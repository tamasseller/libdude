/*
 * Copied shamelessly from https://github.com/blackmagic-debug/blackmagic/blob/main/src/target/jep106.h
 */

export const enum Jep106_Manufacturer
{
    ARM          = 0x43b, /* ARM Ltd. */
    FREESCALE    = 0x00e, /* Freescale */
    NXP          = 0x015, /* NXP */
    TEXAS        = 0x017, /* Texas Instruments */
    ATMEL        = 0x01f, /* Atmel */
    STM          = 0x020, /* STMicroelectronics */
    CYPRESS      = 0x034, /* Cypress Semiconductor */
    INFINEON     = 0x041, /* Infineon Technologies */
    NORDIC       = 0x244, /* Nordic Semiconductor */
    SPECULAR     = 0x501, /* LPC845 with code 501. Strange!? Specular Networks */
    ARM_CHINA    = 0xa75, /* Arm China */
    ENERGY_MICRO = 0x673, /* Energy Micro */
    GIGADEVICE   = 0x751, /* GigaDevice */
    RASPBERRY    = 0x913, /* Raspberry Pi */
    RENESAS      = 0x423, /* Renesas */
    WCH          = 0x72a, /* "Nanjing Yihuo Technology", used by CH579 */
    XILINX       = 0x309, /* Xilinx - Technically 0x049, but they use Ikanos Communications' code */
    /*
    * This JEP code should belong to "Andes Technology Corporation", but is used on RISC-V by GigaDevice,
    * so in the unlikely event we need to support chips by them, here be dragons.
    */
    RV_GIGADEVICE = 0x61e,

    /*
    * This code is not listed in the JEP106 standard, but is used by some stm32f1 clones
    * since we're not using this code elsewhere let's switch to the stm code.
    */
    ERRATA_CS       = 0x555,
    ERRATA_CS_ASCII = 0x8055,

    /*
    * CPU2 for STM32W(L|B) uses ARM's JEP-106 continuation code (4) instead of
    * STM's JEP-106 continuation code (0) like expected, CPU1 behaves as expected.
    *
    * See RM0453
    * https://www.st.com/resource/en/reference_manual/rm0453-stm32wl5x-advanced-armbased-32bit-mcus-with-subghz-radio-solution-stmicroelectronics.pdf :
    * 38.8.2 CPU1 ROM CoreSight peripheral identity register 4 (ROM_PIDR4)
    * vs
    * 38.13.2 CPU2 ROM1 CoreSight peripheral identity register 4 (C2ROM1_PIDR4)
    *
    * let's call this an errata and switch to the "correct" continuation scheme.
    *
    * Note: the JEP code 0x420 would belong to "Legend Silicon Corp." so in
    * the unlikely event we need to support chips by them, here be dragons.
    */
    ERRATA_STM32WX = 0x420,

    /* MindMotion MM32F5 uses the forbidden continuation code */
    ERRATA_ARM_CHINA = 0xc7f
}
