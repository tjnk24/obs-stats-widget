function Write-UpdateTrial {
    param(
        [Parameter(Mandatory)][string]$InstallDirectory,
        [Parameter(Mandatory)][string]$Version,
        [Parameter(Mandatory)][string]$PreviousVersion
    )

    $healthyVersionPath = Join-Path $InstallDirectory $script:HealthyVersionFileName
    $healthyProcessPath = Join-Path $InstallDirectory $script:HealthyProcessFileName
    $obsProcessId = Get-ObsProcessId
    $isPanelChecked = (Test-Path -LiteralPath $healthyVersionPath) -and
        (Get-Content -LiteralPath $healthyVersionPath -Raw).Trim() -eq $PreviousVersion -and
        (Test-Path -LiteralPath $healthyProcessPath) -and
        (Get-Content -LiteralPath $healthyProcessPath -Raw).Trim() -eq [string]$obsProcessId
    $panelFlag = if ($isPanelChecked) { '1' } else { '0' }
    $content = $script:TrialFileTemplate -f $Version, $PreviousVersion, $panelFlag, $obsProcessId

    [System.IO.File]::WriteAllText((Join-Path $InstallDirectory $script:TrialFileName), $content, [System.Text.UTF8Encoding]::new($false))
}
