import {sendDockCommands} from './sendDockCommands.ts';

export const evaluateInDock = async <Result>(expression: string) => {
    const {result, exceptionDetails} = await sendDockCommands([{
        method: 'Runtime.evaluate',
        params: {expression, awaitPromise: true, returnByValue: true},
    }]);

    if (exceptionDetails) {
        throw new Error(`${exceptionDetails.text}: ${result?.description ?? expression}`);
    }

    return result?.value as Result;
};
