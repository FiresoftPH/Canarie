"""
This library acts as an intermediate to between the database and the server. This also function as the main code for connecting between the server and the front end.
"""
from flask import Flask, request, jsonify, redirect, url_for, Response, g
from flask_cors import CORS, cross_origin
from flask_oauthlib.client import OAuth
from dotenv import dotenv_values

import requests
import FastChat.parrot_ai as parrot_ai
import parrot_db
import threading
import re

# A mutually exclusive class to for managing queues
class SequentialProcessor:
    def __init__(self):
        self.lock = threading.Lock()
    
# The actual flask server that manages all REST API connections
class FlaskServer(Flask):
    def __init__(self, name):
        super().__init__(name)
        # Flask server configurations
        config = dotenv_values(".env")
        self.secret_key = config['SECRET_KEY']
        self.canvas_url = config['CANVAS_URL']
        self.canvas_api_key = config['CANVAS_API_KEY']
        self.route('/auth/login', methods = ["POST"])(self.login)
        self.route('/ai/getResponse', methods = ["POST"])(self.getResponse)
        self.route('/ai/getFullHistory', methods = ["POST"])(self.getFullHistory)
        self.route('/compileCode', methods = ["POST"])(self.runCode)
        self.route('/auth/chatroom/fetch', methods = ["POST"])(self.getChatRoom)
        self.route('/auth/chatroom/reset', methods = ["POST"])(self.resetChatHistory)
        self.route('/auth/chatroom/delete', methods = ["POST"])(self.deleteChatRoom)
        self.route('/auth/chatroom/rename', methods = ["POST"])(self.changeChatRoomName)
        self.route('/ai/shakespeare', methods = ["POST"])(self.shakespeare)

        # Init class
        self.db = parrot_db.Database()
        self.prompt_generation = parrot_ai.GeneratePrompt()
        self.ai = parrot_ai.Chat()
        self.oauth = OAuth(self)
        self.queue = SequentialProcessor()

    def checkAuthencity(self, email, username, api_key):
        check_auth = self.db.checkUserRegister(email, username)
        if check_auth is False:
            return jsonify({"Error": "User not registered"})
        else:
            pass

        check_key = self.db.checkAPIKey(email, username, api_key)
        if check_key is False:
            return jsonify({'Error': "Invalid API key"})
        else:
            return None

    def verify_google_token(self, token):
        try:
            google_auth_url = 'https://www.googleapis.com/oauth2/v3/tokeninfo'
            params = {'access_token': token}
            response = requests.get(google_auth_url, params=params)

            if response.status_code == 200:
                token = response.json()
                return token
            else:
                raise ValueError('Invalid token.')
        except Exception as e:
            raise e
        
    def get_google_user_info(self, access_token):
        try:
            google_people_api_url = 'https://people.googleapis.com/v1/people/me'
            headers = {'Authorization': f'Bearer {access_token}'}
            params = {'personFields': 'names'}  # Request specific fields (names in this case)
            response = requests.get(google_people_api_url, headers=headers, params=params)

            if response.status_code == 200:
                user_info = response.json()
                return user_info
            else:
                raise ValueError(f'Failed to retrieve user information from Google People API. Status code: {response.status_code}')
        except Exception as e:
            # print(f'Error during Google People API request: {e}')
            raise e

    def findCanvasID(self, email):
        url = f"{self.canvas_url}/accounts/self/users"
        headers = {"Authorization": f"Bearer {self.canvas_api_key}"}
        users = []

        while url:
            response = requests.get(url, headers=headers)

            if response.status_code == 200:
                data = response.json()
                users.extend(data)
                for user in users:
                    if user['login_id'] == email:
                        return user['id']
                # Check if there are more pages, and update the URL accordingly
                url = response.links.get("next", {}).get("url")
            else:
                # print(f"Failed to fetch users. Status code: {response.status_code}")
                return None

    def getCanvasComptencyCode(self, user_id):
        url = f"{self.canvas_url}/users/{user_id}/courses"
        headers = {"Authorization": f"Bearer {self.canvas_api_key}"}

        response = requests.get(url, headers=headers)
        
        full_load = []
        load = []
        while url:
            response = requests.get(url, headers=headers)

            if response.status_code == 200:
                data = response.json()
                # print(data)
                # load.extend(data)
                for req in data:
                    # load.append([req['name'], req['course_code']])
                    load.append(req['course_code'])
                    full_load.append(req['id'])
                # Check if there are more pages, and update the URL accordingly
                url = response.links.get("next", {}).get("url")
            else:
                # print(f"Failed to fetch users. Status code: {response.status_code}")
                pass
        
        return load, full_load
    
    def get_assignments_from_course(self, course_id):
        load = []
        url = f"{self.canvas_url}/users/{course_id}/courses"
        headers = {"Authorization": f"Bearer {self.canvas_api_key}"}
        response = requests.get(url, headers=headers)

        if response.status_code == 200:
            assignments = response.json()
            for detail in assignments:
                load.append(detail['name'])
        else:
            # print(f"Failed to get assignments. Status code: {response.status_code}")
            return None
        
        return load

    def getCourseName(self, course_code):
        payload = []
        url = "https://a1ce-test.cmkl.ac.th:/api/competency/detailpublic?university_code=CMKL&competency_code={course}"

        for code in course_code:
            mod_url = url.format(course = code)

            try:
                response = requests.get(mod_url)
                data = response.json()
                response.raise_for_status()
                title = data['competency']['title']
                pillar = data['competency']['pillar_title']
                color = data['competency']['graphics']['bordercolor']
                payload.append({"competency_code": code, "title": title, "pillar": pillar, "card_color": color})

            except requests.exceptions.RequestException as e:
                # print("An error occurred:", str(e))
                pass

        return payload
        
    def getChatRoom(self):
        data = request.get_json()
        username = data['username']
        email = data['email']
        course = data['course']
        api_key = data['api_key']
        check = self.checkAuthencity(email, username, api_key)
        if check != None:
            return check
        else:
            pass

        chatrooms = self.db.getChatRoom(email, username, course)
        return jsonify({'chatrooms': chatrooms})

    def login(self):
        try:
            token = request.json['token']
            token_info = self.verify_google_token(token)
            # print(token_info)
            email = token_info.get('email', None)
            user_info = self.get_google_user_info(token)

            # Extract the display name (username) from user_info
            names = user_info.get('names', [])
            username = None
            if names:
                username = names[0].get('displayName')
            
            if email is None or username is None:
                raise ValueError('Failed to retrieve user information from token.')

            key = self.db.userRegister(email, username)
            # print(key)
            # self.db.temporaryEnroll(email, username)
            user_id = self.findCanvasID(email)
            new_code = []
            assignments = []
            if user_id:
                enrolled_courses = self.getCanvasComptencyCode(user_id)
                for x in enrolled_courses[0]:
                    result_string = re.sub(r'-\w+$', '', x)
                    new_code.append(result_string)

            if new_code == [] or len(new_code) == 0:
                new_code = ["AIC-102", "AIC-108", "MAT-101", "MAT-102", "HCD-201", "SYS-101", "URD-101", "SCI-105", "HAS-101", "COM-101"]

            self.db.canvasEnrollCourse(email, username, new_code)
            payload = self.getCourseName(new_code)
            for cour in new_code:
                self.db.createChatRoom(username, email, cour, "General")
            
            return jsonify({'email': email, 'username': username, 'courses': payload, 'api_key': key})
            
        except ValueError as e:
            # print(str(e))

            return jsonify({'error': str(e)})
    
    def getFullHistory(self):
        data = request.get_json()
        username = data['username']
        email = data['email']
        course = data['course']
        chatroom = data['chatroom_name']
        api_key = data['api_key']
        check = self.checkAuthencity(email, username, api_key)
        if check != None:
            return check
        else:
            pass

        try:
            full_history = self.db.fetchChatHistory(email, username, course, chatroom)
            return jsonify({"content": full_history})
        except:
            return jsonify({"Error": "No history found in this chatroom"})
        
    def processRequest(self, email, username, course, chatroom, message, code):
        with self.queue.lock:
            chatroom_check = self.db.checkChatRoom(email, username, course, chatroom)
            if chatroom_check == True:
                status = True
            else:
                status = False

            if code == [] or code == None or code == "":
                prompt = message
            else:
                prompt = self.prompt_generation.codePrompt(message, code)

            history_check = self.db.loadChatHistory(username, email, course, chatroom)
            # print(history_check)
            if history_check != False:
                # continue_chat = self.ai.newchat(history_check)
                chat_cache, answer = self.ai.chatsession(history_check[0], prompt)
                self.db.storeChatHistory(username, email, course, chatroom, chat_cache, history_check[1])
            else:
                self.db.createChatRoom(username, email, course, chatroom)
                # conversation = self.ai.newchat()
                chat_cache, answer = self.ai.chatsession([], prompt)

                self.db.storeChatHistory(username, email, course, chatroom, chat_cache, [])
            return answer, status

    def getResponse(self):
        data = request.get_json()
        username = data['username']
        email = data['email']
        code = data['code']
        course = data['course']
        chatroom = data['chatroom_name']
        message = data['question']
        api_key = data['api_key']
        check = self.checkAuthencity(email, username, api_key)
        if check != None:
            return check
        else:
            pass

        check_course = self.db.checkenrolledCourse(email, username, course)
        if check_course[0] == False:
            return False
        else:
            pass

        answer, status = self.processRequest(email, username, course, chatroom, message, code)

        # return Response(self.streamer(answer), content_type='text/event-stream')
        return jsonify({"message": answer, "sender": "ai", "rating": "none", "status": status})
    
    def enrollCourse(self):
        data = request.get_json()
        username = data['username']
        email = data['email']
        course = data['course']
        api_key = data['api_key']
        check = self.checkAuthencity(email, username, api_key)
        if check != None:
            return check
        else:
            pass

        check_course = self.db.enrollCourse(email, username, course)
        if check_course == False:
            return jsonify({'Error': "Course already enrolled in this user"})
        else:
            courses = self.db.getUserData(email, username)

            payload = []
            url = "https://a1ce-test.cmkl.ac.th/api/competency/detailpublic?university_code=CMKL&competency_code={course}"

            for code in courses:
                mod_url = url.format(course = code)
                # print(mod_url)

                try:
                    response = requests.get(mod_url)
                    data = response.json()
                    response.raise_for_status()
                    title = data['competency']['title']
                    pillar = data['competency']['pillar_title']
                    payload.append({"compentency_code": code, "title": title, "pillar": pillar})

                except requests.exceptions.RequestException as e:
                    # print("An error occurred or have not enrolled any courses yet:", str(e))
                    pass

            return jsonify({'course_list': payload})
        
    def unenrollCourse(self):
        data = request.get_json()
        username = data['username']
        email = data['email']
        course = data['course']
        api_key = data['api_key']
        check = self.checkAuthencity(email, username, api_key)
        if check != None:
            return check
        else:
            pass
        status = self.db.unenrollCourse(email, username, course)
        
        if status == False:
            return jsonify({'Error': "Course does not exist or not enrolled"})
        else:
            payload = []
            url = "https://a1ce-test.cmkl.ac.th/api/competency/detailpublic?university_code=CMKL&competency_code={course}"

            for code in status:
                mod_url = url.format(course = code)
                # print(mod_url)

                try:
                    response = requests.get(mod_url)
                    data = response.json()
                    response.raise_for_status()
                    title = data['competency']['title']
                    pillar = data['competency']['pillar_title']
                    payload.append({"compentency_code": code, "title": title, "pillar": pillar})

                except requests.exceptions.RequestException as e:
                    # print("An error occurred or have not enrolled any courses yet:", str(e))
                    pass

            return jsonify({'course_list': payload})
            # return jsonify({'courses_list': status})

    def deleteChatRoom(self):
        data = request.get_json()
        username = data['username']
        email = data['email']
        course = data['course']
        chatroom = data['chatroom_name']
        api_key = data['api_key']
        check = self.checkAuthencity(email, username, api_key)
        if check != None:
            return check
        else:
            pass
        
        status = self.db.deleteChatRoom(email, username, course, chatroom)
        if status == False:
            return jsonify({'Error': "Chatroom does not exist or not created"})
        else:
            return jsonify({'status': 'Deleted Successfully'})
        
    def runCode(self):
        data = request.get_json()
        username = data['username']
        email = data['email']
        code = data['code']
        extension = data['file_extension']
        api_key = data['api_key']
        server_url = "http://10.233.46.196:5463/runcode"
        check = self.checkAuthencity(email, username, api_key)
        if check != None:
            return check
        else:
            pass
        payload = {
        'code': code,
        'file_extension': extension
        }

        try:
            response = requests.post(server_url, json=payload)
            response_data = response.json()  # Extract JSON data from the response
            return jsonify(response_data)

        except requests.exceptions.RequestException as e:

            return jsonify({'Error': "An error occurred:"})
        
    def resetChatHistory(self):
        data = request.get_json()
        username = data['username']
        email = data['email']
        course = data['course']
        chatroom = data['chatroom_name']
        api_key = data['api_key']
        check = self.checkAuthencity(email, username, api_key)
        if check != None:
            return check
        else:
            pass

        self.db.resetChatHistory(email, username, course, chatroom)
        return jsonify({"status": "Chatroom history reset sucessfully"})
    
    def changeChatRoomName(self):
        data = request.get_json()
        username = data['username']
        email = data['email']
        course = data['course']
        chatroom = data['chatroom_name']
        api_key = data['api_key']
        new_chatroom = data['newchatroom_name']
        check = self.checkAuthencity(email, username, api_key)
        if check != None:
            return check
        else:
            pass

        self.db.changeChatRoomName(email, username, course, chatroom, new_chatroom)
        return {"status": "chatroom name changed"}
    
    def william(self):
        with self.queue.lock:
            chat_cache, answer = self.ai.chatsession([], "Write me a very short poem")
            return answer
    
    def shakespeare(self):
        data = request.get_json()
        username = data['username']
        email = data['email']
        api_key = data['api_key']
        check = self.checkAuthencity(email, username, api_key)
        if check != None:
            return check
        else:
            pass

        poem = self.william()
        return {"message": poem}
        
if __name__ == '__main__':
    app = FlaskServer(__name__)
    CORS(app, supports_credentials=True)
    app.run(host = '0.0.0.0', port=2424)
    # app.run(host = "localhost", port=2424)
