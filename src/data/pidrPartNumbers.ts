/*
 * Sieved blackmagic wisdom from all over https://github.com/blackmagic-debug/blackmagic
 */
export const enum StPartNumbers
{
    STM32C011          = 0x443,
    STM32C031          = 0x453,
    STM32C051          = 0x44c,
    STM32G03_4         = 0x466,
    STM32G05_6         = 0x456,
    STM32G07_8         = 0x460,
    STM32G0B_C         = 0x467,
    STM32L01x          = 0x457, /* Category 1 */
    STM32L03x          = 0x425, /* Category 2 */
    STM32L05x          = 0x417, /* Category 3 */
    STM32L07x          = 0x447, /* Category 5 */
    STM32L1xxxB        = 0x416, /* Category 1 */
    STM32L1xxxBxA      = 0x429, /* Category 2 */
    STM32L1xxxC        = 0x427, /* Category 3 */
    STM32L1xxxD        = 0x436, /* Category 3/4 */
    STM32L1xxxE        = 0x437, /* Category 5/6 */
    STM32MP15x         = 0x500,
    STM32MP15x_ERRATA  = 0x450,
    STM32H5xx          = 0x484,
    STM32H503          = 0x474,
    STM32WB0           = 0x01e,
    STM32L41           = 0x464, /* RM0394, Rev.4 §46.6.1 DBGMCU_IDCODE pg 1560 */
    STM32L43           = 0x435, /* RM0394, Rev.4 §46.6.1 DBGMCU_IDCODE pg 1560 */
    STM32L45           = 0x462, /* RM0394, Rev.4 §46.6.1 DBGMCU_IDCODE pg 1560 */
    STM32L47           = 0x415, /* RM0351, Rev.9 §48.6.1 DBGMCU_IDCODE pg 1840 */
    STM32L49           = 0x461, /* RM0351, Rev.9 §48.6.1 DBGMCU_IDCODE pg 1840 */
    STM32L4R           = 0x470, /* RM0432, Rev.9 §57.6.1 DBGMCU_IDCODE pg 2245 */
    STM32L4P           = 0x471, /* RM0432, Rev.9 §57.6.1 DBGMCU_IDCODE pg 2245 */
    STM32G43           = 0x468, /* RM0440, Rev.7 §47.6.1 DBGMCU_IDCODE pg 2082 (Category 2) */
    STM32G47           = 0x469, /* RM0440, Rev.7 §47.6.1 DBGMCU_IDCODE pg 2082 (Category 3) */
    STM32G49           = 0x479, /* RM0440, Rev.7 §47.6.1 DBGMCU_IDCODE pg 2082 (Category 4) */
    STM32L55           = 0x0472,
    STM32U535          = 0x455, /* STM32U535/545 */
    STM32U5Fx          = 0x476, /* STM32U5Fx/5Gx */
    STM32U59x          = 0x481, /* STM32U59x/5Ax */
    STM32U575          = 0x482, /* STM32U575/585 */
    STM32WLxx          = 0x497,
    STM32WB35          = 0x495, /* STM32WB35/55 */
    STM32WB1x          = 0x494,
    STM32H74x          = 0x450, /* RM0433, RM0399 */
    STM32H7Bx          = 0x480, /* RM0455 */
    STM32H72x          = 0x483, /* RM0468 */
    STM32F20X          = 0x411,
    STM32F40X          = 0x413,
    STM32F42X          = 0x419,
    STM32F446          = 0x421,
    STM32F401C         = 0x423,
    STM32F411          = 0x431,
    STM32F401E         = 0x433,
    STM32F46X          = 0x434,
    STM32F412          = 0x441,
    STM32F74X          = 0x449,
    STM32F76X          = 0x451,
    STM32F72X          = 0x452,
    STM32F410          = 0x458,
    STM32F413          = 0x463,
}

export const enum MicrochipIds
{
    SAMX5X = 0xcd0
}

export const enum RaspberryIds
{
    RP2040       = 0x1002,
    RP2350       = 0x0004,
    RP2350_ARM   = 0x0040,
    RP2350_RISCV = 0x0004,
}

export const enum GigadeviceIds
{
    GD32F450 = 0x2b3,
    GD32F470 = 0xa2e,
    GD32F405 = 0xfa4,
}
