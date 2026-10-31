local ffi = require('ffi')

local wide_string = require('obs-stats-bridge.utils.wide_string')

local GENERIC_READ = 0x80000000
local FILE_SHARE_READ_WRITE_DELETE = 0x00000007
local OPEN_EXISTING = 3
local INVALID_FILE_ATTRIBUTES = 0xFFFFFFFF
local FILE_ATTRIBUTE_DIRECTORY = 0x10
local MAX_READ_BYTES = 65536

local text_file = {}

pcall(ffi.cdef, [[
    uint32_t GetFileAttributesW(const uint16_t *path);
    void *CreateFileW(const uint16_t *path, uint32_t access, uint32_t shareMode, void *security, uint32_t disposition, uint32_t flags, void *template);
    int ReadFile(void *file, void *buffer, uint32_t bytesToRead, uint32_t *bytesRead, void *overlapped);
]])

pcall(ffi.cdef, 'int CloseHandle(void *handle);')

local INVALID_HANDLE_VALUE = ffi.cast('void *', -1)

function text_file.exists(path)
    local attributes = ffi.C.GetFileAttributesW(wide_string.from_text(path))

    return attributes ~= INVALID_FILE_ATTRIBUTES and bit.band(attributes, FILE_ATTRIBUTE_DIRECTORY) == 0
end

function text_file.read(path)
    local file = ffi.C.CreateFileW(wide_string.from_text(path), GENERIC_READ, FILE_SHARE_READ_WRITE_DELETE, nil, OPEN_EXISTING, 0, nil)

    if file == INVALID_HANDLE_VALUE then
        return nil
    end

    local buffer = ffi.new('uint8_t[?]', MAX_READ_BYTES)
    local bytes_read = ffi.new('uint32_t[1]')
    local succeeded = ffi.C.ReadFile(file, buffer, MAX_READ_BYTES, bytes_read, nil)

    ffi.C.CloseHandle(file)

    if succeeded == 0 then
        return nil
    end

    return ffi.string(buffer, bytes_read[0])
end

return text_file
