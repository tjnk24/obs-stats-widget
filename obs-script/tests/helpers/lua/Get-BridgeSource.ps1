function Get-BridgeSource {
    param(
        [Parameter(Mandatory)][string]$InstallRoot,
        [Parameter(Mandatory)][string]$ScenarioFileName
    )

    $harnessDirectory = Join-Path $PSScriptRoot '..\..\harness'
    $utf8 = [System.Text.Encoding]::UTF8
    $stub = [System.IO.File]::ReadAllText((Join-Path $harnessDirectory 'obs_stub.lua'), $utf8)
    $scenario = [System.IO.File]::ReadAllText((Join-Path $harnessDirectory $ScenarioFileName), $utf8)
    $loader = [System.IO.File]::ReadAllText((Join-Path $InstallRoot 'streamoscope-bridge.lua'), $utf8)

    return ($stub + $scenario).Replace('__ROOT__', $InstallRoot.Replace('\', '/') + '/').Replace('__LOADER__', $loader)
}
