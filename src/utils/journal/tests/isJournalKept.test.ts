import {
    describe,
    expect,
    it,
} from 'vitest';

import {isJournalKept} from '../isJournalKept';

describe('isJournalKept', () => {
    it.each([
        {isDevServer: true, isMockEnabled: true, isKept: true},
        {isDevServer: true, isMockEnabled: false, isKept: false},
        {isDevServer: false, isMockEnabled: true, isKept: false},
        {isDevServer: false, isMockEnabled: false, isKept: true},
    ])('dev server $isDevServer, mocks $isMockEnabled: $isKept', ({isDevServer, isMockEnabled, isKept}) => {
        expect(isJournalKept(isDevServer, isMockEnabled)).toBe(isKept);
    });
});
