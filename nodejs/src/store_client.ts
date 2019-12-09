
import * as fnv1a from '@sindresorhus/fnv1a';
import * as ipc from 'node-ipc';
import {GET_PASSWORD, GET_USER_DATA, IPassword, IUser, SET_PASSWORD, SET_USER_DATA} from "./store";

export class StoreClient {

    private sequence: number;
    private readonly storeCount: number;
    private readonly stores: string[];

    constructor(stores: string[]) {
        this.sequence = 0;
        this.storeCount = stores.length;
        this.stores = stores;
        stores.forEach(store => {
            ipc.connectTo(store, () => {
                ipc.of[store].on('message')
            });
        });

    }

    public storePassword(username: string, passwordHash: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const destination = fnv1a(username) % this.storeCount;
            const sequence = `${process.pid}_${this.sequence++}`;
            ipc.of[this.stores[destination]].emit(SET_PASSWORD, {
                sequence,
                username,
                passwordHash
            }).on(SET_PASSWORD, (data) => {
                if (data.sequence === sequence) {
                    resolve();
                } else {
                    reject('Set password failed');
                }
            });
        });
    }

    public getPassword(username: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const destination = fnv1a(username) % this.storeCount;
            const sequence = `${process.pid}_${this.sequence++}`;
            ipc.of[this.stores[destination]].emit(GET_PASSWORD, {
                sequence,
                username
            }).on(GET_PASSWORD, (data: IPassword) => {
                if (data.sequence === sequence) {
                    resolve(data.passwordHash);
                } else {
                    reject('Get password failed');
                }
            })
        });
    }

    public setUserData(username: string, data: IUser): Promise<IUser> {
        return new Promise<IUser>((resolve, reject) => {
            const destination = fnv1a(username) % this.storeCount;
            const sequence = `${process.pid}_${this.sequence++}`;
            ipc.of[this.stores[destination]].emit(SET_USER_DATA, {
                sequence,
                username,
                data
            }).on(SET_USER_DATA, (data: IUser) => {
                if (data.sequence === sequence) {
                    resolve(data);
                } else {
                    reject('Set user data failed');
                }
            });
        });
    }

    public getUserData(username: string): Promise<IUser> {
        return new Promise<IUser>((resolve, reject) => {
            const destination = fnv1a(username) % this.storeCount;
            const sequence = `${process.pid}_${this.sequence++}`;
            ipc.of[this.stores[destination]].emit(GET_USER_DATA, {
                sequence,
                username
            }).on(GET_USER_DATA, (data: IUser) => {
                if (data.sequence === sequence) {
                    resolve(data);
                } else {
                    reject('Get user data failed');
                }
            })
        });
    }

}
