import {
    describe,
    expect,
    it,
} from 'vitest';

import {isJournalWritten} from '../isJournalWritten';

describe('isJournalWritten', () => {
    it.each([
        {isDevServer: true, isMockEnabled: true, isInObs: false, isWritten: true},
        {isDevServer: true, isMockEnabled: false, isInObs: false, isWritten: false},
        {isDevServer: false, isMockEnabled: true, isInObs: true, isWritten: false},
        {isDevServer: false, isMockEnabled: false, isInObs: true, isWritten: true},
        {isDevServer: false, isMockEnabled: false, isInObs: false, isWritten: false},
    ])('dev server $isDevServer, mocks $isMockEnabled, in OBS $isInObs: $isWritten', ({isDevServer, isMockEnabled, isInObs, isWritten}) => {
        expect(isJournalWritten(isDevServer, isMockEnabled, isInObs)).toBe(isWritten);
    });
});
