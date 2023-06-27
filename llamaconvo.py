from transformers import LlamaTokenizer, LlamaForCausalLM, GenerationConfig, pipeline
from langchain.llms import HuggingFacePipeline
from langchain import PromptTemplate, LLMChain
from langchain.chains import ConversationChain
#from langchain.chains.conversation.memory import ConversationBufferMemory
from langchain.memory import ConversationTokenBufferMemory

import torch

tokenizer = LlamaTokenizer.from_pretrained("/lustre/scratch/project/cmkl/ai-chat/llama-13b-meta-hf")
print("here")

base_model = LlamaForCausalLM.from_pretrained(
    "/lustre/scratch/project/cmkl/ai-chat/llama-13b-meta-hf",
    load_in_8bit=True,
    device_map='auto',
)
print("here2")
pipe = pipeline(
    "text-generation",
    model=base_model, 
    tokenizer=tokenizer, 
    max_length=1024,
    temperature=0.6,
    top_p=0.95,
    repetition_penalty=1.2
)
print("here3")
local_llm = HuggingFacePipeline(pipeline=pipe)
#template = """Below is an instruction that describes a task. Write a response that appropriately completes the request.

### Instruction: 
#{instruction}

#Answer:"""

#prompt = PromptTemplate(template=template, input_variables=["instruction"])
# llm_chain = LLMChain(prompt=prompt, llm=local_llm)
# question = "What is the capital of England?"
# print(llm_chain.run(question))
#window_memory = ConversationBufferWindowMemory(k=3)
memcho = ConversationTokenBufferMemory(llm=local_llm,max_token_limit=512)
conversation = ConversationChain(llm=local_llm, verbose=True, memory=memcho)
for i in range(3):
    q = input("gimme: ")
    print(conversation.predict(input=q))
