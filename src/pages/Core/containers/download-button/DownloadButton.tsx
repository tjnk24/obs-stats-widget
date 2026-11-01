import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';

import EnhancedButton from '__components/EnhancedButton';
import {updateSelector} from '__selectors/updateSelectors';
import {updateService} from '__services/updateService';

import {Props} from './types';

const DownloadButton = ({type}: Props) => {
    const {latest} = useSelector(updateSelector);

    const {t} = useTranslation();

    if (!latest) {
        return null;
    }

    return (
        <EnhancedButton
            buttonProps={{
                type,
                size: 'small',
                onClick: () => updateService.openReleasePage(latest.url),
            }}
            withSpinner={false}
        >
            {t('update.download')}
        </EnhancedButton>
    );
};

export default DownloadButton;
