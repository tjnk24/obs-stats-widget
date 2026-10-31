import type {Nullable} from 'infrastructure/common';

export type BridgeUpdateDto = {
    available: boolean;
    status: Nullable<string>;
};
