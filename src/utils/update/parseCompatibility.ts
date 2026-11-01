import type {Nullable} from 'infrastructure/common';
import isPlainObject from 'lodash/isPlainObject';

import {CompatibilityDto} from '__types/update/compatibility/CompatibilityDto';

import {parseVersion} from './parseVersion';

export const parseCompatibility = (value: unknown): Nullable<CompatibilityDto> => {
    if (!isPlainObject(value)) {
        return null;
    }

    const data = value as Partial<Record<keyof CompatibilityDto, unknown>>;
    const {
        version,
        minObsVersion,
        obsWebSocketRpcVersion,
        minChromiumVersion,
        minBridgeVersion,
        requiredRequests,
    } = data;

    if (
        typeof version !== 'string' || !parseVersion(version)
        || typeof minObsVersion !== 'string' || !parseVersion(minObsVersion)
        || typeof obsWebSocketRpcVersion !== 'number'
        || typeof minChromiumVersion !== 'number'
        || typeof minBridgeVersion !== 'number'
        || !Array.isArray(requiredRequests) || !requiredRequests.every(request => typeof request === 'string')
    ) {
        return null;
    }

    return {version, minObsVersion, obsWebSocketRpcVersion, minChromiumVersion, minBridgeVersion, requiredRequests};
};
