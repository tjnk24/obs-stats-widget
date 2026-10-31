import {
    describe,
    expect,
    it,
} from 'vitest';

import {parseRelease} from '../parseRelease';

import {
    COMPATIBILITY,
    GITHUB_RELEASE,
    RELEASE_NOTES,
} from './consts';

describe('parseRelease', () => {
    it('reads the version, the notes and the hidden compatibility data', () => {
        expect(parseRelease(GITHUB_RELEASE)).toEqual({
            version: '0.2.0',
            url: GITHUB_RELEASE.html_url,
            notes: RELEASE_NOTES,
            publishedAt: GITHUB_RELEASE.published_at,
            compatibility: COMPATIBILITY,
        });
    });

    it('keeps fields a newer release adds to the compatibility data out of the way', () => {
        const body = `Notes\n<!-- compatibility: ${JSON.stringify({...COMPATIBILITY, minWindowsVersion: '10.0.19041'})} -->`;

        expect(parseRelease({...GITHUB_RELEASE, body})?.compatibility).toEqual(COMPATIBILITY);
    });

    it.each([
        ['without the compatibility line', 'Just notes'],
        ['with broken JSON', 'Notes <!-- compatibility: {"version": -->'],
        ['with a missing field', `Notes <!-- compatibility: ${JSON.stringify({...COMPATIBILITY, minObsVersion: undefined})} -->`],
        ['with a wrong type', `Notes <!-- compatibility: ${JSON.stringify({...COMPATIBILITY, requiredRequests: 'GetStats'})} -->`],
    ])('gives no compatibility data for a release %s', (_name, body) => {
        expect(parseRelease({...GITHUB_RELEASE, body})?.compatibility).toBeNull();
    });

    it('accepts an empty body', () => {
        expect(parseRelease({...GITHUB_RELEASE, body: null})).toMatchObject({notes: '', compatibility: null});
    });

    it.each([
        ['a tag without v', {tag_name: '0.2.0'}],
        ['a pre-release tag', {tag_name: 'v0.2.0-beta'}],
        ['a draft', {draft: true}],
        ['a pre-release', {prerelease: true}],
    ])('ignores %s', (_name, overrides) => {
        expect(parseRelease({...GITHUB_RELEASE, ...overrides})).toBeNull();
    });
});
