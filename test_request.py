import requests

def getAnswer():
    url = 'https://api.parrot.cmkl.ai/ai/getResponse'  # Replace with your server's URL

    # prompt = "What is coffee?"
    # prompt = "Why is it popular?"
    prompt = "What is Assembly (Programming language)?"

    payload = {
        'username': "Pattarapark Chutisamoot",
        'email': "pattarapark.c@cmkl.ac.th",
        'code': [],
        "course": "Computer System",
        "chatroom_name": "Assembly",
        "question": prompt,
        "api_key" : "99a895702749b7923b52c230cb6328d91623c5b5c641dc1cae35b85711544af8977f713d60a532256b8fe5380039bdfad329f356e56666ea7992674cc3c0ddc4"
    }

    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()  # Raise an exception for 4xx and 5xx status codes

        # Wait for the response and then print it out
        response_data = response.json()
        print(response_data)

    except requests.exceptions.RequestException as e:
        print("An error occurred:", str(e))

def getHistory():
    url = 'https://api.parrot.cmkl.ai/ai/getFullHistory'  # Replace with your server's URL

    payload = {
        'username': "Pattarapark Chutisamoot",
        'email': "pattarapark.c@cmkl.ac.th",
        "course": "Computer System",
        "chatroom_name": "general",
        "api_key" : "99a895702749b7923b52c230cb6328d91623c5b5c641dc1cae35b85711544af8977f713d60a532256b8fe5380039bdfad329f356e56666ea7992674cc3c0ddc4"
    }

    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()  # Raise an exception for 4xx and 5xx status codes

        # Wait for the response and then print it out
        response_data = response.json()
        print(response_data)

    except requests.exceptions.RequestException as e:
        print("An error occurred:", str(e))
        
import requests

def getChatRoom():
    url = 'https://api.parrot.cmkl.ai/auth/chatroom'  # Replace with your server's URL

    payload = {
        'username': "Pattarapark Chutisamoot",
        'email': "pattarapark.c@cmkl.ac.th",
        "course": "Computer System",
        "api_key" : "99a895702749b7923b52c230cb6328d91623c5b5c641dc1cae35b85711544af8977f713d60a532256b8fe5380039bdfad329f356e56666ea7992674cc3c0ddc4"
    }

    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()  # Raise an exception for 4xx and 5xx status codes

        # Wait for the response and then print it out
        response_data = response.json()
        print(response_data)

    except requests.exceptions.RequestException as e:
        print("An error occurred:", str(e))
# getAnswer()
# getHistory()
getChatRoom()
