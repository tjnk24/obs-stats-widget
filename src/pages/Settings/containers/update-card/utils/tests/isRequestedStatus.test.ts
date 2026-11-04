import {
    describe,
    expect,
    it,
} from 'vitest';

import {isRequestedStatus} from '../isRequestedStatus';

import {
    FRESH_DONE_STATUS,
    REQUEST,
    REQUESTED_AT,
} from './consts';

describe('isRequestedStatus', () => {
    it('accepts a status of the requested version written after the request', () => {
        expect(isRequestedStatus(FRESH_DONE_STATUS, REQUEST)).toBe(true);
    });

    it('accepts a status written a moment before the request because of second rounding', () => {
        expect(isRequestedStatus({...FRESH_DONE_STATUS, updated: (REQUESTED_AT - 1_000) / 1000}, REQUEST)).toBe(true);
    });

    it('rejects a status left from an earlier update of the same version', () => {
        expect(isRequestedStatus({...FRESH_DONE_STATUS, updated: (REQUESTED_AT - 3_600_000) / 1000}, REQUEST)).toBe(false);
    });

    it('rejects a status of another version', () => {
        expect(isRequestedStatus({...FRESH_DONE_STATUS, version: '0.3.0'}, REQUEST)).toBe(false);
    });

    it('rejects when there is no status or no request', () => {
        expect(isRequestedStatus(null, REQUEST)).toBe(false);
        expect(isRequestedStatus(FRESH_DONE_STATUS, null)).toBe(false);
    });
});
