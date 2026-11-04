import type {DockEvaluationDto} from './DockEvaluationDto.ts';
import type {DockExceptionDto} from './DockExceptionDto.ts';

export type DockResponseResultDto = {
    data?: string;
    result?: DockEvaluationDto;
    exceptionDetails?: DockExceptionDto;
};
