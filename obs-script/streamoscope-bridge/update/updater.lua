local consts = require('streamoscope-bridge.consts')
local environment = require('streamoscope-bridge.utils.environment')
local process = require('streamoscope-bridge.utils.process')
local profile_parameter = require('streamoscope-bridge.utils.profile_parameter')
local text_file = require('streamoscope-bridge.utils.text_file')

local Updater = {}

Updater.__index = Updater

local function start_update(self, version)
    local command_line = string.format(
        'powershell.exe -NoProfile -NonInteractive -ExecutionPolicy Bypass -File "%s" -Version %s',
        self.script_path,
        version
    )

    return process.start_hidden(command_line, environment.get('TEMP'))
end

function Updater.new()
    local local_app_data = environment.get('LOCALAPPDATA')

    return setmetatable({
        script_path = string.gsub(script_path() .. '/' .. consts.UPDATE_SCRIPT_PATH, '/', '\\'),
        status_path = local_app_data ~= nil and (local_app_data .. '\\' .. consts.UPDATE_STATUS_PATH) or nil,
    }, Updater)
end

function Updater:is_available()
    return self.status_path ~= nil and text_file.exists(self.script_path)
end

function Updater:handle_command()
    local command = profile_parameter.take(consts.UPDATE_COMMAND_NAME)

    if command == nil or not self:is_available() then
        return
    end

    local version = string.match(command, consts.INSTALL_COMMAND_PATTERN)

    if version ~= nil then
        start_update(self, version)
    end
end

function Updater:read_status()
    if self.status_path == nil then
        return nil
    end

    return text_file.read(self.status_path)
end

function Updater:close()
end

return Updater
