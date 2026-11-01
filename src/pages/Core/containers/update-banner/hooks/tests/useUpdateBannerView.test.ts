import {useSelector} from 'react-redux';
import {
    afterAll,
    beforeAll,
    describe,
    expect,
    it,
    vi,
} from 'vitest';

import {BaseStore} from '__reducers';
import {ConnectionStatusEnum} from '__types/connection/ConnectionStatusEnum';

import {UpdateBannerModeEnum} from '../../types';
import {useUpdateBannerView} from '../useUpdateBannerView';

import {
    CURRENT_RELEASE_URL,
    CURRENT_VERSION,
    NOW,
    OLDER_VERSION,
    RELEASE,
    REQUEST,
    STATE,
} from './consts';

vi.mock('react-redux', () => ({useSelector: vi.fn()}));

describe('useUpdateBannerView', () => {
    beforeAll(() => {
        vi.setSystemTime(NOW);
        vi.stubEnv('APP_VERSION', CURRENT_VERSION);
    });

    afterAll(() => {
        vi.useRealTimers();
        vi.unstubAllEnvs();
    });

    it('shows a newer release', () => {
        vi.mocked(useSelector).mockImplementation((selector: (state: BaseStore) => unknown) => selector(STATE));

        expect(useUpdateBannerView()).toEqual({mode: UpdateBannerModeEnum.NewVersion, deferredVersion: null, currentReleaseUrl: CURRENT_RELEASE_URL});
    });

    it('hides everything while OBS is not connected', () => {
        const state = {...STATE, connection: {...STATE.connection, status: ConnectionStatusEnum.Closed}};

        vi.mocked(useSelector).mockImplementation((selector: (state: BaseStore) => unknown) => selector(state));

        expect(useUpdateBannerView().mode).toBe(UpdateBannerModeEnum.Hidden);
    });

    it('shows the progress once an install is requested', () => {
        const state = {...STATE, update: {...STATE.update, request: REQUEST}};

        vi.mocked(useSelector).mockImplementation((selector: (state: BaseStore) => unknown) => selector(state));

        expect(useUpdateBannerView().mode).toBe(UpdateBannerModeEnum.Progress);
    });

    it('shows the deferred install', () => {
        const state = {...STATE, update: {...STATE.update, deferredVersion: RELEASE.version}};

        vi.mocked(useSelector).mockImplementation((selector: (state: BaseStore) => unknown) => selector(state));

        expect(useUpdateBannerView()).toMatchObject({mode: UpdateBannerModeEnum.Deferred, deferredVersion: RELEASE.version});
    });

    it('hides a skipped version', () => {
        const state = {...STATE, settings: {...STATE.settings, skippedUpdateVersion: RELEASE.version}};

        vi.mocked(useSelector).mockImplementation((selector: (state: BaseStore) => unknown) => selector(state));

        expect(useUpdateBannerView().mode).toBe(UpdateBannerModeEnum.Hidden);
    });

    it('hides a version postponed until later', () => {
        const state = {...STATE, settings: {...STATE.settings, updateRemindAt: NOW + 60_000}};

        vi.mocked(useSelector).mockImplementation((selector: (state: BaseStore) => unknown) => selector(state));

        expect(useUpdateBannerView().mode).toBe(UpdateBannerModeEnum.Hidden);
    });

    it('shows a postponed version again once the time has come', () => {
        const state = {...STATE, settings: {...STATE.settings, updateRemindAt: NOW - 60_000}};

        vi.mocked(useSelector).mockImplementation((selector: (state: BaseStore) => unknown) => selector(state));

        expect(useUpdateBannerView().mode).toBe(UpdateBannerModeEnum.NewVersion);
    });

    it('tells once that the dock was updated', () => {
        const state = {...STATE, settings: {...STATE.settings, lastSeenVersion: OLDER_VERSION}};

        vi.mocked(useSelector).mockImplementation((selector: (state: BaseStore) => unknown) => selector(state));

        expect(useUpdateBannerView().mode).toBe(UpdateBannerModeEnum.Updated);
    });

    it('hides a release that is not newer', () => {
        const state = {...STATE, update: {...STATE.update, latest: {...RELEASE, version: CURRENT_VERSION}}};

        vi.mocked(useSelector).mockImplementation((selector: (state: BaseStore) => unknown) => selector(state));

        expect(useUpdateBannerView().mode).toBe(UpdateBannerModeEnum.Hidden);
    });
});
