import type {Nullable} from 'infrastructure/common';

export type BridgeNoticeViewDto = {
    isShown: boolean;
    sceneCollection: Nullable<string>;
    scriptPath: Nullable<string>;
};
