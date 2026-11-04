import {startStand} from './startStand.ts';
import {stopStand} from './stopStand.ts';

export const restartObs = async () => {
    await stopStand({isObsOnly: true});
    await startStand();
};
