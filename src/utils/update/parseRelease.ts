import type {Nullable} from 'infrastructure/common';

import {GithubReleaseDto} from '__types/update/GithubReleaseDto';
import {ReleaseDto} from '__types/update/ReleaseDto';
import {COMPATIBILITY_PATTERN, TAG_PATTERN} from '__utils/consts';

import {parseCompatibility} from './parseCompatibility';

export const parseRelease = (release: GithubReleaseDto): Nullable<ReleaseDto> => {
    const tag = TAG_PATTERN.exec(release.tag_name);

    if (!tag || release.draft || release.prerelease) {
        return null;
    }

    const body = release.body ?? '';
    const compatibilityMatch = COMPATIBILITY_PATTERN.exec(body);
    let compatibility = null;

    if (compatibilityMatch) {
        try {
            compatibility = parseCompatibility(JSON.parse(compatibilityMatch[1]));
        } catch {
            compatibility = null;
        }
    }

    return {
        version: tag[1],
        url: release.html_url,
        notes: body.replace(COMPATIBILITY_PATTERN, '').trim(),
        publishedAt: release.published_at,
        compatibility,
    };
};
