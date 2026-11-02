import {t} from 'i18next';

import {OutputOriginEnum} from '__types/targets/OutputOriginEnum';
import {StreamTargetDto} from '__types/targets/StreamTargetDto';

import {TargetSourceDto} from '../types';

export const getTargetSource = ({origin, pluginName, outputName}: StreamTargetDto): TargetSourceDto => {
    if (origin === OutputOriginEnum.Main) {
        return {
            text: t('stats.mainTag'),
            hint: t('stats.mainTagHint'),
            color: 'blue',
        };
    }

    return {
        text: pluginName ?? t('stats.pluginTag'),
        hint: t('stats.pluginTagHint', {name: outputName}),
        color: null,
    };
};
