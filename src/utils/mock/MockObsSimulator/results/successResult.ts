import {ObsRequestResultDto} from '__types/obs/requests';

export const successResult = (requestType: string, responseData: unknown): ObsRequestResultDto => ({
    requestType,
    requestStatus: {result: true, code: 100},
    responseData,
});
