import type {Nullable} from 'infrastructure/common';

import {CompatibilityDto} from './compatibility';

export type VersionDto = {
    major: number;
    minor: number;
    patch: number;
};

export type GithubReleaseDto = {
    tag_name: string;
    html_url: string;
    body: Nullable<string>;
    published_at: Nullable<string>;
    draft: boolean;
    prerelease: boolean;
};

export type ReleaseDto = {
    version: string;
    url: string;
    notes: string;
    publishedAt: Nullable<string>;
    compatibility: Nullable<CompatibilityDto>;
};
