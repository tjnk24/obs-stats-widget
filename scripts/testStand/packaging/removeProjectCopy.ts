import fs from 'node:fs';
import path from 'node:path';

import {PROJECT_COPY_DIRECTORY} from '../consts.ts';

export const removeProjectCopy = () => {
    const modulesLink = path.join(PROJECT_COPY_DIRECTORY, 'node_modules');

    if (fs.existsSync(modulesLink)) {
        fs.rmdirSync(modulesLink);
    }

    fs.rmSync(PROJECT_COPY_DIRECTORY, {recursive: true, force: true});
};
