import type {Nullable} from 'infrastructure/common';

import {UpdateStatusDto} from '__types/update/bridgeUpdate';
import {UpdateRequestDto} from '__types/update/install';

import {UPDATE_STATUS_CLOCK_SLACK_MS} from '../consts';

export const isRequestedStatus = (status: Nullable<UpdateStatusDto>, request: Nullable<UpdateRequestDto>): boolean => (
    status !== null
    && request !== null
    && status.version === request.version
    && status.updated * 1000 >= request.requestedAt - UPDATE_STATUS_CLOCK_SLACK_MS
);
