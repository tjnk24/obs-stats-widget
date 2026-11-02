param(
    [Parameter(Mandatory)][string]$Version,
    [string]$InstallDirectory,
    [string]$StatusPath = (Join-Path $env:LOCALAPPDATA 'streamoscope\update-status.json'),
    [string]$ReleaseBaseUrl = 'https://github.com/tjnk24/streamoscope/releases/download',
    [string]$PublicKey = 'RWRzpUdJutr3gDJeHN8YtU6E/Vw3Am48D72eSvZaX1EWA69uhrc6f3f2',
    [string]$MinisignPath
)

$ErrorActionPreference = 'Stop'

$scriptDirectory = Split-Path -Parent $MyInvocation.MyCommand.Path

if ([string]::IsNullOrEmpty($InstallDirectory)) {
    $InstallDirectory = Split-Path -Parent $scriptDirectory
}

if ([string]::IsNullOrEmpty($MinisignPath)) {
    $MinisignPath = Join-Path $scriptDirectory 'minisign.exe'
}

$env:PSModulePath = @(
    (Join-Path $env:ProgramFiles 'WindowsPowerShell\Modules'),
    (Join-Path $env:SystemRoot 'System32\WindowsPowerShell\v1.0\Modules')
) -join ';'

[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12

Get-ChildItem -LiteralPath (Join-Path $scriptDirectory 'UpdateWidget') -Filter '*.ps1' | ForEach-Object { . $_.FullName }
. (Join-Path $InstallDirectory 'ConfigureObs\paths\Find-ObsDirectory.ps1')

try {
    $result = Invoke-UpdateWidget -Version $Version -InstallDirectory $InstallDirectory -StatusPath $StatusPath -ReleaseBaseUrl $ReleaseBaseUrl -PublicKey $PublicKey -MinisignPath $MinisignPath
} catch {
    Write-UpdateStatus -Path $StatusPath -Version $Version -Stage 'failed' -ErrorCode 'unexpected'
    $result = 'unexpected'
}

exit $(if ($result -eq 'done') { 0 } else { 1 })
