from transformers import pipeline, Conversation

chatbot = pipeline(model="microsoft/DialoGPT-large")
conversation = Conversation("what is cofee")
conversation = chatbot(conversation)
print(conversation.generated_responses[-1])

conversation.add_user_input("why is it so popular")
conversation = chatbot(conversation)
print(conversation.generated_responses[-1])
