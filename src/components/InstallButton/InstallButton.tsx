import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';

import EnhancedButton from '__components/EnhancedButton';
import {updateSelector} from '__selectors/updateSelectors';
import {updateService} from '__services/updateService';

import {Props} from './types';

const InstallButton = ({children, onStart}: Props) => {
    const {isObsBusy} = useSelector(updateSelector);

    const {t} = useTranslation();

    const onInstall = () => {
        updateService.install();
        onStart?.();
    };

    const onInstallWhenFree = () => {
        updateService.installWhenFree();
        onStart?.();
    };

    return (
        <EnhancedButton
            buttonProps={{
                type: 'primary',
                size: 'small',
                onClick: isObsBusy ? undefined : onInstall,
            }}
            popconfirmProps={isObsBusy
                ? {
                    title: t('update.busyConfirm'),
                    okText: t('update.afterStream'),
                    onConfirm: onInstallWhenFree,
                }
                : undefined}
            withSpinner={false}
        >
            {children}
        </EnhancedButton>
    );
};

export default InstallButton;
