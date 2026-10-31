import {CompatibilityProblemEnum} from './CompatibilityProblemEnum';
import {CompatibilityWarningEnum} from './CompatibilityWarningEnum';

export type CompatibilityResultDto = {
    problems: CompatibilityProblemEnum[];
    warnings: CompatibilityWarningEnum[];
};
