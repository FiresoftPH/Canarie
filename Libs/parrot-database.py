import pymysql.cursors

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
        # self.cursor.execute("DROP TABLE Most")

    # Register your google account to store in the database
    def register(self, username, name, password):
        try:
            create_table_command = "CREATE TABLE {name} (username VARCHAR(255), password VARCHAR(255))".format(name = name)
            self.cursor.execute(create_table_command)
            add_username_password = "INSERT into {name} (username, password) VALUES(%s, %s)".format(name = name)
            self.cursor.execute(add_username_password, (username, password))
            self.connection.commit()

        except pymysql.err.OperationalError:
            print("User already exists")
        
    def getAllTables(self):
        self.cursor.execute("SHOW TABLES")
        temp = []
        for x in self.cursor:
            temp.append(x[0])

        print(temp)

    def getAllData(self, table_name):
        command = "SELECT * FROM {name}".format(name = table_name)
        self.cursor.execute(command)
        for x in self.cursor:
            print(x)

    def verification(self, username, password):
        all_users = []
        command = "SHOW TABLES"
        self.cursor.execute(command)
        for x in self.cursor:
            all_users.append(x[0])

        print(all_users)

        for user in all_users:
            command = "SELECT * FROM {name}".format(name = user)
            self.cursor.execute(command)
            stored_data = [] 
            for x in self.cursor:
                stored_data.append(x)
                if (username, password) in stored_data:
                    return True
                else:
                    pass

        return False
    
    def deleteAccount(self, name):
        try:
            command = "DROP TABLE {name}".format(name = name)
            self.cursor.execute(command)
            print("Deleted an Account")
        except pymysql.err.OperationalError:
            print("Account does not exist")

db = Database()
# db.register("Tor" ,"Otorku", "222222")
# db.register("Most", "Firesoft", "111111")
# db.getAllTables()
# db.getAllData("Firesoft")
# db.deleteAccount("Otorku")
print(db.verification("Tor", "222222"))

