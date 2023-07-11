import requests
import json
url = 'http://localhost:2424/compileCode'  # Replace with your server's URL

file_to_send = {'file': open('test_files/TwT.cpp', 'rb')}

response = requests.post(url, files=file_to_send)

print(response.json())  # Print the response from the server