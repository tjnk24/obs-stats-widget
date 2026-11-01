import {useSelector} from 'react-redux';
import {
    afterAll,
    beforeAll,
    describe,
    expect,
    it,
    vi,
} from 'vitest';

import {useInstallProgressView} from '../useInstallProgressView';

import {
    BRIDGE,
    DONE_STATUS,
    DOWNLOADING_STATUS,
    FAILED_STATUS,
    NOW,
    OLD_REQUEST,
    REQUEST,
    UNKNOWN_ERROR_STATUS,
} from './consts';

vi.mock('react-redux', () => ({useSelector: vi.fn()}));

describe('useInstallProgressView', () => {
    beforeAll(() => {
        vi.setSystemTime(NOW);
    });

    afterAll(() => {
        vi.useRealTimers();
    });

    it('shows preparing while the bridge has not answered yet', () => {
        vi.mocked(useSelector).mockReturnValue({bridge: BRIDGE, request: REQUEST});

        expect(useInstallProgressView()).toMatchObject({
            version: '0.2.0',
            stageKey: 'update.stages.preparing',
            percent: 0,
            progressStatus: 'active',
            isFailed: false,
        });
    });

    it('fails with noResponse when the bridge stays silent too long', () => {
        vi.mocked(useSelector).mockReturnValue({bridge: BRIDGE, request: OLD_REQUEST});

        expect(useInstallProgressView()).toMatchObject({
            stageKey: 'update.stages.failed',
            progressStatus: 'exception',
            isFailed: true,
            errorKey: 'update.errors.noResponse',
        });
    });

    it('shows the download percent on the bar and in the text', () => {
        vi.mocked(useSelector).mockReturnValue({bridge: {...BRIDGE, status: DOWNLOADING_STATUS}, request: REQUEST});

        expect(useInstallProgressView()).toMatchObject({
            stageKey: 'update.stages.downloading',
            downloadPercent: 40,
            percent: 40,
        });
    });

    it('maps the updater error code to its text', () => {
        vi.mocked(useSelector).mockReturnValue({bridge: {...BRIDGE, status: FAILED_STATUS}, request: REQUEST});

        expect(useInstallProgressView().errorKey).toBe('update.errors.network');
    });

    it('falls back to unexpected for an unknown error code', () => {
        vi.mocked(useSelector).mockReturnValue({bridge: {...BRIDGE, status: UNKNOWN_ERROR_STATUS}, request: REQUEST});

        expect(useInstallProgressView().errorKey).toBe('update.errors.unexpected');
    });

    it('marks a finished update as success', () => {
        vi.mocked(useSelector).mockReturnValue({bridge: {...BRIDGE, status: DONE_STATUS}, request: REQUEST});

        expect(useInstallProgressView()).toMatchObject({
            stageKey: 'update.stages.done',
            percent: 100,
            progressStatus: 'success',
        });
    });
});
