import {BridgeUpdateStateDto} from '__types/update/bridge/BridgeUpdateStateDto';
import {UpdateStageEnum} from '__types/update/bridge/UpdateStageEnum';
import {UpdateStatusDto} from '__types/update/bridge/UpdateStatusDto';
import {UpdateRequestDto} from '__types/update/UpdateRequestDto';

export const NOW: number = 1_800_000_000_000;

export const REQUEST: UpdateRequestDto = {version: '0.2.0', requestedAt: NOW - 10_000};

export const FAILED_STATUS: UpdateStatusDto = {
    version: '0.2.0',
    stage: UpdateStageEnum.Failed,
    percent: 0,
    error: 'network',
    updated: (NOW - 5_000) / 1000,
};

export const OLD_FAILED_STATUS: UpdateStatusDto = {...FAILED_STATUS, updated: (NOW - 600_000) / 1000};

export const RUNNING_STATUS: UpdateStatusDto = {...FAILED_STATUS, stage: UpdateStageEnum.Downloading, percent: 40, error: null};

export const STALE_RUNNING_STATUS: UpdateStatusDto = {...RUNNING_STATUS, updated: (NOW - 600_000) / 1000};

export const BRIDGE: BridgeUpdateStateDto = {isAvailable: true, bridgeVersion: 2, status: null};
