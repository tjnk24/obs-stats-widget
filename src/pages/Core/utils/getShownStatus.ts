import type {Nullable} from 'infrastructure/common';

import {BridgeUpdateStateDto} from '__types/update/bridge/BridgeUpdateStateDto';
import {UpdateStatusDto} from '__types/update/bridge/UpdateStatusDto';
import {UpdateRequestDto} from '__types/update/UpdateRequestDto';
import {isRequestedStatus} from '__utils/bridge/isRequestedStatus';
import {RUNNING_UPDATE_STAGES, UPDATE_STATUS_STALE_SEC} from '__utils/consts';

export const getShownStatus = (
    bridge: Nullable<BridgeUpdateStateDto>,
    request: Nullable<UpdateRequestDto>,
    now: number,
): Nullable<UpdateStatusDto> => {
    const status = bridge?.status ?? null;

    if (!status) {
        return null;
    }

    const updatedAt = status.updated * 1000;
    const isRunning = RUNNING_UPDATE_STAGES.includes(status.stage) && now - updatedAt < UPDATE_STATUS_STALE_SEC * 1000;

    return isRequestedStatus(status, request) || isRunning ? status : null;
};
