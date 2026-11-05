import {spawn} from 'node:child_process';
import type {Request, Response} from 'webpack-dev-server';

import {DEV_JOURNAL_DIRECTORY, FOLDER_OPENERS} from '../../consts.ts';

import {isSameOriginRequest} from './isSameOriginRequest.ts';

export const openDevJournalFolder = (request: Request, response: Response) => {
    if (!isSameOriginRequest(request)) {
        response.status(403).end();

        return;
    }

    spawn(FOLDER_OPENERS[process.platform] ?? 'xdg-open', [DEV_JOURNAL_DIRECTORY], {detached: true, stdio: 'ignore'}).unref();
    response.status(204).end();
};
