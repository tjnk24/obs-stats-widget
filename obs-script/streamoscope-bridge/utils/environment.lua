local ffi = require('ffi')

local wide_string = require('streamoscope-bridge.utils.wide_string')

local environment = {}

pcall(ffi.cdef, [[
    uint32_t GetEnvironmentVariableW(const uint16_t *name, uint16_t *buffer, uint32_t size);
]])

function environment.get(name)
    local wide_name = wide_string.from_text(name)
    local length = ffi.C.GetEnvironmentVariableW(wide_name, nil, 0)

    if length == 0 then
        return nil
    end

    local buffer = ffi.new('uint16_t[?]', length)

    if ffi.C.GetEnvironmentVariableW(wide_name, buffer, length) == 0 then
        return nil
    end

    return wide_string.to_text(buffer)
end

return environment
