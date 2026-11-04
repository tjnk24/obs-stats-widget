import {
    describe,
    expect,
    it,
} from 'vitest';

import {UpdateStageEnum} from '__types/update/bridge/UpdateStageEnum';
import {CompatibilityProblemEnum} from '__types/update/compatibility/CompatibilityProblemEnum';
import {UpdateInstallBlockerEnum} from '__types/update/UpdateInstallBlockerEnum';

import {getInstallBlocker} from '../getInstallBlocker';

import {
    BRIDGE_UPDATE_STATE,
    INSTALL_CONTEXT,
    RUNNING_UPDATE_STATUS,
} from './consts';

describe('getInstallBlocker', () => {
    it('lets a newer compatible release install', () => {
        expect(getInstallBlocker(INSTALL_CONTEXT)).toBeNull();
    });

    it.each([
        ['there is no release', {release: null}, UpdateInstallBlockerEnum.NoRelease],
        ['the release is the current version', {currentVersion: '0.2.0'}, UpdateInstallBlockerEnum.NotNewer],
        ['the release is older', {currentVersion: '1.0.0'}, UpdateInstallBlockerEnum.NotNewer],
        ['the bridge is missing', {bridge: null}, UpdateInstallBlockerEnum.NoUpdater],
        ['the bridge has no updater', {bridge: {...BRIDGE_UPDATE_STATE, isAvailable: false}}, UpdateInstallBlockerEnum.NoUpdater],
        ['the release does not fit OBS', {compatibility: {problems: [CompatibilityProblemEnum.ObsTooOld], warnings: []}}, UpdateInstallBlockerEnum.Incompatible],
        ['an update is running', {bridge: {...BRIDGE_UPDATE_STATE, status: RUNNING_UPDATE_STATUS}}, UpdateInstallBlockerEnum.InProgress],
    ])('refuses when %s', (_name, context, blocker) => {
        expect(getInstallBlocker({...INSTALL_CONTEXT, ...context})).toBe(blocker);
    });

    it('does not wait for an update status that stopped changing', () => {
        const staleStatus = {...RUNNING_UPDATE_STATUS, updated: RUNNING_UPDATE_STATUS.updated - 600};

        expect(getInstallBlocker({...INSTALL_CONTEXT, bridge: {...BRIDGE_UPDATE_STATE, status: staleStatus}})).toBeNull();
    });

    it('lets a failed update be tried again', () => {
        const failedStatus = {...RUNNING_UPDATE_STATUS, stage: UpdateStageEnum.Failed, error: 'network'};

        expect(getInstallBlocker({...INSTALL_CONTEXT, bridge: {...BRIDGE_UPDATE_STATE, status: failedStatus}})).toBeNull();
    });
});
