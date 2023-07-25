from transformers import LlamaTokenizer, LlamaForCausalLM, GenerationConfig, pipeline
#from transformers import AutoTokenizer, AutoModelForCausalLM, AutoConfig, GenerationConfig, pipeline
from langchain.llms import HuggingFacePipeline
from optimum.bettertransformer import BetterTransformer
from langchain import PromptTemplate, LLMChain
import langchain.chains
#from langchain.chains.conversation.memory import ConversationBufferMemory
import langchain.memory
import time
import torch
from Libs import parrot_ai
import sys
import pickle

arima = parrot_ai.GeneratePrompt()
prompt = arima.codePrompt("what is wrong with the code below", "UwU.py")

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
#base_model = BetterTransformer.transform(base_model, keep_original_model=True)

print("here2")
pipe = pipeline(
    "text-generation",
    model=base_model, 
    tokenizer=tokenizer, 
    max_length=1024,
    temperature=0.6,
    top_p=0.95,
    repetition_penalty=1.2,
    device_map="auto"
)
print("here3")
local_llm = HuggingFacePipeline(pipeline=pipe)

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
    q = input("gimme: ")
    # q = "What is a coffee? Can I eat it?"
    if q == "code":
        q = prompt
    start = time.time()
    print(conversation.predict(input=q))
    print("time taken ",time.time()-start,"s")
    extracted_messages = conversation.memory.chat_memory.messages
    print(extracted_messages)
    # ingest_to_db = pickle.dumps(extracted_messages)
    # print(type(ingest_to_db))
    # # jstore = json.loads(store["history"])
    # # print(type(jstore))
    #break

