import type {Nullable} from 'infrastructure/common';

export type UpdateCardViewDto = {
    lastCheckText: string;
    checkText: Nullable<string>;
    isCheckFailed: boolean;
    hiddenUpdateText: Nullable<string>;
    isAutoUpdateCheckEnabled: boolean;
};
