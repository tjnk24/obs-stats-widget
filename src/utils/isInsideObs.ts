import {OBS_USER_AGENT_PATTERN} from '__utils/consts';

export const isInsideObs = (): boolean => 'obsstudio' in window || OBS_USER_AGENT_PATTERN.test(navigator.userAgent);
