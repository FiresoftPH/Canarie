"""
The CLI (Command Line Interface) is for testing the user journey and visualizing the steps programmically. Initial demonstration will be done here.
Note that the CLI will not be updated once the WebUI is completed.
"""
from Libs import macaw_server as server

class appCLI:
    def __init__(self):
        self.db = server.DatabaseOperations()
        self.ai = server.AIOperations()
        self.credentials = None
        self.current_chat_room = None
        # self.global_command_list = ["abort"]

    def firstPage(self):
        print("Welcome to Macaw, your friendly A.I. tutor.")
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

    def printSpace(self):
        for x in range(5):
            print("")

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
        
        # self.db.showUserData(1)
        self.printSpace()
        self.firstPage()

    def loginInterface(self):
        while True:
            username = str(input("What is your username?: "))
            password = str(input("What is your password?: "))
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
        
        initial = self.db.checkInitialSetup(self.credentials[0])
        if initial == False:
            self.courseEnroll()
        else:
            # confirm = str(input("Do you want to enroll any courses?: "))
            # # if +
            self.courseSelection()
        self.printSpace()

    def courseEnroll(self):
        chosen_list = []
        stop_choice = ["yes", "no"]
        while True:
            self.db.showCourseData(2)
            chosen = str(input("Which course do you want to enroll: ")).strip().lower()
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
        self.printSpace()
        self.courseSelection()

    def courseSelection(self):
        while True:
            course_list = self.db.showUserEnrolledCourse(self.credentials[0])
            for course in course_list:
                print(course)
            choice = str(input("Which course do you want to ask? (Type exit if you want to log out): "))
            if choice in course_list:
                print("You chose "+ choice)
                self.current_chat_room = [choice, ""]
                self.generalChatRoom()

            elif choice == "exit":
                break
            else:
                print("Invalid choice")
        
        self.printSpace()

    def generalChatRoom(self):
        print(self.current_chat_room[0] + " chat room")
        choice = ["yes", "no", "exit"]
        self.ai.loadChatHistory(self.credentials[0], self.current_chat_room[0], self.current_chat_room[1])
        while True:
            choice = str(input("Upload any file?: "))
            if choice == "yes":
                file_dir = str(input("Directory of the file: "))
                question = str(input("What is your question?: "))
                prompt = self.ai.getPrompt(question, file_dir)
                print(self.ai.getResponse(prompt))
            elif choice == "no":
                file_dir = ""
                question = str(input("What is your question?: "))
                prompt = self.ai.getPrompt(question, file_dir)
                print(self.ai.getResponse(prompt))
            elif choice == "exit":
                self.ai.storeChatHistory(self.credentials[0], self.current_chat_room[0], self.current_chat_room[1])
                break
            else:
                print("invalid_choice")
                choice = str(input("Upload any file?: "))

        self.courseSelection()

    def assignmentChatRoom(self):
        pass

    def adminPage(self):
        pass

app = appCLI()
app.firstPage()