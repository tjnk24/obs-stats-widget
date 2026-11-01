import {StatisticProps, TagProps} from 'antd';
import type {ParseKeys} from 'i18next';
import type {Nullable} from 'infrastructure/common';

import {GraphPointDto} from '__types/stats/views/GraphPointDto';
import {NoteDto} from '__types/targets/NoteDto';
import {StreamTargetDto} from '__types/targets/StreamTargetDto';

import {StatItemDto} from '../../components/stat-list';
import {TagDto} from '../../types';

export enum OutputStatKeyEnum {
    Timecode = 'timecode',
    Dropped = 'dropped',
    Recent = 'recent',
    Congestion = 'congestion',
}

export type PlatformMarkDto = {
    emoji: string;
    hintKey: ParseKeys;
};

export type HealthTagDto = Pick<TagProps, 'color' | 'variant'>;

export type OutputCardViewDto = {
    title: string;
    color: string;
    notes: NoteDto[];
    platformMark: Nullable<PlatformMarkDto>;
    originTag: TagDto;
    healthTag: HealthTagDto;
    statusKey: ParseKeys;
    isActive: boolean;
    bitrate: StatisticProps['value'];
    isBitrateLoading: boolean;
    graph: GraphPointDto[];
    now: number;
    items: StatItemDto[];
};

interface OwnProps {
    target: StreamTargetDto;
}

export type Props = OwnProps;
