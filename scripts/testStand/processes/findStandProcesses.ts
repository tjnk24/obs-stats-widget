import {spawnSync} from 'node:child_process';

import {
    FIND_STAND_PROCESSES_SCRIPT,
    POWERSHELL_ARGUMENTS,
    STAND_DIRECTORY,
} from '../consts.ts';
import type {StandProcessDto} from '../types/StandProcessDto.ts';

export const findStandProcesses = (): StandProcessDto[] => {
    const search = spawnSync('powershell.exe', [...POWERSHELL_ARGUMENTS, '-Command', FIND_STAND_PROCESSES_SCRIPT], {
        env: {...process.env, STAND_DIRECTORY},
        encoding: 'utf8',
    });

    return search.stdout
        .split(/\r?\n/)
        .filter(line => line.trim() !== '')
        .map(line => {
            const [id, name] = line.trim().split(' ');

            return {id: Number(id), name};
        });
};
