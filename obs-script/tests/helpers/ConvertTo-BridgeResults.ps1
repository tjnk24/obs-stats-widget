function ConvertTo-BridgeResults {
    param(
        [Parameter(Mandatory)][string]$Text
    )

    $results = @{}

    foreach ($line in $Text -split "`n") {
        $name, $value = $line -split '=', 2
        $results[$name] = $value
    }

    return $results
}
