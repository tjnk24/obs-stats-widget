import type {Nullable} from 'infrastructure/common';

import {UpdateInstallBlockerEnum} from '__types/update/UpdateInstallBlockerEnum';
import {UpdateInstallContextDto} from '__types/update/UpdateInstallContextDto';
import {UPDATE_STATUS_STALE_SEC} from '__utils/consts';
import {RUNNING_UPDATE_STAGES} from '__utils/consts';

import {compareVersions} from './compareVersions';

export const getInstallBlocker = (context: UpdateInstallContextDto): Nullable<UpdateInstallBlockerEnum> => {
    const {release, currentVersion, bridge, compatibility, isObsBusy, now} = context;

    if (!release) {
        return UpdateInstallBlockerEnum.NoRelease;
    }

    if ((compareVersions(release.version, currentVersion) ?? 0) <= 0) {
        return UpdateInstallBlockerEnum.NotNewer;
    }

    if (!bridge?.isAvailable) {
        return UpdateInstallBlockerEnum.NoUpdater;
    }

    if (compatibility && compatibility.problems.length > 0) {
        return UpdateInstallBlockerEnum.Incompatible;
    }

    const status = bridge.status;

    if (status && RUNNING_UPDATE_STAGES.includes(status.stage) && (now / 1000) - status.updated < UPDATE_STATUS_STALE_SEC) {
        return UpdateInstallBlockerEnum.InProgress;
    }

    if (isObsBusy) {
        return UpdateInstallBlockerEnum.ObsBusy;
    }

    return null;
};
