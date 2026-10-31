import {UpdateStageEnum} from '__types/update/bridge/UpdateStageEnum';
import {UpdateStatusDto} from '__types/update/bridge/UpdateStatusDto';

export const UPDATE_STATUS: UpdateStatusDto = {
    version: '0.2.0',
    stage: UpdateStageEnum.Downloading,
    percent: 42,
    error: null,
    updated: 1793400000,
};
