import {JournalTransportDto} from '__types/journal';
import {DEV_JOURNAL_FOLDER_URL, DEV_JOURNAL_URL} from '__utils/consts';

export const devJournalTransport: JournalTransportDto = {
    isReady: () => true,
    send: lines => {
        void fetch(DEV_JOURNAL_URL, {method: 'POST', body: lines.join('\n')}).catch(() => undefined);
    },
    setEnabled: () => undefined,
    openFolder: () => {
        void fetch(DEV_JOURNAL_FOLDER_URL, {method: 'POST'}).catch(() => undefined);
    },
};
