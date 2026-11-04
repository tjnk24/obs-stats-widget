import fs from 'node:fs';

import {
    BACKGROUND_UPDATE_WAIT_MS,
    CONNECTION_WAIT_MS,
    HEALTHY_VERSION_PATH,
    ROLLED_BACK_VERSION_PATH,
    UPDATE_CHECK_STAMP_PATH,
} from '../../consts.ts';
import {findDockTarget} from '../../dock/findDockTarget.ts';
import {restartObs} from '../../processes/restartObs.ts';
import {waitFor} from '../../processes/waitFor.ts';
import {getCurrentVersion} from '../getCurrentVersion.ts';
import {readStandFile} from '../readStandFile.ts';

import {checkStep} from './checkStep.ts';

export const checkBackgroundUpdate = async (version: string) => {
    fs.rmSync(UPDATE_CHECK_STAMP_PATH, {force: true});

    await restartObs();
    await waitFor('the background update', () => getCurrentVersion() === version, BACKGROUND_UPDATE_WAIT_MS);
    console.log('ok   the bridge updates by itself about a minute after the start');

    checkStep('a successful update clears the rollback mark', readStandFile(ROLLED_BACK_VERSION_PATH), null);

    await restartObs();
    await waitFor('the health report of the new version', () => readStandFile(HEALTHY_VERSION_PATH) === version, CONNECTION_WAIT_MS);
    checkStep('after a restart the dock opens the new version', (await findDockTarget())?.url.includes(`/versions/${version}/`), true);
};
