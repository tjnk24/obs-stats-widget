import {CompatibilityDto} from '__types/update/compatibility/CompatibilityDto';
import {UpdateEnvironmentDto} from '__types/update/compatibility/UpdateEnvironmentDto';
import {GithubReleaseDto} from '__types/update/GithubReleaseDto';

export const COMPATIBILITY: CompatibilityDto = {
    version: '0.2.0',
    minObsVersion: '30.0.0',
    obsWebSocketRpcVersion: 1,
    minChromiumVersion: 120,
    minBridgeVersion: 2,
    requiredRequests: ['GetStats', 'GetVersion'],
};

export const ENVIRONMENT: UpdateEnvironmentDto = {
    currentVersion: '0.1.0',
    obsVersion: '33.0.1',
    rpcVersion: 1,
    availableRequests: ['GetStats', 'GetVersion', 'GetStreamStatus'],
    chromiumVersion: 127,
    bridgeVersion: 2,
};

export const RELEASE_NOTES = 'New things.\n\n---\n\nНовое.';

export const GITHUB_RELEASE: GithubReleaseDto = {
    tag_name: 'v0.2.0',
    html_url: 'https://github.com/tjnk24/obs-stats-widget/releases/tag/v0.2.0',
    body: `${RELEASE_NOTES}\n\n<!-- compatibility: ${JSON.stringify(COMPATIBILITY)} -->\n`,
    published_at: '2026-11-01T10:00:00Z',
    draft: false,
    prerelease: false,
};

export const OBS_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.6533.120 Safari/537.36 OBS/33.0.1';

export const FIREFOX_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; rv:131.0) Gecko/20100101 Firefox/131.0';
