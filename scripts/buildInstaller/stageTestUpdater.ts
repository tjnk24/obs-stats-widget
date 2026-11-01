import fs from 'node:fs';
import path from 'node:path';

import {
    PUBLIC_KEY_PATTERN,
    RELEASE_BASE_URL_PATTERN,
    TEST_UPDATER_DIRECTORY,
    UPDATER_ENTRY_NAME,
    UPDATER_SOURCE_DIRECTORY,
} from './consts.ts';

export const stageTestUpdater = (server: string, publicKey: string) => {
    fs.rmSync(TEST_UPDATER_DIRECTORY, {recursive: true, force: true});
    fs.cpSync(UPDATER_SOURCE_DIRECTORY, TEST_UPDATER_DIRECTORY, {recursive: true});

    const entryPath = path.join(TEST_UPDATER_DIRECTORY, UPDATER_ENTRY_NAME);
    const source = fs.readFileSync(entryPath, 'utf8');

    if (!RELEASE_BASE_URL_PATTERN.test(source) || !PUBLIC_KEY_PATTERN.test(source)) {
        throw new Error(`${UPDATER_ENTRY_NAME} no longer has the ReleaseBaseUrl and PublicKey defaults the test build replaces`);
    }

    const patched = source
        .replace(RELEASE_BASE_URL_PATTERN, (_match, start: string, end: string) => `${start}${server}/download${end}`)
        .replace(PUBLIC_KEY_PATTERN, (_match, start: string, end: string) => `${start}${publicKey}${end}`);

    fs.writeFileSync(entryPath, patched);

    return TEST_UPDATER_DIRECTORY;
};
