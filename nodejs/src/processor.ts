import * as express from 'express'
import 'express-async-errors';
import {Express} from 'express';
import {BCrypt} from "./bcrypt";
import {StoreClient} from "./store_client";
import {Store} from "./store";
import {StoreInterface} from "./store_interface";
import {SingleStore} from "./single_store";

export class Processor {

    private readonly app: Express;
    private readonly storeClient: StoreInterface;
    private readonly store: Store;
    private readonly bcrypt: BCrypt;
    private readonly clientId: string;
    private readonly clientCount: number;

    constructor({ clientId, clientCount }) {
        this.clientId = clientId;
        this.clientCount = clientCount;
        this.app = express();
        if (clientCount == 0) {
            this.storeClient = new SingleStore();
        } else {
            this.store = new Store(`Server-${this.clientId}`);
            this.storeClient = new StoreClient(Array(this.clientCount).fill('').map((_, i) => `Server-${i}`));
        }
        this.bcrypt = new BCrypt(this.storeClient);
    }

    public start() {
        this.app.use(express.json());
        this.app.post('/password/set/:username', this.setPassword.bind(this));
        this.app.post('/password/verify/:username', this.verifyPassword.bind(this));
        this.app.get('/longPoll', this.longPollHandler.bind(this));
        this.app.get('/user/get/:username', this.getUser.bind(this));
        this.app.post('/user/set/:username', this.setUser.bind(this));
        this.app.get('/', this.default.bind(this));
        this.app.listen(8080);
    }

    private async setPassword(request, response) {
        if (request.params.username && request.body.password) {
            await this.bcrypt.setPassword(request.params.username, request.body.password);
            response.status(200).send('OK');
        } else {
            response.status(400).send('Missing username or password!');
        }
    }

    private async verifyPassword(request, response) {
        if (request.params.username && request.body.password) {
            if (await this.bcrypt.verifyPassword(request.params.username, request.body.password)) {
                response.status(200).send('OK');
            } else {
                response.status(403).send(`Passwords didn't match for the user: ${request.params.username}`);
            }
        } else {
            response.status(400).send('Missing username!');
        }
    }

    private async longPollHandler(_, response) {
        await this.sleep(5000);
        response.status(200).send('OK');
    }

    private async getUser(request, response) {
        if (request.params.username) {
            const data = await this.storeClient.getUserData(request.params.username);
            response.status(200).send(data);
        } else {
            response.status(400).send('Missing username!');
        }
    }

    private async setUser(request, response) {
        if (request.params.username) {
            const data = await this.storeClient.setUserData(request.params.username, request.body);
            response.status(200).send(data);
        } else {
            response.status(400).send('Missing username!');
        }
    }

    // noinspection JSMethodCanBeStatic
    private async default(_, response) {
        response.status(200).send('OK');
    }

    private sleep(milliSeconds: number): Promise<void> {
        return new Promise<void>(resolve => setTimeout(resolve, milliSeconds));
    }
}
