import dotenv from 'dotenv';
import type {Configuration} from 'webpack';
import type {Configuration as DevServerConfiguration} from 'webpack-dev-server';

import {DEFAULT_PORT} from '../consts.ts';

import {clearDevJournal} from './devJournal/clearDevJournal.ts';
import {openDevJournalFolder} from './devJournal/openDevJournalFolder.ts';
import {writeDevJournal} from './devJournal/writeDevJournal.ts';
import {serveObsConnection} from './serveObsConnection.ts';

export const initDevServer = () => (webpackConfig: Configuration): Configuration => {
    dotenv.config({quiet: true});

    const devServer: DevServerConfiguration = {
        static: {
            directory: 'build',
        },
        liveReload: true,
        host: 'localhost',
        open: ['/'],
        port: process.env.PORT || DEFAULT_PORT,
        setupMiddlewares: (middlewares, server) => {
            clearDevJournal();

            server.app?.get('/dev/obs-connection', serveObsConnection);
            server.app?.post('/dev/journal', writeDevJournal);
            server.app?.post('/dev/journal/open-folder', openDevJournalFolder);

            return middlewares;
        },
        hot: true,
        client: {
            logging: 'warn',
            overlay: false,
        },
    };

    return Object.assign(webpackConfig, {devServer});
};
