"""
The admin CLI (Command Line Interface) is for testing the user journey and visualizing the steps programmically. Initial demonstration will be done here.
Note that the CLI will not be updated once the WebUI is completed.
"""

from Libs import parrot_db as db

class adminCLI:
    def __init__(self):
        self.db = db.Database()
        self.credentials = None
        # self.global_command_list = ["abort"]

    def adminLogin(self):
        self.db.adminLogin()
        