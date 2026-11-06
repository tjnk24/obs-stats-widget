import {isJournalKept} from './isJournalKept';

export const isJournalWritten = (isDevServer: boolean, isMockEnabled: boolean, isInObs: boolean) => (
    isJournalKept(isDevServer, isMockEnabled) && (isDevServer || isInObs)
);
