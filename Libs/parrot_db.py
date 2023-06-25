import pymysql.cursors
import numpy as np

class Database:
    def __init__(self):
        file = open("Libs/parrot_db_keys.txt", "r")
        self.connection = pymysql.connect(
        host='127.0.0.1',
        port=14000,
        user='root',
        password=file.readline(),
        database='mft'
        )
        self.cursor = self.connection.cursor()
        file.close()
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

    # Reset the table values to nothing in case something gone wrong. This is used for development only.
    def resetTable(self):
        self.cursor.execute("DROP TABLE courses")
        self.cursor.execute("DROP TABLE users")
        self.cursor.execute("DROP TABLE statistics")

    # Alter the table columns to add more functionalities. This is used for development only
    def alterTable(self):
        self.cursor.execute("ALTER TABLE users ADD status VARCHAR(100) DEFAULT 'user'")

    # Add course data to the courses table. In the final development, this will be automatically integrated with canvas
    def addCourseData(self, course_name, assignment_list):
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

    # User register, each user have to have a name, username and password.
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

    # Used to show course data in the database. Some modes will be removed from the final version.
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
            # course_data = []
            for row in result:
                # course_data.append(row[0])
                print(row[0])

    # Shows the data from the users table. Some modes will be removed in the final version.
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

    # Shows the data from the statistics table. 
    def showStatisticsData(self):
        self.cursor.execute("SELECT statistics, assignments FROM courses")

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
        self.cursor.execute("SELECT username, password FROM users")
        result = self.cursor.fetchall()
        credentials = (username, password)        
        for row in result:
            if row == credentials:
                # print("Login Successfully")
                return (credentials, True)

        return False

    # Used when enrolling courses for each user.
    def enrollCourse(self, username, course_list):
        # course_list_data = self.stringFromArray(course_list)
        difference_enrolled_course = self.checkEnrolledCourse(username, course_list)
        course_list_data = self.stringFromArray(difference_enrolled_course)
        self.cursor.execute("SELECT enrolled_courses FROM users WHERE username = %s", username)

        enrolled_course = self.cursor.fetchall()
        compare_course_data = enrolled_course[0][0]
        if '' != compare_course_data:
            if course_list_data != "":
                compare_course_data = compare_course_data + ',' + course_list_data
            # Reset course data (Used for debugging only)
            # compare_course_data = ""
        else:
            compare_course_data = course_list_data

        command = "UPDATE users SET enrolled_courses = %s WHERE username = %s"
        value = (compare_course_data, username)
        self.cursor.execute(command, value)
        self.connection.commit()
        # print("Initial enroll finished")

    # Used when enrolling courses for each user. This method checks if the selected courses are already enrolled or not
    def checkEnrolledCourse(self, username, course_list):
        command = "SELECT enrolled_courses FROM users WHERE username = %s"
        self.cursor.execute(command, username)
        enrolled_course = self.cursor.fetchall()
        enrolled_course = enrolled_course[0][0]
        enrolled_course = self.arrayFromString(enrolled_course)
        same = list(set(course_list).difference(enrolled_course))
        return same

    # Used when enrolling courses for each user. This method checks if the selected courses are registered or not.
    def checkRegisteredCourse(self, course_name):
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
        command = "SELECT enrolled_courses FROM users WHERE username = %s"
        self.cursor.execute(command, username)
        enrolled_courses = self.cursor.fetchall()
        if enrolled_courses == '':
            return False
        else:
            return True
    
    # Returns the users enrolled courses as the name suggested.
    def showUserEnrolledCourse(self, username):
        command = "SELECT enrolled_courses FROM users WHERE username = %s"
        self.cursor.execute(command, username)
        enrolled_courses = self.cursor.fetchall()
        enrolled_courses = self.arrayFromString(enrolled_courses[0][0])
        return enrolled_courses
    
"""
TESTING THE FUNCTIONALITIES OF THE DATABASE
"""
test = Database()
test.showUserEnrolledCourse("OTorku")
test.showUserData(1)