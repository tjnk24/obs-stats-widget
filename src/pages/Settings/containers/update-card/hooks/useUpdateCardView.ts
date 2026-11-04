import type {ParseKeys} from 'i18next';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';

import {settingsSelector} from '__selectors/settingsSelectors';
import {updateSelector} from '__selectors/updateSelectors';
import {updateService} from '__services/updateService';
import {UpdateErrorEnum} from '__types/update/bridge/UpdateErrorEnum';
import {UpdateStageEnum} from '__types/update/bridge/UpdateStageEnum';
import {UpdateCheckStatusEnum} from '__types/update/UpdateCheckStatusEnum';
import {UpdateInstallBlockerEnum} from '__types/update/UpdateInstallBlockerEnum';
import {
    BRIDGE_SCRIPT_NAME,
    RELEASES_PAGE_URL,
    RUNNING_UPDATE_STAGES,
    UPDATE_STATUS_STALE_SEC,
} from '__utils/consts';
import {compareVersions} from '__utils/update/compareVersions';

import {
    COMPATIBILITY_PROBLEM_TEXTS,
    COMPATIBILITY_WARNING_TEXTS,
    LAST_CHECK_FORMAT,
    UPDATE_BRIDGE_RESPONSE_TIMEOUT_MS,
    UPDATE_CHECK_TEXTS,
    UPDATE_ERROR_TEXTS,
    UPDATE_STAGE_TEXTS,
} from '../consts';
import {UpdateCardViewDto} from '../types';
import {isRequestedStatus} from '../utils/isRequestedStatus';

const {Available, Failed} = UpdateCheckStatusEnum;

const {NoUpdater, Incompatible} = UpdateInstallBlockerEnum;

const {Preparing, Done} = UpdateStageEnum;

export const useUpdateCardView = (): UpdateCardViewDto => {
    const {checkStatus, latest, bridge, request} = useSelector(updateSelector);
    const {lastUpdateCheckAt, isAutoUpdateEnabled} = useSelector(settingsSelector);

    const {t, i18n} = useTranslation();

    const now = Date.now();

    const currentVersion = process.env.APP_VERSION;

    const status = bridge?.status ?? null;

    const isStatusShown = status !== null
        && (compareVersions(status.version, currentVersion) ?? 0) > 0
        && (request === null || isRequestedStatus(status, request));

    const shownStatus = isStatusShown ? status : null;

    const isStaged = shownStatus?.stage === Done;

    const isUpdateFailed = shownStatus?.stage === UpdateStageEnum.Failed;

    const isRunning = shownStatus !== null
        && RUNNING_UPDATE_STAGES.includes(shownStatus.stage)
        && (now / 1000) - shownStatus.updated < UPDATE_STATUS_STALE_SEC;

    const isWaitingForBridge = request !== null && shownStatus === null;

    const isNoResponse = isWaitingForBridge && now - request.requestedAt > UPDATE_BRIDGE_RESPONSE_TIMEOUT_MS;

    const isRequestPending = isWaitingForBridge && !isNoResponse;

    const statusValues = {version: shownStatus?.version, percent: shownStatus?.percent ?? 0};

    const statusText = isStaged || isRunning || isRequestPending
        ? t(UPDATE_STAGE_TEXTS[shownStatus?.stage ?? Preparing], statusValues)
        : null;

    const errorKey = isNoResponse
        ? 'update.errors.noResponse'
        : UPDATE_ERROR_TEXTS[shownStatus?.error as UpdateErrorEnum] ?? 'update.errors.unexpected';

    const isErrorShown = isNoResponse || isUpdateFailed;

    const isNewer = latest !== null && (compareVersions(latest.version, currentVersion) ?? 0) > 0;

    const isUpdateShown = isNewer && !isStaged && !isRunning && !isRequestPending;

    const blocker = updateService.getInstallBlocker();

    const compatibility = updateService.getCompatibility();

    const noteKeys: ParseKeys[] = blocker === NoUpdater
        ? ['update.noUpdater']
        : blocker === Incompatible
            ? compatibility?.problems.map(problem => COMPATIBILITY_PROBLEM_TEXTS[problem]) ?? []
            : compatibility?.warnings.map(warning => COMPATIBILITY_WARNING_TEXTS[warning]) ?? [];

    const noteValues = {
        script: BRIDGE_SCRIPT_NAME,
        obsVersion: latest?.compatibility?.minObsVersion,
        chromiumVersion: latest?.compatibility?.minChromiumVersion,
    };

    const checkTextKey = isStaged && checkStatus === Available ? null : UPDATE_CHECK_TEXTS[checkStatus];

    const lastCheckText = lastUpdateCheckAt === null
        ? t('settings.neverChecked')
        : t('settings.lastCheck', {date: new Intl.DateTimeFormat(i18n.language, LAST_CHECK_FORMAT).format(lastUpdateCheckAt)});

    return {
        lastCheckText,
        checkText: checkTextKey && t(checkTextKey, {version: latest?.version}),
        isCheckFailed: checkStatus === Failed,
        statusText,
        isStatusRunning: isRunning || isRequestPending,
        errorText: isErrorShown ? t(errorKey, {script: BRIDGE_SCRIPT_NAME}) : null,
        notes: isUpdateShown ? noteKeys.map(noteKey => t(noteKey, noteValues)) : [],
        isUpdateShown,
        isManual: blocker === NoUpdater || blocker === Incompatible,
        updateText: t(isErrorShown ? 'update.retry' : 'update.install'),
        currentReleaseUrl: `${RELEASES_PAGE_URL}/tag/v${currentVersion}`,
        latestReleaseUrl: latest?.url ?? null,
        isAutoUpdateEnabled,
    };
};
