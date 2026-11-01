import type {ParseKeys} from 'i18next';

import {CompatibilityProblemEnum} from '__types/update/compatibility/CompatibilityProblemEnum';
import {CompatibilityWarningEnum} from '__types/update/compatibility/CompatibilityWarningEnum';

const {ObsTooOld, RpcMismatch, RequestsMissing, ChromiumTooOld} = CompatibilityProblemEnum;

const {MajorUpdate, BridgeRestart} = CompatibilityWarningEnum;

export const COMPATIBILITY_PROBLEM_TEXTS: Record<CompatibilityProblemEnum, ParseKeys> = {
    [ObsTooOld]: 'update.problems.obsTooOld',
    [RpcMismatch]: 'update.problems.rpcMismatch',
    [RequestsMissing]: 'update.problems.requestsMissing',
    [ChromiumTooOld]: 'update.problems.chromiumTooOld',
};

export const COMPATIBILITY_WARNING_TEXTS: Record<CompatibilityWarningEnum, ParseKeys> = {
    [MajorUpdate]: 'update.warnings.majorUpdate',
    [BridgeRestart]: 'update.warnings.bridgeRestart',
};
