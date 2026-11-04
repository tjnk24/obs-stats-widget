import type {Nullable} from 'infrastructure/common';

export type UpdateEnvironmentDto = {
    currentVersion: string;
    obsVersion: Nullable<string>;
    rpcVersion: Nullable<number>;
    availableRequests: Nullable<string[]>;
    chromiumVersion: Nullable<number>;
};
