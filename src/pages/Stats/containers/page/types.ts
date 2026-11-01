import type {Nullable} from 'infrastructure/common';

export type ConnectionAlertViewDto = {
    isClosed: boolean;
    title: string;
    description: Nullable<string>;
};
