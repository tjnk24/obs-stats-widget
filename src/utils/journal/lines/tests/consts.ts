import {JournalEntryDto, JournalLevelEnum} from '__types/journal';

export const ENTRY: JournalEntryDto = {
    level: JournalLevelEnum.Warn,
    source: 'Twitch',
    message: 'reconnecting',
};

export const JOURNAL_DATE = new Date(2026, 10, 5, 7, 8, 9);

export const STACK_WITH_PRIVATE_PATHS = [
    'Error: boom',
    '    at render (file:///C:/Users/Ivan/AppData/Local/Programs/streamoscope/versions/0.6.0/dock/app.bundle.js:1:2)',
    'failed to open C:\\Users\\Ivan\\obs\\scene.json',
    'server rtmp://live.example.com/app/secret',
].join('\n');
