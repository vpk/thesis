
from locust import HttpLocust, TaskSet, task, between
import logging
import csv

USER_INFO = []

with open('users.csv', 'r') as file:
    reader = csv.reader(file, delimiter=';')
    next(reader)
    USER_INFO = list(reader)


class UserTestTasks(TaskSet):

    acceptHeader = {'Content-Type': 'application/json'}

    @task
    def set_get_userinfo(self):
        if len(USER_INFO) > 0:
            user_info = USER_INFO.pop()
            username = user_info[0]
            password = user_info[1]
            name = user_info[2]
            description = user_info[3]
            age = user_info[4]
            heat = user_info[5]
            group_list = user_info[6].split(',')
            json = {
                'id': username,
                'name': name,
                'description': description,
                'age': int(age),
                'heat': float(heat),
                'groups': group_list
            }
            self.client.post('/user/set/%s' % username, name='/user/set/[username]', json=json, headers=self.acceptHeader)
            self.client.get('/user/get/%s' % username, name='/user/get/[username]', headers=self.acceptHeader)


class UserTest(HttpLocust):
    task_set = UserTestTasks
    wait_time = between(1, 1)
    sock = None

    def __init__(self):
        super(UserTest, self).__init__()
        global USER_INFO

