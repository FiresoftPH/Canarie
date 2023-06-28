"""
This library acts as an intermediate to between the database and the server. This also function as the main code for connecting between the server and the front end.
"""
import macaw_db, macaw_ai

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
    
    # Promote a standard user to be an admin. Only used during development and authorized use.ss
    def promoteUser(self, username):
        return self.db.promoteUser(username)

class PromptOperations:
    def __init__(self):
        self.ai = macaw_ai.AI()
        self.prompt = macaw_ai.GeneratePrompt()

    def checkPromptType(self, prompt, code):
        try:
            return self.prompt.codePrompt(prompt, code)

        except FileNotFoundError:
            return prompt
        
        except TypeError:
            return prompt
        
# test = PromptOperations()
# print(test.checkPromptType("UWU", None))
        