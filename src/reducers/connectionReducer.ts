import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {Nullable} from 'infrastructure/common';

import {ConnectionStatusEnum} from '__types/connection/ConnectionStatusEnum';
import {ObsVersionDto} from '__types/obs/responses';

export type ConnectionReducer = {
    status: ConnectionStatusEnum;
    obsVersion: Nullable<ObsVersionDto>;
    sceneCollection: Nullable<string>;
    isSwitchingCollection: boolean;
    reconnectAt: Nullable<number>;
    lastCloseCode: Nullable<number>;
};

const initialState: ConnectionReducer = {
    status: ConnectionStatusEnum.Connecting,
    obsVersion: null,
    sceneCollection: null,
    isSwitchingCollection: false,
    reconnectAt: null,
    lastCloseCode: null,
};

const slice = createSlice({
    name: 'connection',
    initialState,
    reducers: {
        setStatus: (state, {payload}: PayloadAction<ConnectionStatusEnum>) => {
            state.status = payload;
        },
        setObsVersion: (state, {payload}: PayloadAction<Nullable<ObsVersionDto>>) => {
            state.obsVersion = payload;
        },
        setSceneCollection: (state, {payload}: PayloadAction<Nullable<string>>) => {
            state.sceneCollection = payload;
        },
        setIsSwitchingCollection: (state, {payload}: PayloadAction<boolean>) => {
            state.isSwitchingCollection = payload;
        },
        setLastCloseCode: (state, {payload}: PayloadAction<number>) => {
            state.lastCloseCode = payload;
        },
        setReconnectAt: (state, {payload}: PayloadAction<Nullable<number>>) => {
            state.reconnectAt = payload;
        },
    },
});

export default slice;
