function Set-UninstallDisplayVersion {
    param(
        [Parameter(Mandatory)][string]$Version
    )

    if (Test-Path -LiteralPath $script:UninstallRegistryKey) {
        Set-ItemProperty -LiteralPath $script:UninstallRegistryKey -Name 'DisplayVersion' -Value $Version -ErrorAction SilentlyContinue
    }
}
