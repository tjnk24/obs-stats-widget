function Get-ObsVersion {
    $obsDirectory = Find-ObsDirectory

    if ([string]::IsNullOrEmpty($obsDirectory)) {
        return $null
    }

    $productVersion = (Get-Item -LiteralPath (Join-Path $obsDirectory 'bin\64bit\obs64.exe')).VersionInfo.ProductVersion
    $match = [regex]::Match([string]$productVersion, '^(\d+)\.(\d+)\.(\d+)')

    if (-not $match.Success) {
        return $null
    }

    return $match.Value
}
