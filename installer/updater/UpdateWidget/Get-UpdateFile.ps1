function Get-UpdateFile {
    param(
        [Parameter(Mandatory)][string]$Url,
        [Parameter(Mandatory)][string]$Path,
        [scriptblock]$OnProgress
    )

    $request = [System.Net.WebRequest]::Create($Url)
    $request.Timeout = $script:DownloadTimeoutMilliseconds

    if ($request -is [System.Net.HttpWebRequest]) {
        $request.ReadWriteTimeout = $script:DownloadTimeoutMilliseconds
        $request.UserAgent = 'obs-stats-widget-updater'
    }

    $response = $request.GetResponse()

    try {
        $total = $response.ContentLength
        $stream = $response.GetResponseStream()
        $file = [System.IO.File]::Create($Path)

        try {
            $buffer = New-Object byte[] $script:DownloadBufferBytes
            $received = 0
            $reportedPercent = -1

            while (($read = $stream.Read($buffer, 0, $buffer.Length)) -gt 0) {
                $file.Write($buffer, 0, $read)
                $received += $read

                if ($null -ne $OnProgress -and $total -gt 0) {
                    $percent = [int][Math]::Floor($received * 100 / $total)

                    if ($percent -ne $reportedPercent) {
                        & $OnProgress $percent
                        $reportedPercent = $percent
                    }
                }
            }
        } finally {
            $file.Dispose()
            $stream.Dispose()
        }
    } finally {
        $response.Dispose()
    }
}
