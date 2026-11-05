import {VERSION} from '../../../packageRelease/consts.ts';
import {
    CONNECTION_WAIT_MS,
    DOCK_CONNECTED_TEXT,
    DOCK_OFFLINE_TEXT,
    HEALTHY_VERSION_PATH,
    JOURNAL_PATH,
    JOURNAL_STATS_PATTERN,
    LIVE_BITRATE_PATTERN,
    MEDIAMTX_PATHS_URL,
    STREAM_WAIT_MS,
} from '../../consts.ts';
import {findDockTarget} from '../../dock/findDockTarget.ts';
import {getDockText} from '../../dock/getDockText.ts';
import {sendObsRequest} from '../../obs/sendObsRequest.ts';
import {waitFor} from '../../processes/waitFor.ts';
import type {RtmpPathsDto} from '../../types/rtmp.ts';
import {readStandFile} from '../readStandFile.ts';

import {checkStep} from './checkStep.ts';

export const checkDockAndStream = async () => {
    await waitFor('the dock to connect', async () => (await getDockText()).includes(DOCK_CONNECTED_TEXT), CONNECTION_WAIT_MS);
    console.log('ok   the dock connects to OBS with a password');

    await waitFor('the health report', () => readStandFile(HEALTHY_VERSION_PATH) === VERSION, CONNECTION_WAIT_MS);
    console.log('ok   the dock finds the bridge and reports its health');

    checkStep('the dock opens from the folder of its version', (await findDockTarget())?.url.includes(`/versions/${VERSION}/dock/index.html`), true);

    await sendObsRequest('StartStream');

    await waitFor('the stream on the RTMP server', async () => {
        const {items} = await (await fetch(MEDIAMTX_PATHS_URL)).json() as RtmpPathsDto;

        return items.some(({ready}) => ready);
    }, STREAM_WAIT_MS);

    console.log('ok   the RTMP server receives the stream');

    await waitFor('the live bitrate in the dock', async () => LIVE_BITRATE_PATTERN.test(await getDockText()), STREAM_WAIT_MS);
    console.log('ok   the dock shows the live bitrate');

    await waitFor('the stream statistics in the journal', () => JOURNAL_STATS_PATTERN.test(readStandFile(JOURNAL_PATH) ?? ''), STREAM_WAIT_MS);
    console.log('ok   the bridge writes the statistics from the dock to the journal');

    await sendObsRequest('StopStream');

    await waitFor('the stream to stop in the dock', async () => (await getDockText()).includes(DOCK_OFFLINE_TEXT), STREAM_WAIT_MS);
    console.log('ok   the dock shows that the stream stopped');
};
