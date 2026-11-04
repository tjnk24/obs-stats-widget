import {createHash} from 'node:crypto';

import type {ObsAuthenticationDto} from '../types/obs/ObsAuthenticationDto.ts';

export const buildAuthentication = (password: string, {salt, challenge}: ObsAuthenticationDto) => {
    const secret = createHash('sha256').update(password + salt).digest('base64');

    return createHash('sha256').update(secret + challenge).digest('base64');
};
