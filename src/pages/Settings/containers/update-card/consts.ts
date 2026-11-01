import type {ParseKeys} from 'i18next';
import type {Nullable} from 'infrastructure/common';

import {UpdateCheckStatusEnum} from '__types/update/UpdateCheckStatusEnum';

const {
    Idle,
    Checking,
    UpToDate,
    Available,
    Failed,
} = UpdateCheckStatusEnum;

export const UPDATE_CHECK_TEXTS: Record<UpdateCheckStatusEnum, Nullable<ParseKeys>> = {
    [Idle]: null,
    [Checking]: null,
    [UpToDate]: 'settings.upToDate',
    [Available]: 'settings.updateAvailable',
    [Failed]: 'settings.checkFailed',
};

export const LAST_CHECK_FORMAT: Intl.DateTimeFormatOptions = {dateStyle: 'short', timeStyle: 'short'};
