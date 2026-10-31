import {
    describe,
    expect,
    it,
} from 'vitest';

import {CompatibilityProblemEnum} from '__types/update/compatibility/CompatibilityProblemEnum';
import {CompatibilityWarningEnum} from '__types/update/compatibility/CompatibilityWarningEnum';

import {checkCompatibility} from '../checkCompatibility';

import {COMPATIBILITY, ENVIRONMENT} from './consts';

describe('checkCompatibility', () => {
    it('finds nothing when everything fits', () => {
        expect(checkCompatibility(COMPATIBILITY, ENVIRONMENT)).toEqual({problems: [], warnings: []});
    });

    it.each([
        ['OBS is too old', {obsVersion: '29.1.3'}, CompatibilityProblemEnum.ObsTooOld],
        ['the obs-websocket protocol differs', {rpcVersion: 2}, CompatibilityProblemEnum.RpcMismatch],
        ['obs-websocket lacks a request', {availableRequests: ['GetStats']}, CompatibilityProblemEnum.RequestsMissing],
        ['the OBS browser is too old', {chromiumVersion: 103}, CompatibilityProblemEnum.ChromiumTooOld],
    ])('blocks the update when %s', (_name, environment, problem) => {
        expect(checkCompatibility(COMPATIBILITY, {...ENVIRONMENT, ...environment}).problems).toEqual([problem]);
    });

    it('accepts the minimum OBS version itself', () => {
        expect(checkCompatibility(COMPATIBILITY, {...ENVIRONMENT, obsVersion: '30.0.0'}).problems).toEqual([]);
    });

    it('skips checks it has no data for', () => {
        const unknown = {...ENVIRONMENT, obsVersion: null, rpcVersion: null, availableRequests: null, chromiumVersion: null, bridgeVersion: null};

        expect(checkCompatibility(COMPATIBILITY, unknown)).toEqual({problems: [], warnings: []});
    });

    it('warns about a major update', () => {
        expect(checkCompatibility({...COMPATIBILITY, version: '1.0.0'}, ENVIRONMENT).warnings).toEqual([CompatibilityWarningEnum.MajorUpdate]);
        expect(checkCompatibility({...COMPATIBILITY, version: '20.1.0'}, ENVIRONMENT).warnings).toEqual([CompatibilityWarningEnum.MajorUpdate]);
    });

    it('warns that OBS must be restarted for an older bridge', () => {
        expect(checkCompatibility(COMPATIBILITY, {...ENVIRONMENT, bridgeVersion: 1}).warnings).toEqual([CompatibilityWarningEnum.BridgeRestart]);
    });
});
