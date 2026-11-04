import {
    describe,
    expect,
    it,
} from 'vitest';

import {getBridgeScriptPath} from '../getBridgeScriptPath';

import {
    CYRILLIC_DOCK_HREF,
    CYRILLIC_SCRIPT_PATH,
    DEV_BUILD_HREF,
    DEV_SERVER_HREF,
    INSTALLED_DOCK_HREF,
    INSTALLED_SCRIPT_PATH,
    VERSIONED_DOCK_HREF,
} from './consts';

describe('getBridgeScriptPath', () => {
    it('finds the script next to the dock folder of an install', () => {
        expect(getBridgeScriptPath(INSTALLED_DOCK_HREF)).toBe(INSTALLED_SCRIPT_PATH);
    });

    it('finds the script of the install from a dock in a version folder', () => {
        expect(getBridgeScriptPath(VERSIONED_DOCK_HREF)).toBe(INSTALLED_SCRIPT_PATH);
    });

    it('decodes Cyrillic folder names', () => {
        expect(getBridgeScriptPath(CYRILLIC_DOCK_HREF)).toBe(CYRILLIC_SCRIPT_PATH);
    });

    it('gives no path for a dev build or the dev server', () => {
        expect(getBridgeScriptPath(DEV_BUILD_HREF)).toBeNull();
        expect(getBridgeScriptPath(DEV_SERVER_HREF)).toBeNull();
    });
});
