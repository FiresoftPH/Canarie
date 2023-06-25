"""
The CLI (Command Line Interface) is for testing the user journey and visualizing the steps programmically. Initial demonstration will be done here.
Note that the CLI will not be updated once the WebUI is completed.
"""
from Libs import parrot_db as db

class appCLI:
    def __init__(self):
        self.db = db.Database()
        self.credentials = None
        # self.global_command_list = ["abort"]

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
            username = str(input("What is your username?: ")).strip()
            name = str(input("What is your nickname?: ")).strip()
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
            password = str(input("What is your password? :"))
            success = self.db.userLogin(username, password)
            try:
                if success[1] is True:
                    print("Login sucessfully")
                    self.credentials = success[0]
                    break
                else:
                    print("Wrong password or username")

            except TypeError:
                print("Wrong username and password (TE)")
        
        self.courseEnroll()

    def courseEnroll(self):
        chosen_list = []
        stop_choice = ["yes", "no"]
        while True:
            self.db.showCourseData(2)
            chosen = str(input("Which course do you want to enroll: "))
            check_course = self.db.checkRegisteredCourse(chosen)
            if check_course is False:
                print("Course does not exist")
            else:
                chosen_list.append(chosen)

            stop = str(input("Stop enrolling? [yes, no]: "))
            if stop == stop_choice[0]:
                break
            elif stop not in stop_choice:
                print("Invalid Choice")
            
        self.db.enrollCourse(self.credentials[0], chosen_list)
        self.db.showUserData(1)

    def courseSelection():
        print("Which course do you want to ask?: ")

    def chatRoomSelection(self):
        pass

    def adminPage(self):
        pass

app = appCLI()
app.firstPage()