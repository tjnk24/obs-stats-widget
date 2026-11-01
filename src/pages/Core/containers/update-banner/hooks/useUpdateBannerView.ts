import {useSelector} from 'react-redux';

import {connectionStatusSelector} from '__selectors/connectionSelectors';
import {settingsSelector} from '__selectors/settingsSelectors';
import {updateSelector} from '__selectors/updateSelectors';
import {ConnectionStatusEnum} from '__types/connection/ConnectionStatusEnum';
import {compareVersions} from '__utils/update/compareVersions';

import {getShownStatus} from '../../../utils/getShownStatus';
import {UpdateBannerModeEnum, UpdateBannerViewDto} from '../types';

const {Identified} = ConnectionStatusEnum;

const {Hidden, Progress, Deferred, NewVersion} = UpdateBannerModeEnum;

export const useUpdateBannerView = (): UpdateBannerViewDto => {
    const connectionStatus = useSelector(connectionStatusSelector);
    const {latest, bridge, request, deferredVersion} = useSelector(updateSelector);
    const {skippedUpdateVersion, updateRemindAt} = useSelector(settingsSelector);

    const now = Date.now();

    const isNewer = latest !== null && (compareVersions(latest.version, process.env.APP_VERSION) ?? 0) > 0;

    const isHidden = latest?.version === skippedUpdateVersion || (updateRemindAt !== null && now < updateRemindAt);

    const mode = connectionStatus !== Identified
        ? Hidden
        : getShownStatus(bridge, request, now) || request
            ? Progress
            : deferredVersion
                ? Deferred
                : isNewer && !isHidden
                    ? NewVersion
                    : Hidden;

    return {mode, deferredVersion};
};
