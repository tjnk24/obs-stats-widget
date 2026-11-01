import type {Nullable} from 'infrastructure/common';

import {commonActions} from '__actions';
import {connectionSelector} from '__selectors/connectionSelectors';
import {settingsSelector} from '__selectors/settingsSelectors';
import {updateSelector} from '__selectors/updateSelectors';
import store, {getStore} from '__store';
import {ObsRequestTypeEnum} from '__types/obs/requests/ObsRequestTypeEnum';
import {UpdateStageEnum} from '__types/update/bridge/UpdateStageEnum';
import {CompatibilityResultDto} from '__types/update/compatibility/CompatibilityResultDto';
import {GithubReleaseDto} from '__types/update/GithubReleaseDto';
import {UpdateCheckStatusEnum} from '__types/update/UpdateCheckStatusEnum';
import {UpdateInstallBlockerEnum} from '__types/update/UpdateInstallBlockerEnum';
import {
    LATEST_RELEASE_URL,
    UPDATE_CHECK_PERIOD_MS,
    UPDATE_CHECK_TIMER_MS,
    UPDATE_COMMAND_PARAMETER,
    UPDATE_REMIND_DELAY_MS,
} from '__utils/consts';
import {HTTP_NOT_FOUND} from '__utils/consts';
import {checkCompatibility} from '__utils/update/checkCompatibility';
import {compareVersions} from '__utils/update/compareVersions';
import {getChromiumVersion} from '__utils/update/getChromiumVersion';
import {getInstallBlocker} from '__utils/update/getInstallBlocker';
import {parseRelease} from '__utils/update/parseRelease';

import {obsConnectionService} from './obsConnectionService';

const {Checking, UpToDate, Available, Failed} = UpdateCheckStatusEnum;

class UpdateService {
    private timer: Nullable<number> = null;

    private unsubscribe: Nullable<() => void> = null;

    start = () => {
        this.stop();

        if (settingsSelector(getStore()).isAutoUpdateCheckEnabled) {
            void this.checkForUpdates();
        }

        this.timer = window.setInterval(this.checkIfDue, UPDATE_CHECK_TIMER_MS);
        this.unsubscribe = store.subscribe(this.onStoreChange);
    };

    stop = () => {
        this.timer !== null && window.clearInterval(this.timer);
        this.timer = null;
        this.unsubscribe?.();
        this.unsubscribe = null;
    };

    checkForUpdates = async (): Promise<UpdateCheckStatusEnum> => {
        commonActions.update.setCheckStatus(Checking);

        const status = await this.fetchLatest();

        commonActions.update.setCheckStatus(status);

        if (status !== Failed) {
            commonActions.settings.setLastUpdateCheckAt(Date.now());
        }

        return status;
    };

    getCompatibility = (): Nullable<CompatibilityResultDto> => {
        const state = getStore();
        const {latest, bridge} = updateSelector(state);
        const compatibility = latest?.compatibility;

        if (!compatibility) {
            return null;
        }

        const {obsVersion} = connectionSelector(state);

        return checkCompatibility(compatibility, {
            currentVersion: process.env.APP_VERSION,
            obsVersion: obsVersion?.obsVersion ?? null,
            rpcVersion: obsVersion?.rpcVersion ?? null,
            availableRequests: obsVersion?.availableRequests ?? null,
            chromiumVersion: getChromiumVersion(navigator.userAgent),
            bridgeVersion: bridge?.bridgeVersion ?? null,
        });
    };

    getInstallBlocker = (): Nullable<UpdateInstallBlockerEnum> => {
        const {latest, bridge, isObsBusy} = updateSelector(getStore());

        return getInstallBlocker({
            release: latest,
            currentVersion: process.env.APP_VERSION,
            bridge,
            compatibility: this.getCompatibility(),
            isObsBusy,
            now: Date.now(),
        });
    };

    install = (): Nullable<UpdateInstallBlockerEnum> => {
        const blocker = this.getInstallBlocker();
        const {latest: release} = updateSelector(getStore());

        if (blocker || !release) {
            return blocker ?? UpdateInstallBlockerEnum.NoRelease;
        }

        obsConnectionService.sendRequest({
            requestType: ObsRequestTypeEnum.SetProfileParameter,
            requestData: {...UPDATE_COMMAND_PARAMETER, parameterValue: `install:${release.version}`},
        });

        commonActions.update.setDeferredVersion(null);
        commonActions.update.setRequest({version: release.version, requestedAt: Date.now()});

        return null;
    };

    installWhenFree = () => {
        const {latest} = updateSelector(getStore());

        latest && commonActions.update.setDeferredVersion(latest.version);
    };

    cancelDeferredInstall = () => {
        commonActions.update.setDeferredVersion(null);
    };

    dismissInstallResult = () => {
        commonActions.update.setRequest(null);
    };

    skipVersion = (version: string) => {
        commonActions.settings.setSkippedUpdateVersion(version);
    };

    remindLater = () => {
        commonActions.settings.setUpdateRemindAt(Date.now() + UPDATE_REMIND_DELAY_MS);
    };

    showHiddenUpdate = () => {
        commonActions.settings.setSkippedUpdateVersion(null);
        commonActions.settings.setUpdateRemindAt(null);
    };

    setAutoCheckEnabled = (isEnabled: boolean) => {
        commonActions.settings.setIsAutoUpdateCheckEnabled(isEnabled);
        isEnabled && this.checkIfDue();
    };

    private fetchLatest = async (): Promise<UpdateCheckStatusEnum> => {
        try {
            const response = await fetch(LATEST_RELEASE_URL, {headers: {Accept: 'application/vnd.github+json'}});

            if (response.status === HTTP_NOT_FOUND) {
                commonActions.update.setLatest(null);

                return UpToDate;
            }

            if (!response.ok) {
                return Failed;
            }

            const release = parseRelease(await response.json() as GithubReleaseDto);

            commonActions.update.setLatest(release);

            return release && (compareVersions(release.version, process.env.APP_VERSION) ?? 0) > 0
                ? Available
                : UpToDate;
        } catch {
            return Failed;
        }
    };

    private checkIfDue = () => {
        const {isAutoUpdateCheckEnabled, lastUpdateCheckAt} = settingsSelector(getStore());

        if (isAutoUpdateCheckEnabled && (lastUpdateCheckAt === null || Date.now() - lastUpdateCheckAt >= UPDATE_CHECK_PERIOD_MS)) {
            void this.checkForUpdates();
        }
    };

    private onStoreChange = () => {
        const {request, bridge, deferredVersion, isObsBusy} = updateSelector(getStore());
        const status = bridge?.status;

        if (request && status?.stage === UpdateStageEnum.Done && status.version === request.version) {
            this.stop();
            window.location.reload();

            return;
        }

        if (deferredVersion && !isObsBusy) {
            commonActions.update.setDeferredVersion(null);
            this.install();
        }
    };
}

export const updateService = new UpdateService();

import.meta.webpackHot?.decline();
