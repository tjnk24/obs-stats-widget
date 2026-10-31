import path from 'node:path';

import {ROOT_DIRECTORY} from '../packageRelease/consts.ts';

const MINISIGN_VERSION = '0.12';

export const MINISIGN_ARCHIVE_URL = `https://github.com/jedisct1/minisign/releases/download/${MINISIGN_VERSION}/minisign-${MINISIGN_VERSION}-win64.zip`;

export const MINISIGN_ARCHIVE_SHA256 = '37b600344e20c19314b2e82813db2bfdcc408b77b876f7727889dbd46d539479';

export const MINISIGN_CACHE_DIRECTORY = path.join(ROOT_DIRECTORY, 'node_modules', '.cache', 'minisign', MINISIGN_VERSION);

export const MINISIGN_EXECUTABLE = path.join(MINISIGN_CACHE_DIRECTORY, 'minisign-win64', 'x86_64', 'minisign.exe');
