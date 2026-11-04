import type {EntryObject} from 'webpack';

export type InitBaseConfigOptions = {
    context: string;
};

export type InitClientConfigOptions = {
    entry: EntryObject;
};
