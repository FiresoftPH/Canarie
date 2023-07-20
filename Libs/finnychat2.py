"""
Chat with a model with command line interface.

Usage:
python3 -m fastchat.serve.cli --model lmsys/vicuna-7b-v1.3
python3 -m fastchat.serve.cli --model lmsys/fastchat-t5-3b-v1.0

Other commands:
- Type "!!exit" or an empty line to exit.
- Type "!!reset" to start a new conversation.
"""
import argparse
import os
import re
import sys
import abc
import gc
import math
import sys
import time
import pickle
import warnings

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


class SimpleChatIO(ChatIO):
    def __init__(self, multiline: bool = False):
        self._multiline = multiline

    def prompt_for_input(self, role) -> str:
        if not self._multiline:
            return input(f"{role}: ")

        prompt_data = []
        line = input(f"{role} [ctrl-d/z on empty line to end]: ")
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

models = ["mosaicml/mpt-30b-chat", "TheBloke/vicuna-13B-1.1-HF",
        "tiiuae/falcon-40b", "/lustre/scratch/project/cmkl/ai-chat/vicuna-13b-v1.1",
        "ArimaKana38/alpaca-cmkl","lmsys/vicuna-33b-v1.3","victrained","lmsys/vicuna-13b-v1.3"
        ,"victrained2"]
model_path = models[0]
num_gpus = 6
styles = ["simple","rich","programmatic"]
style = styles[0]
chatio = SimpleChatIO(multiline=True)
# if style == "simple":
#     chatio = SimpleChatIO(multiline=True)
# elif style == "rich":
#     chatio = RichChatIO(multiline=True, mouse=True)
# elif style == "programmatic":
#     chatio = ProgrammaticChatIO()
# else:
#     raise ValueError(f"Invalid style for console: {style}")

def chat_loop(
    model_path: str,
    device: str,
    num_gpus: int,
    max_gpu_memory: str,
    load_8bit: bool,
    cpu_offloading: bool,
    conv_template: Optional[str],
    temperature: float,
    repetition_penalty: float,
    max_new_tokens: int,
    chatio: ChatIO,
    gptq_config: GptqConfig,
    revision: str,
    judge_sent_end: bool,
    debug: bool,
    history: bool = True,
    messages: list = []
):
    # Model
    model, tokenizer = load_model(
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
    generate_stream_func = get_generate_stream_function(model, model_path)

    model_type = str(type(model)).lower()
    is_t5 = "t5" in model_type
    is_codet5p = "codet5p" in model_type

    # Hardcode T5's default repetition penalty to be 1.2
    if is_t5 and repetition_penalty == 1.0:
        repetition_penalty = 1.2

    # Set context length
    context_len = get_context_length(model.config)

    # Chat
    def new_chat():
        if conv_template:
            conv = get_conv_template(conv_template)
        else:
            conv = get_conversation_template(model_path)
            #conv = get_conversation_template("victrained")
        return conv

    #conv = None
    conv = new_chat()
    print(conv.system)
    def chatsession(conv):
        while True:
            # if not history or not conv:
            #     conv = new_chat()

            try:
                inp = chatio.prompt_for_input(conv.roles[0])
            except EOFError:
                inp = ""

            if inp == "!!exit" or not inp:
                print("exit...")
                break

            if inp == "!!save":
                print("saving...")
                ingest_to_db = pickle.dumps(conv)
                print(type(ingest_to_db))
                return ingest_to_db

            if inp == "!!reset":
                print("resetting...")
                conv = new_chat()
                continue

            conv.append_message(conv.roles[0], inp)
            conv.append_message(conv.roles[1], None)
            prompt = conv.get_prompt()

            if is_codet5p:  # codet5p is a code completion model.
                prompt = inp

            gen_params = {
                "model": model_path,
                "prompt": prompt,
                "temperature": temperature,
                "repetition_penalty": repetition_penalty,
                "max_new_tokens": max_new_tokens,
                "stop": conv.stop_str,
                "stop_token_ids": conv.stop_token_ids,
                "echo": False,
            }

            chatio.prompt_for_output(conv.roles[1])
            output_stream = generate_stream_func(
                model,
                tokenizer,
                gen_params,
                device,
                context_len=context_len,
                judge_sent_end=judge_sent_end,
            )
            t = time.time()
            outputs = chatio.stream_output(output_stream)
            duration = time.time() - t
            conv.update_last_message(outputs.strip())

            if debug:
                num_tokens = len(tokenizer.encode(outputs))
                msg = {
                    "conv_template": conv.name,
                    "prompt": prompt,
                    "outputs": outputs,
                    "speed (token/s)": round(num_tokens / duration, 2),
                }
                print(f"\n{msg}\n")
    
    convhistory = chatsession(conv)
    while True:
        c = input("continue? (y/n)")
        if c.lower() == "y":
            convhistory = pickle.loads(convhistory)
            convhistory = chatsession(convhistory)
        elif c.lower() == "n":
            break

try:
    chat_loop(
        gptq_config = GptqConfig(
            ckpt=None,
            wbits=16,
            groupsize=-1,
            act_order=True,
        ),
        chatio=chatio,
        model_path=model_path,
        device = "cuda",
        num_gpus = num_gpus,
        load_8bit = True,
        temperature = 0.7,
        max_new_tokens = 512,
        max_gpu_memory= None,
        cpu_offloading = False,
        debug = False,
        conv_template=None,
        repetition_penalty=1.0,
        revision="main",
        judge_sent_end=False

    )
except KeyboardInterrupt:
    print("exit...")





