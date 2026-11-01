import {useTranslation} from 'react-i18next';

import EnhancedButton from '__components/EnhancedButton';

import {Props} from './types';

const DownloadButton = ({url, type}: Props) => {
    const {t} = useTranslation();

    return (
        <EnhancedButton
            buttonProps={{
                type,
                size: 'small',
                href: url,
                target: '_blank',
                rel: 'noreferrer',
            }}
            withSpinner={false}
        >
            {t('update.download')}
        </EnhancedButton>
    );
};

export default DownloadButton;
