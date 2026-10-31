import type {Nullable} from 'infrastructure/common';

import {ObsRequestTypeEnum} from '__types/obs/requests/ObsRequestTypeEnum';
import {RequestResultPairDto} from '__types/obs/requests/RequestResultPairDto';
import {ObsProfileParameterDto} from '__types/obs/responses/ObsProfileParameterDto';
import {BridgeUpdateStateDto} from '__types/update/bridge/BridgeUpdateStateDto';
import {FIRST_BRIDGE_VERSION} from '__utils/consts';
import {findResultData} from '__utils/requests/findResultData';
import {isRequestOfType} from '__utils/requests/isRequestOfType';

import {parseBridgeData} from './parseBridgeData';
import {parseUpdateStatus} from './parseUpdateStatus';

export const getBridgeUpdate = (pairs: RequestResultPairDto[]): Nullable<BridgeUpdateStateDto> => {
    const bridgeData = parseBridgeData(findResultData<ObsProfileParameterDto>(pairs, isRequestOfType(ObsRequestTypeEnum.GetProfileParameter)));

    if (!bridgeData) {
        return null;
    }

    return {
        isAvailable: bridgeData.update?.available === true,
        bridgeVersion: bridgeData.bridgeVersion ?? FIRST_BRIDGE_VERSION,
        status: parseUpdateStatus(bridgeData.update?.status ?? null),
    };
};
