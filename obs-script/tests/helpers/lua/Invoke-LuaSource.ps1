function Invoke-LuaSource {
    param(
        [Parameter(Mandatory)][string]$Source
    )

    $state = [StreamoScopeTests.LuaNative]::luaL_newstate()

    try {
        [StreamoScopeTests.LuaNative]::luaL_openlibs($state)

        $sourceBytes = [System.Text.Encoding]::UTF8.GetBytes($Source + [char]0)
        $status = [StreamoScopeTests.LuaNative]::luaL_loadstring($state, $sourceBytes)

        if ($status -eq 0) {
            $status = [StreamoScopeTests.LuaNative]::lua_pcall($state, 0, 1, 0)
        }

        $length = [UIntPtr]::Zero
        $pointer = [StreamoScopeTests.LuaNative]::lua_tolstring($state, -1, [ref]$length)
        $text = ''

        if ($pointer -ne [IntPtr]::Zero) {
            $textBytes = New-Object byte[] ([int]$length.ToUInt32())
            [System.Runtime.InteropServices.Marshal]::Copy($pointer, $textBytes, 0, $textBytes.Length)
            $text = [System.Text.Encoding]::UTF8.GetString($textBytes)
        }

        return [pscustomobject]@{
            IsFailed = $status -ne 0
            Text = $text
        }
    } finally {
        [StreamoScopeTests.LuaNative]::lua_close($state)
    }
}
