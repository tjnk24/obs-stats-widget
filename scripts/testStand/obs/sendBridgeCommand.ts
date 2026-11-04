import {sendObsRequest} from './sendObsRequest.ts';

export const sendBridgeCommand = (command: string) => sendObsRequest('SetProfileParameter', {
    parameterCategory: 'StreamoScope',
    parameterName: 'UpdateCommand',
    parameterValue: command,
});
