import {CURRENT_VERSION_PATH} from '../consts.ts';

import {readStandFile} from './readStandFile.ts';

export const getCurrentVersion = () => readStandFile(CURRENT_VERSION_PATH)?.split('\'')[1] ?? null;
