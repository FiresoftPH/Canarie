from torch import cuda, bfloat16
from transformers import AutoTokenizer, AutoModelForCausalLM, AutoConfig, GenerationConfig, pipeline
from transformers import StoppingCriteria, StoppingCriteriaList
from langchain.memory import ConversationTokenBufferMemory
from langchain.llms import HuggingFacePipeline
from langchain.chains import ConversationChain
from typing import Any, Dict, Tuple
import torch
import time
import sys
import textwrap

device = f'cuda:{cuda.current_device()}' if cuda.is_available() else 'cpu'
config = AutoConfig.from_pretrained("mosaicml/mpt-30b-chat", trust_remote_code=True,device_map="auto")
#config.attn_config['attn_impl'] = 'triton' 
config.init_device = 'cuda:0' # For fast initialization directly on GPU!
config.max_seq_len = 16384

model = AutoModelForCausalLM.from_pretrained(
    'mosaicml/mpt-30b-chat',
    trust_remote_code=True,
    torch_dtype=bfloat16,
    device_map="auto",
    config=config,
)

print("here")

tokenizer = AutoTokenizer.from_pretrained(
            "mosaicml/mpt-30b-chat",
            trust_remote_code=True,
            device_map="auto"
)
print("here1")

stop_token_ids = tokenizer.convert_tokens_to_ids(["<|endoftext|>"])

class StopOnTokens(StoppingCriteria):
    def __call__(self, input_ids: torch.LongTensor, scores: torch.FloatTensor, **kwargs) -> bool:
        for stop_id in stop_token_ids:
            if input_ids[0][-1] == stop_id:
                return True
        return False

stopping_criteria = StoppingCriteriaList([StopOnTokens()])

("here2")
pipe = pipeline('text-generation', model=model, tokenizer=tokenizer, device_map='auto', stopping_criteria=stopping_criteria)

# with torch.autocast('cuda', dtype=torch.bfloat16):
#     print(
#         str(pipe('what is coffee?',
#             max_new_tokens=100,
#             do_sample=True,
#             use_cache=True)[0]["generated_text"])
#     )


with torch.autocast('cuda', dtype=torch.bfloat16):
    inputs = tokenizer('what is coffee:\n', return_tensors="pt")
    outputs = model.generate(**inputs, max_new_tokens=100)
    print(tokenizer.batch_decode(outputs, skip_special_tokens=True)[0])


# local_llm = HuggingFacePipeline(pipeline=pipe)
# memcho = ConversationTokenBufferMemory(llm=local_llm,max_token_limit=256)
# conversation = ConversationChain(llm=local_llm, verbose=True, memory=memcho)
# conversation.prompt.template = '''The following is a friendly conversation between a human and an AI called alpaca. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know. 
# Current conversation:
# {history}
# Human: {input}
# AI:'''
# while True:
#     q = input("gimme: ")
#     start = time.time()
#     print(conversation.predict(input=q))
#     print("time taken ",time.time()-start,"s")
#     print(sys.getsizeof(conversation))