import {
    describe,
    expect,
    it,
} from 'vitest';

import {compareVersions} from '../compareVersions';
import {parseVersion} from '../parseVersion';

describe('parseVersion', () => {
    it('reads major, minor and patch', () => {
        expect(parseVersion('20.1.3')).toEqual({major: 20, minor: 1, patch: 3});
    });

    it('reads the OBS version with a suffix', () => {
        expect(parseVersion('31.0.0-rc1')).toEqual({major: 31, minor: 0, patch: 0});
    });

    it.each(['1.2', 'v1.2.3', '', 'abc'])('rejects %j', version => {
        expect(parseVersion(version)).toBeNull();
    });
});

describe('compareVersions', () => {
    it.each([
        ['0.2.0', '0.1.9', 1],
        ['0.10.0', '0.9.0', 1],
        ['20.1.0', '0.1.0', 1],
        ['1.0.0', '1.0.0', 0],
        ['1.2.3', '1.10.0', -1],
        ['28.0.0', '33.0.1', -1],
    ])('compares %s with %s as %d', (first, second, expected) => {
        expect(compareVersions(first, second)).toBe(expected);
    });

    it('gives null for a broken version', () => {
        expect(compareVersions('1.2', '1.2.0')).toBeNull();
    });
});
