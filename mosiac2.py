from typing import Any, Dict, Tuple
import warnings
import json
import textwrap
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, AutoConfig
from transformers import (
    StoppingCriteria,
    StoppingCriteriaList,
    TextIteratorStreamer,
)
# import os
# os.environ["CUDA_DEVICE_ORDER"] = "PCI_BUS_ID"
# os.environ["CUDA_VISIBLE_DEVICES"] = "2,3,4"  # specify which GPU(s) to be used


INSTRUCTION_KEY = "### Instruction:"
RESPONSE_KEY = "### Response:"
END_KEY = "### End"
INTRO_BLURB = "Below is an instruction that describes a task. Write a response that appropriately completes the request."
PROMPT_FOR_GENERATION_FORMAT = """{intro}
{instruction_key}
{instruction}
{response_key}
""".format(
    intro=INTRO_BLURB,
    instruction_key=INSTRUCTION_KEY,
    instruction="{instruction}",
    response_key=RESPONSE_KEY,
)

config = AutoConfig.from_pretrained("mosaicml/mpt-30b-chat", trust_remote_code=True,device_map="auto")
config.init_device = 'cuda:0' # For fast initialization directly on GPU!
config.max_seq_len = 16384

print("here")
class InstructionTextGenerationPipeline:
    def __init__(
        self,
        model_name,
        torch_dtype=torch.bfloat16,
        trust_remote_code=True,
        use_auth_token=None,
    ) -> None:
        self.model = AutoModelForCausalLM.from_pretrained(
            model_name,
            torch_dtype=torch_dtype,
            trust_remote_code=trust_remote_code,
            use_auth_token=use_auth_token,
            device_map="auto"
        )

        tokenizer = AutoTokenizer.from_pretrained(
            model_name,
            trust_remote_code=trust_remote_code,
            use_auth_token=use_auth_token,
            device_map="auto"
        )
        if tokenizer.pad_token_id is None:
            warnings.warn(
                "pad_token_id is not set for the tokenizer. Using eos_token_id as pad_token_id."
            )
            tokenizer.pad_token = tokenizer.eos_token
        tokenizer.padding_side = "left"
        self.tokenizer = tokenizer

        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        print(device)
        self.model.eval()
        self.model.to(device=device, dtype=torch_dtype)

        self.generate_kwargs = {
            "temperature": 0.1,
            "top_p": 0.92,
            "top_k": 0,
            "max_new_tokens": 1024,
            "use_cache": True,
            "do_sample": True,
            "eos_token_id": self.tokenizer.eos_token_id,
            "pad_token_id": self.tokenizer.pad_token_id,
            "repetition_penalty": 1.1,  # 1.0 means no penalty, > 1.0 means penalty, 1.2 from CTRL paper
        }

    def format_instruction(self, instruction):
        return PROMPT_FOR_GENERATION_FORMAT.format(instruction=instruction)

    def __call__(
        self, instruction: str, **generate_kwargs: Dict[str, Any]
    ) -> Tuple[str, str, float]:
        s = PROMPT_FOR_GENERATION_FORMAT.format(instruction=instruction)
        input_ids = self.tokenizer(s, return_tensors="pt").input_ids
        input_ids = input_ids.to(self.model.device)
        gkw = {**self.generate_kwargs, **generate_kwargs}
        with torch.no_grad():
            output_ids = self.model.generate(input_ids, **gkw)
        # Slice the output_ids tensor to get only new tokens
        new_tokens = output_ids[0, len(input_ids[0]) :]
        output_text = self.tokenizer.decode(new_tokens, skip_special_tokens=True)
        return output_text

generate = InstructionTextGenerationPipeline(
    "mosaicml/mpt-30b-chat",
    torch_dtype=torch.bfloat16,
    trust_remote_code=True,
)
print("here2")
stop_token_ids = generate.tokenizer.convert_tokens_to_ids(["<|endoftext|>"])


# Define a custom stopping criteria
class StopOnTokens(StoppingCriteria):
    def __call__(self, input_ids: torch.LongTensor, scores: torch.FloatTensor, **kwargs) -> bool:
        for stop_id in stop_token_ids:
            if input_ids[0][-1] == stop_id:
                return True
        return False
    
def get_prompt(instruction):
    prompt_template = f"Below is an instruction that describes a task. Write a response that appropriately completes the request.\n\n### Instruction:\n{instruction}\n\n### Response:"
    return prompt_template

# print(get_prompt('What is the meaning of life?'))

def parse_text(text):
        wrapped_text = textwrap.fill(text, width=100)
        print(wrapped_text +'\n\n')
        # return assistant_text

prompt = 'What are the differences between alpacas, vicunas and llamas?'
generated_text = generate(prompt)
parse_text(generated_text)