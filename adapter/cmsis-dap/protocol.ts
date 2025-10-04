export const enum CommandCode {
    INFO = 0x00,
    HOST_STATUS = 0x01,
    CONNECT = 0x02,
    DISCONNECT = 0x03,
    TRANSFER_CONFIGURE = 0x04,
    TRANSFER = 0x05,
    TRANSFER_BLOCK = 0x06,
    TRANSFER_ABORT = 0x07,
    WRITE_ABORT = 0x08,
    DELAY = 0x09,
    RESET_TARGET = 0x0A,
    SWJ_PINS = 0x10,
    SWJ_CLOCK = 0x11,
    SWJ_SEQUENCE = 0x12,
    SWD_CONFIGURE = 0x13,
    SWD_SEQUENCE = 0x1D,
    EXECUTE_COMMANDS = 0x7F,
    QUEUE_COMMANDS = 0x7E
}

export const enum Response {
    OK = 0x00,
    ERROR = 0xFF
}

export const enum InfoRequest {
    VENDOR_ID = 0x01,
    PRODUCT_ID = 0x02,
    SERIAL_NUMBER = 0x03,
    CMSIS_DAP_FW_VERSION = 0x04,
    PRODUCT_FIRMWARE_VERSION = 0x09,
    CAPABILITIES = 0xF0,
    TEST_DOMAIN_TIMER = 0xF1,
    SWO_TRACE_BUFFER_SIZE = 0xFD,
    PACKET_COUNT = 0xFE,
    PACKET_SIZE = 0xFF,
}

export const enum CapabilityMask
{
    SWD                 = 1 << 0,    // SWD Serial Wire Debug communication is implemented 
    JTAG                = 1 << 1,    // JTAG communication is implemented
    SWO_UART            = 1 << 2,    // SWO UART - UART Serial Wire Output is implemented 
    SWO_MANCHESTER      = 1 << 3,    // SWO Manchester - Manchester Serial Wire Output is implemented 
    ATOMIC_COMMANDS     = 1 << 4,    // Atomic Commands - Atomic Commands support is implemented
    TEST_DOMAIN_TIMER   = 1 << 5,    // Test Domain Timer - debug unit support for Test Domain Timer is implemented 
    SWO_STREAMING_TRACE = 1 << 6,    // SWO Streaming Trace is implemented
    UART                = 1 << 7     // UART Communication Port is implemented
}

export const enum SwjPinMask
{
    none     = 0,
    swclkTck = (1 << 0),
    swdioTms = (1 << 1),
    tdi      = (1 << 2),
    tdo      = (1 << 3),
    nTrst    = (1 << 5),
    nReset   = (1 << 7),
}

export const enum TransferMode {
    WRITE = 0x00,
    READ = 0x02
}

export const enum ConnectResponse {
    FAILED = 0,
    SWD = 1,
    JTAG = 2
}

export const enum ResetTargeResponse {
    NO_RESET_SEQUENCE = 0,
    RESET_SEQUENCE = 1
}

export const enum TransferResponse {
    OK = 0x01,
    WAIT = 0x02,
    FAULT = 0x04,
    NO_ACK = 0x07,
    PROTOCOL_ERROR = 0x08,
    VALUE_MISMATCH = 0x10
}

export const enum HostStatusType {
    CONNECT = 0,
    RUNNING = 1
}

export const enum Protocol {
    DEFAULT = 0,
    SWD = 1,
    JTAG = 2
}

export const enum Port {
    DEBUG = 0x00,
    ACCESS = 0x01
}
