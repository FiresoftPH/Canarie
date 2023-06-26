from transformers import pipeline, Conversation

# This used to be a separate file named macaw_pg. If this class gets longer, it will become its own file
class GeneratePrompt:
    def __init__(self):
        self.prevent_example = {0 : " Please don't give any examples."}
        self.system_configurations = {0 : "Choose the most related sentences in the list to this question: "}

    def textExtraction(self, file):
        with open(file) as code:
            return code.read()

    def questionPrompt(self, prompt, extracted_code):
        return prompt + self.prevent_example[0] + "\n\n" + extracted_code
    
    def classificationPrompt(self, prompt, context_list):
        return self.system_configurations[0] + prompt + str(context_list)

class GetResponse:
    def __init__(self):
        self.model = pipeline(model="microsoft/DialoGPT-large")

    def getResponse(self):
        pass

    def getNotice(self):
        pass

    def getSuggestion(self):
        pass

