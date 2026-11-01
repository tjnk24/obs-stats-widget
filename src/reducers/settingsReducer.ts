import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {Nullable} from 'infrastructure/common';

import {storageService} from '__services/storageService';
import {SettingsDto} from '__types/app/SettingsDto';
import {LanguageEnum} from '__types/i18n/LanguageEnum';

import {SETTINGS_SLICE_NAME} from './consts';

export type SettingsReducer = SettingsDto;

const slice = createSlice({
    name: SETTINGS_SLICE_NAME,
    initialState: storageService.loadSettings,
    reducers: {
        setPort: (state, {payload}: PayloadAction<number>) => {
            state.port = payload;
        },
        setIsShowGeneralCard: (state, {payload}: PayloadAction<boolean>) => {
            state.isShowGeneralCard = payload;
        },
        setLanguage: (state, {payload}: PayloadAction<LanguageEnum>) => {
            state.language = payload;
        },
        setIsMockEnabled: (state, {payload}: PayloadAction<boolean>) => {
            state.isMockEnabled = payload;
        },
        setIsAutoUpdateCheckEnabled: (state, {payload}: PayloadAction<boolean>) => {
            state.isAutoUpdateCheckEnabled = payload;
        },
        setLastUpdateCheckAt: (state, {payload}: PayloadAction<number>) => {
            state.lastUpdateCheckAt = payload;
        },
        setSkippedUpdateVersion: (state, {payload}: PayloadAction<Nullable<string>>) => {
            state.skippedUpdateVersion = payload;
        },
        setUpdateRemindAt: (state, {payload}: PayloadAction<Nullable<number>>) => {
            state.updateRemindAt = payload;
        },
    },
});

export default slice;
