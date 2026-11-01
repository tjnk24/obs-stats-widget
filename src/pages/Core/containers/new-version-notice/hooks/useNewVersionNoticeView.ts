import type {Nullable} from 'infrastructure/common';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';

import {updateSelector} from '__selectors/updateSelectors';
import {updateService} from '__services/updateService';
import {UpdateInstallBlockerEnum} from '__types/update/UpdateInstallBlockerEnum';
import {BRIDGE_SCRIPT_NAME} from '__utils/consts';

import {COMPATIBILITY_PROBLEM_TEXTS, COMPATIBILITY_WARNING_TEXTS} from '../consts';
import {NewVersionNoticeViewDto} from '../types';

const {NoUpdater, Incompatible} = UpdateInstallBlockerEnum;

export const useNewVersionNoticeView = (): Nullable<NewVersionNoticeViewDto> => {
    const {latest} = useSelector(updateSelector);

    const {t} = useTranslation();

    if (!latest) {
        return null;
    }

    const blocker = updateService.getInstallBlocker();

    const compatibility = updateService.getCompatibility();

    const noteKeys = blocker === Incompatible
        ? compatibility?.problems.map(problem => COMPATIBILITY_PROBLEM_TEXTS[problem]) ?? []
        : compatibility?.warnings.map(warning => COMPATIBILITY_WARNING_TEXTS[warning]) ?? [];

    const noteValues = {
        obsVersion: latest.compatibility?.minObsVersion,
        chromiumVersion: latest.compatibility?.minChromiumVersion,
    };

    const noUpdaterNotes = blocker === NoUpdater ? [t('update.noUpdater', {script: BRIDGE_SCRIPT_NAME})] : [];

    return {
        version: latest.version,
        url: latest.url,
        notes: [...noUpdaterNotes, ...noteKeys.map(noteKey => t(noteKey, noteValues))],
        isManual: blocker === NoUpdater || blocker === Incompatible,
    };
};
