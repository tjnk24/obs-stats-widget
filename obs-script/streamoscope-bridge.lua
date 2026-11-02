local obs = obslua

local consts = require('streamoscope-bridge.consts')
local Gpu = require('streamoscope-bridge.hardware.gpu')
local StreamOutputs = require('streamoscope-bridge.outputs.stream_outputs')
local publisher = require('streamoscope-bridge.publisher')
local release_links = require('streamoscope-bridge.update.release_links')
local Updater = require('streamoscope-bridge.update.updater')

local sources = {}

local function create_safely(Source, ...)
    local created, source = pcall(Source.new, ...)

    return created and source or nil
end

local function open_sources()
    sources = {
        gpu = create_safely(Gpu),
        stream_outputs = create_safely(StreamOutputs),
        updater = create_safely(Updater),
    }
end

local function close_sources()
    for _key, source in pairs(sources) do
        source:close()
    end

    sources = {}
end

local function handle_commands()
    if sources.updater ~= nil then
        pcall(sources.updater.handle_command, sources.updater)
    end

    pcall(release_links.handle_command)
end

local function publish()
    publisher.publish(sources)
end

local function on_event(event)
    if event == obs.OBS_FRONTEND_EVENT_PROFILE_CHANGING then
        publisher.clear()
    elseif event == obs.OBS_FRONTEND_EVENT_PROFILE_CHANGED or event == obs.OBS_FRONTEND_EVENT_SCENE_COLLECTION_CHANGED then
        publish()
    elseif event == obs.OBS_FRONTEND_EVENT_SCRIPTING_SHUTDOWN then
        publisher.clear()
        close_sources()
    end
end

function script_description()
    local icon = string.format(consts.DESCRIPTION_ICON_HTML, script_path())

    if string.sub(obs.obs_get_locale(), 1, 2) == 'ru' then
        return icon .. 'Сообщает панели StreamoScope, на какую площадку стримят выходы плагинов (obs-multi-rtmp и любые другие), ' ..
            'загрузку видеокарты и занятую память системы. Передаёт только адрес сервера без пути и ключа.'
    end

    return icon .. 'Tells the StreamoScope dock which platform plugin outputs stream to (obs-multi-rtmp and any other), ' ..
        'the GPU load and the system memory in use. Only the server address is passed, without the path or the key.'
end

function script_load(_settings)
    open_sources()

    obs.obs_frontend_add_event_callback(on_event)
    obs.timer_add(publish, consts.PUBLISH_INTERVAL_MS)
    obs.timer_add(handle_commands, consts.COMMAND_INTERVAL_MS)
    publish()
end

function script_unload()
    obs.timer_remove(publish)
    obs.timer_remove(handle_commands)
    close_sources()
end
