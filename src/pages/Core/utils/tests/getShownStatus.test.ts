import {
    describe,
    expect,
    it,
} from 'vitest';

import {getShownStatus} from '../getShownStatus';

import {
    BRIDGE,
    FAILED_STATUS,
    NOW,
    OLD_FAILED_STATUS,
    REQUEST,
    RUNNING_STATUS,
    STALE_RUNNING_STATUS,
} from './consts';

describe('getShownStatus', () => {
    it('shows nothing without a bridge status', () => {
        expect(getShownStatus(null, REQUEST, NOW)).toBeNull();
        expect(getShownStatus(BRIDGE, REQUEST, NOW)).toBeNull();
    });

    it('shows the result of the requested update', () => {
        expect(getShownStatus({...BRIDGE, status: FAILED_STATUS}, REQUEST, NOW)).toEqual(FAILED_STATUS);
    });

    it('hides a result left from an earlier attempt', () => {
        expect(getShownStatus({...BRIDGE, status: OLD_FAILED_STATUS}, REQUEST, NOW)).toBeNull();
    });

    it('hides a result of another version', () => {
        expect(getShownStatus({...BRIDGE, status: FAILED_STATUS}, {...REQUEST, version: '0.3.0'}, NOW)).toBeNull();
    });

    it('hides a finished result nobody requested', () => {
        expect(getShownStatus({...BRIDGE, status: FAILED_STATUS}, null, NOW)).toBeNull();
    });

    it('shows a running update even when this dock did not request it', () => {
        expect(getShownStatus({...BRIDGE, status: RUNNING_STATUS}, null, NOW)).toEqual(RUNNING_STATUS);
    });

    it('hides a running update that stopped reporting', () => {
        expect(getShownStatus({...BRIDGE, status: STALE_RUNNING_STATUS}, null, NOW)).toBeNull();
    });
});
