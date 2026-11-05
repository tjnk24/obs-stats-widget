import type {Nullable} from 'infrastructure/common';

import {ObsRequestTypeEnum} from '__types/obs/ObsRequestTypeEnum';
import {RequestResultPairDto} from '__types/obs/requests';
import {ObsRecordStatusDto} from '__types/obs/responses';

import {findResultData} from './findResultData';
import {isRequestOfType} from './isRequestOfType';

export const getIsRecording = (pairs: RequestResultPairDto[]): Nullable<boolean> => (
    findResultData<ObsRecordStatusDto>(pairs, isRequestOfType(ObsRequestTypeEnum.GetRecordStatus))?.outputActive ?? null
);
