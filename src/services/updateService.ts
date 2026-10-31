import type {Nullable} from 'infrastructure/common';

import {commonActions} from '__actions';
import {connectionObsVersionSelector} from '__selectors/connectionSelectors';
import {settingsIsAutoUpdateCheckEnabledSelector, settingsLastUpdateCheckAtSelector} from '__selectors/settingsSelectors';
import {
    updateBridgeSelector,
    updateIsObsBusySelector,
    updateLatestSelector,
    updateRequestedVersionSelector,
} from '__selectors/updateSelectors';
import store, {getStore} from '__store';
import {ObsRequestTypeEnum} from '__types/obs/requests/ObsRequestTypeEnum';
import {UpdateStageEnum} from '__types/update/bridge/UpdateStageEnum';
import {CompatibilityResultDto} from '__types/update/compatibility/CompatibilityResultDto';
import {GithubReleaseDto} from '__types/update/GithubReleaseDto';
import {UpdateCheckStatusEnum} from '__types/update/UpdateCheckStatusEnum';
import {UpdateInstallBlockerEnum} from '__types/update/UpdateInstallBlockerEnum';
import {
    GITHUB_LATEST_RELEASE_URL,
    UPDATE_CHECK_PERIOD_MS,
    UPDATE_CHECK_TIMER_MS,
    UPDATE_COMMAND_PARAMETER,
} from '__utils/consts';
import {HTTP_NOT_FOUND} from '__utils/consts';
import {checkCompatibility} from '__utils/update/checkCompatibility';
import {compareVersions} from '__utils/update/compareVersions';
import {getChromiumVersion} from '__utils/update/getChromiumVersion';
import {getInstallBlocker} from '__utils/update/getInstallBlocker';
import {parseRelease} from '__utils/update/parseRelease';

import {obsConnectionService} from './obsConnectionService';

class UpdateService {
    private timer: Nullable<number> = null;

    private unsubscribe: Nullable<() => void> = null;

    start = () => {
        this.stop();

        if (settingsIsAutoUpdateCheckEnabledSelector(getStore())) {
            void this.checkForUpdates();
        }

        this.timer = window.setInterval(this.checkIfDue, UPDATE_CHECK_TIMER_MS);
        this.unsubscribe = store.subscribe(this.reloadWhenInstalled);
    };

    stop = () => {
        this.timer !== null && window.clearInterval(this.timer);
        this.timer = null;
        this.unsubscribe?.();
        this.unsubscribe = null;
    };

    checkForUpdates = async (): Promise<UpdateCheckStatusEnum> => {
        commonActions.update.setCheckStatus(UpdateCheckStatusEnum.Checking);

        const status = await this.fetchLatest();

        commonActions.update.setCheckStatus(status);

        if (status !== UpdateCheckStatusEnum.Failed) {
            commonActions.settings.setLastUpdateCheckAt(Date.now());
        }

        return status;
    };

    getCompatibility = (): Nullable<CompatibilityResultDto> => {
        const state = getStore();
        const compatibility = updateLatestSelector(state)?.compatibility;

        if (!compatibility) {
            return null;
        }

        const obsVersion = connectionObsVersionSelector(state);

        return checkCompatibility(compatibility, {
            currentVersion: process.env.APP_VERSION,
            obsVersion: obsVersion?.obsVersion ?? null,
            rpcVersion: obsVersion?.rpcVersion ?? null,
            availableRequests: obsVersion?.availableRequests ?? null,
            chromiumVersion: getChromiumVersion(navigator.userAgent),
            bridgeVersion: updateBridgeSelector(state)?.bridgeVersion ?? null,
        });
    };

    getInstallBlocker = (): Nullable<UpdateInstallBlockerEnum> => {
        const state = getStore();

        return getInstallBlocker({
            release: updateLatestSelector(state),
            currentVersion: process.env.APP_VERSION,
            bridge: updateBridgeSelector(state),
            compatibility: this.getCompatibility(),
            isObsBusy: updateIsObsBusySelector(state),
            now: Date.now(),
        });
    };

    install = (): Nullable<UpdateInstallBlockerEnum> => {
        const blocker = this.getInstallBlocker();
        const release = updateLatestSelector(getStore());

        if (blocker || !release) {
            return blocker ?? UpdateInstallBlockerEnum.NoRelease;
        }

        obsConnectionService.sendRequest({
            requestType: ObsRequestTypeEnum.SetProfileParameter,
            requestData: {...UPDATE_COMMAND_PARAMETER, parameterValue: `install:${release.version}`},
        });

        commonActions.update.setRequestedVersion(release.version);

        return null;
    };

    private fetchLatest = async (): Promise<UpdateCheckStatusEnum> => {
        try {
            const response = await fetch(GITHUB_LATEST_RELEASE_URL, {headers: {Accept: 'application/vnd.github+json'}});

            if (response.status === HTTP_NOT_FOUND) {
                commonActions.update.setLatest(null);

                return UpdateCheckStatusEnum.UpToDate;
            }

            if (!response.ok) {
                return UpdateCheckStatusEnum.Failed;
            }

            const release = parseRelease(await response.json() as GithubReleaseDto);

            commonActions.update.setLatest(release);

            return release && (compareVersions(release.version, process.env.APP_VERSION) ?? 0) > 0
                ? UpdateCheckStatusEnum.Available
                : UpdateCheckStatusEnum.UpToDate;
        } catch {
            return UpdateCheckStatusEnum.Failed;
        }
    };

    private checkIfDue = () => {
        const state = getStore();
        const lastCheckAt = settingsLastUpdateCheckAtSelector(state);

        if (settingsIsAutoUpdateCheckEnabledSelector(state) && (lastCheckAt === null || Date.now() - lastCheckAt >= UPDATE_CHECK_PERIOD_MS)) {
            void this.checkForUpdates();
        }
    };

    private reloadWhenInstalled = () => {
        const state = getStore();
        const requestedVersion = updateRequestedVersionSelector(state);
        const status = updateBridgeSelector(state)?.status;

        if (requestedVersion && status?.stage === UpdateStageEnum.Done && status.version === requestedVersion) {
            this.stop();
            window.location.reload();
        }
    };
}

export const updateService = new UpdateService();

import.meta.webpackHot?.decline();
