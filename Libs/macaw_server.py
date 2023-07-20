"""
This library acts as an intermediate to between the database and the server. This also function as the main code for connecting between the server and the front end.
"""
from flask import Flask, request, jsonify, redirect, url_for
from flask_cors import CORS
from flask_caching import Cache
from flask_oauthlib.client import OAuth
from dotenv import dotenv_values
import secrets 

import requests
import os
try: 
    import macaw_db
    import macaw_ai

except:
    from Libs import macaw_db, macaw_ai

import json
import subprocess
import json
from pygments.lexers import guess_lexer_for_filename
import os
import random

class DatabaseOperations:
    def __init__(self):
        self.db = macaw_db.Database()

    # Add course data to the courses table. In the final development, this will be automatically integrated with canvas
    def addCourseData(self, course_name, assignment_list):
        self.db.addCourseData(course_name, assignment_list)

    # User register, each user have to have a name, username and password.
    def userRegister(self, email, username):
        return self.db.userRegister(email, username)

    # Provided login functionalities and returns the credentials to the applications.
    def userLogin(self, username, password):
        return self.db.userLogin(username, password)

    # Used when enrolling courses for each user.
    def enrollCourse(self, username, course_list):
        self.db.enrollCourse(username, course_list)

    # Used when enrolling courses for each user. This method checks if the selected courses are already enrolled or not
    def checkEnrolledCourse(self, username, course_list):
        return self.db.checkEnrolledCourse(self, username, course_list)

    # Used when enrolling courses for each user. This method checks if the selected courses are registered or not.
    def checkRegisteredCourse(self, course_name):
        return self.db.checkRegisteredCourse(course_name)
    
    # Used together with the login method. This checks whether the user enrolled any courses yet.
    def checkInitialSetup(self, username):
        return self.db.checkInitialSetup(username)
    
    # Returns the users enrolled courses as the name suggested.
    def showUserEnrolledCourse(self, username):
        return self.db.showUserEnrolledCourse(username)
    
    # Admin login to access other user's data
    def adminLogin(self, username, password):
        return self.db.adminLogin(username, password)

    def showCourseData(self, mode):
        return self.db.showCourseData(mode)
    
    # Promote a standard user to be an admin. Only used during development and authorized use.ss
    def promoteUser(self, username):
        return self.db.promoteUser(username)

    # Get all chatroom assosiated with a user and course name (WIP):
    def getUserChatRoom(self, username):
        return self.db.getUserChatRoom(username)

    # fetch user related data and send to frontend
    def fetchUserData(self, username):
        return self.db.fetchUserData(username)
    
# The actual flask server
class FlaskServer(Flask):
    def __init__(self, name):
        super().__init__(name)
        # Flask server configurations
        config = dotenv_values(".env")
        self.secret_key = config['SECRET_KEY']

        # Routing applications
        self.route('/auth/login', methods = ["POST"])(self.login)
        self.route('/ai/get_response', methods = ["POST"])(self.getResponse)
        self.route('/ai/getFullHistory', methods = ["POST"])(self.getFullHistory)
        self.route('/compileCode', methods = ["POST"])(self.compileCode)
        # Future routings
        # self.route('/user/enroll', methods = ["POST"])(self.enroll)
        # self.route('/user/unenroll', methods = ["POST"])(self.unenroll)
        # self.route('/user/courses', methods = ["POST"])(self.getEnrolledCourse)

        # Init class
        self.db = macaw_db.Database()
        self.prompt_generation = macaw_ai.GeneratePrompt()
        self.ai = macaw_ai.Chat()
        CORS(self)
        self.oauth = OAuth(self)

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

            print(username)
            print(email)
            
            if email is None or username is None:
                raise ValueError('Failed to retrieve user information from token.')

            self.db.userRegister(email, username)
            self.db.temporaryEnroll(email, username)
            return jsonify({'email': email, 'username': username})
        except ValueError as e:
            print(str(e))

            return jsonify({'error': str(e)})
    
    def getEnrolledCourse(self):
        course_list = self.db.showUserEnrolledCourse(self.credentials[0])
        print(json.dumps(course_list))
        return json.dumps(course_list)
    
    def getFullHistory(self):
        username = request.form['username']
        email = request.form['email']
        course = request.form['course']
        chatroom = request.form['chatroom_name']
        full_history = self.db.loadChatHistory(username, email, course, chatroom)
        user_history = full_history[0]
        ai_history = full_history[1]
        return json.dumps({"user": user_history, "ai": ai_history})

    def getResponse(self):
        username = request.form['username']
        email = request.form['email']
        code = request.form['code']
        course = request.form['course']
        chatroom = request.form['chatroom_name']
        message = request.form['question']
        if code == [] or code == None or code == "":
            prompt = message
        else:
            prompt = self.prompt_generation.codePrompt()

        history_check = self.db.loadChatHistory(username, email, course, chatroom)
        if history_check != False:
            chat_cache, answer = self.ai.chatsession(history_check, prompt)
        else:
            self.db.createChatRoom()
            conversation = self.ai.newchat()
            chat_cache, answer = self.ai.chatsession(conversation, prompt)

        self.db.storeChatHistory(username, email, course, chatroom, chat_cache)
 
        return json.dumps({"message": answer, "sender": "ai", "rating": "none"})
    
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
