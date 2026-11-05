import {JournalEntryDto} from '__types/journal';
import {JOURNAL_LEVEL_WIDTH, JOURNAL_SOURCE_WIDTH} from '__utils/consts';

import {formatJournalTime} from './formatJournalTime';
import {removePrivateText} from './removePrivateText';

export const formatJournalLine = ({level, source, message}: JournalEntryDto, date: Date) => [
    formatJournalTime(date),
    level.padEnd(JOURNAL_LEVEL_WIDTH),
    source.padEnd(JOURNAL_SOURCE_WIDTH),
    removePrivateText(message),
].join(' ');
