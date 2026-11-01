import {UpdateStageEnum} from '__types/update/bridge/UpdateStageEnum';
import {UpdateStatusDto} from '__types/update/bridge/UpdateStatusDto';
import {UpdateRequestDto} from '__types/update/UpdateRequestDto';

export const UPDATE_STATUS: UpdateStatusDto = {
    version: '0.2.0',
    stage: UpdateStageEnum.Downloading,
    percent: 42,
    error: null,
    updated: 1793400000,
};

export const REQUESTED_AT: number = 1_800_000_000_000;

export const REQUEST: UpdateRequestDto = {version: '0.2.0', requestedAt: REQUESTED_AT};

export const FRESH_DONE_STATUS: UpdateStatusDto = {
    version: '0.2.0',
    stage: UpdateStageEnum.Done,
    percent: 100,
    error: null,
    updated: (REQUESTED_AT + 30_000) / 1000,
};
