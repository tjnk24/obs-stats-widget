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
import {updateService} from '__services/updateService';
import {UpdateCheckStatusEnum} from '__types/update/UpdateCheckStatusEnum';
import {UpdateInstallBlockerEnum} from '__types/update/UpdateInstallBlockerEnum';

import {useUpdateCardView} from '../useUpdateCardView';

import {
    CURRENT_VERSION,
    NOW,
    RELEASE,
    STATE,
} from './consts';

vi.mock('react-redux', () => ({useSelector: vi.fn()}));

vi.mock('__services/updateService', () => ({updateService: {getInstallBlocker: vi.fn(() => null)}}));

vi.mock('react-i18next', () => ({useTranslation: () => ({t: (key: string) => key, i18n: {language: 'en'}})}));

describe('useUpdateCardView', () => {
    beforeAll(() => {
        vi.setSystemTime(NOW);
        vi.stubEnv('APP_VERSION', CURRENT_VERSION);
    });

    afterAll(() => {
        vi.useRealTimers();
        vi.unstubAllEnvs();
    });

    it('shows the result of a successful check', () => {
        vi.mocked(useSelector).mockImplementation((selector: (state: BaseStore) => unknown) => selector(STATE));

        expect(useUpdateCardView()).toEqual({
            lastCheckText: 'settings.lastCheck',
            checkText: 'settings.updateAvailable',
            isCheckFailed: false,
            hiddenUpdateText: null,
            isUpdateShown: true,
            isManual: false,
            isAutoUpdateCheckEnabled: true,
        });
    });

    it('offers a manual download when the update cannot be installed automatically', () => {
        vi.mocked(useSelector).mockImplementation((selector: (state: BaseStore) => unknown) => selector(STATE));
        vi.mocked(updateService.getInstallBlocker).mockReturnValueOnce(UpdateInstallBlockerEnum.NoUpdater);

        expect(useUpdateCardView()).toMatchObject({isUpdateShown: true, isManual: true});
    });

    it('hides the update button while an update is requested', () => {
        const state = {...STATE, update: {...STATE.update, request: {version: RELEASE.version, requestedAt: NOW}}};

        vi.mocked(useSelector).mockImplementation((selector: (state: BaseStore) => unknown) => selector(state));

        expect(useUpdateCardView().isUpdateShown).toBe(false);
    });

    it('says when updates were never checked', () => {
        const state = {...STATE, settings: {...STATE.settings, lastUpdateCheckAt: null}};

        vi.mocked(useSelector).mockImplementation((selector: (state: BaseStore) => unknown) => selector(state));

        expect(useUpdateCardView().lastCheckText).toBe('settings.neverChecked');
    });

    it('marks a failed check', () => {
        const state = {...STATE, update: {...STATE.update, checkStatus: UpdateCheckStatusEnum.Failed}};

        vi.mocked(useSelector).mockImplementation((selector: (state: BaseStore) => unknown) => selector(state));

        expect(useUpdateCardView()).toMatchObject({checkText: 'settings.checkFailed', isCheckFailed: true});
    });

    it('shows no result before the first check', () => {
        const state = {...STATE, update: {...STATE.update, checkStatus: UpdateCheckStatusEnum.Idle}};

        vi.mocked(useSelector).mockImplementation((selector: (state: BaseStore) => unknown) => selector(state));

        expect(useUpdateCardView().checkText).toBeNull();
    });

    it('offers the skipped version back', () => {
        const state = {...STATE, settings: {...STATE.settings, skippedUpdateVersion: RELEASE.version}};

        vi.mocked(useSelector).mockImplementation((selector: (state: BaseStore) => unknown) => selector(state));

        expect(useUpdateCardView().hiddenUpdateText).toBe('settings.skippedVersion');
    });

    it('offers the postponed version back', () => {
        const state = {...STATE, settings: {...STATE.settings, updateRemindAt: NOW + 60_000}};

        vi.mocked(useSelector).mockImplementation((selector: (state: BaseStore) => unknown) => selector(state));

        expect(useUpdateCardView().hiddenUpdateText).toBe('settings.postponedVersion');
    });
});
