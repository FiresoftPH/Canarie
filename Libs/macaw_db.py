import pymysql.cursors
import numpy as np
import json
import pickle
from dotenv import dotenv_values

class Database:
    def __init__(self):

        # file = open("Libs/parrot_db_keys.txt", "r")
        config = dotenv_values(".env")
        self.connection = pymysql.connect(
        host=config["HOST_ALT"],
        port=int(config["PORT_ALT"]),
        user=config["USER"],
        password=config["PASSWORD"],
        database=config["DATABASE"]
        )
        self.cursor = self.connection.cursor()
        # file.close()
        # except pymysql.err.OperationalError:

        try:
            command_0 = "CREATE TABLE courses (id INT AUTO_INCREMENT PRIMARY KEY, course_name VARCHAR(255), assignments VARCHAR(255))"
            self.cursor.execute(command_0)
        except pymysql.err.OperationalError:
            print("Already initialized")
            pass

        try:
            command_1 = "CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255),  email VARCHAR(255), enrolled_courses VARCHAR(255), status VARCHAR(255), consent VARCHAR(255))"
            self.cursor.execute(command_1)
        except pymysql.err.OperationalError:
            print("Already initialized")
            pass

        try:
            command_2 = "CREATE TABLE statistics (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255), email VARCHAR(255),  overall_understanding VARCHAR(255), most_asked_course VARCHAR(255), average_session_time VARCHAR(255))"
            self.cursor.execute(command_2)
        except pymysql.err.OperationalError:
            print("Already initialized")
            pass

        try:
            command_3 = "CREATE TABLE chat_history (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255), email VARCHAR(255), course_name VARCHAR(255), room_name VARCHAR(255), log BLOB)"
            self.cursor.execute(command_3)
        except pymysql.err.OperationalError:
            print("Already initialized")
            pass

        try:
            command_4 = "CREATE TABLE assignments (id INT AUTO_INCREMENT PRIMARY KEY, assignment_name VARCHAR(255), assignment_details VARCHAR(255))"
            self.cursor.execute(command_4)
        except pymysql.err.OperationalError:
            print("Already initialized")
            pass

    # Reset the table values to nothing in case something gone wrong. This is used for development only.
    def resetTable(self):
        config = dotenv_values(".env")
        self.connection = pymysql.connect(
        host=config["HOST_ALT"],
        port=int(config["PORT_ALT"]),
        user=config["USER"],
        password=config["PASSWORD"],
        database=config["DATABASE"]
        )
        self.cursor = self.connection.cursor()
        # self.cursor.execute("DROP TABLE courses")
        self.cursor.execute("DROP TABLE users")
        self.cursor.execute("DROP TABLE statistics")
        self.cursor.execute("DROP TABLE chat_history")
        self.cursor.close()

    # Alter the table columns to add more functionalities. This is used for development only
    def alterTable(self):
        self.cursor = self.connection.cursor()
        self.cursor.execute("ALTER TABLE statistics ADD assignment_details VARCHAR(255) DEFAULT ''")
        self.cursor.close()

    # Add course data to the courses table. In the final development, this will be automatically integrated with canvas
    def addCourseData(self, course_name, assignment_list):
        self.cursor = self.connection.cursor()
        self.cursor.execute("SELECT course_name, assignments FROM courses")
        registered_course = self.cursor.fetchall()
        assignment_list = self.stringFromArray(assignment_list)
        new_course_data = (course_name, assignment_list)
        if new_course_data in registered_course:
            print("Course already exist")
        else:
            command = "INSERT INTO courses (course_name, assignments) VALUES (%s, %s)"
            self.cursor.execute(command, new_course_data)
            self.connection.commit()
        self.cursor.close()

    # User register, each user have to have a name, username and password.
    def userRegister(self, email, username):
        config = dotenv_values(".env")
        self.connection = pymysql.connect(
        host=config["HOST_ALT"],
        port=int(config["PORT_ALT"]),
        user=config["USER"],
        password=config["PASSWORD"],
        database=config["DATABASE"]
        )
        self.cursor = self.connection.cursor()
        self.cursor.execute("SELECT email FROM users")
        result = self.cursor.fetchall()
        new_user_data = (email, )        
        for row in result:
            if row == new_user_data:
                print("User already exist")
                return False
            
        new_user_data_long = (email, username, "", "user", "yes")
        command = "INSERT INTO users (email, username, enrolled_courses, status, consent) VALUES (%s, %s, %s, %s, %s)"
        self.cursor.execute(command, new_user_data_long)
        self.connection.commit()
        self.cursor.close()
        return True

    def temporaryEnroll(self, email, username):
        config = dotenv_values(".env")
        self.connection = pymysql.connect(
        host=config["HOST_ALT"],
        port=int(config["PORT_ALT"]),
        user=config["USER"],
        password=config["PASSWORD"],
        database=config["DATABASE"]
        )
        self.cursor = self.connection.cursor()
        command = "UPDATE users SET enrolled_courses = %s WHERE email = %s AND username = %s"
        temp_course = ["Principal Of Computing Applications", "Computer Systems", "Advanced Calculus", "Database Technology", "Cloud Computing"]
        course_data = self.stringFromArray(temp_course)
        self.cursor.execute(command, (course_data, email, username))
        self.connection.commit()
        self.cursor.close()

    def getUserData(self, email, username):
        config = dotenv_values(".env")
        self.connection = pymysql.connect(
        host=config["HOST_ALT"],
        port=int(config["PORT_ALT"]),
        user=config["USER"],
        password=config["PASSWORD"],
        database=config["DATABASE"]
        )
        self.cursor = self.connection.cursor()
        command = "SELECT enrolled_courses from users WHERE email = %s AND username = %s"
        self.cursor.execute(command, (email, username))
        result = self.cursor.fetchall()
        course_data = result[0][0]
        course_data = self.arrayFromString(course_data)
        self.cursor.close()
        return course_data

    # Used to show course data in the database. Some modes will be removed from the final version.
    def showCourseData(self, mode=0):
        self.cursor = self.connection.cursor()
        if mode == 0:
            self.cursor.execute("SELECT course_name, assignments FROM courses")
            result = self.cursor.fetchall()
            course_data = []
            for row in result:
                course_data.append(row)

            # print(course_data)
            return course_data
        
        elif mode == 1:
            self.cursor.execute("SELECT * FROM courses")
            result = self.cursor.fetchall()
            for row in result:
                print(row)

        elif mode == 2:
            self.cursor.execute("SELECT course_name FROM courses")
            result = self.cursor.fetchall()
            # course_data = []
            for row in result:
                # course_data.append(row[0])
                print(row[0])

    # Shows the data from the users table. Some modes will be removed in the final version.
    def showUserData(self, mode=0):
        self.cursor = self.connection.cursor()
        if mode == 0:
            self.cursor.execute("SELECT email, username FROM users")
            result = self.cursor.fetchall()
            user_data = []
            for row in result:
                user_data.append(row)

            print(user_data)
            return user_data
        
        elif mode == 1:
            self.cursor.execute("SELECT * FROM users")
            result = self.cursor.fetchall()
            for row in result:
                print(row)

        elif mode == 2:
            self.cursor.execute("SELECT username, password FROM users")
            result = self.cursor.fetchall()
            user_data = []
            for row in result:
                user_data.append(row)

            # print(user_data)
            return user_data
        
        elif mode == 3:
            self.cursor.execute("SELECT enrolled_courses FROM users")
            result = self.cursor.fetchall()
            for row in result:
                print(row)

    # Use together with flask webserver to fetch the user whole information
    def fetchUserData(self, username):
        config = dotenv_values(".env")
        self.connection = pymysql.connect(
        host=config["HOST_ALT"],
        port=int(config["PORT_ALT"]),
        user=config["USER"],
        password=config["PASSWORD"],
        database=config["DATABASE"]
        )
        self.cursor = self.connection.cursor()
        self.cursor.execute("SELECT * FROM users WHERE username = %s", username)
        result = self.cursor.fetchall()
        transform_courses = self.arrayFromString(result[0][4])
        data = {"id": result[0][0], "name": result[0][1], "username": result[0][2], "password": result[0][3], "enrolled_courses": transform_courses, "status": result[0][5]}
        return data
    
    # Use together with flask webserver to fetch the course data enrolled by a given user.
    def fetchUserCourseData(self, username):
        self.cursor = self.connection.cursor()
        self.cursor.execute("SELECT enrolled_courses WHERE username = %s", username)
        result = self.cursor.fetchall()
        transform_courses = self.arrayFromString(result[0][0])
        return transform_courses
    
    # Shows the data from the statistics table. 
    def showStatisticsData(self):
        self.cursor = self.connection.cursor()
        self.cursor.execute("SELECT username FROM statistics")

        result = self.cursor.fetchall()
        for row in result:
            print(row)

    # These are for the Assignment list for each courses. It changes an array to strings to store inside the database.
    def stringFromArray(self, array):
        temp = ','.join(array)
        # print(temp)
        return temp

    def arrayFromString(self, string):
        temp = string.split(',')
        return temp

    # Provided login functionalities and returns the credentials to the applications.
    def userLogin(self, username, password):
        self.cursor = self.connection.cursor()
        self.cursor.execute("SELECT username, password FROM users")
        result = self.cursor.fetchall()
        credentials = (username, password)        
        for row in result:
            if row == credentials:
                # print("Login Successfully")
                return (credentials, True)

        return False

    # Used when enrolling courses for each user. (WIP)
    def enrollCourse(self, email, username, course_list):
        config = dotenv_values(".env")
        self.connection = pymysql.connect(
        host=config["HOST_ALT"],
        port=int(config["PORT_ALT"]),
        user=config["USER"],
        password=config["PASSWORD"],
        database=config["DATABASE"]
        )
        self.cursor = self.connection.cursor()

    # Used when enrolling courses for each user. This method checks if the selected courses are already enrolled or not
    def checkEnrolledCourse(self, email, username, course):
        self.cursor = self.connection.cursor()
        command = "SELECT enrolled_courses FROM users WHERE email = %sAND username = %s"
        self.cursor.execute(command, (email, username))
        enrolled_course = self.cursor.fetchall()
        enrolled_course = enrolled_course[0][0]
        if course in enrolled_course:
            return True
        else:
            return False

    # Used when enrolling courses for each user. This method checks if the selected courses are registered or not.
    def checkRegisteredCourse(self, course_name):
        self.cursor = self.connection.cursor()
        self.cursor.execute("SELECT course_name FROM courses")
        enrolled_course = self.cursor.fetchall()
        # enrolled_course = self.arrayFromString(enrolled_course)
        # print(enrolled_course)
        course_name = (course_name, )
        if course_name in enrolled_course:
            return True
        else:
            return False
    
    # Used together with the login method. This checks whether the user enrolled any courses yet.
    def checkInitialSetup(self, username):
        self.cursor = self.connection.cursor()
        command = "SELECT enrolled_courses FROM users WHERE username = %s"
        self.cursor.execute(command, username)
        enrolled_courses = self.cursor.fetchall()
        if enrolled_courses[0][0] == '':
            return False
        else:
            return True
    
    # Returns the users enrolled courses as the name suggested.
    def showUserEnrolledCourse(self, username):
        self.cursor = self.connection.cursor()
        command = "SELECT enrolled_courses FROM users WHERE username = %s"
        self.cursor.execute(command, username)
        enrolled_courses = self.cursor.fetchall()
        enrolled_courses = self.arrayFromString(enrolled_courses[0][0])
        return enrolled_courses
    
    # Admin login to access other user's data
    def adminLogin(self, username, password):
        self.cursor = self.connection.cursor()
        self.cursor.execute("SELECT username, password FROM users")
        result = self.cursor.fetchall()
        credentials = (username, password)        
        for row in result:
            if row == credentials:
                # print("Login Successfully")
                self.cursor.execute("SELECT status FROM users WHERE username = %s", username)
                status = self.cursor.fetchall()
                if status[0][0] == "admin":
                    return (credentials, True)
                else:
                    return False

        return False
    
    # Promote a standard user to be an admin. Only used during development and authorized use.ss
    def promoteUser(self, username):
        self.cursor = self.connection.cursor()
        command = "UPDATE users SET status = %s WHERE username = %s"
        self.cursor.execute(command, ("admin", username))
        self.connection.commit()

    # Show all chat history stored in the database
    def showChatHistory(self):
        self.cursor = self.connection.cursor()
        self.cursor.execute("SELECT * FROM chat_history")
        result = self.cursor.fetchall()
        for row in result:
            print(row)

    # Show all tables listed in the database.
    def showAllTables(self):
        self.cursor = self.connection.cursor()
        self.cursor.execute("SHOW TABLES")
        result = self.cursor.fetchall()
        for row in result:
            print(row)

    # Update chat history in the database. This will be updated when the session ends.
    def storeChatHistory(self, username, email, course, room_name, history):
        config = dotenv_values(".env")
        self.connection = pymysql.connect(
        host=config["HOST_ALT"],
        port=int(config["PORT_ALT"]),
        user=config["USER"],
        password=config["PASSWORD"],
        database=config["DATABASE"]
        )
        self.cursor = self.connection.cursor()
        # history = pickle.dumps(history)
        self.cursor.execute("UPDATE chat_history SET log = %s WHERE email = %s AND username = %s AND course_name = %s AND room_name = %s",
                                    (history, email, username, course, room_name))
        self.connection.commit()
        self.cursor.close()

    # Function to create a chat room.
    def createChatRoom(self, username, email, course, room_name):
        config = dotenv_values(".env")
        self.connection = pymysql.connect(
        host=config["HOST_ALT"],
        port=int(config["PORT_ALT"]),
        user=config["USER"],
        password=config["PASSWORD"],
        database=config["DATABASE"]
        )
        self.cursor = self.connection.cursor()
        command = "INSERT INTO chat_history (username, email, course_name, room_name) VALUES (%s, %s, %s, %s)"
        self.cursor.execute(command, (username, email, course, room_name))
        self.cursor.close()
    
    def loadChatHistory(self, username, email, course, room_name):
        config = dotenv_values(".env")
        self.connection = pymysql.connect(
        host=config["HOST_ALT"],
        port=int(config["PORT_ALT"]),
        user=config["USER"],
        password=config["PASSWORD"],
        database=config["DATABASE"]
        )
        self.cursor = self.connection.cursor()
        try:
            self.cursor.execute("SELECT log FROM chat_history WHERE email = %s AND username = %s AND course_name = %s AND room_name = %s", (email, username, course, room_name))
            result = self.cursor.fetchall()
            temp = result[0][0]
            self.cursor.close()
            if temp == "" or temp == None:
                return False
            else:
                return pickle.loads(temp)
        
        except IndexError:
            return False
        
        except ValueError:
            return False

        except pymysql.OperationalError:
            return False
    
    def printChatHistory(self, username):
        self.cursor = self.connection.cursor()
        self.cursor.execute("SELECT assignment_name FROM chat_history WHERE username = %s", username)
        all_history = self.cursor.fetchall()
        for data in all_history:
            print(data)
            
        return False

    def showColumnNames(self):
        self.cursor = self.connection.cursor()
        self.cursor.execute("SELECT * from chat_history")
        print(self.cursor.description)

    def getUserChatRoom(self, username):
        self.cursor = self.connection.cursor()
        self.cursor.execute("SELECT assignment_name from chat_history WHERE username = %s", username)
        result = self.cursor.fetchall()
        print(result)
    
"""
TESTING THE FUNCTIONALITIES OF THE DATABASE
"""

# test = Database()
# test.resetTable()
# print(test.loadChatHistory("hutao", "Computer System", ""))
# print(test.loadChatHistory("hutao"))