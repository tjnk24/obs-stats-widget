import {spawnSync} from 'node:child_process';
import fs from 'node:fs';

import {WINDOWS_TAR} from '../consts.ts';

export const unpackArchive = (archivePath: string, targetDirectory: string, members: string[] = []) => {
    fs.mkdirSync(targetDirectory, {recursive: true});

    const extraction = spawnSync(WINDOWS_TAR, ['-xf', archivePath, '-C', targetDirectory, ...members], {stdio: 'inherit'});

    if (extraction.status !== 0) {
        throw new Error(`Unpacking ${archivePath} failed`);
    }
};
