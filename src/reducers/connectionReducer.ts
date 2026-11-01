import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {Nullable} from 'infrastructure/common';

import {ConnectionStatusEnum} from '__types/connection/ConnectionStatusEnum';
import {ObsVersionDto} from '__types/obs/responses/ObsVersionDto';

export type ConnectionReducer = {
    status: ConnectionStatusEnum;
    obsVersion: Nullable<ObsVersionDto>;
    sceneCollection: Nullable<string>;
    isSwitchingCollection: boolean;
};

const initialState: ConnectionReducer = {
    status: ConnectionStatusEnum.Connecting,
    obsVersion: null,
    sceneCollection: null,
    isSwitchingCollection: false,
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
    },
});

export default slice;
