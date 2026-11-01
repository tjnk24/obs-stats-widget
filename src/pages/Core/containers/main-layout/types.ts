import {BadgeProps} from 'antd';
import type {ParseKeys} from 'i18next';
import type {Nullable} from 'infrastructure/common';

export type HeaderStageViewDto = {
    stageKey: Nullable<ParseKeys>;
};

export type ConnectionBadgeDto = {
    status: BadgeProps['status'];
    textKey: ParseKeys;
};
