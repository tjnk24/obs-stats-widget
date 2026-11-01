import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

import {
    PACKAGE_DIRECTORY,
    RELEASE_DIRECTORY,
    ROOT_DIRECTORY,
    VERSION,
} from '../packageRelease/consts.ts';

import {ensureMinisign} from './ensureMinisign.ts';
import {findCompiler} from './findCompiler.ts';
import {stageTestUpdater} from './stageTestUpdater.ts';

if (!fs.existsSync(PACKAGE_DIRECTORY)) {
    throw new Error(`${path.relative(ROOT_DIRECTORY, PACKAGE_DIRECTORY)} is missing, run npm run package:release first`);
}

const minisign = await ensureMinisign();

const testServer = process.env.TEST_UPDATE_SERVER;
const testPublicKey = process.env.TEST_UPDATE_PUBLIC_KEY;

if (testServer && !testPublicKey) {
    throw new Error('TEST_UPDATE_SERVER is set without TEST_UPDATE_PUBLIC_KEY');
}

const updaterArguments = testServer && testPublicKey ? [`/DUpdaterDir=${stageTestUpdater(testServer, testPublicKey)}`] : [];

const result = spawnSync(findCompiler(), [
    '/Qp',
    `/DAppVersion=${VERSION}`,
    `/DPackageDir=${PACKAGE_DIRECTORY}`,
    `/DMinisignPath=${minisign}`,
    `/DOutputDir=${RELEASE_DIRECTORY}`,
    ...updaterArguments,
    path.join(ROOT_DIRECTORY, 'installer', 'obs-stats-widget.iss'),
], {stdio: 'inherit'});

if (result.status !== 0) {
    throw new Error(`Inno Setup failed with exit code ${result.status}`);
}

if (testServer) {
    console.log(`TEST BUILD: the dock and the updater take releases from ${testServer}`);
}

console.log(`Built ${path.relative(ROOT_DIRECTORY, path.join(RELEASE_DIRECTORY, `obs-stats-widget-setup-${VERSION}.exe`))}`);
