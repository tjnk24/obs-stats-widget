import {MockOutputStateDto} from '__types/mock';

export const createMockOutput = (startedAt: number): MockOutputStateDto => ({
    bytes: 0,
    totalFrames: 0,
    skippedFrames: 0,
    startedAt,
});
