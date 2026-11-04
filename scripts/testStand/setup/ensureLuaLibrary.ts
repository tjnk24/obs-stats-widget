import fs from 'node:fs';

import {
    LUA_DIRECTORY,
    LUA_LIBRARY_IN_ARCHIVE,
    LUA_LIBRARY_PATH,
    OBS_ARCHIVE,
} from '../consts.ts';

import {downloadArchive} from './downloadArchive.ts';
import {unpackArchive} from './unpackArchive.ts';

export const ensureLuaLibrary = async () => {
    if (fs.existsSync(LUA_LIBRARY_PATH)) {
        return LUA_LIBRARY_PATH;
    }

    unpackArchive(await downloadArchive(OBS_ARCHIVE), LUA_DIRECTORY, [LUA_LIBRARY_IN_ARCHIVE]);

    if (!fs.existsSync(LUA_LIBRARY_PATH)) {
        throw new Error(`${LUA_LIBRARY_IN_ARCHIVE} is not in ${OBS_ARCHIVE.name}`);
    }

    return LUA_LIBRARY_PATH;
};
