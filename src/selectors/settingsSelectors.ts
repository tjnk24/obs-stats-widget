import {BaseStore} from '__reducers';
import {getObsWebSocketPort} from '__utils/getObsWebSocketPort';

export const settingsPortSelector = (state: BaseStore) => state.settings.port;

export const settingsIsShowGeneralCardSelector = (state: BaseStore) => state.settings.isShowGeneralCard;

export const settingsIsMockEnabledSelector = (state: BaseStore) => state.settings.isMockEnabled;

export const settingsIsAutoUpdateCheckEnabledSelector = (state: BaseStore) => state.settings.isAutoUpdateCheckEnabled;

export const settingsLastUpdateCheckAtSelector = (state: BaseStore) => state.settings.lastUpdateCheckAt;

export const settingsLanguageSelector = (state: BaseStore) => state.settings.language;

export const obsWebSocketPortSelector = (state: BaseStore) => getObsWebSocketPort() ?? state.settings.port;
