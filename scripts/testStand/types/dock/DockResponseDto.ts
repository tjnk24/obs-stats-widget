import type {DockResponseResultDto} from './DockResponseResultDto.ts';

export type DockResponseDto = {
    id: number;
    result: DockResponseResultDto;
    error?: Error;
};
