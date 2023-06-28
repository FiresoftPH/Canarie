from transformers import pipeline, Conversation
from transformers import LlamaTokenizer, LlamaForCausalLM, GenerationConfig, pipeline
from langchain.llms import HuggingFacePipeline
from langchain import PromptTemplate, LLMChain
from langchain.chains import ConversationChain
from langchain.memory import ConversationTokenBufferMemory
import time
import torch
import sys

# This used to be a separate file named macaw_pg. If this class gets longer, it will become its own file
class GeneratePrompt:
    def __init__(self):
        self.prevent_example = {0 : " Please don't give any examples."}
        self.system_configurations = {0 : "Choose the most related sentences in the list to this question: ", 1 : "Pick a random Assignment: "}

    def textExtraction(self, file):
        with open(file) as code:
            return code.read()

    def codePrompt(self, prompt, extracted_code):
        return prompt + self.prevent_example[0] + "\n\n" + self.textExtraction(extracted_code)
    
    def classificationPrompt(self, prompt, context_list):
        # return self.system_configurations[0] + prompt + str(context_list)
        return self.system_configurations[1] + prompt + str(context_list)

# Used to call AI responses. This will be changed since the model used here is just temporary.
class AI:
    def __init__(self):
        self.tokenizer = LlamaTokenizer.from_pretrained("TheBloke/vicuna-13B-1.1-HF")
        self.base_model = LlamaForCausalLM.from_pretrained(
                            "TheBloke/vicuna-13B-1.1-HF",
                            load_in_8bit=True,
                            device_map='auto',
                            )
        self.pipe = pipeline(
                        "text-generation",
                        model=self.base_model, 
                        tokenizer=self.tokenizer, 
                        max_length=1024,
                        temperature=0.6,
                        top_p=0.95,
                        repetition_penalty=1.2
                    )
        self.local_llm = HuggingFacePipeline(pipeline=self.pipe)
        self.memory = ConversationTokenBufferMemory(llm=self.local_llm,max_token_limit=512)
        self.conversation = ConversationChain(llm=self.local_llm, verbose=True, memory=self.memory)
        self.conversation.prompt.template = '''The following is a friendly conversation between a human and an AI called vicuna. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know.
        Current conversation:
        {history}
        Human: {input}
        AI:'''

    def getResponse(self, prompt):
        return self.conversation.predict(input=prompt)

    def getNotice(self):
        pass

    def getSuggestion(self):
        pass

# test = GeneratePrompt()
# prompt = test.codePrompt("Explain this code: ", "test_files/UwU.py")
# ai = AI()

# while True:
#     code = input("gimme: ")
#     prompt = test.codePrompt(q, "test_files/UwU.py")
#     answer = ai.getResponse(prompt)
#     print(answer)
