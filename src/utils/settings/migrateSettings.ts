import isPlainObject from 'lodash/isPlainObject';

import {MigratedSettingsDto} from '__types/app/MigratedSettingsDto';
import {SettingsDto} from '__types/app/SettingsDto';
import {SettingsMigrationDto} from '__types/app/SettingsMigrationDto';
import {StoredSettingsDto} from '__types/app/StoredSettingsDto';
import {DEFAULT_SETTINGS, SETTINGS_VERSION} from '__utils/consts';

import {SETTINGS_MIGRATIONS} from './settingsMigrations';

const FIRST_SETTINGS_VERSION = 1;

const DISCARDED: MigratedSettingsDto = {settings: DEFAULT_SETTINGS, isDiscarded: true, isChanged: true};

export const migrateSettings = (
    stored: unknown,
    migrations: SettingsMigrationDto[] = SETTINGS_MIGRATIONS,
    currentVersion: number = SETTINGS_VERSION,
): MigratedSettingsDto => {
    if (stored === null || stored === undefined) {
        return {settings: DEFAULT_SETTINGS, isDiscarded: false, isChanged: false};
    }

    if (!isPlainObject(stored)) {
        return DISCARDED;
    }

    const storedSettings = stored as StoredSettingsDto;
    const storedVersion = storedSettings.settingsVersion ?? FIRST_SETTINGS_VERSION;

    if (typeof storedVersion !== 'number' || !Number.isInteger(storedVersion) || storedVersion < FIRST_SETTINGS_VERSION || storedVersion > currentVersion) {
        return DISCARDED;
    }

    let settings = storedSettings;

    for (let version = storedVersion; version < currentVersion; version++) {
        const migration = migrations.find(({fromVersion}) => fromVersion === version);

        if (!migration) {
            return DISCARDED;
        }

        settings = migration.migrate(settings);
    }

    return {
        settings: {...DEFAULT_SETTINGS, ...settings as Partial<SettingsDto>, settingsVersion: currentVersion},
        isDiscarded: false,
        isChanged: storedSettings.settingsVersion !== currentVersion,
    };
};
