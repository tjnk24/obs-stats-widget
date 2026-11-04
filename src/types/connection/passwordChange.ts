export enum PasswordChangeResultEnum {
    Accepted = 'accepted',
    Rejected = 'rejected',
    NoConnection = 'noConnection',
}

export type PasswordChangeDto = {
    password: string;
    resolve: (result: PasswordChangeResultEnum) => void;
};
