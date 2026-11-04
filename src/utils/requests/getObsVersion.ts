import type {Nullable} from 'infrastructure/common';

import {ObsRequestTypeEnum} from '__types/obs/ObsRequestTypeEnum';
import {RequestResultPairDto} from '__types/obs/requests';
import {ObsVersionDto} from '__types/obs/responses';

import {findResultData} from './findResultData';
import {isRequestOfType} from './isRequestOfType';

export const getObsVersion = (pairs: RequestResultPairDto[]): Nullable<ObsVersionDto> => {
    const data = findResultData<ObsVersionDto>(pairs, isRequestOfType(ObsRequestTypeEnum.GetVersion));

    return data
        ? {
            obsVersion: data.obsVersion,
            obsWebSocketVersion: data.obsWebSocketVersion,
            platformDescription: data.platformDescription,
            rpcVersion: data.rpcVersion,
            availableRequests: data.availableRequests,
        }
        : null;
};
