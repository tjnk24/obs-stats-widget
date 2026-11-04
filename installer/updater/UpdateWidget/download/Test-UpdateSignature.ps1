function Test-UpdateSignature {
    param(
        [Parameter(Mandatory)][string]$MinisignPath,
        [Parameter(Mandatory)][string]$FilePath,
        [Parameter(Mandatory)][string]$PublicKey
    )

    if (-not (Test-Path -LiteralPath $MinisignPath) -or -not (Test-Path -LiteralPath "$FilePath.minisig")) {
        return $false
    }

    $ErrorActionPreference = 'Continue'

    & $MinisignPath -V -q -m $FilePath -x "$FilePath.minisig" -P $PublicKey 2>$null | Out-Null

    return $LASTEXITCODE -eq 0
}
