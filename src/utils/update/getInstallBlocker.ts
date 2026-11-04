import type {Nullable} from 'infrastructure/common';

import {UpdateInstallBlockerEnum, UpdateInstallContextDto} from '__types/update/install';
import {RUNNING_UPDATE_STAGES, UPDATE_STATUS_STALE_SEC} from '__utils/consts';

import {compareVersions} from './compareVersions';

const {
    NoRelease,
    NotNewer,
    NoUpdater,
    Incompatible,
    InProgress,
} = UpdateInstallBlockerEnum;

export const getInstallBlocker = (context: UpdateInstallContextDto): Nullable<UpdateInstallBlockerEnum> => {
    const {
        release,
        currentVersion,
        bridge,
        compatibility,
        now,
    } = context;

    if (!release) {
        return NoRelease;
    }

    if ((compareVersions(release.version, currentVersion) ?? 0) <= 0) {
        return NotNewer;
    }

    if (!bridge?.isAvailable) {
        return NoUpdater;
    }

    if (compatibility && compatibility.problems.length > 0) {
        return Incompatible;
    }

    const status = bridge.status;

    if (status && RUNNING_UPDATE_STAGES.includes(status.stage) && (now / 1000) - status.updated < UPDATE_STATUS_STALE_SEC) {
        return InProgress;
    }

    return null;
};
