import requests
# from dotenv import dotenv_values
from time import sleep

# config = dotenv_values("Libs/.env")

# Checked

# Basiclly ask ai for answer to your question


def getAnswer():
    url = 'https://api.parrot.cmkl.ai/ai/getResponse'  # Replace with your server's URL

    prompt = "Are you Parrot?"
    # prompt = "Why is it popular?"
    # prompt = "What is a for loop and why is it considered more simple than while loops?"

    payload = {
        'username': config["TEST_USERNAME"],
        'email': config["TEST_EMAIL"],
        'code': [],
        "course": "AIC-102",
        "chatroom_name": "Python",
        "question": prompt,
        "api_key": config['TEST_API_KEY']
    }

    try:
        response = requests.post(url, json=payload)
        # for line in response.iter_lines(decode_unicode=True):
        #     if line:
        #         sleep(0.5)
        #         print(line)
        response.raise_for_status()  # Raise an exception for 4xx and 5xx status codes

        # Wait for the response and then print it out
        response_data = response.json()
        print(response_data)

    except requests.exceptions.RequestException as e:
        print("An error occurred:", str(e))

# Checked


def getHistory():
    # Replace with your server's URL
    url = 'https://api.canarie.cmkl.ai/ai/getFullHistory'

    # payload = {
    #     'username': config["TEST_USERNAME"],
    #     'email': config["TEST_EMAIL"],
    #     "course": "AIC-102",
    #     "chatroom_name": "Python",
    #     "api_key" : config['TEST_API_KEY']
    # }

    payload = {
        'username': "Kittikhom Kriamorn",
        'email': "kittikhom.k@cmkl.ac.th",
        "course": "AIC-102",
        "chatroom_name": "New",
        "api_key": "d12de08e860339dc064c8504b0bead17fc3d8f4263423702792b5c68c17c3e55f2bc6c994cece4897c1d329e008a050324eb2a23c5273d915a92201a4a220f50"
    }

    # payload =

    try:
        response = requests.post(url, json=payload)
        # Raise an exceptiPrincipal Of Computing Applicationson for 4xx and 5xx status codes
        response.raise_for_status()

        # Wait for the response and then print it out
        response_data = response.json()
        print(response_data)

    except requests.exceptions.RequestException as e:
        print("An error occurred:", str(e))

# Checked


def getChatRoom():
    # Replace with your server's URL
    url = 'https://api.parrot.cmkl.ai/auth/chatroom/fetch'

    payload = {
        'username': config["TEST_USERNAME"],
        'email': config["TEST_EMAIL"],
        "course": "AIC-102",
        "api_key": config['TEST_API_KEY']
    }

    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()  # Raise an exception for 4xx and 5xx status codes

        # Wait for the response and then print it out
        response_data = response.json()
        print(response_data)

    except requests.exceptions.RequestException as e:
        print("An error occurred:", str(e))

# Checked


def enrollCourse():
    url = 'https://api.parrot.cmkl.ai/auth/enroll'  # Repla
    # print(response_data)ce with your server's URL

    # payload = {
    #     'username': config["TEST_USERNAME"],
    #     'email': config["TEST_EMAIL"],
    #     "course": "Computer Systems",
    #     "api_key" : config['TEST_API_KEY']
    # }

    payload = {
        'username': "Kittikhom Kriamorn",
        'email': "kittikhom.k@cmkl.ac.th",
        "course": "AIC02",
        "api_key": "ef61e664ed8c1549afeb4856e71524d21ced78d2615be541c5398476bb25e0047dfa576462969b78213baf2f605262c647f1fb3ac6d70e195c09c2ef93a55eec"
    }

    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()  # Raise an exception for 4xx and 5xx status codes

        # Wait for the response and then print it out# For getting the chat history for that certain room, backend automaticlly checks
# if the room is created or not, just send the room name.
        response_data = response.json()
        print(response_data)

    except requests.exceptions.RequestException as e:
        print("An error occurred:", str(e))

# Checked


def unenrollCourse():
    url = 'https://api.parrot.cmkl.ai/auth/unenroll'  # Replace with your server's URL

    # payload = {
    #     'username': config["TEST_USERNAME"],
    #     'email': config["TEST_EMAIL"],
    #     "course": "Computer Systems",
    #     "api_key" : config['TEST_API_KEY']
    # }

    payload = {
        'username': "Kittikhom Kriamorn",
        'email': "kittikhom.k@cmkl.ac.th",
        "course": "Computer Systems",
        "api_key": "ef61e664ed8c1549afeb4856e71524d21ced78d2615be541c5398476bb25e0047dfa576462969b78213baf2f605262c647f1fb3ac6d70e195c09c2ef93a55eec"
    }

    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        response_data = response.json()
        print(response_data)

    except requests.exceptions.RequestException as e:
        print("An error occurred:", str(e))

# Checked


def deleteChatRoom():
    url = 'https://api.parrot.cmkl.ai/auth/chatroom/delete'
    payload = {
        'username': config["TEST_USERNAME"],
        'email': config["TEST_EMAIL"],
        "course": "Cloud Computing",
        "chatroom_name": "Python",
        "api_key": config['TEST_API_KEY']
    }

    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()  # Raise an exception for 4xx and 5xx status codes

        # Wait for the response and then print it out
        response_data = response.json()
        print(response_data)

    except requests.exceptions.RequestException as e:
        print("An error occurred:", str(e))

# Checked


def runPythonCode():
    url = 'https://api.parrot.cmkl.ai/compileCode'

    code = '''
def factorial(n):
    if n == 0:
        return 1
    else:
        return n * factorial(n - 1)

result = factorial(5)
print("Factorial of 5:", result)
# '''
#     code = '''

# # '''

#     code = '''
# #include <stdio.h>

# int factorial(int n) {
#     if (n == 0) {
#         return 1;
#     } else {
#         return n * factorial(n - 1);
#     }
# }

# int main() {
#     int number = 5;
#     int result = factorial(number);
#     printf("Factorial of %d: %d\\n", number, result);
#     return 0;
# }
# '''
#     code = '''
# #include <iostream>

# int factorial(int n) {
#     if (n == 0) {
#         return 1;
#     } else {
#         return n * factorial(n - 1);
#     }
# }

# int main() {
#     int number = 5;
#     int result = factorial(number);
#     std::cout << "Factorial of " << number << ": " << result << std::endl;
#     return 0;
# }
# '''

    payload = {
        'username': config["TEST_USERNAME"],
        'email': config["TEST_EMAIL"],
        'code': code,
        "api_key": config['TEST_API_KEY'],
        "file_extension": ".py"
    }

    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()  # Raise an exception for 4xx and 5xx status codes

        # Wait for the response and then print it out
        # response_data = response.json()
        print(response.json())

    except requests.exceptions.RequestException as e:
        print("An error occurred:", str(e))

# Checked


def resetChatRoom():
    url = 'https://api.parrot.cmkl.ai/auth/chatroom/reset'

    payload = {
        'username': config["TEST_USERNAME"],
        'email': config["TEST_EMAIL"],
        "course": "AIC-102",
        "chatroom_name": "Python",
        "api_key": config['TEST_API_KEY']
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
getHistory()
# resetChatRoom()
# getHistory()
# getAnswer()
# getHistory()
# resetChatRoom()
# getHistory()
# getChatRoom()
# enrollCourse()
# unenrollCourse()
# deleteChatRoom()
# runPythonCode()
