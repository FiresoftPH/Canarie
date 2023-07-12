import argparse
import json
import pickle
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM

from fastchat.model import load_model, add_model_args, get_conversation_template

models = ["mosaicml/mpt-30b-chat", "TheBloke/vicuna-13B-1.1-HF",
           "tiiuae/falcon-40b", "/lustre/scratch/project/cmkl/ai-chat/vicuna-14b-v1.1"
           "ArimaKana38/alpaca-cmkl"]
#choose model by idex
model_path = models[0]
num_gpus = 4
model, tokenizer = load_model(
        model_path = model_path,
        device = "cuda",
        num_gpus = num_gpus
    ) 

#conversation object
conv = get_conversation_template(model_path)
conv.to_gradio_chatbot()

def chat(history=conv.messages):
    conv.messages = history
    while True:
        msg = input("gimme: ")

        if msg == "save":
            ingest_to_db = pickle.dumps(conv.messages)
            print(type(ingest_to_db))
            return ingest_to_db

        conv.append_message(conv.roles[0], msg)
        conv.append_message(conv.roles[1], None)
        prompt = conv.get_prompt()
        #print(prompt)

        input_ids = tokenizer([prompt]).input_ids
        output_ids = model.generate(
            torch.as_tensor(input_ids).cuda(),
            do_sample=True,
            temperature=0.7,
            repetition_penalty=1,
            max_new_tokens=512
        )

        if model.config.is_encoder_decoder:
            output_ids = output_ids[0]
        else:
            output_ids = output_ids[0][len(input_ids[0]) :]
        outputs = tokenizer.decode(
            output_ids, skip_special_tokens=True, spaces_between_special_tokens=False
        ) 

        print(f"{conv.roles[0]}: {msg}")
        print(f"{conv.roles[1]}: {outputs}")
        print(conv.messages)

chat_history = chat()
while True:
    load1 = pickle.loads(chat_history)
    chat(load1)
    input("continue? (y/n)")