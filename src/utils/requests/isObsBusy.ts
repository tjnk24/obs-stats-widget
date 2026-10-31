import type {Nullable} from 'infrastructure/common';

import {ObsRequestTypeEnum} from '__types/obs/requests/ObsRequestTypeEnum';
import {RequestResultPairDto} from '__types/obs/requests/RequestResultPairDto';
import {ObsRecordStatusDto} from '__types/obs/responses/ObsRecordStatusDto';
import {ObsOutputListDto} from '__types/obs/responses/outputs/ObsOutputListDto';
import {SERVICE_OUTPUT_FLAG} from '__utils/consts';

import {findResultData} from './findResultData';
import {isRequestOfType} from './isRequestOfType';

export const isObsBusy = (pairs: RequestResultPairDto[]): Nullable<boolean> => {
    const outputList = findResultData<ObsOutputListDto>(pairs, isRequestOfType(ObsRequestTypeEnum.GetOutputList));
    const recordStatus = findResultData<ObsRecordStatusDto>(pairs, isRequestOfType(ObsRequestTypeEnum.GetRecordStatus));

    if (!outputList && !recordStatus) {
        return null;
    }

    const isStreaming = (outputList?.outputs ?? []).some(({outputActive, outputFlags}) => (
        outputActive && outputFlags?.[SERVICE_OUTPUT_FLAG] === true
    ));

    return isStreaming || recordStatus?.outputActive === true;
};
