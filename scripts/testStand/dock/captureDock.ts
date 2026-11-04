import fs from 'node:fs';

import {DOCK_PICTURE_METRICS} from '../consts.ts';

import {sendDockCommands} from './sendDockCommands.ts';

export const captureDock = async (filePath: string) => {
    const {data} = await sendDockCommands([
        {method: 'Emulation.setDeviceMetricsOverride', params: DOCK_PICTURE_METRICS},
        {method: 'Page.captureScreenshot', params: {format: 'png'}},
    ]);

    fs.writeFileSync(filePath, Buffer.from(data ?? '', 'base64'));
};
