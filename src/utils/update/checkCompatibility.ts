import {
    CompatibilityDto,
    CompatibilityProblemEnum,
    CompatibilityResultDto,
    CompatibilityWarningEnum,
    UpdateEnvironmentDto,
} from '__types/update/compatibility';

import {compareVersions} from './compareVersions';
import {parseVersion} from './parseVersion';

const {ObsTooOld, RpcMismatch, RequestsMissing, ChromiumTooOld} = CompatibilityProblemEnum;

export const checkCompatibility = (compatibility: CompatibilityDto, environment: UpdateEnvironmentDto): CompatibilityResultDto => {
    const problems: CompatibilityProblemEnum[] = [];
    const warnings: CompatibilityWarningEnum[] = [];
    const {
        obsVersion,
        rpcVersion,
        availableRequests,
        chromiumVersion,
        currentVersion,
    } = environment;

    if (obsVersion !== null && (compareVersions(obsVersion, compatibility.minObsVersion) ?? 0) < 0) {
        problems.push(ObsTooOld);
    }

    if (rpcVersion !== null && rpcVersion !== compatibility.obsWebSocketRpcVersion) {
        problems.push(RpcMismatch);
    }

    if (availableRequests !== null && compatibility.requiredRequests.some(request => !availableRequests.includes(request))) {
        problems.push(RequestsMissing);
    }

    if (chromiumVersion !== null && chromiumVersion < compatibility.minChromiumVersion) {
        problems.push(ChromiumTooOld);
    }

    const newMajor = parseVersion(compatibility.version)?.major ?? 0;
    const currentMajor = parseVersion(currentVersion)?.major ?? 0;

    if (newMajor > currentMajor) {
        warnings.push(CompatibilityWarningEnum.MajorUpdate);
    }

    return {problems, warnings};
};
