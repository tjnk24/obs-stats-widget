import type {Nullable} from 'infrastructure/common';

export type UpdateCardViewDto = {
    lastCheckText: string;
    checkText: Nullable<string>;
    isCheckFailed: boolean;
    statusText: Nullable<string>;
    isStatusRunning: boolean;
    errorText: Nullable<string>;
    notes: string[];
    isUpdateShown: boolean;
    isManual: boolean;
    updateText: string;
    currentReleaseUrl: string;
    latestReleaseUrl: Nullable<string>;
    isAutoUpdateEnabled: boolean;
};
