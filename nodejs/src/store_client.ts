
import * as fnv1a from '@sindresorhus/fnv1a';
import * as ipc from 'node-ipc';
import {GET_PASSWORD, GET_USER_DATA, IPassword, IUser, SET_PASSWORD, SET_USER_DATA} from "./store";

export class StoreClient {

    private sequence: number;
    private readonly storeCount: number;
    private readonly stores: string[];
    private readonly getPasswordListeners: Map<string, Function>;
    private readonly setPasswordListeners: Map<string, Function>;
    private readonly getUserListeners: Map<string, Function>;
    private readonly setUserListeners: Map<string, Function>;

    constructor(stores: string[]) {
        this.sequence = 0;
        this.storeCount = stores.length;
        this.stores = stores;
        this.getPasswordListeners = new Map<string, Function>();
        this.setPasswordListeners = new Map<string, Function>();
        this.getUserListeners = new Map<string, Function>();
        this.setUserListeners = new Map<string, Function>();
        this.stores.forEach(store => {
            ipc.connectTo(store, () => {
                ipc.of[store].on(SET_PASSWORD, data => {
                    this.setPasswordListeners.get(data.sequence)(data);
                    this.setPasswordListeners.delete(data.sequence);
                });
                ipc.of[store].on(GET_PASSWORD, (data: IPassword) => {
                    this.getPasswordListeners.get(data.sequence)(data.passwordHash);
                    this.getPasswordListeners.delete(data.sequence);
                });
                ipc.of[store].on(SET_USER_DATA, (data: IUser) => {
                    this.setUserListeners.get(data.sequence)(data);
                    this.setUserListeners.delete(data.sequence);
                });
                ipc.of[store].on(GET_USER_DATA, (data: IUser) => {
                    this.getUserListeners.get(data.sequence)(data);
                    this.getUserListeners.delete(data.sequence);
                });
            });
        });
    }

    public storePassword(username: string, passwordHash: string): Promise<void> {
        return new Promise<void>(resolve => {
            const destination = fnv1a(username) % this.storeCount;
            const sequence = `${process.pid}_${this.sequence++}`;
            this.setPasswordListeners.set(sequence, resolve);
            ipc.of[this.stores[destination]].emit(SET_PASSWORD, {
                sequence,
                username,
                passwordHash
            });
        });
    }

    public getPassword(username: string): Promise<string> {
        return new Promise<string>(resolve => {
            const destination = fnv1a(username) % this.storeCount;
            const sequence = `${process.pid}_${this.sequence++}`;
            this.getPasswordListeners.set(sequence, resolve);
            ipc.of[this.stores[destination]].emit(GET_PASSWORD, {
                sequence,
                username
            });
        });
    }

    public setUserData(username: string, data: IUser): Promise<IUser> {
        return new Promise<IUser>(resolve => {
            const destination = fnv1a(username) % this.storeCount;
            const sequence = `${process.pid}_${this.sequence++}`;
            this.setUserListeners.set(sequence, resolve);
            ipc.of[this.stores[destination]].emit(SET_USER_DATA, {
                sequence,
                username,
                data
            });
        });
    }

    public getUserData(username: string): Promise<IUser> {
        return new Promise<IUser>(resolve => {
            const destination = fnv1a(username) % this.storeCount;
            const sequence = `${process.pid}_${this.sequence++}`;
            this.getUserListeners.set(sequence, resolve);
            ipc.of[this.stores[destination]].emit(GET_USER_DATA, {
                sequence,
                username
            });
        });
    }

}
