function Get-LatestRelease {
    param(
        [Parameter(Mandatory)][string]$Url
    )

    $responsePath = [System.IO.Path]::GetTempFileName()

    try {
        Get-UpdateFile -Url $Url -Path $responsePath

        $release = Get-Content -LiteralPath $responsePath -Raw -Encoding UTF8 | ConvertFrom-Json
    } finally {
        Remove-Item -LiteralPath $responsePath -Force -ErrorAction SilentlyContinue
    }

    return [pscustomobject]@{
        Version = ([string]$release.tag_name) -replace '^v', ''
        PublishedAt = [DateTimeOffset]::Parse([string]$release.published_at, [System.Globalization.CultureInfo]::InvariantCulture)
    }
}
