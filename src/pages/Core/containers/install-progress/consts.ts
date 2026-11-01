import type {ParseKeys} from 'i18next';

import {UpdateErrorEnum} from '__types/update/bridge/UpdateErrorEnum';
import {UpdateStageEnum} from '__types/update/bridge/UpdateStageEnum';

import {UpdateStageViewDto} from './types';

const {
    Preparing,
    Downloading,
    Verifying,
    Installing,
    Done,
    Failed,
} = UpdateStageEnum;

const {
    InvalidVersion,
    NotNewer,
    Busy,
    Network,
    Signature,
    Incompatible,
    Install,
    Unexpected,
} = UpdateErrorEnum;

export const UPDATE_BRIDGE_RESPONSE_TIMEOUT_MS: number = 30 * 1000;

export const UPDATE_STAGE_VIEWS: Record<UpdateStageEnum, UpdateStageViewDto> = {
    [Preparing]: {textKey: 'update.stages.preparing', percent: 0},
    [Downloading]: {textKey: 'update.stages.downloading', percent: null},
    [Verifying]: {textKey: 'update.stages.verifying', percent: 100},
    [Installing]: {textKey: 'update.stages.installing', percent: 100},
    [Done]: {textKey: 'update.stages.done', percent: 100},
    [Failed]: {textKey: 'update.stages.failed', percent: 100},
};

export const UPDATE_ERROR_TEXTS: Record<UpdateErrorEnum, ParseKeys> = {
    [InvalidVersion]: 'update.errors.invalidVersion',
    [NotNewer]: 'update.errors.notNewer',
    [Busy]: 'update.errors.busy',
    [Network]: 'update.errors.network',
    [Signature]: 'update.errors.signature',
    [Incompatible]: 'update.errors.incompatible',
    [Install]: 'update.errors.install',
    [Unexpected]: 'update.errors.unexpected',
};
