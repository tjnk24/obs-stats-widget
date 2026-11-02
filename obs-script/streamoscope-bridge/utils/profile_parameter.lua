local obs = obslua

local consts = require('streamoscope-bridge.consts')

local profile_parameter = {}

function profile_parameter.take(name)
    local config = obs.obs_frontend_get_profile_config()

    if config == nil then
        return nil
    end

    local value = obs.config_get_string(config, consts.PARAMETER_SECTION, name)

    if value == nil or value == '' then
        return nil
    end

    obs.config_remove_value(config, consts.PARAMETER_SECTION, name)

    return value
end

return profile_parameter
