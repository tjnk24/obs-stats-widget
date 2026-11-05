import {GraphPointDto} from '__types/stats/views';

export const describeJournalBitrate = (points: GraphPointDto[]) => {
    if (!points.length) {
        return 'kbps_avg=none kbps_min=none';
    }

    const bitrates = points.map(({kbps}) => kbps);
    const average = bitrates.reduce((sum, kbps) => sum + kbps, 0) / bitrates.length;

    return `kbps_avg=${Math.round(average)} kbps_min=${Math.round(Math.min(...bitrates))}`;
};
