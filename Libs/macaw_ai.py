import sys
import time
import pickle

from prompt_toolkit import PromptSession
from prompt_toolkit.auto_suggest import AutoSuggestFromHistory
from prompt_toolkit.completion import WordCompleter
from prompt_toolkit.history import InMemoryHistory
from prompt_toolkit.key_binding import KeyBindings
from typing import Iterable, Optional, Dict
from rich.console import Console
from rich.live import Live
from rich.markdown import Markdown

from fastchat.model.model_adapter import add_model_args
from fastchat.modules.gptq import GptqConfig
from fastchat.serve.inference import ChatIO, chat_loop
from fastchat.conversation import get_conv_template, SeparatorStyle
from fastchat.model.model_adapter import (
    load_model,
    get_conversation_template,
    get_generate_stream_function,
)
from fastchat.modules.gptq import GptqConfig
from fastchat.utils import is_partial_stop, is_sentence_complete, get_context_length

# This used to be a separate file named macaw_pg. If this class gets longer, it will become its own file
class GeneratePrompt:
    def __init__(self):
        self.prevent_example = {0 : " Please don't give any examples.", 1 : "Please don't give any clues."}
        self.system_configurations = {0 : "Choose the most related sentences in the list to this question: ", 1 : "Pick a random Assignment: "}

    def textExtraction(self, file):
        with open(file) as code:
            return code.read()

    def codePrompt(self, prompt, extracted_code):
        return prompt + self.prevent_example[0] + "\n\n" + self.textExtraction(extracted_code)
    
    def classificationPrompt(self, prompt, context_list):
        # return self.system_configurations[0] + prompt + str(context_list)
        return self.system_configurations[1] + prompt + str(context_list)
    
class SimpleChatIO(ChatIO):
    def __init__(self, multiline: bool = False):
        self._multiline = multiline

    def prompt_for_input(self, user_input) -> str:
        prompt_data = []
        #line = input(f"{role} [ctrl-d/z on empty line to end]: ")
        line = user_input
        while True:
            prompt_data.append(line.strip())
            try:
                line = input()
            except EOFError as e:
                break
        return "\n".join(prompt_data)

    def prompt_for_output(self, role: str):
        print(f"{role}: ", end="", flush=True)

    def stream_output(self, output_stream):
        pre = 0
        for outputs in output_stream:
            output_text = outputs["text"]
            output_text = output_text.strip().split(" ")
            now = len(output_text) - 1
            if now > pre:
                print(" ".join(output_text[pre:now]), end=" ", flush=True)
                pre = now
        print(" ".join(output_text[pre:]), flush=True)
        return " ".join(output_text)


class Chat:
    def __init__(self):
        self.chatio = SimpleChatIO(multiline=True)
        model_path = "mosaicml/mpt-30b-chat"
        device = "cuda"
        num_gpus = 2
        max_gpu_memory = None
        load_8bit = True
        cpu_offloading = False
        gptq_config = GptqConfig(
                ckpt=None,
                wbits=16,
                groupsize=-1,
                act_order=True,
            )
        revision = "main"
        debug = False
        self.model, self.tokenizer = load_model(
        model_path,
        device,
        num_gpus,
        max_gpu_memory,
        load_8bit,
        cpu_offloading,
        gptq_config,
        revision,
        debug,
    )
        self.generate_stream_func = get_generate_stream_function(self.model, model_path)

        self.model_type = str(type(self.model)).lower()
        self.context_len = get_context_length(self.model.config)

        #self.conv = get_conversation_template(model_path)

    def newchat(self):
        conv = get_conversation_template(self.model_path)
        return conv

    def chatsession(self, conv, inp_fromweb):
        #conv = get_conversation_template(self.model_path)
        try:
            #inp = chatio.prompt_for_input(conv.roles[0])
            #user input goes here
            inp = inp_fromweb
            inp = self.chatio.prompt_for_input(inp)

        except EOFError:
            inp = ""

        conv.append_message(conv.roles[0], inp)
        conv.append_message(conv.roles[1], None)
        prompt = conv.get_prompt()

        gen_params = {
            "model": self.model_path,
            "prompt": prompt,
            "temperature": 0.7,
            "repetition_penalty": 1.0,
            "max_new_tokens": 512,
            "stop": conv.stop_str,
            "stop_token_ids": conv.stop_token_ids,
            "echo": False,
        }

        self.chatio.prompt_for_output(conv.roles[1])
        output_stream = self.generate_stream_func(
            self.model,
            self.tokenizer,
            gen_params,
            "cuda",
            context_len=self.context_len,
            judge_sent_end=False,
        )
        t = time.time()
        outputs = self.chatio.stream_output(output_stream)
        output_db = pickle.dumps(outputs)
        duration = time.time() - t
        conv.update_last_message(outputs.strip())

        # if debug:
        #     num_tokens = len(tokenizer.encode(outputs))
        #     msg = {
        #         "conv_template": conv.name,
        #         "prompt": prompt,
        #         "outputs": outputs,
        #         "speed (token/s)": round(num_tokens / duration, 2),
        #     }
        #     print(f"\n{msg}\n")

        conv_db = pickle.dumps(conv)
        return conv_db, output_db


# inp = "what is coffee"
# prevsession = chatsession(conv, inp)
# conv_obj = prevsession[0]
# prev_output = prevsession[1]

# conv = pickle.loads(conv_obj)
# inp = "why is it popular"
# convhistory = chatsession(conv, inp)
