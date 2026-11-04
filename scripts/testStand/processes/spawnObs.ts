import {spawn} from 'node:child_process';

import {
    LOCAL_APP_DATA_DIRECTORY,
    OBS_ARGUMENTS,
    OBS_BIN_DIRECTORY,
    OBS_EXECUTABLE,
} from '../consts.ts';

export const spawnObs = () => {
    spawn(OBS_EXECUTABLE, OBS_ARGUMENTS, {
        cwd: OBS_BIN_DIRECTORY,
        env: {...process.env, LOCALAPPDATA: LOCAL_APP_DATA_DIRECTORY},
        detached: true,
        stdio: 'ignore',
    }).unref();
};
