export type CompatibilityDto = {
    version: string;
    minObsVersion: string;
    obsWebSocketRpcVersion: number;
    minChromiumVersion: number;
    minBridgeVersion: number;
    requiredRequests: string[];
};
