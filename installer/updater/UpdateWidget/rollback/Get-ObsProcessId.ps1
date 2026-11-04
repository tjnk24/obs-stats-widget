function Get-ObsProcessId {
    $process = Get-Process -Name $script:ObsProcessName -ErrorAction SilentlyContinue | Select-Object -First 1

    if ($null -eq $process) {
        return 0
    }

    return $process.Id
}
