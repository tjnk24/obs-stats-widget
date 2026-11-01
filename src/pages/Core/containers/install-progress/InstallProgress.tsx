import {
    Alert,
    Flex,
    Progress,
    Typography,
} from 'antd';
import {useTranslation} from 'react-i18next';

import EnhancedButton from '__components/EnhancedButton';
import {updateService} from '__services/updateService';
import {BRIDGE_SCRIPT_NAME} from '__utils/consts';

import DownloadButton from '../download-button';

import {useInstallProgressView} from './hooks/useInstallProgressView';

const InstallProgress = () => {
    const {t} = useTranslation();

    const {
        version,
        stageKey,
        downloadPercent,
        percent,
        progressStatus,
        isFailed,
        errorKey,
        isObsBusy,
    } = useInstallProgressView();

    return (
        <Alert
            type={isFailed ? 'error' : 'info'}
            title={t('update.installingTitle', {version})}
            description={(
                <Flex
                    gap="small"
                    vertical
                >
                    <Typography.Text>
                        {t(stageKey, {percent: downloadPercent})}
                    </Typography.Text>

                    <Progress
                        percent={percent}
                        status={progressStatus}
                        size="small"
                    />

                    {isFailed && (
                        <>
                            <Typography.Text>
                                {t(errorKey, {script: BRIDGE_SCRIPT_NAME})}
                            </Typography.Text>

                            <Flex
                                gap="small"
                                wrap
                            >
                                <EnhancedButton
                                    buttonProps={{
                                        type: 'primary',
                                        size: 'small',
                                        onClick: isObsBusy ? undefined : () => updateService.install(),
                                    }}
                                    popconfirmProps={isObsBusy
                                        ? {
                                            title: t('update.busyConfirm'),
                                            okText: t('update.afterStream'),
                                            onConfirm: updateService.installWhenFree,
                                        }
                                        : undefined}
                                    withSpinner={false}
                                >
                                    {t('update.retry')}
                                </EnhancedButton>

                                <DownloadButton type="default"/>

                                <EnhancedButton
                                    buttonProps={{
                                        type: 'text',
                                        size: 'small',
                                        onClick: updateService.dismissInstallResult,
                                    }}
                                    withSpinner={false}
                                >
                                    {t('update.close')}
                                </EnhancedButton>
                            </Flex>
                        </>
                    )}
                </Flex>
            )}
            showIcon
        />
    );
};

export default InstallProgress;
