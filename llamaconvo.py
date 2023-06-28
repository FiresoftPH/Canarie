from transformers import LlamaTokenizer, LlamaForCausalLM, GenerationConfig, pipeline
from langchain.llms import HuggingFacePipeline
from langchain import PromptTemplate, LLMChain
from langchain.chains import ConversationChain
#from langchain.chains.conversation.memory import ConversationBufferMemory
from langchain.memory import ConversationTokenBufferMemory
import time
import torch
from Libs import macaw_ai

arima = macaw_ai.GeneratePrompt()
prompt = arima.codePrompt("explain this code ", "test_files/UwU.js")

#tokenizer = LlamaTokenizer.from_pretrained("/lustre/scratch/project/cmkl/ai-chat/llama-13b-meta-hf")
tokenizer = LlamaTokenizer.from_pretrained("TheBloke/vicuna-13B-1.1-HF")
print("here")

base_model = LlamaForCausalLM.from_pretrained(
    "TheBloke/vicuna-13B-1.1-HF",
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
#template = "Below is an instruction that describes a task. Write a response that appropriately completes the request."
#prompt = PromptTemplate(template=template, input_variables = [])
# llm_chain = LLMChain(prompt=prompt, llm=local_llm)
# question = "What is the capital of England?"
# print(llm_chain.run(question))
#window_memory = ConversationBufferWindowMemory(k=3)
memcho = ConversationTokenBufferMemory(llm=local_llm,max_token_limit=512)
conversation = ConversationChain(llm=local_llm, verbose=True, memory=memcho)
conversation.prompt.template = '''The following is a friendly conversation between a human and an AI called vicuna. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know. 

Current conversation:
{history}
Human: {input}
AI:'''
while True:
    q = input("gimme: ")
    if q == "code":
        q = prompt
    start = time.time()
    print(conversation.predict(input=q))
    print("time taken ",time.time()-start,"s")
