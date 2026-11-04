import fs from 'node:fs';

export const readStandFile = (filePath: string) => (fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8').trim() : null);
