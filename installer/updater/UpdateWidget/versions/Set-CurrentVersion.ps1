function Set-CurrentVersion {
    param(
        [Parameter(Mandatory)][string]$InstallDirectory,
        [Parameter(Mandatory)][string]$Version
    )

    $path = Join-Path $InstallDirectory $script:CurrentVersionFileName
    $temporaryPath = "$path.tmp"

    [System.IO.File]::WriteAllText($temporaryPath, ($script:CurrentVersionFileTemplate -f $Version), [System.Text.UTF8Encoding]::new($false))
    [System.IO.File]::Replace($temporaryPath, $path, [NullString]::Value)
}
