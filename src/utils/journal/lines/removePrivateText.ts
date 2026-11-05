import {
    FILE_URL_FOLDERS_PATTERN,
    LINE_BREAKS_PATTERN,
    STREAM_URL_PATTERN,
    WINDOWS_FOLDERS_PATTERN,
} from '__utils/consts';

export const removePrivateText = (text: string, isSingleLine = true) => {
    const cleaned = text
        .replace(STREAM_URL_PATTERN, '<server>')
        .replace(FILE_URL_FOLDERS_PATTERN, '')
        .replace(WINDOWS_FOLDERS_PATTERN, '');

    return isSingleLine ? cleaned.replace(LINE_BREAKS_PATTERN, ' | ') : cleaned;
};
