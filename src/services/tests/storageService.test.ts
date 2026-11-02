import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    vi,
} from 'vitest';

import {
    LEGACY_PASSWORD_KEY,
    NEWER_PASSWORD,
    PASSWORD_KEY,
    SAVED_PASSWORD,
} from './consts';

const items = new Map<string, string>();

describe('storageService', () => {
    beforeEach(() => {
        items.clear();
        vi.resetModules();
        vi.stubGlobal('localStorage', {
            getItem: (key: string) => items.get(key) ?? null,
            setItem: (key: string, value: string) => items.set(key, value),
            removeItem: (key: string) => items.delete(key),
        });
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('moves the password saved under the old name', async () => {
        items.set(LEGACY_PASSWORD_KEY, SAVED_PASSWORD);

        const {storageService} = await import('../storageService');

        expect(storageService.loadPassword()).toBe(SAVED_PASSWORD);
        expect(items.has(LEGACY_PASSWORD_KEY)).toBe(false);
    });

    it('keeps a password already saved under the new name', async () => {
        items.set(LEGACY_PASSWORD_KEY, SAVED_PASSWORD);
        items.set(PASSWORD_KEY, NEWER_PASSWORD);

        const {storageService} = await import('../storageService');

        expect(storageService.loadPassword()).toBe(NEWER_PASSWORD);
        expect(items.has(LEGACY_PASSWORD_KEY)).toBe(false);
    });
});
