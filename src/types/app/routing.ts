export type NavigateDto = (path: string) => Promise<void> | void;

export type PreloadDto = {
    onLoad?: () => void;
    onDispose?: () => void;
};
