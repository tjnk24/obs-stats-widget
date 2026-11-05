import {VERSION} from '../../packageRelease/consts.ts';
import {SCENARIO_VERSIONS} from '../consts.ts';
import {buildNewerRelease} from '../packaging/buildNewerRelease.ts';
import {installCurrentVersion} from '../packaging/installCurrentVersion.ts';
import {restartAll} from '../processes/restartAll.ts';
import {startStand} from '../processes/startStand.ts';
import {stopStand} from '../processes/stopStand.ts';
import {setupStand} from '../setup/setupStand.ts';

import {checkBackgroundUpdate} from './checks/checkBackgroundUpdate.ts';
import {checkDockAndStream} from './checks/checkDockAndStream.ts';
import {checkJournal} from './checks/checkJournal.ts';
import {checkRollback} from './checks/checkRollback.ts';
import {checkUpdateButton} from './checks/checkUpdateButton.ts';

export const runScenario = async () => {
    const {button, broken, background} = SCENARIO_VERSIONS;

    await stopStand();

    try {
        await setupStand();
        await installCurrentVersion();

        console.log(`--- the installed version ${VERSION} in OBS`);
        await startStand();
        await checkDockAndStream();

        console.log('--- the journal');
        await checkJournal();

        console.log(`--- the Update button, version ${button}`);
        await buildNewerRelease(button, false);
        await restartAll();
        await checkUpdateButton(button);

        console.log(`--- a broken dock, version ${broken}`);
        await buildNewerRelease(broken, true);
        await restartAll();
        await checkRollback(broken, button);

        console.log(`--- the background update, version ${background}`);
        await buildNewerRelease(background, false);
        await restartAll();
        await checkBackgroundUpdate(background);

        console.log('ALL PASSED');
    } finally {
        await stopStand();
    }
};
