import {ObsRequestStatusDto} from '__types/obs/requests/ObsRequestStatusDto';
import {ObsRequestTypeEnum} from '__types/obs/requests/ObsRequestTypeEnum';
import {RequestResultPairDto} from '__types/obs/requests/RequestResultPairDto';
import {ObsOutputListItemDto} from '__types/obs/responses/outputs/ObsOutputListItemDto';

const SUCCESS: ObsRequestStatusDto = {result: true, code: 100};

const MAIN_OUTPUT: ObsOutputListItemDto = {
    outputName: 'adv_stream',
    outputKind: 'rtmp_output',
    outputActive: false,
    outputFlags: {OBS_OUTPUT_SERVICE: true},
};

const PLUGIN_OUTPUT: ObsOutputListItemDto = {
    outputName: 'multi-output',
    outputKind: 'rtmp_output',
    outputActive: false,
    outputFlags: {OBS_OUTPUT_SERVICE: true},
};

const ALWAYS_ON_OUTPUTS: ObsOutputListItemDto[] = [
    {outputName: 'virtualcam_output', outputKind: 'virtualcam_output', outputActive: true, outputFlags: {OBS_OUTPUT_SERVICE: false}},
    {outputName: 'Replay Buffer', outputKind: 'replay_buffer', outputActive: true, outputFlags: {OBS_OUTPUT_SERVICE: false}},
];

export const IDLE_OUTPUT_LIST_PAIR: RequestResultPairDto = {
    request: {requestType: ObsRequestTypeEnum.GetOutputList},
    result: {
        requestType: ObsRequestTypeEnum.GetOutputList,
        requestStatus: SUCCESS,
        responseData: {outputs: [MAIN_OUTPUT, PLUGIN_OUTPUT, ...ALWAYS_ON_OUTPUTS]},
    },
};

export const MAIN_STREAMING_OUTPUT_LIST_PAIR: RequestResultPairDto = {
    request: {requestType: ObsRequestTypeEnum.GetOutputList},
    result: {
        requestType: ObsRequestTypeEnum.GetOutputList,
        requestStatus: SUCCESS,
        responseData: {outputs: [{...MAIN_OUTPUT, outputActive: true}, PLUGIN_OUTPUT, ...ALWAYS_ON_OUTPUTS]},
    },
};

export const PLUGIN_STREAMING_OUTPUT_LIST_PAIR: RequestResultPairDto = {
    request: {requestType: ObsRequestTypeEnum.GetOutputList},
    result: {
        requestType: ObsRequestTypeEnum.GetOutputList,
        requestStatus: SUCCESS,
        responseData: {outputs: [MAIN_OUTPUT, {...PLUGIN_OUTPUT, outputActive: true}, ...ALWAYS_ON_OUTPUTS]},
    },
};

export const NOT_RECORDING_PAIR: RequestResultPairDto = {
    request: {requestType: ObsRequestTypeEnum.GetRecordStatus},
    result: {
        requestType: ObsRequestTypeEnum.GetRecordStatus,
        requestStatus: SUCCESS,
        responseData: {outputActive: false},
    },
};

export const RECORDING_PAIR: RequestResultPairDto = {
    request: {requestType: ObsRequestTypeEnum.GetRecordStatus},
    result: {
        requestType: ObsRequestTypeEnum.GetRecordStatus,
        requestStatus: SUCCESS,
        responseData: {outputActive: true},
    },
};

export const STATS_PAIR: RequestResultPairDto = {
    request: {requestType: ObsRequestTypeEnum.GetStats},
    result: {
        requestType: ObsRequestTypeEnum.GetStats,
        requestStatus: SUCCESS,
        responseData: {},
    },
};
