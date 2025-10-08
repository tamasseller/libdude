import { StPartNumbers } from "../../data/pidrPartNumbers";

/*
 * As per RM0454 STM32G0x0 advanced Arm® -based 32-bit MCUs Reference manual
 *
 * https://www.st.com/resource/en/reference_manual/rm0454-stm32g0x0-advanced-armbased-32bit-mcus-stmicroelectronics.pdf
 */
export const enum DeviceSignature {
    FlashSize = 0x1FFF75E0,
    PackageData = 0x1FFF7500
}

export function partName(part: StPartNumbers): string 
{
    switch (part) 
    {
        case StPartNumbers.STM32G03_4: return "STM32G030xx";
        case StPartNumbers.STM32G05_6: return "STM32G050xx";
        case StPartNumbers.STM32G07_8: return "STM32G070xx";
        case StPartNumbers.STM32G0B_C: return "STM32G0B0xx";
        default: throw new Error("Got lost");
    }
}

export function sramSizeKb(part: StPartNumbers): number 
{
    switch (part) 
    {
        case StPartNumbers.STM32G03_4: return 8;
        case StPartNumbers.STM32G05_6: return 16;
        case StPartNumbers.STM32G07_8: return 32;
        case StPartNumbers.STM32G0B_C: return 128;
        default: throw new Error("Got lost");
    }
}

const enum Stm32g0Package {
    TSSOP20 = "TSSOP20",
    LQFP32 = "LQFP32",
    LQFP48 = "LQFP48",
    LQFP64 = "LQFP64",
    LQFP100 = "LQFP100",
    Unknown = "Unknown"
}

export function identifyPackage(part: StPartNumbers, pkgData: number) 
{
    switch (part) 
    {
        case StPartNumbers.STM32G03_4:
        case StPartNumbers.STM32G05_6:
            switch (pkgData)
            {
                case 0b0100: return Stm32g0Package.LQFP32;
                case 0b0111: return Stm32g0Package.LQFP48;
                case 0b1100: return Stm32g0Package.LQFP64;
            }
        case StPartNumbers.STM32G07_8:
            switch (pkgData) 
            {
                case 0b0011: return Stm32g0Package.TSSOP20; // Unspecified
                case 0b0100: return Stm32g0Package.LQFP32;
                case 0b1000: return Stm32g0Package.LQFP48;
                case 0b1100: return Stm32g0Package.LQFP64;
            }
        case StPartNumbers.STM32G0B_C:
            switch (pkgData) 
            {
                case 0b0000: return Stm32g0Package.LQFP100;
                case 0b0001: return Stm32g0Package.LQFP32;
                case 0b0100: return Stm32g0Package.LQFP48;
                case 0b0111: return Stm32g0Package.LQFP64;
            }
    }
}
