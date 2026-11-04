function Invoke-UpdateWidget {
    param(
        [Parameter(Mandatory)][string]$Version,
        [Parameter(Mandatory)][string]$InstallDirectory,
        [Parameter(Mandatory)][string]$StatusPath,
        [Parameter(Mandatory)][string]$ReleaseBaseUrl,
        [Parameter(Mandatory)][string]$PublicKey,
        [Parameter(Mandatory)][string]$MinisignPath
    )

    $statusDirectory = Split-Path -Parent $StatusPath

    New-Item -ItemType Directory -Path $statusDirectory -Force | Out-Null

    try {
        $lock = [System.IO.File]::Open("$StatusPath.lock", 'OpenOrCreate', 'ReadWrite', 'None')
    } catch [System.IO.IOException] {
        return 'busy'
    }

    $report = {
        param([string]$Stage, [int]$Percent = 0, [string]$ErrorCode)

        Write-UpdateStatus -Path $StatusPath -Version $Version -Stage $Stage -Percent $Percent -ErrorCode $ErrorCode
    }

    $fail = {
        param([string]$ErrorCode)

        & $report 'failed' 0 $ErrorCode

        return $ErrorCode
    }

    $workDirectory = Join-Path ([System.IO.Path]::GetTempPath()) "streamoscope-update-$Version"
    $versionsDirectory = Join-Path $InstallDirectory $script:VersionsDirectoryName

    try {
        & $report 'preparing'

        if ($Version -notmatch '^\d+\.\d+\.\d+$') {
            return & $fail 'invalidVersion'
        }

        $installedVersion = Get-InstalledVersion -InstallDirectory $InstallDirectory

        $versionOrder = Compare-SemanticVersion -First $Version -Second $installedVersion

        if ($versionOrder -lt 0) {
            return & $fail 'notNewer'
        }

        if ($versionOrder -eq 0) {
            & $report 'done' 100

            return 'done'
        }

        if (Test-Path -LiteralPath $workDirectory) {
            Remove-Item -LiteralPath $workDirectory -Recurse -Force
        }

        New-Item -ItemType Directory -Path $workDirectory | Out-Null

        $releaseUrl = "$($ReleaseBaseUrl.TrimEnd('/'))/v$Version"
        $compatibilityPath = Join-Path $workDirectory 'compatibility.json'
        $packageName = "streamoscope-$Version.zip"
        $packagePath = Join-Path $workDirectory $packageName

        try {
            Get-UpdateFile -Url "$releaseUrl/compatibility.json" -Path $compatibilityPath
            Get-UpdateFile -Url "$releaseUrl/compatibility.json.minisig" -Path "$compatibilityPath.minisig"
        } catch {
            return & $fail 'network'
        }

        & $report 'verifying'

        if (-not (Test-UpdateSignature -MinisignPath $MinisignPath -FilePath $compatibilityPath -PublicKey $PublicKey)) {
            return & $fail 'signature'
        }

        $compatibility = Get-Content -LiteralPath $compatibilityPath -Raw -Encoding UTF8 | ConvertFrom-Json

        if ($compatibility.version -ne $Version) {
            return & $fail 'signature'
        }

        $obsVersion = Get-ObsVersion

        if ($null -ne $obsVersion -and (Compare-SemanticVersion -First $obsVersion -Second $compatibility.minObsVersion) -lt 0) {
            return & $fail 'incompatible'
        }

        & $report 'downloading'

        try {
            Get-UpdateFile -Url "$releaseUrl/$packageName" -Path $packagePath -OnProgress { param([int]$Percent) & $report 'downloading' $Percent }
            Get-UpdateFile -Url "$releaseUrl/$packageName.minisig" -Path "$packagePath.minisig"
        } catch {
            return & $fail 'network'
        }

        & $report 'verifying' 100

        if (-not (Test-UpdateSignature -MinisignPath $MinisignPath -FilePath $packagePath -PublicKey $PublicKey)) {
            return & $fail 'signature'
        }

        & $report 'installing' 100

        try {
            Expand-UpdatePackage -PackagePath $packagePath -VersionsDirectory $versionsDirectory -Version $Version
            Set-CurrentVersion -InstallDirectory $InstallDirectory -Version $Version
        } catch {
            return & $fail 'install'
        }

        Remove-OldVersions -VersionsDirectory $versionsDirectory
        Set-UninstallDisplayVersion -Version $Version

        & $report 'done' 100

        return 'done'
    } finally {
        if (Test-Path -LiteralPath $workDirectory) {
            Remove-Item -LiteralPath $workDirectory -Recurse -Force -ErrorAction SilentlyContinue
        }

        $lock.Dispose()
    }
}
