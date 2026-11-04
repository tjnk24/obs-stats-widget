$script:SemanticVersionPattern = '^(\d+)\.(\d+)\.(\d+)$'
$script:DownloadTimeoutMilliseconds = 30000
$script:DownloadBufferBytes = 65536
$script:CurrentVersionFileName = 'current-version.js'
$script:CurrentVersionFilePattern = '\d+\.\d+\.\d+'
$script:CurrentVersionFileTemplate = "window.STREAMOSCOPE_VERSION = '{0}';`r`n"
$script:VersionsDirectoryName = 'versions'
$script:KeptVersionCount = 3
$script:RequiredPackageFiles = @('dock\index.html', 'streamoscope-bridge\main.lua', 'updater\Update-Widget.ps1', 'compatibility.json')
$script:UninstallRegistryKey = 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\{6D39D358-2386-4437-8FE3-CF5511816FD1}_is1'
$script:AutoCheckStampFileName = 'update-check.stamp'
$script:AutoCheckMinIntervalHours = 1
$script:AutoInstallDelayHours = 48
$script:SuccessfulResults = @('done', 'notDue', 'upToDate', 'tooFresh', 'manualOnly')
