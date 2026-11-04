function Get-RolledBackVersion {
    param(
        [Parameter(Mandatory)][string]$InstallDirectory
    )

    $path = Join-Path $InstallDirectory $script:RolledBackVersionFileName

    if (-not (Test-Path -LiteralPath $path)) {
        return $null
    }

    return (Get-Content -LiteralPath $path -Raw).Trim()
}
