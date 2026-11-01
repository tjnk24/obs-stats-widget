import {useSelector} from 'react-redux';

import {connectionSelector} from '__selectors/connectionSelectors';
import {statsTargetsSelector} from '__selectors/statsSelectors';
import {updateSelector} from '__selectors/updateSelectors';
import {ConnectionStatusEnum} from '__types/connection/ConnectionStatusEnum';

import {BRIDGE_MISSING_CHECKS} from '../../../consts';
import {HeaderStageViewDto} from '../types';

export const useHeaderStageView = (): HeaderStageViewDto => {
    const {status, isSwitchingCollection} = useSelector(connectionSelector);
    const {bridge, bridgeMissingChecks} = useSelector(updateSelector);
    const targets = useSelector(statsTargetsSelector);

    if (status !== ConnectionStatusEnum.Identified) {
        return {stageKey: null};
    }

    if (isSwitchingCollection) {
        return {stageKey: 'header.switchingCollection'};
    }

    if (targets.length === 0) {
        return {stageKey: 'header.loadingData'};
    }

    if (bridge === null && bridgeMissingChecks < BRIDGE_MISSING_CHECKS) {
        return {stageKey: 'header.bridgeChecking'};
    }

    return {stageKey: null};
};
