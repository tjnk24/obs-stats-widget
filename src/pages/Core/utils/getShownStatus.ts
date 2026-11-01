import type {Nullable} from 'infrastructure/common';

import {BridgeUpdateStateDto} from '__types/update/bridge/BridgeUpdateStateDto';
import {UpdateStatusDto} from '__types/update/bridge/UpdateStatusDto';
import {UpdateRequestDto} from '__types/update/UpdateRequestDto';
import {RUNNING_UPDATE_STAGES, UPDATE_STATUS_STALE_SEC} from '__utils/consts';

import {UPDATE_STATUS_CLOCK_SLACK_MS} from '../consts';

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
    const isRequested = request !== null && status.version === request.version && updatedAt >= request.requestedAt - UPDATE_STATUS_CLOCK_SLACK_MS;
    const isRunning = RUNNING_UPDATE_STAGES.includes(status.stage) && now - updatedAt < UPDATE_STATUS_STALE_SEC * 1000;

    return isRequested || isRunning ? status : null;
};
