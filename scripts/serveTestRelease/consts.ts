export const TEST_RELEASE_HOST = '127.0.0.1';

export const TEST_RELEASE_PORT = 3063;

export const BROKEN_SIGNATURE_FLAG = '--broken-signature';

export const COMPATIBILITY_FILE_NAME = 'compatibility.json';

export const SETUP_SIGNATURE_SUFFIX = '.exe.minisig';

export const DOWNLOAD_PATH_PATTERN = /^\/download\/v(\d+\.\d+\.\d+)\/([\w.-]+)$/;

export const CORS_HEADERS: Record<string, string> = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
};

export const USAGE = 'Usage: npm run serve:test-release -- <folder with the signed test release> [--broken-signature]';
