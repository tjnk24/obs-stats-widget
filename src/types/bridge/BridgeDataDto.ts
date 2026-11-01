import {BridgeUpdateDto} from '../update/bridge/BridgeUpdateDto';

import {BridgeOutputDto} from './BridgeOutputDto';
import {GpuStatsDto} from './GpuStatsDto';
import {SystemMemoryDto} from './SystemMemoryDto';

export type BridgeDataDto = {
    bridgeVersion?: number;
    updated: number;
    sceneCollection?: string;
    outputs: BridgeOutputDto[];
    gpu?: GpuStatsDto;
    systemMemory?: SystemMemoryDto;
    update?: BridgeUpdateDto;
};
