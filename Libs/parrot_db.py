import pymysql.cursors
import numpy as np
import json
import pickle
from dotenv import dotenv_values
import secrets
import sys

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
        connect_timeout=60,
        read_timeout=1800,
        write_timeout=1800
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
            command_3 = "CREATE TABLE chat_history (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255), email VARCHAR(255), course_name VARCHAR(255), room_name VARCHAR(255), log LONGBLOB, ai_log LONGBLOB)"
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
        connect_timeout=60,
        read_timeout=1800,
        write_timeout=1800
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
        connect_timeout=60,
        read_timeout=1800,
        write_timeout=1800
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
        connect_timeout=60,
        read_timeout=1800,
        write_timeout=1800
        )
        cursor = connection.cursor()
        cursor.execute("SELECT email FROM users")
        result = cursor.fetchall()
        new_user_data = (email, )        
        for row in result:
            if row == new_user_data:
                print("User already exist")
                cursor.execute("SELECT api_key FROM users WHERE email = %s AND username = %s", (email, username))
                result = cursor.fetchall()
                return result[0][0]
        
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
        connect_timeout=60,
        read_timeout=1800,
        write_timeout=1800
        )
        cursor = connection.cursor()
        command = "SELECT email, username, api_key FROM users"
        load = (str(email), str(username), str(api_key))
        cursor.execute(command)
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
        connect_timeout=60,
        read_timeout=1800,
        write_timeout=1800
        )
        cursor = connection.cursor()
        command = "UPDATE users SET enrolled_courses = %s WHERE email = %s AND username = %s"
        temp_course = ["AIC-102", "AIC-108", "MAT-102"]
        course_data = self.stringFromArray(temp_course)
        cursor.execute(command, (course_data, email, username))
        connection.commit()
        cursor.close()

    def checkenrolledCourse(self, email, username, course):
        config = dotenv_values(".env")
        connection = pymysql.connect(
        host=config["HOST_ALT"],
        port=int(config["PORT_ALT"]),
        user=config["USER"],
        password=config["PASSWORD"],
        database=config["DATABASE"],
        connect_timeout=60,
        read_timeout=1800,
        write_timeout=1800
        )
        cursor = connection.cursor()
        command = "SELECT enrolled_courses from users WHERE email = %s AND username = %s"
        cursor.execute(command, (email, username))
        result = cursor.fetchall()
        course_list = self.arrayFromString(result[0][0])
        
        if course in course_list:
            return True, course_list
        else:
            return False, course_list
        
    def canvasEnrollCourse(self, email, username, course_list):
        config = dotenv_values(".env")
        connection = pymysql.connect(
        host=config["HOST_ALT"],
        port=int(config["PORT_ALT"]),
        user=config["USER"],
        password=config["PASSWORD"],
        database=config["DATABASE"],
        connect_timeout=60,
        read_timeout=1800,
        write_timeout=1800
        )
        cursor = connection.cursor()
        command = "UPDATE users SET enrolled_courses = %s WHERE email = %s AND username = %s"
        course_list = self.stringFromArray(course_list)
        load = (course_list, email, username)
        cursor.execute(command, load)
        connection.commit()
        cursor.close()

    def enrollCourse(self, email, username, course):
        config = dotenv_values(".env")
        connection = pymysql.connect(
        host=config["HOST_ALT"],
        port=int(config["PORT_ALT"]),
        user=config["USER"],
        password=config["PASSWORD"],
        database=config["DATABASE"],
        connect_timeout=60,
        read_timeout=1800,
        write_timeout=1800
        )
        cursor = connection.cursor()
        check_course = self.checkenrolledCourse(email, username, course)
        if check_course[0] != False:
            return False
        else:
            new_course_list = check_course[1]
            new_course_list.append(course)
            temp = new_course_list
            new_course_list = self.stringFromArray(new_course_list)
            command = "UPDATE users SET enrolled_courses = %s WHERE email = %s AND username = %s"
            load = (new_course_list, email, username)
            cursor.execute(command, load)
            connection.commit()
            cursor.close()
            return temp

    def getUserData(self, email, username):
        config = dotenv_values(".env")
        connection = pymysql.connect(
        host=config["HOST_ALT"],
        port=int(config["PORT_ALT"]),
        user=config["USER"],
        password=config["PASSWORD"],
        database=config["DATABASE"],
        connect_timeout=60,
        read_timeout=1800,
        write_timeout=1800
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
        connect_timeout=60,
        read_timeout=1800,
        write_timeout=1800
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
        connect_timeout=60,
        read_timeout=1800,
        write_timeout=1800
        )
        cursor = connection.cursor()
        cursor.execute("SELECT email, username FROM users")
        registered = cursor.fetchall()
        if (email, username) in registered:
            return True
        else:
            return False

    # Update chat history in the database. This will be updated when the session ends.
    def storeChatHistory(self, username, email, course, room_name, history, old_history):
        config = dotenv_values(".env")
        connection = pymysql.connect(
        host=config["HOST_ALT"],
        port=int(config["PORT_ALT"]),
        user=config["USER"],
        password=config["PASSWORD"],
        database=config["DATABASE"],
        connect_timeout=60,
        read_timeout=1800,
        write_timeout=1800
        )
        history = pickle.loads(history)
        old_history.append(history[-2])
        old_history.append(history[-1])
        full_history = pickle.dumps(old_history)
        history = pickle.dumps(history)

        cursor = connection.cursor()
        if sys.getsizeof(full_history) >= 1000000000:
            while sys.getsizeof(full_history) >= 500000000:
                full_history = pickle.loads(full_history)
                full_history.pop(0)
                full_history = pickle.dumps(full_history)
            
        else:
            pass

        cursor.execute("UPDATE chat_history SET log = %s WHERE email = %s AND username = %s AND course_name = %s AND room_name = %s",
                                    (full_history, email, username, course, room_name))
        connection.commit()

        cursor.execute("UPDATE chat_history SET ai_log = %s WHERE email = %s AND username = %s AND course_name = %s AND room_name = %s",
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
        connect_timeout=60,
        read_timeout=1800,
        write_timeout=1800
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
        connect_timeout=60,
        read_timeout=1800,
        write_timeout=1800
        )
        cursor = connection.cursor()
        cursor.execute("SELECT log FROM chat_history WHERE email = %s AND username = %s AND course_name = %s AND room_name = %s", (email, username, course, room_name))        
        result = cursor.fetchall()
        full_history = result[0][0]
        # history = result[0][1]
        cursor.close()
        return pickle.loads(full_history)
    
    def resetChatHistory(self, email, username, course, room_name):
        config = dotenv_values(".env")
        connection = pymysql.connect(
        host=config["HOST_ALT"],
        port=int(config["PORT_ALT"]),
        user=config["USER"],
        password=config["PASSWORD"],
        database=config["DATABASE"],
        connect_timeout=60,
        read_timeout=1800,
        write_timeout=1800
        )
        cursor = connection.cursor()

        history = pickle.dumps([])

        cursor.execute("UPDATE chat_history SET log = %s WHERE email = %s AND username = %s AND course_name = %s AND room_name = %s",
                                    (history, email, username, course, room_name))
        connection.commit()
        cursor.close()

    def loadChatHistory(self, username, email, course, room_name):
        config = dotenv_values(".env")
        connection = pymysql.connect(
        host=config["HOST_ALT"],
        port=int(config["PORT_ALT"]),
        user=config["USER"],
        password=config["PASSWORD"],
        database=config["DATABASE"],
        connect_timeout=60,
        read_timeout=1800,
        write_timeout=1800
        )
        cursor = connection.cursor()
        try:
            cursor.execute("SELECT ai_log, log FROM chat_history WHERE email = %s AND username = %s AND course_name = %s AND room_name = %s", (email, username, course, room_name))
            result = cursor.fetchall()
            history = result[0][0]
            full_history = result[0][0]
            cursor.close()
            if history == "" or history == None or full_history  == "" or full_history == None:
                return False
            else:
                return pickle.loads(history), pickle.loads(full_history)
        
        except IndexError:
            return False
        
        except ValueError:
            return False

        except pymysql.OperationalError:
            return False
        
    def changeChatRoomName(self, email, username, course, chatroom, new_chatroom):
        config = dotenv_values(".env")
        connection = pymysql.connect(
        host=config["HOST_ALT"],
        port=int(config["PORT_ALT"]),
        user=config["USER"],
        password=config["PASSWORD"],
        database=config["DATABASE"],
        connect_timeout=60,
        read_timeout=1800,
        write_timeout=1800
        )
        cursor = connection.cursor()
        command = "UPDATE chat_history SET room_name = %s WHERE email = %s AND username = %s AND course_name = %s AND chatroom = %s"
        cursor.execute(command, (new_chatroom, email, username, course, chatroom))
        connection.commit()
        cursor.close()
        
    def getChatRoom(self, email, username, course):
        config = dotenv_values(".env")
        connection = pymysql.connect(
        host=config["HOST_ALT"],
        port=int(config["PORT_ALT"]),
        user=config["USER"],
        password=config["PASSWORD"],
        database=config["DATABASE"],
        connect_timeout=60,
        read_timeout=1800,
        write_timeout=1800
        )
        cursor = connection.cursor()
        command = "SELECT room_name FROM chat_history WHERE email = %s AND username = %s AND course_name = %s"
        load = (email, username, course)
        cursor.execute(command, load)
        result = cursor.fetchall()
        cursor.close()
        chatroom = []
        for x in result:
            chatroom.append(x[0])

        return chatroom

    def checkChatRoom(self, email, username, course, chatroom):
        all_chatrooms = self.getChatRoom(email, username, course)
        if chatroom in all_chatrooms:
            return True
        else:
            return False
    
    def unenrollCourse(self, email, username, course):
        config = dotenv_values(".env")
        connection = pymysql.connect(
        host=config["HOST_ALT"],
        port=int(config["PORT_ALT"]),
        user=config["USER"],
        password=config["PASSWORD"],
        database=config["DATABASE"],
        connect_timeout=60,
        read_timeout=1800,
        write_timeout=1800
        )
        cursor = connection.cursor()
        check_course = self.checkenrolledCourse(email, username, course)
        if check_course[0] == False:
            return False
        else:
            new_course_list = check_course[1]
            new_course_list.remove(course)
            temp = new_course_list
            new_course_list = self.stringFromArray(new_course_list)
            command_1 = "UPDATE users SET enrolled_courses = %s WHERE email = %s AND username = %s"
            load_1 = (new_course_list, email, username)
            cursor.execute(command_1, load_1)
            connection.commit()
            command_2 = "DELETE FROM chat_history WHERE email = %s AND username = %s AND course_name = %s"
            load_2 = (email, username, course)
            cursor.execute(command_2, load_2)
            connection.commit()
            cursor.close()
            return temp
        
    def deleteChatRoom(self, email, username, course, chatroom):
        config = dotenv_values(".env")
        connection = pymysql.connect(
        host=config["HOST_ALT"],
        port=int(config["PORT_ALT"]),
        user=config["USER"],
        password=config["PASSWORD"],
        database=config["DATABASE"],
        connect_timeout=60,
        read_timeout=1800,
        write_timeout=1800
        )
        cursor = connection.cursor()
        check_course = self.checkenrolledCourse(email, username, course)
        if check_course[0] == False:
            return False
        else:
            check_chatroom = self.getChatRoom(email, username, course)
            if chatroom not in check_chatroom:
                return False
            else:
                pass
            
            command = "DELETE FROM chat_history WHERE email = %s AND username = %s AND course_name = %s AND room_name = %s"
            load = (email, username, course, chatroom)
            cursor.execute(command, load)
            connection.commit()
            cursor.close()
            return True   