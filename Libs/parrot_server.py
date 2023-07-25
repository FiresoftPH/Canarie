"""
This library acts as an intermediate to between the database and the server. This also function as the main code for connecting between the server and the front end.
"""
from Libs import parrot_ai
from flask import Flask, request, jsonify, redirect, url_for
from flask_cors import CORS
from flask_caching import Cache
from flask_oauthlib.client import OAuth
from dotenv import dotenv_values
import secrets
import pickle

import requests
import os
try: 
    import Libs.parrot_db as parrot_db
    import Libs.parrot_ai as parrot_ai

except:
    from Libs import parrot_db

import json
import subprocess
import json
from pygments.lexers import guess_lexer_for_filename
import os
import random
    
# The actual flask server
class FlaskServer(Flask):
    def __init__(self, name):
        super().__init__(name)
        # Flask server configurations
        config = dotenv_values(".env")
        self.secret_key = config['SECRET_KEY']

        # Routing applications
        self.route('/auth/login', methods = ["POST"])(self.login)
        self.route('/ai/getResponse', methods = ["POST"])(self.getResponse)
        self.route('/ai/getFullHistory', methods = ["POST"])(self.getFullHistory)
        self.route('/compileCode', methods = ["POST"])(self.compileCode)
        self.route('/auth/chatroom/fetch', methods = ["POST"])(self.getChatRoom)
        self.route('/auth/enroll', methods = ["POST"])(self.enrollCourse)
        self.route('/auth/chatroom/delete', methods = ["POST"])(self.deleteChatRoom)
        self.route('/auth/unenroll', methods = ["POST"])(self.unenrollCourse)

        # Init class
        self.db = parrot_db.Database()
        self.prompt_generation = parrot_ai.GeneratePrompt()
        self.ai = parrot_ai.Chat()
        CORS(self)
        self.oauth = OAuth(self)

    def checkAuthencity(self, email, username, api_key):
        check_auth = self.db.checkUserRegister(email, username)
        if check_auth is False:
            return json.dumps({"Error": "User not registered"})
        else:
            pass

        check_key = self.db.checkAPIKey(email, username, api_key)
        if check_key is False:
            return json.dumps({'Error': "Invalid API key"})
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
            print(f'Error during Google People API request: {e}')
            raise e
        
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
        return json.dumps({'chatrooms': chatrooms})

    def login(self):
        try:
            token = request.json['token']
            token_info = self.verify_google_token(token)
            print(token_info)
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
            print(key)
            self.db.temporaryEnroll(email, username)
            courses = self.db.getUserData(email, username)
            return json.dumps({'email': email, 'username': username, 'courses': courses, 'api_key': key})
        except ValueError as e:
            print(str(e))

            return json.dumps({'error': str(e)})
    
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

        full_history = self.db.fetchChatHistory(email, username, course, chatroom)
        # user_history = full_history[0]
        # ai_history = full_history[1]
        # return json.dumps({"user": user_history, "ai": ai_history})
        return json.dumps({"content": full_history})

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

        chatroom_check = self.db.checkChatRoom(email, username, course, chatroom)
        if chatroom_check == True:
            return {"Error": "Chatroom already exist"}
        else:
            pass

        if code == [] or code == None or code == "":
            prompt = message
        else:
            prompt = self.prompt_generation.codePrompt()

        history_check = self.db.loadChatHistory(username, email, course, chatroom)
        print(history_check)
        if history_check != False:
            # continue_chat = self.ai.newchat(history_check)
            chat_cache, answer = self.ai.chatsession(history_check, prompt)
        else:
            self.db.createChatRoom(username, email, course, chatroom)
            # conversation = self.ai.newchat()
            chat_cache, answer = self.ai.chatsession([], prompt)

        self.db.storeChatHistory(username, email, course, chatroom, chat_cache)
 
        return json.dumps({"message": answer, "sender": "ai", "rating": "none"})
    
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
            return json.dumps({'Error': "Course already enrolled in this user"})
        else:
            return json.dumps({'course_list': check_course})
        
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
            return json.dumps({'Error': "Course does not exist or not enrolled"})
        else:
            return json.dumps({'courses_list': status})

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
            return json.dumps({'Error': "Chatroom does not exist or not created"})
        else:
            return json.dumps({'status': 'Deleted Successfully'})
    
    def compileCode(self):
        # recieved_file = Cache(self, config={'CACHE_TYPE': 'simple'})
        # recieved_file = recieved_file.get("file.js")
        # print(recieved_file)
        # print(type(recieved_file))
        return jsonify({"cache": "disshpilt"})
        # # received_file = request.files['file']
        # filename = recieved_file.filename
        # file_extension = os.path.splitext(filename)[1]
        # cached_files = os.listdir("cache")
        # output_filename = str(random.randint(1, 1000000))
        # while output_filename in cached_files:
        #     output_filename = str(random.randint(1, 1000000))

        # filename = "cache/" + output_filename + file_extension
        # recieved_file.save(filename)
        # gcc_list = ['c', 'rust']
        # lexer = guess_lexer_for_filename(filename, '')
        # lang = lexer.name.lower()
        # cached_files = os.listdir("cache")
        # output_filename = str(random.randint(1, 1000000)) + ".o"
        # while output_filename in cached_files:
        #     output_filename = str(random.randint(1, 1000000)) + ".o"

        # output_filename = "cache/" + output_filename

        # if lang in gcc_list:
        #     compile_process = subprocess.Popen(['gcc', filename, "-o", output_filename], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        #     compile_process.communicate()
        #     execute_process = subprocess.Popen(['./' + output_filename], stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)
        #     stdout, stderr = execute_process.communicate()
        # elif lang == "c++":
        #     compile_process = subprocess.Popen(['g++', filename, "-o", output_filename], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        #     compile_process.communicate()
        #     execute_process = subprocess.Popen(['./' + output_filename], stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)
        #     stdout, stderr = execute_process.communicate()
        # else:
        #     process = subprocess.Popen([lang, filename], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        #     stdout, stderr = process.communicate()
        
        # if len(os.listdir("cache")) >= 20:
        #     for x in os.listdir("cache"):
        #         try:
        #             os.remove("cache/" + x)
        #         except FileNotFoundError:
        #             print("File not found")

        # return json.dumps({"Output": stdout.decode(), "Error": stderr.decode()})
        
if __name__ == '__main__':
    app = FlaskServer(__name__)
    app.run(host = '0.0.0.0', port=2424)
    # app.run(host = "localhost", port=2424)
