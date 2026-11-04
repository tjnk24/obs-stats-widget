import {MockOutputStateDto} from '__types/mock';
import {ObsOutputStatusDto} from '__types/obs/responses';

import {formatMockTimecode} from './formatMockTimecode';

export const buildMockOutputStatus = (
    output: MockOutputStateDto,
    now: number,
    congestion: number,
    isReconnecting: boolean,
): ObsOutputStatusDto => {
    const seconds = (now - output.startedAt) / 1000;

    return {
        outputActive: true,
        outputReconnecting: isReconnecting,
        outputTimecode: formatMockTimecode(seconds),
        outputDuration: Math.round(seconds * 1000),
        outputCongestion: congestion,
        outputBytes: output.bytes,
        outputSkippedFrames: output.skippedFrames,
        outputTotalFrames: output.totalFrames,
    };
};
