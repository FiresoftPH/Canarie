from transformers import LlamaTokenizer, LlamaForCausalLM, GenerationConfig, pipeline
#from transformers import AutoTokenizer, AutoModelForCausalLM, AutoConfig, GenerationConfig, pipeline
from langchain.llms import HuggingFacePipeline
from langchain import PromptTemplate, LLMChain
import langchain.chains
#from langchain.chains.conversation.memory import ConversationBufferMemory
import langchain.memory
import time
import torch
from Libs import macaw_ai
import sys
import pickle

arima = macaw_ai.GeneratePrompt()
prompt = arima.codePrompt("explain this code ", "UwU.py")

#tokenizer = LlamaTokenizer.from_pretrained("/lustre/scratch/project/cmkl/ai-chat/llama-13b-meta-hf")
tokenizer = LlamaTokenizer.from_pretrained("TheBloke/vicuna-13B-1.1-HF")
#tokenizer = LlamaTokenizer.from_pretrained("chavinlo/alpaca-native")
#tokenizer = AutoTokenizer.from_pretrained('mosaicml/mpt-30b')
print("here")

base_model = LlamaForCausalLM.from_pretrained(
    "TheBloke/vicuna-13B-1.1-HF",
    load_in_8bit=True,
    device_map='auto',
)
# config = AutoConfig.from_pretrained("mosaicml/mpt-30b", trust_remote_code=True)
# config.attn_config['attn_impl'] = 'triton' 
# config.init_device = 'cuda:0'

# base_model = AutoModelForCausalLM.from_pretrained(
#   'mosaicml/mpt-30b',
#   trust_remote_code=True
# )
print("here2")
pipe = pipeline(
    "text-generation",
    model=base_model, 
    tokenizer=tokenizer, 
    max_length=720,
    temperature=0.6,
    top_p=0.95,
    repetition_penalty=1.2,
    device_map="auto"
)
print("here3")
local_llm = HuggingFacePipeline(pipeline=pipe)
#template = "Below is an instruction that describes a task. Write a response that appropriately completes the request."
#prompt = PromptTemplate(template=template, input_variables = [])
# llm_chain = LLMChain(prompt=prompt, llm=local_llm)
# question = "What is the capital of England?"
# print(llm_chain.run(question))
#window_memory = ConversationBufferWindowMemory(k=3)

memcho = langchain.memory.ConversationTokenBufferMemory(llm=local_llm,max_token_limit=512,return_message=True)
conversation = langchain.chains.ConversationChain(llm=local_llm, verbose=True, memory=memcho)
conversation.prompt.template = '''The following is a friendly conversation between a human and an AI called vicuna. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know. 

Current conversation:
{history}
Human: {input}
AI:'''
cnt = 0
# store = memcho.load_memory_variables({})
while True:
    q = "code"
    # q = "What is a coffee? Can I eat it?"
    if q == "code":
        q = prompt
    start = time.time()
    print(conversation.predict(input=q))
    # print("time taken ",time.time()-start,"s")
    # print(sys.getsizeof(conversation))
    # print(sys.getsizeof(conversation))
    # store = memcho.load_memory_variables({})
    # jstore = "{" + store["history"] + "}"
    # print(str(conversation.memory))
    # filehandler = open(b"stuff.obj","wb")
    extracted_messages = conversation.memory.chat_memory.messages
    # print(extracted_messages)
    ingest_to_db = pickle.dumps(extracted_messages)
    print(type(ingest_to_db))
    # jstore = json.loads(store["history"])
    # print(type(jstore))
    break

# ljson = json.loads(jstore)
# conversation_string = ljson["history"]

# # Split the conversation string by '\n' to separate the exchanges
# exchanges = conversation_string.split('\n')

# # Create an empty dictionary to store the conversation
# conversation8 = {}

# # Iterate over the exchanges and populate the dictionary
# for exchange in exchanges:
#     if exchange:
#         role, message = exchange.split(': ')
#         conversation8[role] = message

# memcho2 = ConversationTokenBufferMemory(llm=local_llm,max_token_limit=512,return_message=True)

load1 = pickle.loads(ingest_to_db)
# print(load1)
retrieved_chat_history = langchain.memory.ChatMessageHistory(messages=load1)
retrieved_memory = langchain.memory.ConversationTokenBufferMemory(chat_memory=retrieved_chat_history,llm=local_llm,max_token_limit=512,return_message=True)
conversation2 = langchain.ConversationChain(llm=local_llm, verbose=True, memory = retrieved_memory)
conversation2.prompt.template = '''The following is a friendly conversation between a human and an AI called vicuna. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know. 


Current conversation:
{history}
Human: {input}
AI:'''

cnt = 0
while True:
    q = input("gimme: ")
    # q = "What is a coffee? Can I eat it?"
    if q == "code":
        q = prompt
    start = time.time()
    print(conversation.predict(input=q))
    # print("time taken ",time.time()-start,"s")
    # print(sys.getsizeof(conversation))
    # print(sys.getsizeof(conversation))
    # print(sh)
    # print(json.dumps(sh))
    break