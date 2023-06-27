from transformers import pipeline, Conversation

# This used to be a separate file named macaw_pg. If this class gets longer, it will become its own file
class GeneratePrompt:
    def __init__(self):
        self.prevent_example = {0 : " Please don't give any examples."}
        self.system_configurations = {0 : "Choose the most related sentences in the list to this question: ", 1 : "Pick a random Assignment: "}

    def textExtraction(self, file):
        with open(file) as code:
            return code.read()

    def codePrompt(self, prompt, extracted_code):
        return prompt + self.prevent_example[0] + "\n\n" + extracted_code
    
    def classificationPrompt(self, prompt, context_list):
        # return self.system_configurations[0] + prompt + str(context_list)
        return self.system_configurations[1] + prompt + str(context_list)

# Used to call AI responses. This will be changed since the model used here is just temporary.
class GetResponse:
    def __init__(self):
        self.model = pipeline(model="microsoft/DialoGPT-large")
        self.conversation_cache = Conversation("Greetings!")
        self.conversation_cache = self.model(self.conversation_cache)

    def getResponse(self, prompt):
        self.conversation_cache.add_user_input(prompt)
        self.conversation_cache = self.model(self.conversation_cache)
        return self.conversation_cache.generated_responses[-1]

    def getNotice(self):
        pass

    def getSuggestion(self):
        pass