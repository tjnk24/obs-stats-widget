export type DockCommandDto = {
    method: string;
    params: Record<string, unknown>;
};

export type DockTargetDto = {
    type: string;
    url: string;
    webSocketDebuggerUrl: string;
};

type DockEvaluationDto = {
    value?: unknown;
    description?: string;
};

type DockExceptionDto = {
    text: string;
};

export type DockResponseResultDto = {
    data?: string;
    result?: DockEvaluationDto;
    exceptionDetails?: DockExceptionDto;
};

export type DockResponseDto = {
    id: number;
    result: DockResponseResultDto;
    error?: Error;
};
