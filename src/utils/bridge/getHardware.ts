import type {Nullable} from 'infrastructure/common';

import {HardwareDto} from '__types/bridge/HardwareDto';
import {ObsRequestTypeEnum} from '__types/obs/requests/ObsRequestTypeEnum';
import {RequestResultPairDto} from '__types/obs/requests/RequestResultPairDto';
import {ObsProfileParameterDto} from '__types/obs/responses/ObsProfileParameterDto';
import {findResultData} from '__utils/requests/findResultData';
import {isRequestOfType} from '__utils/requests/isRequestOfType';

import {parseBridgeData} from './parseBridgeData';

export const getHardware = (pairs: RequestResultPairDto[], sceneCollection: Nullable<string>): HardwareDto => {
    const parameter = findResultData<ObsProfileParameterDto>(pairs, isRequestOfType(ObsRequestTypeEnum.GetProfileParameter));
    const bridgeData = parseBridgeData(parameter, sceneCollection);

    return {
        gpu: bridgeData?.gpu ?? null,
        systemMemory: bridgeData?.systemMemory ?? null,
    };
};
