import {Locale} from 'antd/es/locale';
import deDE from 'antd/locale/de_DE';
import enUS from 'antd/locale/en_US';
import esES from 'antd/locale/es_ES';
import ptBR from 'antd/locale/pt_BR';
import ruRU from 'antd/locale/ru_RU';

import {LanguageEnum} from '__types/i18n/language';

const {
    En,
    Ru,
    Es,
    De,
    PtBr,
    Frog,
} = LanguageEnum;

export const ANTD_LOCALES: Record<LanguageEnum, Locale> = {
    [En]: enUS,
    [Ru]: ruRU,
    [Es]: esES,
    [De]: deDE,
    [PtBr]: ptBR,
    [Frog]: ruRU,
};
