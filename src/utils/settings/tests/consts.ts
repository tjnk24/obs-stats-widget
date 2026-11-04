import {SettingsMigrationDto} from '__types/app/settings';

export const MIGRATIONS: SettingsMigrationDto[] = [
    {
        fromVersion: 2,
        migrate: ({showCard, ...settings}) => ({...settings, cardMode: showCard === false ? 'hidden' : 'full'}),
    },
    {
        fromVersion: 1,
        migrate: ({obsPort, ...settings}) => ({...settings, port: obsPort}),
    },
];
