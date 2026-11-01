import {Alert} from 'antd';
import {useTranslation} from 'react-i18next';

import EnhancedButton from '__components/EnhancedButton';
import {updateService} from '__services/updateService';

import InstallProgress from '../install-progress';
import NewVersionNotice from '../new-version-notice';

import {useUpdateBannerView} from './hooks/useUpdateBannerView';
import {UpdateBannerModeEnum} from './types';

const {Progress, Deferred, NewVersion} = UpdateBannerModeEnum;

const UpdateBanner = () => {
    const {t} = useTranslation();

    const {mode, deferredVersion} = useUpdateBannerView();

    if (mode === Progress) {
        return <InstallProgress/>;
    }

    if (mode === Deferred) {
        return (
            <Alert
                type="info"
                title={t('update.deferred', {version: deferredVersion})}
                action={(
                    <EnhancedButton
                        buttonProps={{
                            type: 'link',
                            size: 'small',
                            onClick: updateService.cancelDeferredInstall,
                        }}
                        withSpinner={false}
                    >
                        {t('update.cancel')}
                    </EnhancedButton>
                )}
                showIcon
            />
        );
    }

    if (mode === NewVersion) {
        return <NewVersionNotice/>;
    }

    return null;
};

export default UpdateBanner;
