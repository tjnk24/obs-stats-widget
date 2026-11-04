import type {Nullable} from 'infrastructure/common';

export enum CompatibilityProblemEnum {
    ObsTooOld = 'obsTooOld',
    RpcMismatch = 'rpcMismatch',
    RequestsMissing = 'requestsMissing',
    ChromiumTooOld = 'chromiumTooOld',
}

export enum CompatibilityWarningEnum {
    MajorUpdate = 'majorUpdate',
}

export type CompatibilityDto = {
    version: string;
    minObsVersion: string;
    obsWebSocketRpcVersion: number;
    minChromiumVersion: number;
    minBridgeVersion: number;
    requiredRequests: string[];
};

export type CompatibilityResultDto = {
    problems: CompatibilityProblemEnum[];
    warnings: CompatibilityWarningEnum[];
};

export type UpdateEnvironmentDto = {
    currentVersion: string;
    obsVersion: Nullable<string>;
    rpcVersion: Nullable<number>;
    availableRequests: Nullable<string[]>;
    chromiumVersion: Nullable<number>;
};
