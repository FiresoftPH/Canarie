from transformers import LlamaTokenizer, LlamaForCausalLM, GenerationConfig, pipeline
#from transformers import AutoTokenizer, AutoModelForCausalLM, AutoConfig, GenerationConfig, pipeline
from langchain.llms import HuggingFacePipeline
from langchain import PromptTemplate, LLMChain
import langchain.chains
#from langchain.chains.conversation.memory import ConversationBufferMemory
import langchain.memory
import time
import torch
from Libs import parrot_ai
import sys
import pickle

tokenizer = LlamaTokenizer.from_pretrained("openchat/openchat",device_map = 'auto')
base_model = LlamaForCausalLM.from_pretrained(
    "openchat/openchat",
    load_in_8bit=True,
    device_map='auto',
)

pipe = pipeline(
    "text-generation",
    model=base_model, 
    tokenizer=tokenizer, 
    max_length=512,
    temperature=0.6,
    top_p=0.95,
    repetition_penalty=1.2,
    device_map="auto"
)

local_llm = HuggingFacePipeline(pipeline=pipe)

memcho = langchain.memory.ConversationTokenBufferMemory(llm=local_llm,max_token_limit=256,return_message=True)
conversation = langchain.chains.ConversationChain(llm=local_llm, verbose=False, memory=memcho)
conversation.prompt.template = '''Human asks a question, AI answers

{history}
{input}
'''

while True:
    start = time.time()
    print(conversation.predict(input=input("gimme: ")))
    print("time taken ",time.time()-start,"s")
