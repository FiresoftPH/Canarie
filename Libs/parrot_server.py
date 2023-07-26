"""
This library acts as an intermediate to between the database and the server. This also function as the main code for connecting between the server and the front end.
"""
from flask import Flask, request, jsonify, redirect, url_for, Response
from flask_cors import CORS
from flask_caching import Cache
from flask_oauthlib.client import OAuth
from dotenv import dotenv_values
import secrets
import pickle

import requests
import sys
import FastChat.parrot_ai as parrot_ai
import parrot_db

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
        self.route('/compileCode', methods = ["POST"])(self.runCode)
        self.route('/auth/chatroom/fetch', methods = ["POST"])(self.getChatRoom)
        self.route('/auth/chatroom/reset', methods = ["POST"])(self.resetChatHistory)
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
        return jsonify({'chatrooms': chatrooms})

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

            payload = []
            url = "https://a1ce-test.cmkl.ac.th/api/competency/detailpublic?university_code=CMKL&competency_code={course}"

            for code in courses:
                mod_url = url.format(course = code)
                print(mod_url)

                try:
                    response = requests.get(mod_url)
                    data = response.json()
                    response.raise_for_status()
                    title = data['competency']['title']
                    pillar = data['competency']['pillar_title']
                    # dictionary_stuff = {"compentency_code": code, "title": title, "pillar": pillar}
                    dictionary_stuff = {"competency_code": code, "title": title, "pillar": pillar}
                    payload.append(dictionary_stuff)

                except requests.exceptions.RequestException as e:
                    print("An error occurred or have not enrolled any courses yet:", str(e))
            
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
            chat_cache, answer = self.ai.chatsession(history_check, prompt)
        else:
            self.db.createChatRoom(username, email, course, chatroom)
            # conversation = self.ai.newchat()
            chat_cache, answer = self.ai.chatsession([], prompt)

        self.db.storeChatHistory(username, email, course, chatroom, chat_cache)

        # return Response(self.streamer(answer), content_type='text/event-stream')
        return jsonify({"message": answer, "sender": "ai", "rating": "none", "status": status})
    
    def streamer(self, text):
        for x in text:
            yield x
    
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
                print(mod_url)

                try:
                    response = requests.get(mod_url)
                    data = response.json()
                    response.raise_for_status()
                    title = data['competency']['title']
                    pillar = data['competency']['pillar_title']
                    payload.append({"compentency_code": code, "title": title, "pillar": pillar})

                except requests.exceptions.RequestException as e:
                    print("An error occurred or have not enrolled any courses yet:", str(e))

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
                print(mod_url)

                try:
                    response = requests.get(mod_url)
                    data = response.json()
                    response.raise_for_status()
                    title = data['competency']['title']
                    pillar = data['competency']['pillar_title']
                    payload.append({"compentency_code": code, "title": title, "pillar": pillar})

                except requests.exceptions.RequestException as e:
                    print("An error occurred or have not enrolled any courses yet:", str(e))

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
        
if __name__ == '__main__':
    app = FlaskServer(__name__)
    app.run(host = '0.0.0.0', port=2424)
    # app.run(host = "localhost", port=2424)
