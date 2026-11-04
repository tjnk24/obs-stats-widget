function Expand-UpdatePackage {
    param(
        [Parameter(Mandatory)][string]$PackagePath,
        [Parameter(Mandatory)][string]$VersionsDirectory,
        [Parameter(Mandatory)][string]$Version
    )

    Add-Type -AssemblyName System.IO.Compression.FileSystem

    $stagingDirectory = Join-Path $VersionsDirectory "staging-$Version"
    $targetDirectory = Join-Path $VersionsDirectory $Version
    $packageDirectory = Join-Path $stagingDirectory "streamoscope-$Version"

    foreach ($directory in @($stagingDirectory, $targetDirectory)) {
        if (Test-Path -LiteralPath $directory) {
            Remove-Item -LiteralPath $directory -Recurse -Force
        }
    }

    New-Item -ItemType Directory -Path $stagingDirectory -Force | Out-Null

    try {
        [System.IO.Compression.ZipFile]::ExtractToDirectory($PackagePath, $stagingDirectory)

        foreach ($requiredFile in $script:RequiredPackageFiles) {
            if (-not (Test-Path -LiteralPath (Join-Path $packageDirectory $requiredFile))) {
                throw "$requiredFile is missing from the package"
            }
        }

        $packageVersion = (Get-Content -LiteralPath (Join-Path $packageDirectory 'compatibility.json') -Raw -Encoding UTF8 | ConvertFrom-Json).version

        if ($packageVersion -ne $Version) {
            throw "The package holds version $packageVersion"
        }

        Move-Item -LiteralPath $packageDirectory -Destination $targetDirectory
    } finally {
        Remove-Item -LiteralPath $stagingDirectory -Recurse -Force -ErrorAction SilentlyContinue
    }
}
