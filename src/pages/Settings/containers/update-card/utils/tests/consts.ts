import {UpdateStageEnum, UpdateStatusDto} from '__types/update/bridgeUpdate';
import {UpdateRequestDto} from '__types/update/install';

export const REQUESTED_AT = 1_800_000_000_000;

export const REQUEST: UpdateRequestDto = {version: '0.2.0', requestedAt: REQUESTED_AT};

export const FRESH_DONE_STATUS: UpdateStatusDto = {
    version: '0.2.0',
    stage: UpdateStageEnum.Done,
    percent: 100,
    error: null,
    updated: (REQUESTED_AT + 30_000) / 1000,
};
