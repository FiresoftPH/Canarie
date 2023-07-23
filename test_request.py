import requests

def getAnswer():
    url = 'https://api.parrot.cmkl.ai/ai/getResponse'  # Replace with your server's URL

    # prompt = "What is coffee?"
    # prompt = "Why is it popular?"
    # prompt = "Can you compare it to tea?"

    payload = {
        'username': "Pattarapark Chutisamoot",
        'email': "pattarapark.c@cmkl.ac.th",
        'code': [],
        "course": "Computer System",
        "chatroom_name": "general",
        "question": prompt
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
        "chatroom_name": "general"
    }

    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()  # Raise an exception for 4xx and 5xx status codes

        # Wait for the response and then print it out
        response_data = response.json()
        print(response_data)

    except requests.exceptions.RequestException as e:
        print("An error occurred:", str(e))

getAnswer()
# getHistory()
