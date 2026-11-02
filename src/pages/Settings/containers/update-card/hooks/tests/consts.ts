import {BaseStore} from '__reducers';
import {ReleaseDto} from '__types/update/ReleaseDto';
import {UpdateCheckStatusEnum} from '__types/update/UpdateCheckStatusEnum';

export const NOW = 1_800_000_000_000;

export const CURRENT_VERSION = '0.1.0';

export const RELEASE: ReleaseDto = {
    version: '0.2.0',
    url: 'https://github.com/tjnk24/streamoscope/releases/tag/v0.2.0',
    notes: '',
    publishedAt: null,
    compatibility: null,
};

export const STATE = {
    update: {checkStatus: UpdateCheckStatusEnum.Available, latest: RELEASE, request: null, deferredVersion: null},
    settings: {
        lastUpdateCheckAt: NOW - 60_000,
        isAutoUpdateCheckEnabled: true,
        skippedUpdateVersion: null,
        updateRemindAt: null,
    },
} as unknown as BaseStore;
