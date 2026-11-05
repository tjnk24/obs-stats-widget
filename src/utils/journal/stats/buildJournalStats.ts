import {BaseStore} from '__reducers';
import {statsSelector} from '__selectors/statsSelectors';
import {JournalEntryDto, JournalLevelEnum} from '__types/journal';

import {getJournalTargetLabel} from '../getJournalTargetLabel';

import {describeJournalBitrate} from './describeJournalBitrate';

const {Stat} = JournalLevelEnum;

export const buildJournalStats = (state: BaseStore, windowMs: number): JournalEntryDto[] => {
    const {targets, view, hardware: {gpu}, isRecording} = statsSelector(state);
    const activeEntries: JournalEntryDto[] = [];

    targets.forEach(target => {
        const output = view.outputs[target.key];

        if (!output?.isActive) {
            return;
        }

        const points = output.graph.filter(({time}) => time >= view.now - windowMs);

        activeEntries.push({
            level: Stat,
            source: getJournalTargetLabel(target),
            message: [
                describeJournalBitrate(points),
                `dropped=${output.dropped}`,
                `dropped_1m=${output.recentDropped}`,
                `congestion=${Math.round(output.congestion * 100)}%`,
                `status=${output.level}`,
            ].join(' '),
        });
    });

    if ((!activeEntries.length && !isRecording) || !view.general) {
        return activeEntries;
    }

    const {
        fps,
        frameTime,
        cpu,
        memoryInMb,
        encoding,
        rendering,
    } = view.general;

    const gpuText = gpu ? ` gpu=${Math.round(gpu.usage)}% gpu_encoder=${Math.round(gpu.encoder)}%` : '';

    return [
        ...activeEntries,
        {
            level: Stat,
            source: 'OBS',
            message: `fps=${fps.toFixed(1)} frame_ms=${frameTime.toFixed(1)} render_lag=${rendering.skipped} encoder_lag=${encoding.skipped} cpu=${cpu.toFixed(1)}% memory_mb=${Math.round(memoryInMb)}${gpuText}`,
        },
    ];
};
