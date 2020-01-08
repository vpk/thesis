import {StoreInterface} from "./store_interface";
import {IUser} from "./store";


export class SingleStore implements StoreInterface {

    private userInfoStore: Map<string, IUser>;
    private userPasswordStore: Map<string, string>;

    constructor() {
        this.userInfoStore = new Map<string, any>();
        this.userPasswordStore = new Map<string, string>();
    }

    public getPassword(username: string): Promise<string> {
        return new Promise(resolve => {
            resolve(this.userPasswordStore.get(username));
        });
    }

    public getUserData(username: string): Promise<IUser> {
        return new Promise<IUser>(resolve => {
           resolve(this.userInfoStore.get(username));
        });
    }

    public setUserData(username: string, data: IUser): Promise<IUser> {
        return new Promise<IUser>(resolve => {
            this.userInfoStore.set(username, data);
            resolve(data);
        });
    }

    public storePassword(username: string, passwordHash: string): Promise<void> {
        return new Promise<void>(resolve => {
            this.userPasswordStore.set(username, passwordHash);
            resolve();
        });
    }

}