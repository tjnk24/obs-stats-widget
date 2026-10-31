import type {Nullable} from 'infrastructure/common';

import {CHROMIUM_PATTERN} from '__utils/consts';

export const getChromiumVersion = (userAgent: string): Nullable<number> => {
    const match = CHROMIUM_PATTERN.exec(userAgent);

    return match ? Number(match[1]) : null;
};
