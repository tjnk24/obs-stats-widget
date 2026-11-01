import type {Configuration} from 'webpack';

import {CONTENT_HASH} from '../consts.ts';

export const loadAssets = () => (webpackConfig: Configuration): Configuration => {
    webpackConfig.module?.rules?.push({
        test: /\.(jpe?g|png|gif|svg)$/i,
        type: 'asset/resource',
        generator: {
            filename: `images/[name]${CONTENT_HASH}[ext]`,
        },
    });

    webpackConfig.module?.rules?.push({
        test: /\.woff2?$/i,
        type: 'asset/resource',
        generator: {
            filename: `fonts/[name]${CONTENT_HASH}[ext]`,
        },
    });

    return webpackConfig;
};
