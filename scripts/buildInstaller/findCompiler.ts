import fs from 'node:fs';

import {COMPILER_LOCATIONS} from './consts.ts';

export const findCompiler = () => {
    const compiler = COMPILER_LOCATIONS.find(location => location && fs.existsSync(location));

    if (!compiler) {
        throw new Error('Inno Setup 6 is not found. Install it (winget install JRSoftware.InnoSetup) or set ISCC_PATH');
    }

    return compiler;
};
