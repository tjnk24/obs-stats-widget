import type {Nullable} from 'infrastructure/common';

import {BridgeUpdateStateDto} from './bridge/BridgeUpdateStateDto';
import {CompatibilityResultDto} from './compatibility/CompatibilityResultDto';
import {ReleaseDto} from './ReleaseDto';

export type UpdateInstallContextDto = {
    release: Nullable<ReleaseDto>;
    currentVersion: string;
    bridge: Nullable<BridgeUpdateStateDto>;
    compatibility: Nullable<CompatibilityResultDto>;
    now: number;
};
