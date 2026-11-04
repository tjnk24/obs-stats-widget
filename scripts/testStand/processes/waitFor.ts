import {setTimeout as sleep} from 'node:timers/promises';

import {POLL_INTERVAL_MS} from '../consts.ts';

export const waitFor = async <Result>(description: string, check: () => Promise<Result> | Result, timeoutMs: number) => {
    const deadline = Date.now() + timeoutMs;
    let lastError: unknown = null;

    while (Date.now() < deadline) {
        try {
            const result = await check();

            if (result) {
                return result;
            }
        } catch (error) {
            lastError = error;
        }

        await sleep(POLL_INTERVAL_MS);
    }

    throw new Error(`Timed out waiting for ${description}${lastError ? `: ${String(lastError)}` : ''}`);
};
