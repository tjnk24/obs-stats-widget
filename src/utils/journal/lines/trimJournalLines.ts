export const trimJournalLines = (lines: string[], maxChars: number) => {
    let totalChars = 0;
    let firstKeptIndex = lines.length;

    while (firstKeptIndex > 0 && totalChars + lines[firstKeptIndex - 1].length + 1 <= maxChars) {
        firstKeptIndex -= 1;
        totalChars += lines[firstKeptIndex].length + 1;
    }

    return lines.slice(firstKeptIndex);
};
