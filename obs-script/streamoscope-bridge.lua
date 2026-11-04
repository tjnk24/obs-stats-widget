local ffi = require('ffi')

local CP_UTF8 = 65001
local GENERIC_READ = 0x80000000
local FILE_SHARE_READ_WRITE_DELETE = 0x00000007
local OPEN_EXISTING = 3
local INVALID_HANDLE_VALUE = ffi.cast('void *', -1)
local MAX_SOURCE_BYTES = 1024 * 1024
local MODULE_PREFIX = 'streamoscope-bridge.'
local CURRENT_VERSION_FILE = 'current-version.js'
local VERSION_PATTERN = '%d+%.%d+%.%d+'

pcall(ffi.cdef, 'int MultiByteToWideChar(uint32_t codePage, uint32_t flags, const char *text, int length, uint16_t *buffer, int bufferLength);')
pcall(ffi.cdef, 'void *CreateFileW(const uint16_t *path, uint32_t access, uint32_t shareMode, void *security, uint32_t disposition, uint32_t flags, void *template);')
pcall(ffi.cdef, 'int ReadFile(void *file, void *buffer, uint32_t bytesToRead, uint32_t *bytesRead, void *overlapped);')
pcall(ffi.cdef, 'int CloseHandle(void *handle);')

local function to_wide(text)
    local length = ffi.C.MultiByteToWideChar(CP_UTF8, 0, text, -1, nil, 0)
    local buffer = ffi.new('uint16_t[?]', math.max(length, 1))

    ffi.C.MultiByteToWideChar(CP_UTF8, 0, text, -1, buffer, length)

    return buffer
end

local function read_file(path)
    local file = ffi.C.CreateFileW(to_wide(path), GENERIC_READ, FILE_SHARE_READ_WRITE_DELETE, nil, OPEN_EXISTING, 0, nil)

    if file == INVALID_HANDLE_VALUE then
        return nil
    end

    local buffer = ffi.new('uint8_t[?]', MAX_SOURCE_BYTES)
    local bytes_read = ffi.new('uint32_t[1]')
    local succeeded = ffi.C.ReadFile(file, buffer, MAX_SOURCE_BYTES, bytes_read, nil)

    ffi.C.CloseHandle(file)

    return succeeded ~= 0 and ffi.string(buffer, bytes_read[0]) or nil
end

local install_root = script_path()
local current_version = string.match(read_file(install_root .. CURRENT_VERSION_FILE) or '', VERSION_PATTERN)
local bridge_root = current_version ~= nil and (install_root .. 'versions/' .. current_version .. '/') or install_root

function script_path()
    return bridge_root
end

table.insert(package.loaders, 2, function(module_name)
    if string.sub(module_name, 1, #MODULE_PREFIX) ~= MODULE_PREFIX then
        return nil
    end

    local module_path = bridge_root .. string.gsub(module_name, '%.', '/') .. '.lua'
    local source = read_file(module_path)

    return source ~= nil and assert(loadstring(source, '@' .. module_path)) or nil
end)

require('streamoscope-bridge.main')
