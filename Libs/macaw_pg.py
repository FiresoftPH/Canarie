import shutil

class GeneratePrompt:
    def __init__(self):
        self.prevent_example = {0 : " Please don't give any examples."}

    def textExtraction(self, file):
        with open(file) as code:
            return code.read()

    def generateFullPrompt(self, prompt, extracted_code):
        return prompt + self.prevent_example[0] + "\n\n" + extracted_code

test = GeneratePrompt()
code_prompt = test.textExtraction("test_files/UwU.py")
full_prompt = test.generateFullPrompt('What is wrong with my code?', code_prompt)
print(full_prompt)