function Get-RepositoryRoot {
    return (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..\..\..')).Path
}
