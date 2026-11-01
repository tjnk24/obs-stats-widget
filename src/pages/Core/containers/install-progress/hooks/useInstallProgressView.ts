import {useSelector} from 'react-redux';

import {updateSelector} from '__selectors/updateSelectors';
import {UpdateErrorEnum} from '__types/update/bridge/UpdateErrorEnum';
import {UpdateStageEnum} from '__types/update/bridge/UpdateStageEnum';

import {getShownStatus} from '../../../utils/getShownStatus';
import {
    UPDATE_BRIDGE_RESPONSE_TIMEOUT_MS,
    UPDATE_ERROR_TEXTS,
    UPDATE_STAGE_VIEWS,
} from '../consts';
import {InstallProgressViewDto} from '../types';

const {Failed, Preparing, Done} = UpdateStageEnum;

export const useInstallProgressView = (): InstallProgressViewDto => {
    const {bridge, request} = useSelector(updateSelector);

    const now = Date.now();

    const status = getShownStatus(bridge, request, now);

    const isNoResponse = !status && request !== null && now - request.requestedAt > UPDATE_BRIDGE_RESPONSE_TIMEOUT_MS;

    const stage = status?.stage ?? (isNoResponse ? Failed : Preparing);

    const isFailed = stage === Failed;

    const {textKey, percent} = UPDATE_STAGE_VIEWS[stage];

    const downloadPercent = status?.percent ?? 0;

    const progressStatus = isFailed
        ? 'exception'
        : stage === Done
            ? 'success'
            : 'active';

    const errorKey = isNoResponse
        ? 'update.errors.noResponse'
        : UPDATE_ERROR_TEXTS[status?.error as UpdateErrorEnum] ?? 'update.errors.unexpected';

    return {
        version: status?.version ?? request?.version ?? null,
        stageKey: textKey,
        downloadPercent,
        percent: percent ?? downloadPercent,
        progressStatus,
        isFailed,
        errorKey,
    };
};
