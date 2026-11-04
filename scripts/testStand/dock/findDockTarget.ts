import {STAND_DEBUG_PORT} from '../consts.ts';
import type {DockTargetDto} from '../types/dock/DockTargetDto.ts';

export const findDockTarget = async () => {
    const response = await fetch(`http://127.0.0.1:${STAND_DEBUG_PORT}/json/list`);
    const targets = await response.json() as DockTargetDto[];

    return targets.find(({url, type}) => type === 'page' && url.includes('/dock/index.html')) ?? null;
};
