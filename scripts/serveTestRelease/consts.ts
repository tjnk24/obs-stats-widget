export const TEST_RELEASE_HOST: string = '127.0.0.1';

export const TEST_RELEASE_PORT: number = 3063;

export const BROKEN_SIGNATURE_FLAG: string = '--broken-signature';

export const COMPATIBILITY_FILE_NAME: string = 'compatibility.json';

export const SETUP_SIGNATURE_SUFFIX: string = '.exe.minisig';

export const DOWNLOAD_PATH_PATTERN: RegExp = /^\/download\/v(\d+\.\d+\.\d+)\/([\w.-]+)$/;

export const CORS_HEADERS: Record<string, string> = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
};

export const USAGE: string = 'Usage: npm run serve:test-release -- <folder with the signed test release> [--broken-signature]';
