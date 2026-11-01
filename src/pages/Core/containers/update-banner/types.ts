import type {Nullable} from 'infrastructure/common';

export enum UpdateBannerModeEnum {
    Hidden = 'hidden',
    Progress = 'progress',
    Deferred = 'deferred',
    NewVersion = 'newVersion',
}

export type UpdateBannerViewDto = {
    mode: UpdateBannerModeEnum;
    deferredVersion: Nullable<string>;
};
