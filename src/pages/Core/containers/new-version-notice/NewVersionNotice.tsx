import {
    Alert,
    Flex,
    Typography,
} from 'antd';
import {useTranslation} from 'react-i18next';

import EnhancedButton from '__components/EnhancedButton';
import {updateService} from '__services/updateService';

import DownloadButton from '../download-button';

import {useNewVersionNoticeView} from './hooks/useNewVersionNoticeView';

const NewVersionNotice = () => {
    const {t} = useTranslation();

    const view = useNewVersionNoticeView();

    if (!view) {
        return null;
    }

    const {
        version,
        url,
        notes,
        isManual,
        isObsBusy,
    } = view;

    return (
        <Alert
            type="success"
            title={t('update.available', {version})}
            description={(
                <Flex
                    gap="small"
                    vertical
                >
                    {notes.map(note => (
                        <Typography.Text key={note}>
                            {note}
                        </Typography.Text>
                    ))}

                    <Flex
                        gap="small"
                        wrap
                    >
                        {isManual
                            ? (
                                <DownloadButton type="primary"/>
                            )
                            : (
                                <>
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
                                        {t('update.install')}
                                    </EnhancedButton>

                                    <EnhancedButton
                                        buttonProps={{
                                            type: 'link',
                                            size: 'small',
                                            onClick: () => updateService.openReleasePage(url),
                                        }}
                                        withSpinner={false}
                                    >
                                        {t('update.whatsNew')}
                                    </EnhancedButton>
                                </>
                            )}

                        <EnhancedButton
                            buttonProps={{
                                type: 'text',
                                size: 'small',
                                onClick: () => updateService.skipVersion(version),
                            }}
                            withSpinner={false}
                        >
                            {t('update.skip')}
                        </EnhancedButton>

                        <EnhancedButton
                            buttonProps={{
                                type: 'text',
                                size: 'small',
                                onClick: updateService.remindLater,
                            }}
                            withSpinner={false}
                        >
                            {t('update.remindLater')}
                        </EnhancedButton>
                    </Flex>
                </Flex>
            )}
            showIcon
        />
    );
};

export default NewVersionNotice;
