import {
    describe,
    expect,
    it,
} from 'vitest';

import {parseUpdateStatus} from '../parseUpdateStatus';

import {UPDATE_STATUS} from './consts';

describe('parseUpdateStatus', () => {
    it('reads the status the updater writes', () => {
        expect(parseUpdateStatus(JSON.stringify(UPDATE_STATUS))).toEqual(UPDATE_STATUS);
    });

    it('reads a failed status with an error code', () => {
        const failed = {...UPDATE_STATUS, stage: 'failed', error: 'signature'};

        expect(parseUpdateStatus(JSON.stringify(failed))).toEqual(failed);
    });

    it.each([
        ['nothing', null],
        ['an empty string', ''],
        ['broken JSON', '{"stage":'],
        ['an unknown stage', JSON.stringify({...UPDATE_STATUS, stage: 'rebooting'})],
        ['a missing version', JSON.stringify({...UPDATE_STATUS, version: undefined})],
        ['a text percent', JSON.stringify({...UPDATE_STATUS, percent: '42'})],
        ['an array', '[]'],
    ])('gives null for %s', (_name, raw) => {
        expect(parseUpdateStatus(raw)).toBeNull();
    });
});
