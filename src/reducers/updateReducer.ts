import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {Nullable} from 'infrastructure/common';

import {BridgeUpdateStateDto} from '__types/update/bridgeUpdate';
import {UpdateRequestDto} from '__types/update/install';
import {ReleaseDto} from '__types/update/release';
import {UpdateCheckStatusEnum} from '__types/update/UpdateCheckStatusEnum';

export type UpdateReducer = {
    checkStatus: UpdateCheckStatusEnum;
    latest: Nullable<ReleaseDto>;
    bridge: Nullable<BridgeUpdateStateDto>;
    bridgeMissingChecks: number;
    request: Nullable<UpdateRequestDto>;
};

const initialState: UpdateReducer = {
    checkStatus: UpdateCheckStatusEnum.Idle,
    latest: null,
    bridge: null,
    bridgeMissingChecks: 0,
    request: null,
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
        setRequest: (state, {payload}: PayloadAction<Nullable<UpdateRequestDto>>) => {
            state.request = payload;
        },
    },
});

export default slice;
