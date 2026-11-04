function Get-AutoUpdateAction {
    param(
        [Parameter(Mandatory)]$Release,
        [Parameter(Mandatory)][string]$InstalledVersion,
        [Parameter(Mandatory)][DateTimeOffset]$Now
    )

    if ((Compare-SemanticVersion -First $Release.Version -Second $InstalledVersion) -le 0) {
        return 'upToDate'
    }

    if ($Release.Version.Split('.')[0] -ne $InstalledVersion.Split('.')[0]) {
        return 'manualOnly'
    }

    if (($Now - $Release.PublishedAt).TotalHours -lt $script:AutoInstallDelayHours) {
        return 'tooFresh'
    }

    return 'install'
}
