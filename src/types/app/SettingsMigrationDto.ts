import {StoredSettingsDto} from './StoredSettingsDto';

export type SettingsMigrationDto = {
    fromVersion: number;
    migrate: (settings: StoredSettingsDto) => StoredSettingsDto;
};
