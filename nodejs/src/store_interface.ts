import {IUser} from "./store";

export abstract class StoreInterface {
    public abstract storePassword(username: string, passwordHash: string): Promise<void>;
    public abstract getPassword(username: string): Promise<string>;
    public abstract setUserData(username: string, data: IUser): Promise<IUser>;
    public abstract getUserData(username: string): Promise<IUser>;
}
