local ffi = require('ffi')

local CP_UTF8 = 65001

local wide_string = {}

pcall(ffi.cdef, [[
    int MultiByteToWideChar(uint32_t codePage, uint32_t flags, const char *text, int length, uint16_t *buffer, int bufferLength);
    int WideCharToMultiByte(uint32_t codePage, uint32_t flags, const uint16_t *text, int length, char *buffer, int bufferLength, const char *defaultCharacter, int *usedDefault);
]])

function wide_string.from_text(text)
    local length = ffi.C.MultiByteToWideChar(CP_UTF8, 0, text, -1, nil, 0)
    local buffer = ffi.new('uint16_t[?]', math.max(length, 1))

    ffi.C.MultiByteToWideChar(CP_UTF8, 0, text, -1, buffer, length)

    return buffer
end

function wide_string.to_text(pointer)
    local length = ffi.C.WideCharToMultiByte(CP_UTF8, 0, pointer, -1, nil, 0, nil, nil)

    if length <= 1 then
        return ''
    end

    local buffer = ffi.new('char[?]', length)

    ffi.C.WideCharToMultiByte(CP_UTF8, 0, pointer, -1, buffer, length, nil, nil)

    return ffi.string(buffer, length - 1)
end

return wide_string
