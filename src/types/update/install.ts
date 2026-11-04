import type {Nullable} from 'infrastructure/common';

import {BridgeUpdateStateDto} from './bridgeUpdate';
import {CompatibilityResultDto} from './compatibility';
import {ReleaseDto} from './release';

export enum UpdateInstallBlockerEnum {
    NoRelease = 'noRelease',
    NotNewer = 'notNewer',
    NoUpdater = 'noUpdater',
    Incompatible = 'incompatible',
    InProgress = 'inProgress',
}

export type UpdateRequestDto = {
    version: string;
    requestedAt: number;
};

export type UpdateInstallContextDto = {
    release: Nullable<ReleaseDto>;
    currentVersion: string;
    bridge: Nullable<BridgeUpdateStateDto>;
    compatibility: Nullable<CompatibilityResultDto>;
    now: number;
};
