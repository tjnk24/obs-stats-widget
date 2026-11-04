import {spawnSync} from 'node:child_process';
import fs from 'node:fs';

import {ensureMinisign} from '../../buildInstaller/ensureMinisign.ts';
import {
    TEST_KEY_DIRECTORY,
    TEST_PUBLIC_KEY_PATH,
    TEST_SECRET_KEY_PATH,
} from '../consts.ts';

export const ensureTestKey = async () => {
    if (fs.existsSync(TEST_SECRET_KEY_PATH)) {
        return;
    }

    fs.mkdirSync(TEST_KEY_DIRECTORY, {recursive: true});

    const generation = spawnSync(await ensureMinisign(), ['-G', '-W', '-p', TEST_PUBLIC_KEY_PATH, '-s', TEST_SECRET_KEY_PATH], {stdio: 'ignore'});

    if (generation.status !== 0) {
        throw new Error('Generating the test signing key failed');
    }
};
