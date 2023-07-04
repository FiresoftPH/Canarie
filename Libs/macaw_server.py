"""
This library acts as an intermediate to between the database and the server. This also function as the main code for connecting between the server and the front end.
"""
from flask import Flask, request
import os
try: 
    import macaw_db, macaw_ai

except:
    from Libs import macaw_db, macaw_ai

import json

class DatabaseOperations:
    def __init__(self):
        self.db = macaw_db.Database()

    # Add course data to the courses table. In the final development, this will be automatically integrated with canvas
    def addCourseData(self, course_name, assignment_list):
        self.db.addCourseData(course_name, assignment_list)

    # User register, each user have to have a name, username and password.
    def userRegister(self, name, username, password):
        return self.db.userRegister(name, username, password)

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

class AIOperations:
    def __init__(self):
        self.ai = macaw_ai.AI()
        self.prompt = macaw_ai.GeneratePrompt()
        self.db = macaw_db.Database()
        self.template = {"error_checking" : "Can you recheck this response?: ", "rating" : "Can you rate this conversation from 1 - 10"}

    def getPrompt(self, prompt, code):
        try:
            if code == None:
                return prompt
            else:
                return self.prompt.codePrompt(prompt, code)

        except FileNotFoundError:
            return prompt
        
        except TypeError:
            return prompt
    
    def storeChatHistory(self, username, course, assignment):
        chat_history = self.ai.getCachedMemory()
        self.db.storeChatHistory(username, course, assignment, chat_history)
        self.db.showChatHistory()

    def getResponse(self, prompt):
        return self.ai.getResponse(prompt)
    
    def loadChatHistory(self, username, course, assignment):
        old_chat = self.db.loadChatHistory(username, course, assignment)
        if old_chat == False:
            return
        else:
            self.ai.loadHistory(old_chat)
            return

# Google authentication
class GAuthentication:
    def __init__(self):
        pass

class FlaskServer(Flask):
    def __init__(self, name):
        super().__init__(name)
        # Routing applications
        self.route('/login')(self.login)
        self.route('/register')(self.register)
        self.route('/enrolled_courses')(self.getEnrolledCourse)

        # Init class
        self.db = DatabaseOperations()
        self.ai = AIOperations()
        self.auth = GAuthentication()
        self.credentials = None
        self.credentials = ("Firesoft", "111111")
        self.current_chat_room = None
        self.current_chat_room = ["Computer System", None]

    def login(self):
        data = request.json
        username = data.get("username")
        password = data.get("password")

        success = self.db.userLogin(username, password)
        try:
            if success[1] is True:
                response = {'message': 'Login Success'}
                self.credentials = success[0]
                initial = self.db.checkInitialSetup(self.credentials[0])
                if initial == False:
                    response.update({'status': 'No courses enrolled yet'})
                else:
                    # confirm = str(input("Do you want to enroll any courses?: "))
                    # # if +
                    response.update({'status': 'Already contained enrolled courses'})

            else:
                response = {'message': 'Wrong Username or Password!'}

        except TypeError:
            response = {'message': 'Wrong Username or Password!'}

        return json.dumps(response)

    def register(self):
        data = request.json
        name = data.get("name")
        username = data.get("username")
        password = data.get("password")
        success = self.db.userRegister(name, username, password)
        if success is True:
            response = {'message': 'Done!'}
        else:
            response = {'message': "User already register, use login instead"}

        return json.dumps(response)
    
    def getEnrolledCourse(self):
        course_list = self.db.showUserEnrolledCourse(self.credentials[0])
        print(json.dumps(course_list))
        return json.dumps(course_list)
    
    def loadChatHistory(self):
        return self.ai.loadChatHistory(self.credentials[0], self.current_chat_room[0], self.current_chat_room[1])

    def getResponse(self):
        data = request.json
        question = data.get("responses")
        if 'file' in request.files:
            file = request.files['file']
        else:
            file_dir = None
        
        if file.filename is '':
            return "File name is empty"
        else:
            try:
                file_dir = os.path.join('uploads', file.filename)
                file.save(file_dir)
            except OSError:
                file_dir = None

        prompt = self.ai.getPrompt(question, file_dir)
        self.ai.getResponse(prompt, file_dir)
        # self.ai.storeChatHistory(self.credentials[0], self.current_chat_room[0], self.current_chat_room[1])

if __name__ == '__main__':
    app = FlaskServer(__name__)
    app.run()



        