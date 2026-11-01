import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {Nullable} from 'infrastructure/common';

import {BridgeUpdateStateDto} from '__types/update/bridge/BridgeUpdateStateDto';
import {ReleaseDto} from '__types/update/ReleaseDto';
import {UpdateCheckStatusEnum} from '__types/update/UpdateCheckStatusEnum';
import {UpdateRequestDto} from '__types/update/UpdateRequestDto';

export type UpdateReducer = {
    checkStatus: UpdateCheckStatusEnum;
    latest: Nullable<ReleaseDto>;
    bridge: Nullable<BridgeUpdateStateDto>;
    bridgeMissingChecks: number;
    isObsBusy: boolean;
    request: Nullable<UpdateRequestDto>;
    deferredVersion: Nullable<string>;
};

const initialState: UpdateReducer = {
    checkStatus: UpdateCheckStatusEnum.Idle,
    latest: null,
    bridge: null,
    bridgeMissingChecks: 0,
    isObsBusy: false,
    request: null,
    deferredVersion: null,
};

const slice = createSlice({
    name: 'update',
    initialState,
    reducers: {
        setCheckStatus: (state, {payload}: PayloadAction<UpdateCheckStatusEnum>) => {
            state.checkStatus = payload;
        },
        setLatest: (state, {payload}: PayloadAction<Nullable<ReleaseDto>>) => {
            state.latest = payload;
        },
        setBridge: (state, {payload}: PayloadAction<Nullable<BridgeUpdateStateDto>>) => {
            state.bridge = payload;
            state.bridgeMissingChecks = payload ? 0 : state.bridgeMissingChecks + 1;
        },
        resetBridge: state => {
            state.bridge = null;
            state.bridgeMissingChecks = 0;
        },
        setIsObsBusy: (state, {payload}: PayloadAction<boolean>) => {
            state.isObsBusy = payload;
        },
        setRequest: (state, {payload}: PayloadAction<Nullable<UpdateRequestDto>>) => {
            state.request = payload;
        },
        setDeferredVersion: (state, {payload}: PayloadAction<Nullable<string>>) => {
            state.deferredVersion = payload;
        },
    },
});

export default slice;
