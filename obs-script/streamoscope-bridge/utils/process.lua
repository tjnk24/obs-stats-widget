local ffi = require('ffi')

local consts = require('streamoscope-bridge.consts')
local wide_string = require('streamoscope-bridge.utils.wide_string')

local process = {}

pcall(ffi.cdef, [[
    typedef struct {
        uint32_t cb;
        uint16_t *reserved;
        uint16_t *desktop;
        uint16_t *title;
        uint32_t x, y, width, height, columns, rows, fillAttribute, flags;
        uint16_t showWindow, reservedSize;
        uint8_t *reservedData;
        void *standardInput, *standardOutput, *standardError;
    } StatsBridgeStartupInfo;

    typedef struct {
        void *process;
        void *thread;
        uint32_t processId;
        uint32_t threadId;
    } StatsBridgeProcessInformation;

    int CreateProcessW(const uint16_t *application, uint16_t *commandLine, void *processAttributes, void *threadAttributes, int inheritHandles, uint32_t flags, void *environment, const uint16_t *directory, StatsBridgeStartupInfo *startupInfo, StatsBridgeProcessInformation *processInformation);
]])

pcall(ffi.cdef, 'int CloseHandle(void *handle);')
pcall(ffi.cdef, 'uint32_t GetCurrentProcessId(void);')

function process.current_id()
    return tonumber(ffi.C.GetCurrentProcessId())
end

function process.start_hidden(command_line, directory)
    local startup_info = ffi.new('StatsBridgeStartupInfo')
    local process_information = ffi.new('StatsBridgeProcessInformation')
    local wide_directory = directory ~= nil and wide_string.from_text(directory) or nil

    startup_info.cb = ffi.sizeof(startup_info)

    local started = ffi.C.CreateProcessW(nil, wide_string.from_text(command_line), nil, nil, 0, consts.CREATE_NO_WINDOW, nil, wide_directory, startup_info, process_information)

    if started == 0 then
        return false
    end

    ffi.C.CloseHandle(process_information.thread)
    ffi.C.CloseHandle(process_information.process)

    return true
end

return process
