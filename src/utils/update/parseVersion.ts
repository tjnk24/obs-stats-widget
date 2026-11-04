import type {Nullable} from 'infrastructure/common';

import {VersionDto} from '__types/update/release';
import {VERSION_PATTERN} from '__utils/consts';

export const parseVersion = (version: string): Nullable<VersionDto> => {
    const match = VERSION_PATTERN.exec(version);

    if (!match) {
        return null;
    }

    return {major: Number(match[1]), minor: Number(match[2]), patch: Number(match[3])};
};
