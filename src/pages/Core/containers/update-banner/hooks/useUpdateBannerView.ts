import {useSelector} from 'react-redux';

import {connectionStatusSelector} from '__selectors/connectionSelectors';
import {settingsSelector} from '__selectors/settingsSelectors';
import {updateSelector} from '__selectors/updateSelectors';
import {ConnectionStatusEnum} from '__types/connection/ConnectionStatusEnum';
import {RELEASES_PAGE_URL} from '__utils/consts';
import {compareVersions} from '__utils/update/compareVersions';

import {getShownStatus} from '../../../utils/getShownStatus';
import {UpdateBannerModeEnum, UpdateBannerViewDto} from '../types';

const {Identified} = ConnectionStatusEnum;

const {
    Hidden,
    Progress,
    Deferred,
    Updated,
    NewVersion,
} = UpdateBannerModeEnum;

export const useUpdateBannerView = (): UpdateBannerViewDto => {
    const connectionStatus = useSelector(connectionStatusSelector);
    const {latest, bridge, request, deferredVersion} = useSelector(updateSelector);
    const {skippedUpdateVersion, updateRemindAt, lastSeenVersion} = useSelector(settingsSelector);

    const now = Date.now();

    const currentVersion = process.env.APP_VERSION;

    const view = {deferredVersion, currentReleaseUrl: `${RELEASES_PAGE_URL}/tag/v${currentVersion}`};

    if (connectionStatus !== Identified) {
        return {...view, mode: Hidden};
    }

    if (getShownStatus(bridge, request, now) || request) {
        return {...view, mode: Progress};
    }

    if (deferredVersion) {
        return {...view, mode: Deferred};
    }

    if (lastSeenVersion !== null && (compareVersions(currentVersion, lastSeenVersion) ?? 0) > 0) {
        return {...view, mode: Updated};
    }

    const isNewer = latest !== null && (compareVersions(latest.version, currentVersion) ?? 0) > 0;

    const isHidden = latest?.version === skippedUpdateVersion || (updateRemindAt !== null && now < updateRemindAt);

    return {...view, mode: isNewer && !isHidden ? NewVersion : Hidden};
};
