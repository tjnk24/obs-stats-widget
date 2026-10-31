function Invoke-Installer {
    param(
        [Parameter(Mandatory)][string]$SetupPath
    )

    $process = Start-Process -FilePath $SetupPath -ArgumentList '/VERYSILENT', '/SUPPRESSMSGBOXES', '/NORESTART' -WorkingDirectory ([System.IO.Path]::GetTempPath()) -Wait -PassThru

    return $process.ExitCode
}
