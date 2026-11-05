import fs from 'node:fs';
import path from 'node:path';

import {ROOT_DIRECTORY} from '../../packageRelease/consts.ts';
import {PROJECT_COPY_DIRECTORY, PROJECT_COPY_SKIPPED_NAMES} from '../consts.ts';

import {removeProjectCopy} from './removeProjectCopy.ts';

export const copyProject = (version: string) => {
    removeProjectCopy();

    fs.readdirSync(ROOT_DIRECTORY)
        .filter(name => !name.startsWith('.') && !PROJECT_COPY_SKIPPED_NAMES.includes(name))
        .forEach(name => fs.cpSync(path.join(ROOT_DIRECTORY, name), path.join(PROJECT_COPY_DIRECTORY, name), {recursive: true}));

    fs.symlinkSync(path.join(ROOT_DIRECTORY, 'node_modules'), path.join(PROJECT_COPY_DIRECTORY, 'node_modules'), 'junction');

    const packagePath = path.join(PROJECT_COPY_DIRECTORY, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8')) as Record<string, unknown>;

    fs.writeFileSync(packagePath, `${JSON.stringify({...packageJson, version}, null, 2)}\n`);
};
