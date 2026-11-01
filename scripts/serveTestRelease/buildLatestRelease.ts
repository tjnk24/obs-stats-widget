import fs from 'node:fs';
import path from 'node:path';

import {COMPATIBILITY_FILE_NAME} from './consts.ts';
import type {TestCompatibilityDto} from './TestCompatibilityDto.ts';

export const buildLatestRelease = (releaseDirectory: string, origin: string) => {
    const compatibility = JSON.parse(fs.readFileSync(path.join(releaseDirectory, COMPATIBILITY_FILE_NAME), 'utf8')) as TestCompatibilityDto;

    return {
        tag_name: `v${compatibility.version}`,
        html_url: `${origin}/`,
        body: `Test release ${compatibility.version}, served by npm run serve:test-release.\n\n<!-- compatibility: ${JSON.stringify(compatibility)} -->`,
        published_at: new Date().toISOString(),
        draft: false,
        prerelease: false,
    };
};
