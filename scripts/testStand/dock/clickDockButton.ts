import {evaluateInDock} from './evaluateInDock.ts';

export const clickDockButton = async (text: string) => {
    const isClicked = await evaluateInDock<boolean>(`(() => {
        const button = [...document.querySelectorAll('button')].find(candidate => candidate.innerText.trim() === ${JSON.stringify(text)});

        button?.click();

        return Boolean(button);
    })()`);

    if (!isClicked) {
        throw new Error(`The dock has no button "${text}"`);
    }
};
