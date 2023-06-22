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
        try:
            command_1 = "CREATE TABLE users (credentials VARCHAR(255),  VARCHAR(255), enrolled_course VARCHAR(255))"
            self.cursor.execute(command_1)
            command_2 = "CREATE TABLE {name} (credentials VARCHAR(255),  VARCHAR(255), enrolled_course VARCHAR(255))".format(name = name)
        except pymysql.err.OperationalError:
            print("Already initialized")

    # Register your google account to store in the database
    def register(self, username, name, password, list_of_courses):
        pass

