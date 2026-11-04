import fs from 'node:fs';

import {OBS_WEBSOCKET_CONFIG_PATH} from '../consts.ts';
import type {ObsWebSocketConfigDto} from '../types/obs.ts';

export const readWebSocketConfig = () => JSON.parse(fs.readFileSync(OBS_WEBSOCKET_CONFIG_PATH, 'utf8')) as ObsWebSocketConfigDto;
