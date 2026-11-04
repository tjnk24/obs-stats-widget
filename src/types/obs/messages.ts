import {ObsRequestDto} from './requests';

export enum ObsOpCodeEnum {
    Hello = 0,
    Identify = 1,
    Identified = 2,
    Event = 5,
    RequestBatch = 8,
    RequestBatchResponse = 9,
};

export type ObsMessageDto = {
    op: ObsOpCodeEnum;
    d: any;
};

export enum ObsEventTypeEnum {
    CurrentSceneCollectionChanging = 'CurrentSceneCollectionChanging',
    CurrentSceneCollectionChanged = 'CurrentSceneCollectionChanged',
}

export type ObsSceneCollectionEventDto = {
    sceneCollectionName: string;
};

export type InFlightBatchDto = {
    id: string;
    since: number;
    requests: ObsRequestDto[];
};
