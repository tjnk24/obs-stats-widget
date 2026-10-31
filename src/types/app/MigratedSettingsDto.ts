import {SettingsDto} from './SettingsDto';

export type MigratedSettingsDto = {
    settings: SettingsDto;
    isDiscarded: boolean;
    isChanged: boolean;
};
