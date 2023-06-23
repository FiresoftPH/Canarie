"""
The CLI is for testing the user journey and visualizing the steps programmically. Initial demonstration will be done here.
"""
from Libs import parrot_db as db

class appCLI:
    def __init__(self):
        self.db = db.Database()
        self.login_status = False

    def firstPage(self):
        print("Welcome to Phoenix, your friendly fiery mentor.")
        while True:
            print("What do you want to do? [login, register]")
            choices = ["login", "register"]
            user_choice = str(input("Command: ")).strip().lower()
            if user_choice in choices:
                break
            else:
                print("Choice does not exist")

        if user_choice == choices[0]:
            self.loginInterface()
        elif user_choice == choices[1]:
            self.registerInterface()

    def registerInterface(self):
        while True:
            username = str(input("What is your username?: "))
            name = str(input("What is your nickname?: "))
            password = str(input("what is your password? :"))
            success = self.db.userRegister(name, username, password)
            if success is True:
                print("Register complete, welcome to our academy.")
                break
            else:
                print("It seems like I have known you before, use login instead.")
        
        self.db.showUserData(1)

    def loginInterface(self):
        while True:
            username = str(input("What is your username?: "))
            name = str(input("What is your nickname?: "))
            password = str(input("what is your password? :"))
            success = self.db.userRegister(name, username, password)
            if success is True:
                print("Register complete, welcome to our academy.")
                break
            else:
                print("It seems like I have known you before, use login instead.")
                
    def courseSelection(self):
        pass

    def chatRoomSelection(self):
        pass

    def adminPage(self):
        pass

app = appCLI()
app.firstPage()