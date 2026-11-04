import path from 'node:path';
import {TsconfigPathsPlugin} from 'tsconfig-paths-webpack-plugin';
import type {Configuration} from 'webpack';

import {
    CACHE_NAME,
    IS_DEVELOPMENT,
    RESOLVE_EXTENSIONS,
} from '../consts.ts';
import type {InitBaseConfigOptions} from '../types.ts';

export const initBaseConfig = ({context}: InitBaseConfigOptions) => (webpackConfig: Configuration): Configuration => Object.assign(webpackConfig, {
    context,
    mode: IS_DEVELOPMENT ? 'development' : 'production',
    cache: {
        type: 'filesystem',
        name: CACHE_NAME,
    },
    module: {
        rules: [],
    },
    resolve: {
        modules: ['node_modules', path.resolve(context, 'src')],
        extensions: RESOLVE_EXTENSIONS,
        plugins: [
            new TsconfigPathsPlugin({
                configFile: path.resolve(context, 'tsconfig.json'),
                extensions: RESOLVE_EXTENSIONS,
            }),
        ],
    },
    performance: {
        hints: false,
    },
    plugins: [],
});
