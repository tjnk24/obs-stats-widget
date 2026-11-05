export const formatJournalTime = (date: Date) => {
    const padTwoDigits = (value: number) => String(value).padStart(2, '0');

    const day = [date.getFullYear(), padTwoDigits(date.getMonth() + 1), padTwoDigits(date.getDate())].join('-');
    const time = [date.getHours(), date.getMinutes(), date.getSeconds()].map(padTwoDigits).join(':');

    return `${day} ${time}`;
};
