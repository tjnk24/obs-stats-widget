type WebpackProcessEnv = {
    NODE_ENV: string;
    IS_DEV_SERVER: boolean;
    APP_VERSION: string;
    TEST_UPDATE_SERVER: string;
};

type WebpackProcess = {
    env: WebpackProcessEnv;
};

declare const process: WebpackProcess;
