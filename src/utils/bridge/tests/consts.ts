import {ObsProfileParameterDto} from '__types/obs/responses/ObsProfileParameterDto';
import {UpdateStageEnum} from '__types/update/bridge/UpdateStageEnum';
import {UpdateStatusDto} from '__types/update/bridge/UpdateStatusDto';

export const UPDATE_STATUS: UpdateStatusDto = {
    version: '0.2.0',
    stage: UpdateStageEnum.Downloading,
    percent: 42,
    error: null,
    updated: 1793400000,
};

export const BRIDGE_PUBLISHED_AT = 1_800_000_000;

export const BRIDGE_SCENE_COLLECTION = 'Main scenes';

export const BRIDGE_PARAMETER: ObsProfileParameterDto = {
    parameterValue: JSON.stringify({bridgeVersion: 2, updated: BRIDGE_PUBLISHED_AT, sceneCollection: BRIDGE_SCENE_COLLECTION, outputs: []}),
};

export const OLD_BRIDGE_PARAMETER: ObsProfileParameterDto = {
    parameterValue: JSON.stringify({bridgeVersion: 1, updated: BRIDGE_PUBLISHED_AT, outputs: []}),
};
