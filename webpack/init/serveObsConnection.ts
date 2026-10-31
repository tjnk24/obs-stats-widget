import fs from 'node:fs';
import type {Request, Response} from 'webpack-dev-server';

import {OBS_WEBSOCKET_CONFIG_PATH} from '../consts.ts';

export const serveObsConnection = (_request: Request, response: Response) => {
    try {
        const config = JSON.parse(fs.readFileSync(OBS_WEBSOCKET_CONFIG_PATH, 'utf8'));

        response.json({
            port: config.server_port,
            password: config.auth_required ? config.server_password : null,
        });
    } catch {
        response.status(404).end();
    }
};
