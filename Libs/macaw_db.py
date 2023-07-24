import pymysql.cursors
import numpy as np
import json
import pickle
from dotenv import dotenv_values
import secrets

class Database:
    def __init__(self):

        # file = open("Libs/parrot_db_keys.txt", "r")
        config = dotenv_values(".env")
        connection = pymysql.connect(
        host=config["HOST_ALT"],
        port=int(config["PORT_ALT"]),
        user=config["USER"],
        password=config["PASSWORD"],
        database=config["DATABASE"],
        connect_timeout=30,
        read_timeout=300,
        write_timeout=300
        )
        cursor = connection.cursor()
        # file.close()
        # except pymysql.err.OperationalError:

        try:
            command_0 = "CREATE TABLE courses (id INT AUTO_INCREMENT PRIMARY KEY, course_name VARCHAR(255), assignments VARCHAR(255))"
            cursor.execute(command_0)
        except pymysql.err.OperationalError:
            print("Already initialized")
            pass

        try:
            command_1 = "CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255),  email VARCHAR(255), enrolled_courses VARCHAR(255), status VARCHAR(255), consent VARCHAR(255), api_key VARCHAR(255))"
            cursor.execute(command_1)
        except pymysql.err.OperationalError:
            print("Already initialized")
            pass

        try:
            command_2 = "CREATE TABLE statistics (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255), email VARCHAR(255),  overall_understanding VARCHAR(255), most_asked_course VARCHAR(255), average_session_time VARCHAR(255))"
            cursor.execute(command_2)
        except pymysql.err.OperationalError:
            print("Already initialized")
            pass

        try:
            command_3 = "CREATE TABLE chat_history (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255), email VARCHAR(255), course_name VARCHAR(255), room_name VARCHAR(255), log BLOB)"
            cursor.execute(command_3)
        except pymysql.err.OperationalError:
            print("Already initialized")
            pass

        try:
            command_4 = "CREATE TABLE assignments (id INT AUTO_INCREMENT PRIMARY KEY, assignment_name VARCHAR(255), assignment_details VARCHAR(255))"
            cursor.execute(command_4)
        except pymysql.err.OperationalError:
            print("Already initialized")
            pass

        cursor.close()

    # Reset the table values to nothing in case something gone wrong. This is used for development only.
    def resetTable(self):
        config = dotenv_values(".env")
        connection = pymysql.connect(
        host=config["HOST_ALT"],
        port=int(config["PORT_ALT"]),
        user=config["USER"],
        password=config["PASSWORD"],
        database=config["DATABASE"],
        connect_timeout=30,
        read_timeout=300,
        write_timeout=300
        )
        cursor = connection.cursor()
        # cursor.execute("DROP TABLE courses")
        cursor.execute("DROP TABLE users")
        cursor.execute("DROP TABLE statistics")
        cursor.execute("DROP TABLE chat_history")
        cursor.close()

    # Alter the table columns to add more functionalities. This is used for development only
    def alterTable(self):
        config = dotenv_values(".env")
        connection = pymysql.connect(
        host=config["HOST_ALT"],
        port=int(config["PORT_ALT"]),
        user=config["USER"],
        password=config["PASSWORD"],
        database=config["DATABASE"],
        connect_timeout=30,
        read_timeout=300,
        write_timeout=300
        )
        cursor = connection.cursor()
        cursor.execute("ALTER TABLE statistics ADD assignment_details VARCHAR(255) DEFAULT ''")
        cursor.close()

    # User register, each user have to have a name, username and password.
    def userRegister(self, email, username):
        config = dotenv_values(".env")
        connection = pymysql.connect(
        host=config["HOST_ALT"],
        port=int(config["PORT_ALT"]),
        user=config["USER"],
        password=config["PASSWORD"],
        database=config["DATABASE"],
        connect_timeout=30,
        read_timeout=300,
        write_timeout=300
        )
        cursor = connection.cursor()
        cursor.execute("SELECT email FROM users")
        result = cursor.fetchall()
        new_user_data = (email, )        
        for row in result:
            if row == new_user_data:
                print("User already exist")
                return False
        
        api_key = secrets.token_hex(64)
        new_user_data_long = (email, username, "", "user", "yes", api_key)
        command = "INSERT INTO users (email, username, enrolled_courses, status, consent, api_key) VALUES (%s, %s, %s, %s, %s, %s)"
        cursor.execute(command, new_user_data_long)
        connection.commit()
        cursor.close()
        return api_key
    
    def checkAPIKey(self, email, username, api_key):
        config = dotenv_values(".env")
        connection = pymysql.connect(
        host=config["HOST_ALT"],
        port=int(config["PORT_ALT"]),
        user=config["USER"],
        password=config["PASSWORD"],
        database=config["DATABASE"],
        connect_timeout=30,
        read_timeout=300,
        write_timeout=300
        )
        cursor = connection.cursor()
        command = "SELECT email, username, api_key FROM users"
        load = (email, username, api_key)
        cursor.execute(command, load)
        result = cursor.fetchall()
        cursor.close()
        if load in result:
            return True
        else:
            return False

    def temporaryEnroll(self, email, username):
        config = dotenv_values(".env")
        connection = pymysql.connect(
        host=config["HOST_ALT"],
        port=int(config["PORT_ALT"]),
        user=config["USER"],
        password=config["PASSWORD"],
        database=config["DATABASE"],
        connect_timeout=30,
        read_timeout=300,
        write_timeout=300
        )
        cursor = connection.cursor()
        command = "UPDATE users SET enrolled_courses = %s WHERE email = %s AND username = %s"
        temp_course = ["Principal Of Computing Applications", "Computer Systems", "Advanced Calculus", "Database Technology", "Cloud Computing"]
        course_data = self.stringFromArray(temp_course)
        cursor.execute(command, (course_data, email, username))
        connection.commit()
        cursor.close()

    def getUserData(self, email, username):
        config = dotenv_values(".env")
        connection = pymysql.connect(
        host=config["HOST_ALT"],
        port=int(config["PORT_ALT"]),
        user=config["USER"],
        password=config["PASSWORD"],
        database=config["DATABASE"],
        connect_timeout=30,
        read_timeout=300,
        write_timeout=300
        )
        cursor = connection.cursor()
        command = "SELECT enrolled_courses from users WHERE email = %s AND username = %s"
        cursor.execute(command, (email, username))
        result = cursor.fetchall()
        course_data = result[0][0]
        course_data = self.arrayFromString(course_data)
        cursor.close()
        return course_data

    # Use together with flask webserver to fetch the user whole information
    def fetchUserData(self, username):
        config = dotenv_values(".env")
        connection = pymysql.connect(
        host=config["HOST_ALT"],
        port=int(config["PORT_ALT"]),
        user=config["USER"],
        password=config["PASSWORD"],
        database=config["DATABASE"],
        connect_timeout=30,
        read_timeout=300,
        write_timeout=300
        )
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM users WHERE username = %s", username)
        result = cursor.fetchall()
        transform_courses = self.arrayFromString(result[0][4])
        data = {"id": result[0][0], "name": result[0][1], "username": result[0][2], "password": result[0][3], "enrolled_courses": transform_courses, "status": result[0][5]}
        return data

    # These are for the Assignment list for each courses. It changes an array to strings to store inside the database.
    def stringFromArray(self, array):
        temp = ','.join(array)
        # print(temp)
        return temp

    def arrayFromString(self, string):
        temp = string.split(',')
        return temp
    
    def checkUserRegister(self, email, username):
        config = dotenv_values(".env")
        connection = pymysql.connect(
        host=config["HOST_ALT"],
        port=int(config["PORT_ALT"]),
        user=config["USER"],
        password=config["PASSWORD"],
        database=config["DATABASE"],
        connect_timeout=30,
        read_timeout=300,
        write_timeout=300
        )
        cursor = connection.cursor()
        cursor.execute("SELECT email, username FROM users")
        registered = cursor.fetchall()
        if (email, username) in registered:
            return True
        else:
            return False

    # Used when enrolling courses for each user. (WIP)
    def enrollCourse(self, email, username, course_list):
        config = dotenv_values(".env")
        connection = pymysql.connect(
        host=config["HOST_ALT"],
        port=int(config["PORT_ALT"]),
        user=config["USER"],
        password=config["PASSWORD"],
        database=config["DATABASE"],
        connect_timeout=30,
        read_timeout=300,
        write_timeout=300
        )
        cursor = connection.cursor()

    # Update chat history in the database. This will be updated when the session ends.
    def storeChatHistory(self, username, email, course, room_name, history):
        config = dotenv_values(".env")
        connection = pymysql.connect(
        host=config["HOST_ALT"],
        port=int(config["PORT_ALT"]),
        user=config["USER"],
        password=config["PASSWORD"],
        database=config["DATABASE"],
        connect_timeout=30,
        read_timeout=300,
        write_timeout=300
        )
        cursor = connection.cursor()
        # history = pickle.dumps(history)
        cursor.execute("UPDATE chat_history SET log = %s WHERE email = %s AND username = %s AND course_name = %s AND room_name = %s",
                                    (history, email, username, course, room_name))
        connection.commit()
        cursor.close()

    # Function to create a chat room.
    def createChatRoom(self, username, email, course, room_name):
        config = dotenv_values(".env")
        connection = pymysql.connect(
        host=config["HOST_ALT"],
        port=int(config["PORT_ALT"]),
        user=config["USER"],
        password=config["PASSWORD"],
        database=config["DATABASE"],
        connect_timeout=30,
        read_timeout=300,
        write_timeout=300
        )
        cursor = connection.cursor()
        command = "INSERT INTO chat_history (username, email, course_name, room_name) VALUES (%s, %s, %s, %s)"
        cursor.execute(command, (username, email, course, room_name))
        connection.commit()
        cursor.close()

    def fetchChatHistory(self, email, username, course, room_name):
        config = dotenv_values(".env")
        connection = pymysql.connect(
        host=config["HOST_ALT"],
        port=int(config["PORT_ALT"]),
        user=config["USER"],
        password=config["PASSWORD"],
        database=config["DATABASE"],
        connect_timeout=30,
        read_timeout=300,
        write_timeout=300
        )
        cursor = connection.cursor()
        cursor.execute("SELECT log FROM chat_history WHERE email = %s AND username = %s AND course_name = %s AND room_name = %s", (email, username, course, room_name))        
        history = cursor.fetchall()
        temp = history[0][0]
        cursor.close()
        return pickle.loads(temp)

    def loadChatHistory(self, username, email, course, room_name):
        config = dotenv_values(".env")
        connection = pymysql.connect(
        host=config["HOST_ALT"],
        port=int(config["PORT_ALT"]),
        user=config["USER"],
        password=config["PASSWORD"],
        database=config["DATABASE"],
        connect_timeout=30,
        read_timeout=300,
        write_timeout=300
        )
        cursor = connection.cursor()
        try:
            cursor.execute("SELECT log FROM chat_history WHERE email = %s AND username = %s AND course_name = %s AND room_name = %s", (email, username, course, room_name))
            result = cursor.fetchall()
            temp = result[0][0]
            cursor.close()
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
    
"""
TESTING THE FUNCTIONALITIES OF THE DATABASE
"""

# test = Database()
# test.resetTable()
# print(test.loadChatHistory("hutao", "Computer System", ""))
# print(test.loadChatHistory("hutao"))