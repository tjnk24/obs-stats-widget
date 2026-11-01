import {BaseStore} from '__reducers';
import {ConnectionStatusEnum} from '__types/connection/ConnectionStatusEnum';

export const DOCK_HREF: string = 'file:///C:/Users/Streamer/AppData/Local/Programs/obs-stats-widget/dock/index.html';

export const SCRIPT_PATH: string = 'C:\\Users\\Streamer\\AppData\\Local\\Programs\\obs-stats-widget\\obs-stats-bridge.lua';

export const SCENE_COLLECTION: string = 'Main scenes';

export const STATE = {
    connection: {status: ConnectionStatusEnum.Identified, sceneCollection: SCENE_COLLECTION},
    update: {bridgeMissingChecks: 2},
} as unknown as BaseStore;
