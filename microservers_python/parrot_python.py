from flask_cors import CORS
from flask import Flask, request, jsonify
import os
from pygments.lexers import guess_lexer_for_filename
import subprocess
import random
import signal

app = Flask(__name__)
CORS(app)

def runCode(code, file_extension):
        try:
            cached_files = os.listdir("cache")
        except:
            os.makedirs("cache")
            cached_files = os.listdir("cache")
        output_filename = str(random.randint(1, 1000000))
        while output_filename in cached_files:
            output_filename = str(random.randint(1, 1000000))

        filename = "cache/" + output_filename + file_extension
        # Create a temporary file in here and run it
        with open(filename, 'w') as file:
            file.write(code)

        gcc_list = ['c', 'rust']
        lexer = guess_lexer_for_filename(filename, '')
        lang = lexer.name.lower()
        cached_files = os.listdir("cache")
        output_filename = str(random.randint(1, 1000000)) + ".o"
        while output_filename in cached_files:
            output_filename = str(random.randint(1, 1000000)) + ".o"

        output_filename = "cache/" + output_filename

        if lang == "python":
            lang = "python3"

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
        
        if len(os.listdir("/app/cache")) >= 20:
            for x in os.listdir("/app/cache"):
                try:
                    os.remove("/app/cache/" + x)
                except FileNotFoundError:
                    print("File not found")

        return {"Output": stdout.decode(), "Error": stderr.decode()}

@app.route('/runcode', methods=['POST'])
def terminal():
    received_data = request.get_json()
    code = received_data['code']
    file_extension = received_data['file_extension']

    response = runCode(code, file_extension)

    for x in os.listdir("/app"):
        try:
            if x != "parrot_python.py":
                os.remove("app/" + x)
        except IsADirectoryError:
            pass
        except OSError:
            pass

    return jsonify(response)

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5463)
