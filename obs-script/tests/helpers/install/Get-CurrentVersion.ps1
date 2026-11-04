function Get-CurrentVersion {
    param(
        [Parameter(Mandatory)][string]$InstallRoot
    )

    return ([System.IO.File]::ReadAllText((Join-Path $InstallRoot 'current-version.js')) -split "'")[1]
}
