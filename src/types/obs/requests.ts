export type ObsRequestDto = {
    requestType: string;
    requestData?: Record<string, unknown>;
};

type ObsRequestStatusDto = {
    result: boolean;
    code: number;
    comment?: string;
};

export type ObsRequestResultDto<T = unknown> = {
    requestType: string;
    requestStatus: ObsRequestStatusDto;
    responseData?: T;
};

export type RequestResultPairDto = {
    request: ObsRequestDto;
    result?: ObsRequestResultDto;
};

export type ProfileParameterKeyDto = {
    parameterCategory: string;
    parameterName: string;
};
