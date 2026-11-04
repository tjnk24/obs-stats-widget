import type {Nullable} from 'infrastructure/common';

import {ObsRequestTypeEnum} from '__types/obs/ObsRequestTypeEnum';
import {ObsRequestDto} from '__types/obs/requests';

const {GetStreamStatus, GetOutputStatus} = ObsRequestTypeEnum;

export const isStatusRequestOf = (outputName: Nullable<string>) => ({requestType, requestData}: ObsRequestDto) => (
    outputName === null
        ? requestType === GetStreamStatus
        : requestType === GetOutputStatus && requestData?.outputName === outputName
);
