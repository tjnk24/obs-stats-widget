import type {Nullable} from 'infrastructure/common';

import {UpdateStatusDto} from './UpdateStatusDto';

export type BridgeUpdateStateDto = {
    isAvailable: boolean;
    bridgeVersion: number;
    status: Nullable<UpdateStatusDto>;
};
