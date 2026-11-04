function Remove-OldVersions {
    param(
        [Parameter(Mandatory)][string]$VersionsDirectory,
        [Parameter(Mandatory)][string[]]$ProtectedVersions
    )

    Get-ChildItem -LiteralPath $VersionsDirectory -Directory |
        Where-Object { $_.Name -match $script:SemanticVersionPattern } |
        Sort-Object { [version]$_.Name } -Descending |
        Select-Object -Skip $script:KeptVersionCount |
        Where-Object { $ProtectedVersions -notcontains $_.Name } |
        ForEach-Object { Remove-Item -LiteralPath $_.FullName -Recurse -Force -ErrorAction SilentlyContinue }
}
