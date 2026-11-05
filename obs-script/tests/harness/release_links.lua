local results = {}

local function record(name, value)
    results[#results + 1] = name .. '=' .. tostring(value)
end

local process = require('streamoscope-bridge.utils.process')
local opened_command_lines = {}

process.start_hidden = function(command_line)
    opened_command_lines[#opened_command_lines + 1] = command_line

    return true
end

store['StreamoScope/OpenUrlCommand'] = 'https://github.com/tjnk24/streamoscope/releases'
script_unload()
script_load({})
timers[250]()
record('staleCommandLeft', store['StreamoScope/OpenUrlCommand'] ~= nil)
record('staleCommandOpened', #opened_command_lines)

store['StreamoScope/OpenUrlCommand'] = 'https://github.com/tjnk24/streamoscope/releases'
timers[250]()
record('freshCommandOpened', #opened_command_lines)

script_unload()

return table.concat(results, '\n')
