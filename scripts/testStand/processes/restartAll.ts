import {startStand} from './startStand.ts';
import {stopStand} from './stopStand.ts';

export const restartAll = async () => {
    await stopStand();
    await startStand();
};
