
from locust import HttpLocust, TaskSet, task, between
import csv

USER_INFO = []


class PasswordTestTasks(TaskSet):

    acceptHeader = {'Content-Type': 'application/json'}

    @task
    def set_get_password(self):
        if len(USER_INFO) > 0:
            user_info = USER_INFO.pop()
            username = user_info[0]
            password = user_info[1]
            self.client.post('/password/set/%s' % username, name='/password/set/[username]', json={'password': password}, headers=self.acceptHeader)
            self.client.post('/password/verify/%s' % username, name='/password/verify/[username]', json={'password': password}, headers=self.acceptHeader)


class PasswordTest(HttpLocust):
    task_set = PasswordTestTasks
    wait_time = between(1, 1)
    sock = None

    def __init__(self):
        super(PasswordTest, self).__init__()
        global USER_INFO
        if not USER_INFO:
            with open('users.csv', 'r') as file:
                reader = csv.reader(file, delimiter=';')
                next(reader)
                USER_INFO = list(reader)
