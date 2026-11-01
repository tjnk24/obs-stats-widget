import path from 'node:path';

import {RELEASE_DIRECTORY, ROOT_DIRECTORY} from '../packageRelease/consts.ts';

const MINISIGN_VERSION = '0.12';

export const MINISIGN_ARCHIVE_URL = `https://github.com/jedisct1/minisign/releases/download/${MINISIGN_VERSION}/minisign-${MINISIGN_VERSION}-win64.zip`;

export const MINISIGN_ARCHIVE_SHA256 = '37b600344e20c19314b2e82813db2bfdcc408b77b876f7727889dbd46d539479';

export const MINISIGN_CACHE_DIRECTORY = path.join(ROOT_DIRECTORY, 'node_modules', '.cache', 'minisign', MINISIGN_VERSION);

export const MINISIGN_EXECUTABLE = path.join(MINISIGN_CACHE_DIRECTORY, 'minisign-win64', 'x86_64', 'minisign.exe');

export const COMPILER_LOCATIONS: Array<string | undefined> = [
    process.env.ISCC_PATH,
    process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, 'Programs', 'Inno Setup 6', 'ISCC.exe'),
    process.env['ProgramFiles(x86)'] && path.join(process.env['ProgramFiles(x86)'], 'Inno Setup 6', 'ISCC.exe'),
    process.env.ProgramFiles && path.join(process.env.ProgramFiles, 'Inno Setup 6', 'ISCC.exe'),
];

export const UPDATER_SOURCE_DIRECTORY: string = path.join(ROOT_DIRECTORY, 'installer', 'updater');

export const TEST_UPDATER_DIRECTORY: string = path.join(RELEASE_DIRECTORY, 'test-updater');

export const UPDATER_ENTRY_NAME: string = 'Update-Widget.ps1';

export const RELEASE_BASE_URL_PATTERN: RegExp = /(\[string\]\$ReleaseBaseUrl = ')[^']*(')/;

export const PUBLIC_KEY_PATTERN: RegExp = /(\[string\]\$PublicKey = ')[^']*(')/;
