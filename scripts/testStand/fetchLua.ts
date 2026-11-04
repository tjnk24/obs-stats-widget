import {ensureLuaLibrary} from './setup/ensureLuaLibrary.ts';

console.log(`Lua: ${await ensureLuaLibrary()}`);
