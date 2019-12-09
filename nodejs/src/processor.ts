import * as express from 'express'
import 'express-async-errors';
import {Express} from 'express';
import {BCrypt} from "./bcrypt";
import {StoreClient} from "./store_client";
import {Store} from "./store";

export class Processor {

    private readonly app: Express;
    private readonly storeClient: StoreClient;
    private readonly store: Store;
    private readonly bcrypt: BCrypt;
    private readonly clientId: string;
    private readonly clientCount: number;

    constructor({ clientId, clientCount }) {
        this.clientId = clientId;
        this.clientCount = clientCount;
        this.app = express();
        this.store = new Store(`Server-${this.clientId}`);
        this.storeClient = new StoreClient(Array(this.clientCount).fill('').map((_, i) => `Server-${i}`));
        this.bcrypt = new BCrypt(this.storeClient);
    }

    public start() {
        this.app.use(express.json());
        this.app.post('/password/set/:username', this.setPassword);
        this.app.post('/password/verify/:username', this.verifyPassword);
        this.app.get('/longPoll', this.longPollHandler);
        this.app.get('/user/get/:username', this.getUser);
        this.app.post('/user/set/:username', this.setUser);
        this.app.get('/', this.default);
        this.app.listen(8080);
    }

    private async setPassword(request, response) {
        if (request.params.username) {
            await this.bcrypt.setPassword(request.params.username, request.body);
            response.status(200).write('OK').end();
        } else {
            response.status(400).write('Missing username!');
        }
    }

    private async verifyPassword(request, response) {
        if (request.params.username) {
            if (await this.bcrypt.verifyPassword(request.params.username, request.body)) {
                response.status(200).write('OK').end();
            } else {
                response.status(403).write(`Passwords didn't match for the user: ${request.params.username}`).end();
            }
        } else {
            response.status(400).write('Missing username!').end();
        }
    }

    private async longPollHandler(_, response) {
        await this.sleep(5000);
        response.status(200).write('OK').end();
    }

    private async getUser(request, response) {
        if (request.params.username) {
            const data = await this.storeClient.getUserData(request.params.usename);
            response.status(200).send(data);
        } else {
            response.status(400).write('Missing username!');
        }
    }

    private async setUser(request, response) {
        if (request.params.username) {
            const data = await this.storeClient.setUserData(request.params.username, request.body);
            response.status(200).send(data);
        } else {
            response.status(400).write('Missing username!');
        }
    }

    private async default(_, response) {
        response.status(200).write('OK').end();
    }

    private sleep(milliSeconds: number): Promise<void> {
        return new Promise<void>(resolve => setTimeout(resolve, milliSeconds));
    }
}