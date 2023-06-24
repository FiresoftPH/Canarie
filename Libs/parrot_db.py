import pymysql.cursors
import numpy as np

class Database:
    def __init__(self):
        self.connection = pymysql.connect(
        host='127.0.0.1',
        port=14000,
        user='root',
        password='',
        database='mft'
        )
        self.cursor = self.connection.cursor()

        # self.cursor.execute("DROP TABLE courses")
        # self.cursor.execute("DROP TABLE users")
        # self.cursor.execute("DROP TABLE statistics")
        # except pymysql.err.OperationalError:

        try:
            command_0 = "CREATE TABLE courses (id INT AUTO_INCREMENT PRIMARY KEY, course_name VARCHAR(255), assignments VARCHAR(255))"
            self.cursor.execute(command_0)
        except pymysql.err.OperationalError:
            # print("Already initialized")
            pass

        try:
            command_1 = "CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), username VARCHAR(255),  password VARCHAR(255), enrolled_courses VARCHAR(255))"
            self.cursor.execute(command_1)
        except pymysql.err.OperationalError:
            # print("Already initialized")
            pass

        try:
            command_2 = "CREATE TABLE statistics (FOREIGN KEY (id) REFERENCES users(id), id INT,  overall_understanding VARCHAR(255), most_asked_course VARCHAR(255), average_session_time VARCHAR(255))"
            self.cursor.execute(command_2)
        except pymysql.err.OperationalError:
            # print("Already initialized")
            pass

    def addCourseData(self, course_name, assignment_list):
        assignment_list = self.stringFromArray(assignment_list)
        registered_course = self.showCourseData()
        new_course_data = (course_name, assignment_list)
        if new_course_data in registered_course:
            print("Course already exist")
        else:
            command = "INSERT INTO courses (course_name, assignments) VALUES (%s, %s)"
            self.cursor.execute(command, new_course_data)
            self.connection.commit()

    def userRegister(self, name, username, password):
        self.cursor.execute("SELECT username FROM users")
        result = self.cursor.fetchall()
        new_user_data = (username, )        
        for row in result:
            if row == new_user_data:
                print("User already exist")
                return False

        new_user_data_long = (name, username, password, "")
        command = "INSERT INTO users (name, username, password, enrolled_courses) VALUES (%s, %s, %s, %s)"
        self.cursor.execute(command, new_user_data_long)
        self.connection.commit()
        return True

    def userCourseRegister(self, username, course_list):
        course_list = self.stringFromArray(course_list)

    def showCourseData(self, mode=0):
        if mode == 0:
            self.cursor.execute("SELECT course_name, assignments FROM courses")
            result = self.cursor.fetchall()
            course_data = []
            for row in result:
                course_data.append(row)

            # print(course_data)
            return course_data
        
        elif mode == 1:
            self.cursor.execute("SELECT course_name, assignments FROM courses")
            result = self.cursor.fetchall()
            for row in result:
                print(row)

        elif mode == 2:
            self.cursor.execute("SELECT course_name FROM courses")
            result = self.cursor.fetchall()
            for row in result:
                print(row[0])

    def showUserData(self, mode=0):
        if mode == 0:
            self.cursor.execute("SELECT name, username FROM users")
            result = self.cursor.fetchall()
            user_data = []
            for row in result:
                user_data.append(row)

            print(user_data)
            return user_data
        
        elif mode == 1:
            self.cursor.execute("SELECT name, username, password, enrolled_courses FROM users")
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

    def showStatisticsData(self):
        self.cursor.execute("SELECT statistics, assignments FROM courses")

        result = self.cursor.fetchall()
        for row in result:
            print(row)

    def stringFromArray(self, array):
        temp = ','.join(array)
        # print(temp)
        return temp
    
    def arrayFromString(self, string):
        temp = string.split(',')
        return temp

    def userLogin(self, username, password):
        self.cursor.execute("SELECT username, password FROM users")
        result = self.cursor.fetchall()
        credentials = (username, password)        
        for row in result:
            if row == credentials:
                # print("Login Successfully")
                return (credentials, True)

        return False

    def enrollCourse(self, username, course_list):
        course_list_data = self.stringFromArray(course_list)
        self.cursor.execute("SELECT enrolled_courses FROM users WHERE username = %s", username)
        enrolled_course = self.cursor.fetchall()
        compare_course = []
        for course in enrolled_course:
            compare_course.append(course[0])

        compare_course_data = self.stringFromArray(compare_course)
        if enrolled_course[0] != '':
            compare_course_data = compare_course_data + ',' + course_list_data
            # Reset course data
            # compare_course_data = ""

        command = "UPDATE users SET enrolled_courses = %s WHERE username = %s"
        value = (compare_course_data, username)
        self.cursor.execute(command, value)
        self.connection.commit()
        # print("Initial enroll finished")

test = Database()
# test.addCourseData("Calculus 1", ["Assignment 1", "Assignment 2", "Assignment 3"])
# test.showCourseData(1)
# test.enrollCourse("Firesoft", ["Computer System", "Principal of Programming Applications", "Innovative Communicaation"])
# test.enrollCourse("Firesoft", [""])
# test.showUserData(1)