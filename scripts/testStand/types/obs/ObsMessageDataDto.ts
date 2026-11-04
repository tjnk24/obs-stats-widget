import type {ObsAuthenticationDto} from './ObsAuthenticationDto.ts';
import type {ObsRequestStatusDto} from './ObsRequestStatusDto.ts';

export type ObsMessageDataDto = {
    authentication?: ObsAuthenticationDto;
    requestStatus?: ObsRequestStatusDto;
    responseData?: Record<string, unknown>;
};
