local store = {}
local timers = {}
local event_callbacks = {}
local fake_now = 1000000
local real_time = os.time

os.time = function(...)
    if select('#', ...) > 0 then
        return real_time(...)
    end

    return fake_now
end

obslua = {
    OBS_FRONTEND_EVENT_PROFILE_CHANGING = 1,
    OBS_FRONTEND_EVENT_PROFILE_CHANGED = 2,
    OBS_FRONTEND_EVENT_SCRIPTING_SHUTDOWN = 3,
    OBS_FRONTEND_EVENT_SCENE_COLLECTION_CHANGED = 4,
    OBS_FRONTEND_EVENT_STREAMING_STARTED = 5,
    OBS_FRONTEND_EVENT_FINISHED_LOADING = 99,
    obs_get_locale = function() return 'en-US' end,
    obs_frontend_get_profile_config = function() return store end,
    config_get_string = function(config, section, name) return config[section .. '/' .. name] end,
    config_set_string = function(config, section, name, value) config[section .. '/' .. name] = value end,
    config_remove_value = function(config, section, name) config[section .. '/' .. name] = nil end,
    obs_get_output_by_name = function() return nil end,
    obs_frontend_get_current_scene_collection = function() return 'Main scenes' end,
    obs_frontend_add_event_callback = function(callback) event_callbacks[#event_callbacks + 1] = callback end,
    timer_add = function(callback, interval) timers[interval] = callback end,
    timer_remove = function(callback)
        for interval, known in pairs(timers) do
            if known == callback then
                timers[interval] = nil
            end
        end
    end,
}

local root = '__ROOT__'

function script_path()
    return root
end

package.loaded['streamoscope-bridge.outputs.stream_outputs'] = {
    new = function()
        return {close = function() end, read = function() return {} end}
    end,
}

local loader = function()
__LOADER__
end

loader()

script_load({})

