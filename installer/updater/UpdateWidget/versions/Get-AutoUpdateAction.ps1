function Get-AutoUpdateAction {
    param(
        [Parameter(Mandatory)]$Release,
        [Parameter(Mandatory)][string]$InstalledVersion,
        [AllowNull()][string]$RolledBackVersion,
        [Parameter(Mandatory)][DateTimeOffset]$Now
    )

    if ((Compare-SemanticVersion -First $Release.Version -Second $InstalledVersion) -le 0) {
        return 'upToDate'
    }

    if (-not [string]::IsNullOrEmpty($RolledBackVersion) -and (Compare-SemanticVersion -First $Release.Version -Second $RolledBackVersion) -le 0) {
        return 'rolledBack'
    }

    if ($Release.Version.Split('.')[0] -ne $InstalledVersion.Split('.')[0]) {
        return 'manualOnly'
    }

    if (($Now - $Release.PublishedAt).TotalHours -lt $script:AutoInstallDelayHours) {
        return 'tooFresh'
    }

    return 'install'
}
