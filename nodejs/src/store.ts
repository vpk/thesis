import * as ipc from 'node-ipc';

export interface IPassword {
    sequence: string
    passwordHash: string
}

export interface IUser {
    sequence?: string
    id: string
    name: string
    description: string
    age: number
    heat: number
    groups: string[]
}

export const SET_USER_DATA = 'setUserData';
export const GET_USER_DATA = 'getUSerData';
export const SET_PASSWORD = 'setPassword';
export const GET_PASSWORD = 'getPassword';

const CHARSET = "abcdefghijklmnopqrstuvwxyz" +
                "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const GROUPS = ["group1", "group2", "group3", "group4", "group5", "group6", "group7", "group8"];

export class Store {

    private readonly storeId: string;
    private readonly passwordStore: Map<string, string>;
    private readonly userStore: Map<string, IUser>;

    constructor(storeId: string) {
        this.storeId = storeId;
        this.passwordStore = new Map<string, string>();
        this.userStore = new Map<string, IUser>();
        ipc.serve(() => {
            ipc.server.on(SET_USER_DATA, (data, socket) => {
                this.userStore.set(data.username, data.data);
                data.data.sequence = data.sequence;
                ipc.server.emit(socket, SET_USER_DATA, data.data);
            });
            ipc.server.on(GET_USER_DATA, (data, socket) => {
                const user = this.userStore.has(data.username)
                    ? this.userStore.get(data.username)
                    : this.createRandomUser(data.username);
                user.sequence = data.sequence;
                ipc.server.emit(socket, GET_USER_DATA, user);
            });
            ipc.server.on(SET_PASSWORD, (data, socket) => {
                this.passwordStore.set(data.username, data.passwordHash);
                ipc.server.emit(socket, SET_PASSWORD, {sequence: data.sequence});
            });
            ipc.server.on(GET_PASSWORD, (data, socket) => {
                const result = {
                    sequence: data.sequence,
                    passwordHash: this.passwordStore.has(data.username) ? this.passwordStore.get(data.username) : undefined
                };
                ipc.server.emit(socket, GET_PASSWORD, result);
            });
        });
        ipc.server.start();
    }

    private createRandomUser(username: string): IUser {
        return {
            id: username,
            name: `${this.getRandomString(20)}, ${this.getRandomString(15)}`,
            description: this.getRandomString(40),
            age: Store.random(0, 100),
            heat: Math.random(),
            groups: Array(
                Store.random(0, GROUPS.length)
            ).fill('').map(() => GROUPS[Store.random(0, GROUPS.length)])
        }
    }

    private getRandomString(maxLength: number): string {
        const length = Store.random(0, maxLength);
        return Array(length).fill(0).map(() => CHARSET[Store.random(0, CHARSET.length)]).join();
    }

    private static random(min: number, max: number) {
        return Math.round(Math.random() * (max - min) + min);
    }
}