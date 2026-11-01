import type {Nullable} from 'infrastructure/common';

import {LanguageEnum} from '../i18n/LanguageEnum';

export type SettingsDto = {
    settingsVersion: number;
    port: number;
    isShowGeneralCard: boolean;
    language: Nullable<LanguageEnum>;
    isMockEnabled: boolean;
    isAutoUpdateCheckEnabled: boolean;
    lastUpdateCheckAt: Nullable<number>;
    skippedUpdateVersion: Nullable<string>;
    updateRemindAt: Nullable<number>;
};
