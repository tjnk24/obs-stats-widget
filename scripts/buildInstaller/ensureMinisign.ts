import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import {
    MINISIGN_ARCHIVE_SHA256,
    MINISIGN_ARCHIVE_URL,
    MINISIGN_CACHE_DIRECTORY,
    MINISIGN_EXECUTABLE,
} from './consts.ts';

export const ensureMinisign = async () => {
    if (fs.existsSync(MINISIGN_EXECUTABLE)) {
        return MINISIGN_EXECUTABLE;
    }

    const response = await fetch(MINISIGN_ARCHIVE_URL);

    if (!response.ok) {
        throw new Error(`Downloading minisign failed: HTTP ${response.status}`);
    }

    const archive = Buffer.from(await response.arrayBuffer());
    const hash = createHash('sha256').update(archive).digest('hex');

    if (hash !== MINISIGN_ARCHIVE_SHA256) {
        throw new Error(`minisign archive has SHA-256 ${hash}, expected ${MINISIGN_ARCHIVE_SHA256}`);
    }

    const archivePath = path.join(MINISIGN_CACHE_DIRECTORY, 'minisign.zip');

    fs.rmSync(MINISIGN_CACHE_DIRECTORY, {recursive: true, force: true});
    fs.mkdirSync(MINISIGN_CACHE_DIRECTORY, {recursive: true});
    fs.writeFileSync(archivePath, archive);

    const windowsTar = path.join(process.env.SystemRoot ?? 'C:\\Windows', 'System32', 'tar.exe');
    const extraction = spawnSync(windowsTar, ['-xf', archivePath, '-C', MINISIGN_CACHE_DIRECTORY], {stdio: 'inherit'});

    if (extraction.status !== 0 || !fs.existsSync(MINISIGN_EXECUTABLE)) {
        throw new Error('Extracting minisign failed');
    }

    return MINISIGN_EXECUTABLE;
};
