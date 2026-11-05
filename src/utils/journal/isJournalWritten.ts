export const isJournalWritten = (isDevServer: boolean, isMockEnabled: boolean, isInObs: boolean) => (
    isDevServer ? isMockEnabled : !isMockEnabled && isInObs
);
