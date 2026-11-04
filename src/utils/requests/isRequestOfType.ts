import {ObsRequestDto} from '__types/obs/requests';

export const isRequestOfType = (requestType: string) => (request: ObsRequestDto) => request.requestType === requestType;
