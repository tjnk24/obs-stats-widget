import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {Nullable} from 'infrastructure/common';

import {BridgeUpdateStateDto} from '__types/update/bridge/BridgeUpdateStateDto';
import {ReleaseDto} from '__types/update/ReleaseDto';
import {UpdateCheckStatusEnum} from '__types/update/UpdateCheckStatusEnum';

export type UpdateReducer = {
    checkStatus: UpdateCheckStatusEnum;
    latest: Nullable<ReleaseDto>;
    bridge: Nullable<BridgeUpdateStateDto>;
    isObsBusy: boolean;
    requestedVersion: Nullable<string>;
};

const initialState: UpdateReducer = {
    checkStatus: UpdateCheckStatusEnum.Idle,
    latest: null,
    bridge: null,
    isObsBusy: false,
    requestedVersion: null,
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
        },
        setIsObsBusy: (state, {payload}: PayloadAction<boolean>) => {
            state.isObsBusy = payload;
        },
        setRequestedVersion: (state, {payload}: PayloadAction<Nullable<string>>) => {
            state.requestedVersion = payload;
        },
    },
});

export default slice;
