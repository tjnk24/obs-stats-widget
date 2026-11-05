import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {HardwareDto} from '__types/bridge';
import {StatsViewDto} from '__types/stats/views';
import {StreamTargetDto} from '__types/targets';

export type StatsReducer = {
    targets: StreamTargetDto[];
    view: StatsViewDto;
    hardware: HardwareDto;
    isRecording: boolean;
};

const initialState: StatsReducer = {
    targets: [],
    view: {
        outputs: {},
        general: null,
        now: 0,
    },
    hardware: {
        gpu: null,
        systemMemory: null,
    },
    isRecording: false,
};

const slice = createSlice({
    name: 'stats',
    initialState,
    reducers: {
        setTargets: (state, {payload}: PayloadAction<StreamTargetDto[]>) => {
            state.targets = payload;
        },
        setView: (state, {payload}: PayloadAction<StatsViewDto>) => {
            state.view = payload;
        },
        setHardware: (state, {payload}: PayloadAction<HardwareDto>) => {
            state.hardware = payload;
        },
        setIsRecording: (state, {payload}: PayloadAction<boolean>) => {
            state.isRecording = payload;
        },
        reset: () => initialState,
    },
});

export default slice;
