import type {Nullable} from 'infrastructure/common';

import {ObsRequestTypeEnum} from '__types/obs/ObsRequestTypeEnum';
import {RequestResultPairDto} from '__types/obs/requests';
import {ObsSceneCollectionListDto} from '__types/obs/responses';

import {findResultData} from './findResultData';
import {isRequestOfType} from './isRequestOfType';

export const getSceneCollection = (pairs: RequestResultPairDto[]): Nullable<string> => {
    const list = findResultData<ObsSceneCollectionListDto>(pairs, isRequestOfType(ObsRequestTypeEnum.GetSceneCollectionList));

    return typeof list?.currentSceneCollectionName === 'string' ? list.currentSceneCollectionName : null;
};
