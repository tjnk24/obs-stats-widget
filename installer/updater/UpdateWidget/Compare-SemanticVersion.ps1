$script:SemanticVersionPattern = '^(\d+)\.(\d+)\.(\d+)$'

function Compare-SemanticVersion {
    param(
        [Parameter(Mandatory)][string]$First,
        [Parameter(Mandatory)][string]$Second
    )

    $firstMatch = [regex]::Match($First, $script:SemanticVersionPattern)
    $secondMatch = [regex]::Match($Second, $script:SemanticVersionPattern)

    if (-not $firstMatch.Success -or -not $secondMatch.Success) {
        throw "Not a version: '$First' or '$Second'"
    }

    for ($part = 1; $part -le 3; $part++) {
        $difference = [int64]$firstMatch.Groups[$part].Value - [int64]$secondMatch.Groups[$part].Value

        if ($difference -ne 0) {
            return [Math]::Sign($difference)
        }
    }

    return 0
}
