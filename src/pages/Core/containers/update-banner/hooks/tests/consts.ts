import {BaseStore} from '__reducers';
import {ConnectionStatusEnum} from '__types/connection/ConnectionStatusEnum';
import {ReleaseDto} from '__types/update/ReleaseDto';
import {UpdateRequestDto} from '__types/update/UpdateRequestDto';

export const NOW = 1_800_000_000_000;

export const CURRENT_VERSION = '0.1.0';

export const OLDER_VERSION = '0.0.9';

export const CURRENT_RELEASE_URL = 'https://github.com/tjnk24/obs-stats-widget/releases/tag/v0.1.0';

export const RELEASE: ReleaseDto = {
    version: '0.2.0',
    url: 'https://github.com/tjnk24/obs-stats-widget/releases/tag/v0.2.0',
    notes: '',
    publishedAt: null,
    compatibility: null,
};

export const REQUEST: UpdateRequestDto = {version: '0.2.0', requestedAt: NOW - 5_000};

export const STATE = {
    connection: {status: ConnectionStatusEnum.Identified},
    update: {latest: RELEASE, bridge: null, request: null, deferredVersion: null},
    settings: {skippedUpdateVersion: null, updateRemindAt: null, lastSeenVersion: CURRENT_VERSION},
} as unknown as BaseStore;
