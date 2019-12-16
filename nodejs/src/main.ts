
import * as cluster from 'cluster';
import * as os from 'os';
import {Processor} from "./processor";

const isValidParams = (params: string[]) => {
    return params.length > 2
        && (params[2] === 'single'
            || params[2] === 'max'
            || !isNaN(Number(params[2]))
        );
};

if (cluster.isMaster) {
    if (!isValidParams(process.argv)) {
        console.error(
            'Process started with wrong number of arguments\n',
            'Give number of cpus to execute on as first argument\n',
            'or string single if running only single thread without ipc\n',
            'or string max if should use max CPUs'
        );
        process.exit(1);
    }

    if (process.argv[2] === 'single') {

    } else {
        const processCount = process.argv[2] === 'max' ? os.cpus().length : Number(process.argv[2]);
        for (let i = 0; i < processCount; i++) {
            console.log(`Forking process number ${i}.`);
            let env = {
                CLIENT_ID: `${i}`,
                CLIENT_COUNT: `${processCount}`
            };
            cluster.fork(env);
        }
    }
} else {
    const processor = new Processor({
        clientId: process.env.CLIENT_ID,
        clientCount: Number(process.env.CLIENT_COUNT)
    });
    processor.start();
}
