import type {ParseKeys} from 'i18next';
import type {Nullable} from 'infrastructure/common';

import {UpdateErrorEnum} from '__types/update/bridge/UpdateErrorEnum';
import {UpdateStageEnum} from '__types/update/bridge/UpdateStageEnum';
import {CompatibilityProblemEnum} from '__types/update/compatibility/CompatibilityProblemEnum';
import {CompatibilityWarningEnum} from '__types/update/compatibility/CompatibilityWarningEnum';
import {UpdateCheckStatusEnum} from '__types/update/UpdateCheckStatusEnum';

const {
    Idle,
    Checking,
    UpToDate,
    Available,
    Failed,
} = UpdateCheckStatusEnum;

const {
    Preparing,
    Downloading,
    Verifying,
    Installing,
    Done,
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

const {ObsTooOld, RpcMismatch, RequestsMissing, ChromiumTooOld} = CompatibilityProblemEnum;

export const UPDATE_CHECK_TEXTS: Record<UpdateCheckStatusEnum, Nullable<ParseKeys>> = {
    [Idle]: null,
    [Checking]: null,
    [UpToDate]: 'settings.upToDate',
    [Available]: 'settings.updateAvailable',
    [Failed]: 'settings.checkFailed',
};

export const LAST_CHECK_FORMAT: Intl.DateTimeFormatOptions = {dateStyle: 'short', timeStyle: 'short'};

export const UPDATE_STATUS_CLOCK_SLACK_MS = 2000;

export const UPDATE_BRIDGE_RESPONSE_TIMEOUT_MS = 30 * 1000;

export const UPDATE_STAGE_TEXTS: Record<UpdateStageEnum, ParseKeys> = {
    [Preparing]: 'update.stages.preparing',
    [Downloading]: 'update.stages.downloading',
    [Verifying]: 'update.stages.verifying',
    [Installing]: 'update.stages.installing',
    [Done]: 'settings.updateStaged',
    [UpdateStageEnum.Failed]: 'update.errors.unexpected',
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

export const COMPATIBILITY_PROBLEM_TEXTS: Record<CompatibilityProblemEnum, ParseKeys> = {
    [ObsTooOld]: 'update.problems.obsTooOld',
    [RpcMismatch]: 'update.problems.rpcMismatch',
    [RequestsMissing]: 'update.problems.requestsMissing',
    [ChromiumTooOld]: 'update.problems.chromiumTooOld',
};

export const COMPATIBILITY_WARNING_TEXTS: Record<CompatibilityWarningEnum, ParseKeys> = {
    [CompatibilityWarningEnum.MajorUpdate]: 'update.warnings.majorUpdate',
};
