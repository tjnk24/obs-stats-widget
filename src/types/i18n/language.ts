export enum LanguageEnum {
    En = 'en',
    Ru = 'ru',
    Es = 'es',
    De = 'de',
    PtBr = 'pt-BR',
    Frog = 'ru-x-frog',
}

export type ObsLanguagePrefixDto = {
    prefix: string;
    language: LanguageEnum;
};
