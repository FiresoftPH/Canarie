from flask_cors import CORS
from flask import Flask, request, jsonify
import docker

app = Flask(__name__)

def runDocker():
    client = docker.from_env()
    docker_code = f"""
    """
    pass

@app.route('/runcode')
def runPythonCode():
    data = request.get_json()
    file = data['code']
    # name = recieved_load['name']

    # return json.dumps({"Output": stdout.decode(), "Error": stderr.decode()})

if __name__ == '__main__':
    app.run(debug=True)