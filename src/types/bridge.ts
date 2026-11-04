import type {Nullable} from 'infrastructure/common';

import {BridgeUpdateDto} from './update/bridgeUpdate';

type BridgeOutputDto = {
    name: string;
    server: string;
};

type GpuStatsDto = {
    name?: Nullable<string>;
    usage: number;
    encoder: number;
    memoryInBytes: number;
    isSharedMemory: boolean;
};

type SystemMemoryDto = {
    used: number;
    total: number;
};

export type HardwareDto = {
    gpu: Nullable<GpuStatsDto>;
    systemMemory: Nullable<SystemMemoryDto>;
};

export type BridgeDataDto = {
    bridgeVersion?: number;
    updated: number;
    sceneCollection?: string;
    outputs: BridgeOutputDto[];
    gpu?: GpuStatsDto;
    systemMemory?: SystemMemoryDto;
    update?: BridgeUpdateDto;
};
