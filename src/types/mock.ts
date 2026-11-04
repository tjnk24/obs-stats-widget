export type MockOutputStateDto = {
    bytes: number;
    totalFrames: number;
    skippedFrames: number;
    startedAt: number;
};

export type MockTargetDto = {
    outputName: string;
    server: string;
    minKbps: number;
    maxKbps: number;
};
