function Test-PortableObs {
    param(
        [AllowNull()][AllowEmptyString()][string]$ObsDirectory
    )

    if ([string]::IsNullOrEmpty($ObsDirectory)) {
        return $false
    }

    foreach ($marker in $script:PortableMarkers) {
        if (Test-Path -LiteralPath (Join-Path $ObsDirectory $marker)) {
            return $true
        }
    }

    return $false
}
