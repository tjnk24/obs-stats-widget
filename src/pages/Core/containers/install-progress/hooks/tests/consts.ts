import {BridgeUpdateStateDto} from '__types/update/bridge/BridgeUpdateStateDto';
import {UpdateStageEnum} from '__types/update/bridge/UpdateStageEnum';
import {UpdateStatusDto} from '__types/update/bridge/UpdateStatusDto';
import {UpdateRequestDto} from '__types/update/UpdateRequestDto';

export const NOW = 1_800_000_000_000;

export const REQUEST: UpdateRequestDto = {version: '0.2.0', requestedAt: NOW - 5_000};

export const OLD_REQUEST: UpdateRequestDto = {...REQUEST, requestedAt: NOW - 60_000};

export const DOWNLOADING_STATUS: UpdateStatusDto = {
    version: '0.2.0',
    stage: UpdateStageEnum.Downloading,
    percent: 40,
    error: null,
    updated: (NOW - 1_000) / 1000,
};

export const FAILED_STATUS: UpdateStatusDto = {...DOWNLOADING_STATUS, stage: UpdateStageEnum.Failed, error: 'network'};

export const UNKNOWN_ERROR_STATUS: UpdateStatusDto = {...FAILED_STATUS, error: 'somethingNew'};

export const DONE_STATUS: UpdateStatusDto = {...DOWNLOADING_STATUS, stage: UpdateStageEnum.Done, percent: 100};

export const BRIDGE: BridgeUpdateStateDto = {isAvailable: true, bridgeVersion: 2, status: null};
