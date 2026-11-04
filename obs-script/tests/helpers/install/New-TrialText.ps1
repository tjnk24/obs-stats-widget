function New-TrialText {
    param(
        [string]$Panel = '1',
        [string]$Version = $script:NewVersion,
        [int]$ProcessId = $script:FakeProcessId
    )

    return $script:TrialTemplate -f $Version, $script:PreviousVersion, $Panel, $ProcessId, 0
}
