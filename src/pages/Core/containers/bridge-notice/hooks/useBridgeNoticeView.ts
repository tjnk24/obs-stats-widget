import {useSelector} from 'react-redux';

import {connectionSelector} from '__selectors/connectionSelectors';
import {updateSelector} from '__selectors/updateSelectors';
import {ConnectionStatusEnum} from '__types/connection/ConnectionStatusEnum';
import {BRIDGE_MISSING_CHECKS} from '__utils/consts';

import {BridgeNoticeViewDto} from '../types';
import {getBridgeScriptPath} from '../utils/getBridgeScriptPath';

export const useBridgeNoticeView = (): BridgeNoticeViewDto => {
    const {status, sceneCollection} = useSelector(connectionSelector);
    const {bridgeMissingChecks} = useSelector(updateSelector);

    const isShown = status === ConnectionStatusEnum.Identified
        && bridgeMissingChecks >= BRIDGE_MISSING_CHECKS
        && sceneCollection !== null;

    return {
        isShown,
        sceneCollection,
        scriptPath: getBridgeScriptPath(window.location.href),
    };
};
