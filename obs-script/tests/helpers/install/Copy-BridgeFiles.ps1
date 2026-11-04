function Copy-BridgeFiles {
    param(
        [Parameter(Mandatory)][string]$TargetDirectory
    )

    $sourceDirectory = Join-Path (Get-RepositoryRoot) 'obs-script'

    New-Item -ItemType Directory -Path $TargetDirectory -Force | Out-Null
    Copy-Item -LiteralPath (Join-Path $sourceDirectory 'streamoscope-bridge.lua') -Destination $TargetDirectory
    Copy-Item -LiteralPath (Join-Path $sourceDirectory 'streamoscope-bridge') -Destination $TargetDirectory -Recurse
}
