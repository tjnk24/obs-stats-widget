import {OutputOriginEnum, StreamTargetDto} from '__types/targets';
import {JOURNAL_MAIN_TARGET_LABEL, JOURNAL_OTHER_TARGET_LABEL} from '__utils/consts';

export const getJournalTargetLabel = ({origin, outputName, platform}: StreamTargetDto) => {
    if (platform.isKnown) {
        return platform.title;
    }

    return origin === OutputOriginEnum.Main ? JOURNAL_MAIN_TARGET_LABEL : outputName ?? JOURNAL_OTHER_TARGET_LABEL;
};
