import {
    describe,
    expect,
    it,
} from 'vitest';

import {getJournalFolderBlockerKey} from '../getJournalFolderBlockerKey';

import {BRIDGE} from './consts';

describe('getJournalFolderBlockerKey', () => {
    it('allows the button in OBS with a fresh bridge', () => {
        expect(getJournalFolderBlockerKey(false, false, true, BRIDGE)).toBeNull();
    });

    it('allows the button on the development server with mocks, without a bridge', () => {
        expect(getJournalFolderBlockerKey(true, true, false, null)).toBeNull();
    });

    it('asks for mocks on the development server', () => {
        expect(getJournalFolderBlockerKey(true, false, false, BRIDGE)).toBe('settings.journalFolderDevServer');
    });

    it('names mock mode', () => {
        expect(getJournalFolderBlockerKey(false, true, true, BRIDGE)).toBe('settings.journalFolderMock');
    });

    it('names a dock opened outside OBS', () => {
        expect(getJournalFolderBlockerKey(false, false, false, BRIDGE)).toBe('settings.journalFolderBrowser');
    });

    it('names the bridge when it is missing or too old', () => {
        expect(getJournalFolderBlockerKey(false, false, true, null)).toBe('settings.journalFolderBridge');
        expect(getJournalFolderBlockerKey(false, false, true, {...BRIDGE, bridgeVersion: 4})).toBe('settings.journalFolderBridge');
    });
});
