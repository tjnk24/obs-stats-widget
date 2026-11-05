import type {ParseKeys} from 'i18next';
import type {Nullable} from 'infrastructure/common';

import {BridgeUpdateStateDto} from '__types/update/bridgeUpdate';
import {JOURNAL_MIN_BRIDGE_VERSION} from '__utils/consts';
import {isJournalWritten} from '__utils/journal/isJournalWritten';

export const getJournalFolderBlockerKey = (
    isDevServer: boolean,
    isMockEnabled: boolean,
    isInObs: boolean,
    bridge: Nullable<BridgeUpdateStateDto>,
): Nullable<ParseKeys> => {
    if (isDevServer) {
        return isMockEnabled ? null : 'settings.journalFolderDevServer';
    }

    if (!isJournalWritten(isDevServer, isMockEnabled, isInObs)) {
        return isMockEnabled ? 'settings.journalFolderMock' : 'settings.journalFolderBrowser';
    }

    return bridge !== null && bridge.bridgeVersion >= JOURNAL_MIN_BRIDGE_VERSION ? null : 'settings.journalFolderBridge';
};
