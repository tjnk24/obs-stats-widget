import {CompatibilityDto} from '__types/update/compatibility/CompatibilityDto';
import {CompatibilityProblemEnum} from '__types/update/compatibility/CompatibilityProblemEnum';
import {CompatibilityResultDto} from '__types/update/compatibility/CompatibilityResultDto';
import {CompatibilityWarningEnum} from '__types/update/compatibility/CompatibilityWarningEnum';
import {UpdateEnvironmentDto} from '__types/update/compatibility/UpdateEnvironmentDto';

import {compareVersions} from './compareVersions';
import {parseVersion} from './parseVersion';

export const checkCompatibility = (compatibility: CompatibilityDto, environment: UpdateEnvironmentDto): CompatibilityResultDto => {
    const problems: CompatibilityProblemEnum[] = [];
    const warnings: CompatibilityWarningEnum[] = [];
    const {obsVersion, rpcVersion, availableRequests, chromiumVersion, bridgeVersion, currentVersion} = environment;

    if (obsVersion !== null && (compareVersions(obsVersion, compatibility.minObsVersion) ?? 0) < 0) {
        problems.push(CompatibilityProblemEnum.ObsTooOld);
    }

    if (rpcVersion !== null && rpcVersion !== compatibility.obsWebSocketRpcVersion) {
        problems.push(CompatibilityProblemEnum.RpcMismatch);
    }

    if (availableRequests !== null && compatibility.requiredRequests.some(request => !availableRequests.includes(request))) {
        problems.push(CompatibilityProblemEnum.RequestsMissing);
    }

    if (chromiumVersion !== null && chromiumVersion < compatibility.minChromiumVersion) {
        problems.push(CompatibilityProblemEnum.ChromiumTooOld);
    }

    const newMajor = parseVersion(compatibility.version)?.major ?? 0;
    const currentMajor = parseVersion(currentVersion)?.major ?? 0;

    if (newMajor > currentMajor) {
        warnings.push(CompatibilityWarningEnum.MajorUpdate);
    }

    if (bridgeVersion !== null && bridgeVersion < compatibility.minBridgeVersion) {
        warnings.push(CompatibilityWarningEnum.BridgeRestart);
    }

    return {problems, warnings};
};
