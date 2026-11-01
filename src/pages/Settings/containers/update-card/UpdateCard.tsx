import {SyncOutlined} from '@ant-design/icons';
import {
    Card,
    Flex,
    Switch,
    Typography,
} from 'antd';
import {useTranslation} from 'react-i18next';

import DownloadButton from '__components/DownloadButton';
import EnhancedButton from '__components/EnhancedButton';
import InstallButton from '__components/InstallButton';
import {updateService} from '__services/updateService';

import {useUpdateCardView} from './hooks/useUpdateCardView';

const UpdateCard = () => {
    const {t} = useTranslation();

    const {
        lastCheckText,
        checkText,
        isCheckFailed,
        hiddenUpdateText,
        isUpdateShown,
        isManual,
        isAutoUpdateCheckEnabled,
    } = useUpdateCardView();

    const scrollToTop = () => window.requestAnimationFrame(() => window.scrollTo({top: 0, behavior: 'smooth'}));

    return (
        <Card
            size="small"
            title={t('settings.updatesTitle')}
        >
            <Flex
                gap={14}
                vertical
            >
                <Flex vertical>
                    <Typography.Text>
                        {t('settings.currentVersion', {version: process.env.APP_VERSION})}
                    </Typography.Text>

                    <Typography.Text type="secondary">
                        {lastCheckText}
                    </Typography.Text>
                </Flex>

                <Flex
                    align="center"
                    gap={14}
                    wrap
                >
                    <EnhancedButton
                        buttonProps={{
                            icon: <SyncOutlined/>,
                            onClick: () => updateService.checkForUpdates(),
                        }}
                    >
                        {t('settings.checkUpdates')}
                    </EnhancedButton>

                    {checkText && (
                        <Typography.Text type={isCheckFailed ? 'danger' : 'secondary'}>
                            {checkText}
                        </Typography.Text>
                    )}

                    {isUpdateShown && (isManual
                        ? <DownloadButton type="primary"/>
                        : (
                            <InstallButton onStart={scrollToTop}>
                                {t('update.install')}
                            </InstallButton>
                        ))}
                </Flex>

                {hiddenUpdateText && (
                    <Flex
                        align="center"
                        justify="space-between"
                        gap="small"
                        wrap
                    >
                        <Typography.Text>
                            {hiddenUpdateText}
                        </Typography.Text>

                        <EnhancedButton
                            buttonProps={{
                                type: 'primary',
                                onClick: updateService.showHiddenUpdate,
                            }}
                            withSpinner={false}
                        >
                            {t('settings.updateAnyway')}
                        </EnhancedButton>
                    </Flex>
                )}

                <Flex
                    align="center"
                    justify="space-between"
                    gap={14}
                >
                    <Flex vertical>
                        <Typography.Text>
                            {t('settings.autoUpdateCheck')}
                        </Typography.Text>

                        <Typography.Text type="secondary">
                            {t('settings.autoUpdateCheckHint')}
                        </Typography.Text>
                    </Flex>

                    <Switch
                        checked={isAutoUpdateCheckEnabled}
                        onChange={updateService.setAutoCheckEnabled}
                    />
                </Flex>
            </Flex>
        </Card>
    );
};

export default UpdateCard;
