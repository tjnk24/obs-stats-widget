function Invoke-AutoUpdate {
    param(
        [Parameter(Mandatory)][string]$InstallDirectory,
        [Parameter(Mandatory)][string]$StatusPath,
        [Parameter(Mandatory)][string]$ReleaseBaseUrl,
        [Parameter(Mandatory)][string]$LatestReleaseUrl,
        [Parameter(Mandatory)][string]$PublicKey,
        [Parameter(Mandatory)][string]$MinisignPath
    )

    $stampPath = Join-Path (Split-Path -Parent $StatusPath) $script:AutoCheckStampFileName

    if ((Test-Path -LiteralPath $stampPath) -and ([DateTime]::UtcNow - (Get-Item -LiteralPath $stampPath).LastWriteTimeUtc).TotalHours -lt $script:AutoCheckMinIntervalHours) {
        return 'notDue'
    }

    $release = Get-LatestRelease -Url $LatestReleaseUrl

    New-Item -ItemType Directory -Path (Split-Path -Parent $StatusPath) -Force | Out-Null
    [System.IO.File]::WriteAllText($stampPath, '')

    $action = Get-AutoUpdateAction -Release $release -InstalledVersion (Get-InstalledVersion -InstallDirectory $InstallDirectory) -Now ([DateTimeOffset]::UtcNow)

    if ($action -ne 'install') {
        return $action
    }

    return Invoke-UpdateWidget -Version $release.Version -InstallDirectory $InstallDirectory -StatusPath $StatusPath -ReleaseBaseUrl $ReleaseBaseUrl -PublicKey $PublicKey -MinisignPath $MinisignPath
}
