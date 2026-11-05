import {
    describe,
    expect,
    it,
} from 'vitest';

import {OutputOriginEnum} from '__types/targets';

import {getJournalTargetLabel} from '../getJournalTargetLabel';

import {TARGET} from './consts';

describe('getJournalTargetLabel', () => {
    it('never shows the host of an unknown server', () => {
        expect(getJournalTargetLabel(TARGET)).toBe('Main');
    });

    it('names a plugin output of an unknown server by the output', () => {
        expect(getJournalTargetLabel({...TARGET, origin: OutputOriginEnum.Plugin, outputName: 'multi-output'})).toBe('multi-output');
    });

    it('names a known platform', () => {
        expect(getJournalTargetLabel({...TARGET, platform: {title: 'Twitch', color: '#000', isKnown: true}})).toBe('Twitch');
    });
});
