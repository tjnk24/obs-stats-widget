import {ProgressProps} from 'antd';
import type {ParseKeys} from 'i18next';
import type {Nullable} from 'infrastructure/common';

export type UpdateStageViewDto = {
    textKey: ParseKeys;
    percent: Nullable<number>;
};

export type InstallProgressViewDto = {
    version: Nullable<string>;
    stageKey: ParseKeys;
    downloadPercent: number;
    percent: number;
    progressStatus: ProgressProps['status'];
    isFailed: boolean;
    errorKey: ParseKeys;
    isObsBusy: boolean;
};
