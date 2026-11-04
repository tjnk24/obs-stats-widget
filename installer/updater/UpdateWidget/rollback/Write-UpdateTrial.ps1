function Write-UpdateTrial {
    param(
        [Parameter(Mandatory)][string]$InstallDirectory,
        [Parameter(Mandatory)][string]$Version,
        [Parameter(Mandatory)][string]$PreviousVersion
    )

    $healthyVersionPath = Join-Path $InstallDirectory $script:HealthyVersionFileName
    $isPanelChecked = (Test-Path -LiteralPath $healthyVersionPath) -and (Get-Content -LiteralPath $healthyVersionPath -Raw).Trim() -eq $PreviousVersion
    $panelFlag = if ($isPanelChecked) { '1' } else { '0' }
    $content = $script:TrialFileTemplate -f $Version, $PreviousVersion, $panelFlag, (Get-ObsProcessId)

    [System.IO.File]::WriteAllText((Join-Path $InstallDirectory $script:TrialFileName), $content, [System.Text.UTF8Encoding]::new($false))
}
