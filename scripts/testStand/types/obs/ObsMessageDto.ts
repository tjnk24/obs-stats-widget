import type {ObsMessageDataDto} from './ObsMessageDataDto.ts';

export type ObsMessageDto = {
    op: number;
    d: ObsMessageDataDto;
};
