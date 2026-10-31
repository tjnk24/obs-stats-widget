import type {Nullable} from 'infrastructure/common';

import {UpdateStageEnum} from './UpdateStageEnum';

export type UpdateStatusDto = {
    version: string;
    stage: UpdateStageEnum;
    percent: number;
    error: Nullable<string>;
    updated: number;
};
