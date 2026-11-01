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
import {UpdateCheckStatusEnum} from '__types/update/UpdateCheckStatusEnum';

import {useUpdateCardView} from '../useUpdateCardView';

import {
    CURRENT_VERSION,
    NOW,
    RELEASE,
    STATE,
} from './consts';

vi.mock('react-redux', () => ({useSelector: vi.fn()}));

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
            isAutoUpdateCheckEnabled: true,
        });
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
