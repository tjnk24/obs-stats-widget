import {createHash} from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import {DOWNLOADS_DIRECTORY} from '../consts.ts';
import type {StandArchiveDto} from '../types/StandArchiveDto.ts';

export const downloadArchive = async ({name, url, sha256}: StandArchiveDto) => {
    const archivePath = path.join(DOWNLOADS_DIRECTORY, name);

    if (fs.existsSync(archivePath)) {
        return archivePath;
    }

    console.log(`Downloading ${url}`);

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Downloading ${name} failed: HTTP ${response.status}`);
    }

    const archive = Buffer.from(await response.arrayBuffer());
    const hash = createHash('sha256').update(archive).digest('hex');

    if (hash !== sha256) {
        throw new Error(`${name} has SHA-256 ${hash}, expected ${sha256}`);
    }

    fs.mkdirSync(DOWNLOADS_DIRECTORY, {recursive: true});
    fs.writeFileSync(archivePath, archive);

    return archivePath;
};
