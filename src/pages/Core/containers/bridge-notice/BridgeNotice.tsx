import {
    Alert,
    Flex,
    Typography,
} from 'antd';
import {useTranslation} from 'react-i18next';

import {BRIDGE_SCRIPT_NAME} from '__utils/consts';

import {useBridgeNoticeView} from './hooks/useBridgeNoticeView';

const BridgeNotice = () => {
    const {t} = useTranslation();

    const {isShown, sceneCollection, scriptPath} = useBridgeNoticeView();

    if (!isShown) {
        return null;
    }

    return (
        <Alert
            type="warning"
            title={t('bridgeNotice.title', {collection: sceneCollection})}
            description={(
                <Flex
                    gap="small"
                    vertical
                >
                    <Typography.Text>
                        {t('bridgeNotice.description', {script: BRIDGE_SCRIPT_NAME})}
                    </Typography.Text>

                    {scriptPath && (
                        <Typography.Text
                            code
                            copyable
                        >
                            {scriptPath}
                        </Typography.Text>
                    )}
                </Flex>
            )}
            showIcon
        />
    );
};

export default BridgeNotice;
