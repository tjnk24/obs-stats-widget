import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';

import {settingsSelector} from '__selectors/settingsSelectors';
import {updateSelector} from '__selectors/updateSelectors';
import {UpdateCheckStatusEnum} from '__types/update/UpdateCheckStatusEnum';
import {compareVersions} from '__utils/update/compareVersions';

import {LAST_CHECK_FORMAT, UPDATE_CHECK_TEXTS} from '../consts';
import {UpdateCardViewDto} from '../types';

const {Failed} = UpdateCheckStatusEnum;

export const useUpdateCardView = (): UpdateCardViewDto => {
    const {checkStatus, latest} = useSelector(updateSelector);
    const {lastUpdateCheckAt, isAutoUpdateCheckEnabled, skippedUpdateVersion, updateRemindAt} = useSelector(settingsSelector);

    const {t, i18n} = useTranslation();

    const version = latest?.version;

    const checkTextKey = UPDATE_CHECK_TEXTS[checkStatus];

    const isNewer = latest !== null && (compareVersions(latest.version, process.env.APP_VERSION) ?? 0) > 0;

    const isSkipped = isNewer && latest.version === skippedUpdateVersion;

    const isPostponed = isNewer && !isSkipped && updateRemindAt !== null && Date.now() < updateRemindAt;

    const hiddenUpdateKey = isSkipped ? 'settings.skippedVersion' : 'settings.postponedVersion';

    const hiddenUpdateText = isSkipped || isPostponed ? t(hiddenUpdateKey, {version}) : null;

    const lastCheckText = lastUpdateCheckAt === null
        ? t('settings.neverChecked')
        : t('settings.lastCheck', {date: new Intl.DateTimeFormat(i18n.language, LAST_CHECK_FORMAT).format(lastUpdateCheckAt)});

    return {
        lastCheckText,
        checkText: checkTextKey && t(checkTextKey, {version}),
        isCheckFailed: checkStatus === Failed,
        hiddenUpdateText,
        isAutoUpdateCheckEnabled,
    };
};
