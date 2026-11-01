import type {Nullable} from 'infrastructure/common';

export type UpdateCardViewDto = {
    lastCheckText: string;
    checkText: Nullable<string>;
    isCheckFailed: boolean;
    hiddenUpdateText: Nullable<string>;
    isUpdateShown: boolean;
    isManual: boolean;
    isAutoUpdateCheckEnabled: boolean;
};
