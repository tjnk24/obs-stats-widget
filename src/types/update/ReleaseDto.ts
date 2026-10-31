import type {Nullable} from 'infrastructure/common';

import {CompatibilityDto} from './compatibility/CompatibilityDto';

export type ReleaseDto = {
    version: string;
    url: string;
    notes: string;
    publishedAt: Nullable<string>;
    compatibility: Nullable<CompatibilityDto>;
};
