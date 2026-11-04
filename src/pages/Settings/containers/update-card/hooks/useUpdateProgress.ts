import {useSelector} from 'react-redux';

import {updateSelector} from '__selectors/updateSelectors';
import {UpdateErrorEnum} from '__types/update/bridge/UpdateErrorEnum';
import {UpdateStageEnum} from '__types/update/bridge/UpdateStageEnum';
import {UPDATE_STATUS_STALE_SEC} from '__utils/consts';
import {compareVersions} from '__utils/update/compareVersions';

import {
    NO_UPDATE_PROGRESS,
    UPDATE_BRIDGE_RESPONSE_TIMEOUT_MS,
    UPDATE_ERROR_TEXTS,
    UPDATE_STAGE_TEXTS,
} from '../consts';
import {UpdateProgressDto} from '../types';
import {isRequestedStatus} from '../utils/isRequestedStatus';

const {Done, Failed} = UpdateStageEnum;

export const useUpdateProgress = (): UpdateProgressDto => {
    const {bridge, request} = useSelector(updateSelector);

    const now = Date.now();

    const currentVersion = process.env.APP_VERSION;

    const status = bridge?.status ?? null;

    const rolledBackVersion = bridge?.rolledBackVersion ?? null;

    if (request === null && rolledBackVersion !== null && (compareVersions(rolledBackVersion, currentVersion) ?? 0) > 0) {
        return {...NO_UPDATE_PROGRESS, errorKey: 'update.errors.rolledBack', version: rolledBackVersion};
    }

    const isStatusShown = status !== null
        && (compareVersions(status.version, currentVersion) ?? 0) > 0
        && (request === null || isRequestedStatus(status, request));

    if (!isStatusShown) {
        if (request === null) {
            return NO_UPDATE_PROGRESS;
        }

        return now - request.requestedAt > UPDATE_BRIDGE_RESPONSE_TIMEOUT_MS
            ? {...NO_UPDATE_PROGRESS, errorKey: 'update.errors.noResponse'}
            : {...NO_UPDATE_PROGRESS, statusKey: 'update.stages.preparing', isRunning: true};
    }

    const {
        stage,
        version,
        percent,
        error,
        updated,
    } = status;

    if (stage === Done) {
        return {...NO_UPDATE_PROGRESS, statusKey: 'settings.updateStaged', isStaged: true, version};
    }

    if (stage === Failed) {
        return {...NO_UPDATE_PROGRESS, errorKey: UPDATE_ERROR_TEXTS[error as UpdateErrorEnum] ?? 'update.errors.unexpected'};
    }

    if ((now / 1000) - updated >= UPDATE_STATUS_STALE_SEC) {
        return NO_UPDATE_PROGRESS;
    }

    return {...NO_UPDATE_PROGRESS, statusKey: UPDATE_STAGE_TEXTS[stage], isRunning: true, percent};
};
