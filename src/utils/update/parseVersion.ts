import type {Nullable} from 'infrastructure/common';

import {VersionDto} from '__types/update/VersionDto';

const VERSION_PATTERN = /^(\d+)\.(\d+)\.(\d+)/;

export const parseVersion = (version: string): Nullable<VersionDto> => {
    const match = VERSION_PATTERN.exec(version);

    if (!match) {
        return null;
    }

    return {major: Number(match[1]), minor: Number(match[2]), patch: Number(match[3])};
};
