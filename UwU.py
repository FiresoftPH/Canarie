from transformers import LlamaTokenizer, LlamaForCausalLM, GenerationConfig, pipeline
#from transformers import AutoTokenizer, AutoModelForCausalLM, AutoConfig, GenerationConfig, pipeline
from langchain.llms import HuggingFacePipeline
from langchain import PromptTemplate, LLMChain
from langchain.chains import ConversationChain
#from langchain.chains.conversation.memory import ConversationBufferMemory
from langchain.memory import ConversationTokenBufferMemory
import time
import torch
from Libs import macaw_ai
import sys

arima = macaw_ai.GeneratePrompt()
prompt = arima.codePrompt("explain this code ", "test_files/waifus.py")

#tokenizer = LlamaTokenizer.from_pretrained("/lustre/scratch/project/cmkl/ai-chat/llama-13b-meta-hf")
#tokenizer = LlamaTokenizer.from_pretrained("TheBloke/vicuna-13B-1.1-HF")
tokenizer = LlamaTokenizer.from_pretrained("chavinlo/alpaca-native")
#tokenizer = AutoTokenizer.from_pretrained('mosaicml/mpt-30b')
print("here")

base_model = LlamaForCausalLM.from_pretrained(
    "chavinlo/alpaca-native",
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
conversation.prompt.template = '''The following is a friendly conversation between a human and an AI called alpaca. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know. 
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
    print(sys.getsizeof(conversation))