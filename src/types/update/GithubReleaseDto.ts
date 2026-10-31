import type {Nullable} from 'infrastructure/common';

export type GithubReleaseDto = {
    tag_name: string;
    html_url: string;
    body: Nullable<string>;
    published_at: Nullable<string>;
    draft: boolean;
    prerelease: boolean;
};
