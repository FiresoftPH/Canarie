"""
The admin CLI (Command Line Interface) is for testing the user journey and visualizing the steps programmically. Initial demonstration will be done here.
Note that the CLI will not be updated once the WebUI is completed.
"""

from Libs import parrot_server as server

class adminCLI:
    def __init__(self):
        self.db = server.DatabaseOperations()
        self.credentials = None
        # self.global_command_list = ["abort"]

    def adminLogin(self):
        print("Welcome to Phoenix Admin. Please login with your admin account.")
        while True:
            username = str(input("Username: "))
            password = str(input("Password: "))
            operator = self.db.adminLogin(username, password)
            try:
                if operator[1] is True:
                    break
                else:
                    print("Wrong Username or Password")
            except TypeError:
                print("Wrong Username and Password")

app = adminCLI()
app.adminLogin()