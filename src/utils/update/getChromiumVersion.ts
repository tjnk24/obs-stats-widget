import type {Nullable} from 'infrastructure/common';

const CHROMIUM_PATTERN = /Chrome\/(\d+)\./;

export const getChromiumVersion = (userAgent: string): Nullable<number> => {
    const match = CHROMIUM_PATTERN.exec(userAgent);

    return match ? Number(match[1]) : null;
};
