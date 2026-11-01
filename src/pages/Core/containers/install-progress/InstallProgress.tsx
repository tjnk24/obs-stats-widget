import {
    Alert,
    Flex,
    Progress,
    Typography,
} from 'antd';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';

import EnhancedButton from '__components/EnhancedButton';
import {updateSelector} from '__selectors/updateSelectors';
import {updateService} from '__services/updateService';
import {BRIDGE_SCRIPT_NAME} from '__utils/consts';

import DownloadButton from '../../components/download-button';

import {useInstallProgressView} from './hooks/useInstallProgressView';

const InstallProgress = () => {
    const {latest} = useSelector(updateSelector);

    const {t} = useTranslation();

    const {
        version,
        stageKey,
        downloadPercent,
        percent,
        progressStatus,
        isFailed,
        errorKey,
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
                                        onClick: () => updateService.install(),
                                    }}
                                    withSpinner={false}
                                >
                                    {t('update.retry')}
                                </EnhancedButton>

                                {latest && (
                                    <DownloadButton
                                        url={latest.url}
                                        type="default"
                                    />
                                )}

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
