function Get-InstalledVersion {
    param(
        [Parameter(Mandatory)][string]$InstallDirectory
    )

    $content = Get-Content -LiteralPath (Join-Path $InstallDirectory $script:CurrentVersionFileName) -Raw
    $match = [regex]::Match($content, $script:CurrentVersionFilePattern)

    if (-not $match.Success) {
        throw "No version in $script:CurrentVersionFileName"
    }

    return $match.Value
}
