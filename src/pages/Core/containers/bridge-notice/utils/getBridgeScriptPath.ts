import type {Nullable} from 'infrastructure/common';

import {BRIDGE_SCRIPT_NAME} from '__utils/consts';

import {DOCK_INDEX_PATH_PATTERN} from '../consts';

export const getBridgeScriptPath = (href: string): Nullable<string> => {
    const url = new URL(href);

    if (url.protocol !== 'file:') {
        return null;
    }

    const [, installDirectory] = DOCK_INDEX_PATH_PATTERN.exec(decodeURIComponent(url.pathname)) ?? [];

    return installDirectory ? `${installDirectory}/${BRIDGE_SCRIPT_NAME}`.replaceAll('/', '\\') : null;
};
