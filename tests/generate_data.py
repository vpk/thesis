
import sys
import csv
import random
import string

if len(sys.argv) < 3:
    print('./' + sys.argv[0] + ' [ENTRY_COUNT] [OUTPUT_FILE_NAME]')

ENTRIES = int(sys.argv[1])
GROUPS = 1000
LOWERCASE_LETTERS = string.ascii_lowercase
LETTERS = string.ascii_letters
LETTERS_WITH_SPACE = string.ascii_letters + ' '
LETTERS_AND_NUMBERS = string.ascii_letters + string.digits

random.seed()


def random_string(letters, length):
    return ''.join(random.choice(letters) for i in range(length))


def random_group_name():
    name_length = random.randint(5, 30)
    return random_string(LOWERCASE_LETTERS, name_length)


def get_heat():
    return float(str(random.randint(35, 40)) + "." + str(random.randint(0, 99)))


def get_random_groups(groups, count):
    return list(set([random.choice(groups) for i in range(count)]))


def random_user(groups):
    username_length = random.randint(6, 20)
    password_length = random.randint(6, 30)
    given_name_length = random.randint(2, 15)
    family_name_length = random.randint(2, 20)
    description_length = random.randint(10, 40)
    age = random.randint(1, 100)
    heat = get_heat()
    groups_count = random.randint(3, 10)
    return [
        random_string(LOWERCASE_LETTERS, username_length),
        random_string(LETTERS_AND_NUMBERS, password_length),
        random_string(LOWERCASE_LETTERS, family_name_length).capitalize()
        + ", "
        + random_string(LOWERCASE_LETTERS, given_name_length).capitalize(),
        random_string(LETTERS_WITH_SPACE, description_length),
        age,
        heat,
        ','.join(get_random_groups(groups, groups_count))
    ]


group_list = [random_group_name() for i in range(GROUPS)]
with open(sys.argv[2], 'w', newline='') as file:
    writer = csv.writer(file, delimiter=';')
    writer.writerow(['username', 'password', 'name', 'description', 'age', 'heat', 'group_list'])
    for i in range(ENTRIES):
        writer.writerow(random_user(group_list))

