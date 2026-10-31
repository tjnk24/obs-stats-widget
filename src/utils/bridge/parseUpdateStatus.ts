import type {Nullable} from 'infrastructure/common';
import isPlainObject from 'lodash/isPlainObject';

import {UpdateStageEnum} from '__types/update/bridge/UpdateStageEnum';
import {UpdateStatusDto} from '__types/update/bridge/UpdateStatusDto';
import {UPDATE_STAGES} from '__utils/consts';

export const parseUpdateStatus = (raw: Nullable<string>): Nullable<UpdateStatusDto> => {
    if (!raw) {
        return null;
    }

    let parsed: unknown;

    try {
        parsed = JSON.parse(raw);
    } catch {
        return null;
    }

    if (!isPlainObject(parsed)) {
        return null;
    }

    const {version, stage, percent, error, updated} = parsed as Partial<Record<keyof UpdateStatusDto, unknown>>;

    if (
        typeof version !== 'string'
        || typeof stage !== 'string' || !UPDATE_STAGES.includes(stage)
        || typeof percent !== 'number'
        || (error !== null && typeof error !== 'string')
        || typeof updated !== 'number'
    ) {
        return null;
    }

    return {version, stage: stage as UpdateStageEnum, percent, error, updated};
};
