import type {Nullable} from 'infrastructure/common';

import {parseVersion} from './parseVersion';

export const compareVersions = (first: string, second: string): Nullable<number> => {
    const firstVersion = parseVersion(first);
    const secondVersion = parseVersion(second);

    if (!firstVersion || !secondVersion) {
        return null;
    }

    return Math.sign(firstVersion.major - secondVersion.major)
        || Math.sign(firstVersion.minor - secondVersion.minor)
        || Math.sign(firstVersion.patch - secondVersion.patch);
};
