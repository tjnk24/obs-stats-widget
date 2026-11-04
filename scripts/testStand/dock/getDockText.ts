import {evaluateInDock} from './evaluateInDock.ts';

export const getDockText = () => evaluateInDock<string>('document.body.innerText');
