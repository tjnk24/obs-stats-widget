function Write-UpdateStatus {
    param(
        [Parameter(Mandatory)][string]$Path,
        [Parameter(Mandatory)][string]$Version,
        [Parameter(Mandatory)][ValidateSet('preparing', 'downloading', 'verifying', 'installing', 'done', 'failed')][string]$Stage,
        [int]$Percent = 0,
        [AllowNull()][string]$ErrorCode
    )

    $status = [ordered]@{
        version = $Version
        stage = $Stage
        percent = $Percent
        error = if ([string]::IsNullOrEmpty($ErrorCode)) { $null } else { $ErrorCode }
        updated = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
    }

    $directory = Split-Path -Parent $Path

    if (-not (Test-Path -LiteralPath $directory)) {
        New-Item -ItemType Directory -Path $directory -Force | Out-Null
    }

    $temporaryPath = "$Path.tmp"

    [System.IO.File]::WriteAllText($temporaryPath, ($status | ConvertTo-Json -Compress), [System.Text.UTF8Encoding]::new($false))
    Move-Item -LiteralPath $temporaryPath -Destination $Path -Force
}
