import type {DockCommandDto} from '../types/dock/DockCommandDto.ts';
import type {DockResponseDto} from '../types/dock/DockResponseDto.ts';
import type {DockResponseResultDto} from '../types/dock/DockResponseResultDto.ts';

import {findDockTarget} from './findDockTarget.ts';

export const sendDockCommands = async (commands: DockCommandDto[]) => {
    const target = await findDockTarget();

    if (target === null) {
        throw new Error('The dock is not open in OBS');
    }

    return new Promise<DockResponseResultDto>((resolve, reject) => {
        const socket = new WebSocket(target.webSocketDebuggerUrl);

        socket.addEventListener('error', () => reject(new Error('No answer from the dock debugger')));

        socket.addEventListener('open', () => {
            commands.forEach(({method, params}, index) => socket.send(JSON.stringify({id: index + 1, method, params})));
        });

        socket.addEventListener('message', ({data}) => {
            const {id, result, error} = JSON.parse(String(data)) as DockResponseDto;

            if (error) {
                socket.close();
                reject(new Error(error.message));
            } else if (id === commands.length) {
                socket.close();
                resolve(result);
            }
        });
    });
};
