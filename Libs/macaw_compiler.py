import subprocess
import json
from pygments.lexers import guess_lexer_for_filename
import os
import random

def run_another_file(filename):
    gcc_list = ['c', 'rust']
    lexer = guess_lexer_for_filename(filename, '')
    lang = lexer.name.lower()
    cached_files = os.listdir("cache")
    output_filename = str(random.randint(1, 1000000)) + ".o"
    while output_filename in cached_files:
        output_filename = str(random.randint(1, 1000000)) + ".o"

    output_filename = "cache/" + output_filename
    print(lang)
    if lang in gcc_list:
        compile_process = subprocess.Popen(['gcc', filename, "-o", output_filename], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        compile_process.communicate()
        execute_process = subprocess.Popen(['./' + output_filename], stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)
        stdout, stderr = execute_process.communicate()
    elif lang == "c++":
        compile_process = subprocess.Popen(['g++', filename, "-o", output_filename], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        compile_process.communicate()
        execute_process = subprocess.Popen(['./' + output_filename], stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)
        stdout, stderr = execute_process.communicate()
    else:
        process = subprocess.Popen([lang, filename], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        stdout, stderr = process.communicate()
    
    if len(os.listdir("cache")) >= 10:
        for x in os.listdir("cache"):
            try:
                os.remove("cache/" + x)
            except FileNotFoundError:
                print("File not found")

    return json.dumps({"Output": stdout.decode(), "Error": stderr.decode()})

# Example usage
# print(json.loads(run_another_file("test_files/TwT.cpp")))