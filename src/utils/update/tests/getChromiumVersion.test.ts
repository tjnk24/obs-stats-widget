import {
    describe,
    expect,
    it,
} from 'vitest';

import {getChromiumVersion} from '../getChromiumVersion';

import {FIREFOX_USER_AGENT, OBS_USER_AGENT} from './consts';

describe('getChromiumVersion', () => {
    it('reads the Chromium version of the OBS browser', () => {
        expect(getChromiumVersion(OBS_USER_AGENT)).toBe(127);
    });

    it('gives null for another browser', () => {
        expect(getChromiumVersion(FIREFOX_USER_AGENT)).toBeNull();
    });
});
