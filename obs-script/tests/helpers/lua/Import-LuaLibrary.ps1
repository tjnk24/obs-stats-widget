function Import-LuaLibrary {
    $libraryPath = Join-Path (Get-RepositoryRoot) $script:LuaLibraryRelativePath

    if (-not (Test-Path -LiteralPath $libraryPath)) {
        throw "$libraryPath is missing, run: node scripts/testStand/fetchLua.ts"
    }

    if ($null -eq ('StreamoScopeTests.LuaNative' -as [type])) {
        Add-Type -TypeDefinition @'
using System;
using System.Runtime.InteropServices;

namespace StreamoScopeTests {
    public static class LuaNative {
        [DllImport("kernel32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
        public static extern IntPtr LoadLibraryW(string path);

        [DllImport("lua51.dll", CallingConvention = CallingConvention.Cdecl)]
        public static extern IntPtr luaL_newstate();

        [DllImport("lua51.dll", CallingConvention = CallingConvention.Cdecl)]
        public static extern void luaL_openlibs(IntPtr state);

        [DllImport("lua51.dll", CallingConvention = CallingConvention.Cdecl)]
        public static extern int luaL_loadstring(IntPtr state, byte[] source);

        [DllImport("lua51.dll", CallingConvention = CallingConvention.Cdecl)]
        public static extern int lua_pcall(IntPtr state, int argumentCount, int resultCount, int errorHandler);

        [DllImport("lua51.dll", CallingConvention = CallingConvention.Cdecl)]
        public static extern IntPtr lua_tolstring(IntPtr state, int index, out UIntPtr length);

        [DllImport("lua51.dll", CallingConvention = CallingConvention.Cdecl)]
        public static extern void lua_close(IntPtr state);
    }
}
'@
    }

    if ([StreamoScopeTests.LuaNative]::LoadLibraryW($libraryPath) -eq [IntPtr]::Zero) {
        throw "Could not load $libraryPath"
    }
}
