from torch import cuda, bfloat16
from transformers import AutoTokenizer, AutoModelForCausalLM, AutoConfig, GenerationConfig, pipeline
import torch
from transformers import StoppingCriteria, StoppingCriteriaList
from langchain import PromptTemplate, LLMChain
from langchain.llms import HuggingFacePipeline
from langchain.chains import ConversationChain
#from langchain.chains.conversation.memory import ConversationBufferMemory
from langchain.memory import ConversationTokenBufferMemory
import time

#device = f'cuda:{cuda.current_device()}' if cuda.is_available() else 'cpu'

model = AutoModelForCausalLM.from_pretrained(
    'mosaicml/mpt-30b-chat',
    trust_remote_code=True,
    torch_dtype=bfloat16,
    device_map="auto",
    max_seq_len=2048
)
model.eval()
# model.to(device)
# print(f"Model loaded on {device}")

#tokenizer = LlamaTokenizer.from_pretrained("mosaicml/mpt-30b-chat",device_map="auto",trust_remote_code=True)
tokenizer = AutoTokenizer.from_pretrained("mosaicml/mpt-30b-chat")
stop_token_ids = tokenizer.convert_tokens_to_ids(["<|endoftext|>"])

# define custom stopping criteria object
class StopOnTokens(StoppingCriteria):
    def __call__(self, input_ids: torch.LongTensor, scores: torch.FloatTensor, **kwargs) -> bool:
        for stop_id in stop_token_ids:
            if input_ids[0][-1] == stop_id:
                return True
        return False

#return_full_text=True,  # langchain expects the full text
stopping_criteria = StoppingCriteriaList([StopOnTokens()])
generate_text = pipeline(
    max_new_tokens=256,
    model=model, tokenizer=tokenizer,
    task='text-generation',
    # we pass model parameters here too
    stopping_criteria=stopping_criteria,  # without this model will ramble
    temperature=0.1,  # 'randomness' of outputs, 0.0 is the min and 1.0 the max
    top_p=0.15,  # select from top tokens whose probability add up to 15%
    top_k=0,  # select from top 0 tokens (because zero, relies on top_p)
  # mex number of tokens to generate in the output
    repetition_penalty=1.1,  # without this output begins repeating
    device_map="auto"
)

llm = HuggingFacePipeline(pipeline=generate_text)
memcho = ConversationTokenBufferMemory(llm=llm,max_token_limit=256)
conversation = ConversationChain(llm=llm, verbose=True, memory=memcho)
# prompt = PromptTemplate(
#     input_variables=["template"],
#     template='''The following is a friendly conversation between a human and an AI called alpaca. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know.''',
#     input="{input}",
#     history="{history}"
# )
conversation.prompt.template = '''The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know. 
{history}
{input}'''

while True:
    inp = input("gimme: ")
    start = time.time()
    print(conversation.predict(
        input=inp)
    )
    print("time taken "+str(time.time()-start)+"s")