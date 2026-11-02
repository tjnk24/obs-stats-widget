BeforeAll {
    $updaterDirectory = Join-Path $PSScriptRoot '..\updater'

    Get-ChildItem -LiteralPath (Join-Path $updaterDirectory 'UpdateWidget') -Filter '*.ps1' | ForEach-Object { . $_.FullName }
    . (Join-Path $PSScriptRoot '..\ConfigureObs\paths\Find-ObsDirectory.ps1')

    $script:minisign = $env:OBS_STATS_WIDGET_MINISIGN

    if ([string]::IsNullOrEmpty($script:minisign) -or -not (Test-Path -LiteralPath $script:minisign)) {
        throw 'Run the tests with npm run test:installer: minisign.exe is needed'
    }

    function New-TestKey {
        param([string]$Name)

        $directory = Join-Path $TestDrive "keys-$Name"
        New-Item -ItemType Directory -Path $directory -Force | Out-Null
        & $script:minisign -G -W -p (Join-Path $directory 'key.pub') -s (Join-Path $directory 'key.sec') | Out-Null

        return [pscustomobject]@{
            Secret = Join-Path $directory 'key.sec'
            Public = (Get-Content -LiteralPath (Join-Path $directory 'key.pub'))[1]
        }
    }

    function Add-TestSignature {
        param([string]$Path, $Key)

        & $script:minisign -S -s $Key.Secret -m $Path | Out-Null
    }

    $script:releaseKey = New-TestKey -Name 'release'
    $script:otherKey = New-TestKey -Name 'other'

    function New-TestRelease {
        param(
            [string]$Version = '0.2.0',
            [string]$CompatibilityVersion = $Version,
            [string]$MinObsVersion = '28.0.0',
            $Key = $script:releaseKey,
            [switch]$TamperSetup,
            [switch]$SkipSetup
        )

        $root = Join-Path $TestDrive ([guid]::NewGuid().ToString('N'))
        $release = Join-Path $root "release\v$Version"
        $install = Join-Path $root 'install'

        New-Item -ItemType Directory -Path $release, $install -Force | Out-Null
        Set-Content -LiteralPath (Join-Path $install 'compatibility.json') -Value '{"version": "0.1.0"}'

        $compatibility = Join-Path $release 'compatibility.json'
        Set-Content -LiteralPath $compatibility -Value ("{`"version`": `"$CompatibilityVersion`", `"minObsVersion`": `"$MinObsVersion`"}")
        Add-TestSignature -Path $compatibility -Key $Key

        if (-not $SkipSetup) {
            $setup = Join-Path $release "streamoscope-setup-$Version.exe"
            [System.IO.File]::WriteAllBytes($setup, [byte[]]::new(300000))
            Add-TestSignature -Path $setup -Key $Key

            if ($TamperSetup) {
                [System.IO.File]::AppendAllText($setup, 'tampered')
            }
        }

        return [pscustomobject]@{
            BaseUrl = [System.Uri]::new((Join-Path $root 'release')).AbsoluteUri
            Install = $install
            Status = Join-Path $root 'data\update-status.json'
        }
    }

    function Invoke-TestUpdate {
        param($Release, [string]$Version = '0.2.0')

        return Invoke-UpdateWidget -Version $Version -InstallDirectory $Release.Install -StatusPath $Release.Status -ReleaseBaseUrl $Release.BaseUrl -PublicKey $script:releaseKey.Public -MinisignPath $script:minisign
    }

    function Get-TestStatus {
        param($Release)

        return Get-Content -LiteralPath $Release.Status -Raw | ConvertFrom-Json
    }
}

Describe 'Compare-SemanticVersion' {
    It 'compares <First> and <Second> as <Expected>' -TestCases @(
        @{First = '0.2.0'; Second = '0.1.9'; Expected = 1},
        @{First = '0.10.0'; Second = '0.9.0'; Expected = 1},
        @{First = '1.0.0'; Second = '1.0.0'; Expected = 0},
        @{First = '1.2.3'; Second = '1.10.0'; Expected = -1}
    ) {
        param($First, $Second, $Expected)

        Compare-SemanticVersion -First $First -Second $Second | Should -Be $Expected
    }

    It 'rejects anything but X.Y.Z' {
        { Compare-SemanticVersion -First '1.2' -Second '1.2.0' } | Should -Throw
        { Compare-SemanticVersion -First '1.2.0-beta' -Second '1.2.0' } | Should -Throw
    }
}

Describe 'Invoke-UpdateWidget' {
    BeforeEach {
        Mock Invoke-Installer { 0 }
        Mock Get-ObsVersion { '33.0.1' }
    }

    It 'downloads, verifies and installs a newer signed release' {
        $release = New-TestRelease

        Invoke-TestUpdate -Release $release | Should -Be 'done'
        (Get-TestStatus -Release $release).stage | Should -Be 'done'
        (Get-TestStatus -Release $release).version | Should -Be '0.2.0'
        Should -Invoke Invoke-Installer -Times 1 -ParameterFilter { $SetupPath -like '*streamoscope-setup-0.2.0.exe' }
        Test-Path -LiteralPath (Join-Path ([System.IO.Path]::GetTempPath()) 'streamoscope-update-0.2.0') | Should -BeFalse
    }

    It 'reports every stage and the download progress' {
        $release = New-TestRelease
        $script:stages = @()

        Mock Write-UpdateStatus { $script:stages += "$Stage $Percent" }

        Invoke-TestUpdate -Release $release | Should -Be 'done'
        $downloads = @($script:stages | Where-Object { $_ -like 'downloading *' } | ForEach-Object { [int]$_.Split(' ')[1] })

        $script:stages[0] | Should -Be 'preparing 0'
        $downloads.Count | Should -BeGreaterThan 3
        ($downloads | Sort-Object) -join ',' | Should -Be ($downloads -join ',')
        $downloads[-1] | Should -Be 100
        $script:stages[-2] | Should -Be 'installing 100'
        $script:stages[-1] | Should -Be 'done 100'
    }

    It 'refuses <Version> as <Expected>' -TestCases @(
        @{Version = '0.1.0'; Expected = 'notNewer'},
        @{Version = '0.0.9'; Expected = 'notNewer'},
        @{Version = '0.2'; Expected = 'invalidVersion'},
        @{Version = '0.2.0; calc'; Expected = 'invalidVersion'}
    ) {
        param($Version, $Expected)

        $release = New-TestRelease

        Invoke-TestUpdate -Release $release -Version $Version | Should -Be $Expected
        (Get-TestStatus -Release $release).error | Should -Be $Expected
        Should -Invoke Invoke-Installer -Times 0
    }

    It 'reports a network error when the release is missing' {
        $release = New-TestRelease -SkipSetup

        Invoke-TestUpdate -Release $release | Should -Be 'network'
        Should -Invoke Invoke-Installer -Times 0
    }

    It 'never installs a setup that was changed after signing' {
        $release = New-TestRelease -TamperSetup

        Invoke-TestUpdate -Release $release | Should -Be 'signature'
        Should -Invoke Invoke-Installer -Times 0
    }

    It 'never installs a release signed with another key' {
        $release = New-TestRelease -Key $script:otherKey

        Invoke-TestUpdate -Release $release | Should -Be 'signature'
        Should -Invoke Invoke-Installer -Times 0
    }

    It 'rejects compatibility data of another version' {
        $release = New-TestRelease -CompatibilityVersion '0.3.0'

        Invoke-TestUpdate -Release $release | Should -Be 'signature'
    }

    It 'stops when OBS is older than the release needs' {
        Mock Get-ObsVersion { '27.2.4' }
        $release = New-TestRelease -MinObsVersion '28.0.0'

        Invoke-TestUpdate -Release $release | Should -Be 'incompatible'
        Should -Invoke Invoke-Installer -Times 0
    }

    It 'goes on when the OBS version is unknown' {
        Mock Get-ObsVersion { $null }

        Invoke-TestUpdate -Release (New-TestRelease) | Should -Be 'done'
    }

    It 'reports a failed setup' {
        Mock Invoke-Installer { 1 }

        Invoke-TestUpdate -Release (New-TestRelease) | Should -Be 'install'
    }

    It 'does not start a second update while one is running' {
        $release = New-TestRelease
        New-Item -ItemType Directory -Path (Split-Path -Parent $release.Status) -Force | Out-Null
        Set-Content -LiteralPath $release.Status -Value '{"stage": "downloading"}'
        $lock = [System.IO.File]::Open("$($release.Status).lock", 'OpenOrCreate', 'ReadWrite', 'None')

        try {
            Invoke-TestUpdate -Release $release | Should -Be 'busy'
            (Get-TestStatus -Release $release).stage | Should -Be 'downloading'
        } finally {
            $lock.Dispose()
        }
    }
}

Describe 'Update-Widget.ps1' {
    It 'checks updates with the public key from minisign.pub' {
        $script = Get-Content -LiteralPath (Join-Path $updaterDirectory 'Update-Widget.ps1') -Raw
        $publicKey = (Get-Content -LiteralPath (Join-Path $PSScriptRoot '..\..\minisign.pub'))[1]

        $script | Should -Match ([regex]::Escape("[string]`$PublicKey = '$publicKey'"))
    }

    It 'exits with 1 and writes a failed status for a bad version' {
        $status = Join-Path $TestDrive 'entry\update-status.json'
        $process = Start-Process powershell.exe -ArgumentList @('-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-File', "`"$(Join-Path $updaterDirectory 'Update-Widget.ps1')`"", '-Version', 'bad', '-InstallDirectory', "`"$(Join-Path $PSScriptRoot '..')`"", '-StatusPath', "`"$status`"") -Wait -PassThru -WindowStyle Hidden

        $process.ExitCode | Should -Be 1
        (Get-Content -LiteralPath $status -Raw | ConvertFrom-Json).error | Should -Be 'invalidVersion'
    }
}
