import {
    describe,
    expect,
    it,
} from 'vitest';

import {DEFAULT_SETTINGS} from '__utils/consts';

import {migrateSettings} from '../migrateSettings';

import {MIGRATIONS} from './consts';

describe('migrateSettings', () => {
    it('gives defaults when nothing is stored', () => {
        expect(migrateSettings(null)).toEqual({settings: DEFAULT_SETTINGS, isDiscarded: false, isChanged: false});
    });

    it('treats settings without a version as version 1 and adds the version', () => {
        const result = migrateSettings({port: 4460, isShowGeneralCard: false});

        expect(result.settings).toEqual({...DEFAULT_SETTINGS, port: 4460, isShowGeneralCard: false, settingsVersion: 1});
        expect(result.isChanged).toBe(true);
        expect(result.isDiscarded).toBe(false);
    });

    it('keeps current settings as they are', () => {
        const stored = {...DEFAULT_SETTINGS, port: 4470};

        expect(migrateSettings(stored)).toEqual({settings: stored, isDiscarded: false, isChanged: false});
    });

    it('runs every migration in order, whatever order they are listed in', () => {
        const result = migrateSettings({settingsVersion: 1, obsPort: 4480, showCard: false}, MIGRATIONS, 3);

        expect(result.settings).toMatchObject({settingsVersion: 3, port: 4480, cardMode: 'hidden'});
        expect(result.settings).not.toHaveProperty('obsPort');
        expect(result.settings).not.toHaveProperty('showCard');
        expect(result.isChanged).toBe(true);
    });

    it('starts from the stored version', () => {
        const result = migrateSettings({settingsVersion: 2, port: 4490, showCard: true}, MIGRATIONS, 3);

        expect(result.settings).toMatchObject({settingsVersion: 3, port: 4490, cardMode: 'full'});
    });

    it.each([
        ['a string', 'settings'],
        ['an array', [1, 2]],
        ['a version from the future', {settingsVersion: 99}],
        ['a broken version', {settingsVersion: 'two'}],
        ['a version below 1', {settingsVersion: 0}],
    ])('discards %s and gives defaults', (_name, stored) => {
        expect(migrateSettings(stored)).toEqual({settings: DEFAULT_SETTINGS, isDiscarded: true, isChanged: true});
    });

    it('discards settings when a migration is missing', () => {
        expect(migrateSettings({settingsVersion: 1}, [MIGRATIONS[0]], 3).isDiscarded).toBe(true);
    });
});
