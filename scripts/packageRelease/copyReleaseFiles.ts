import fs from 'node:fs';
import path from 'node:path';

import {
    FONT_LICENSE_SOURCE,
    FONT_LICENSE_TARGET,
    PACKAGE_DIRECTORY,
    RELEASE_DIRECTORY,
    ROOT_DIRECTORY,
    UPDATER_SOURCE_DIRECTORY,
    UPDATER_TARGET_DIRECTORY,
} from './consts.ts';

export const copyReleaseFiles = () => {
    fs.rmSync(RELEASE_DIRECTORY, {recursive: true, force: true});
    fs.mkdirSync(PACKAGE_DIRECTORY, {recursive: true});

    fs.cpSync(path.join(ROOT_DIRECTORY, 'build'), path.join(PACKAGE_DIRECTORY, 'dock'), {recursive: true});
    fs.cpSync(path.join(ROOT_DIRECTORY, 'obs-script'), PACKAGE_DIRECTORY, {recursive: true});
    fs.cpSync(UPDATER_SOURCE_DIRECTORY, UPDATER_TARGET_DIRECTORY, {recursive: true});
    fs.copyFileSync(path.join(ROOT_DIRECTORY, 'LICENSE'), path.join(PACKAGE_DIRECTORY, 'LICENSE'));
    fs.copyFileSync(FONT_LICENSE_SOURCE, FONT_LICENSE_TARGET);
};
