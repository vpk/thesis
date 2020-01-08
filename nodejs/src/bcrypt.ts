import {compare, genSalt, hash} from 'bcryptjs'
import {StoreInterface} from "./store_interface";

const PASSWORD_COST = 20;

export class BCrypt {

    private readonly storeClient: StoreInterface;

    constructor(storeClient: StoreInterface) {
        this.storeClient = storeClient;
    }

    private static async encryptPassword(password: string): Promise<string> {
        return await hash(password, await genSalt(PASSWORD_COST))
    }

    private static async testPassword(password: string, passwordHash: string): Promise<boolean> {
        return await compare(password, passwordHash);
    }

    public async setPassword(username: string, password: string): Promise<void> {
        const passwordHash = await BCrypt.encryptPassword(password);
        await this.storeClient.storePassword(username, passwordHash);
    }

    public async verifyPassword(username: string, password: string): Promise<boolean> {
        const passwordHash = await this.storeClient.getPassword(username);
        return await BCrypt.testPassword(password, passwordHash);
    }

}