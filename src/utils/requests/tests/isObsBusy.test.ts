import {
    describe,
    expect,
    it,
} from 'vitest';

import {isObsBusy} from '../isObsBusy';

import {
    IDLE_OUTPUT_LIST_PAIR,
    MAIN_STREAMING_OUTPUT_LIST_PAIR,
    NOT_RECORDING_PAIR,
    PLUGIN_STREAMING_OUTPUT_LIST_PAIR,
    RECORDING_PAIR,
    STATS_PAIR,
} from './consts';

describe('isObsBusy', () => {
    it('is free when only the virtual camera and the replay buffer run', () => {
        expect(isObsBusy([IDLE_OUTPUT_LIST_PAIR, NOT_RECORDING_PAIR])).toBe(false);
    });

    it.each([
        ['the main output', MAIN_STREAMING_OUTPUT_LIST_PAIR],
        ['a plugin output', PLUGIN_STREAMING_OUTPUT_LIST_PAIR],
    ])('is busy while %s streams', (_name, outputListPair) => {
        expect(isObsBusy([outputListPair, NOT_RECORDING_PAIR])).toBe(true);
    });

    it('is busy while recording', () => {
        expect(isObsBusy([IDLE_OUTPUT_LIST_PAIR, RECORDING_PAIR])).toBe(true);
    });

    it('knows nothing from a batch without the output list and the record status', () => {
        expect(isObsBusy([STATS_PAIR])).toBeNull();
    });
});
