import {Register, Field} from '../executor/register'

export class FLASH
{
    // Access control register
    static readonly ACR = new class ACR extends Register<ACR>
    {
        constructor() { super(0x40022000) }        

        // Latency
        readonly LATENCY = new Field<ACR, true>(3, 0)        

        // Prefetch enable
        readonly PRFTEN  = new Field<ACR, true>(1, 8)        

        // Instruction cache enable
        readonly ICEN    = new Field<ACR, true>(1, 9)        

        // Instruction cache reset
        readonly ICRST   = new Field<ACR, true>(1, 11)        

        // Flash User area empty
        readonly EMPTY   = new Field<ACR, true>(1, 16)        
    }

    // Flash key register
    static readonly KEYR = new class KEYR extends Register<KEYR>
    {
        constructor() { super(0x40022008) }        

        // KEYR
        readonly KEYR = new Field<KEYR, true>(32, 0)        
    }

    // Option byte key register
    static readonly OPTKEYR = new class OPTKEYR extends Register<OPTKEYR>
    {
        constructor() { super(0x4002200c) }        

        // Option byte key
        readonly OPTKEYR = new Field<OPTKEYR, true>(32, 0)        
    }

    // Status register
    static readonly SR = new class SR extends Register<SR>
    {
        constructor() { super(0x40022010) }        

        // End of operation
        readonly EOP     = new Field<SR, true>(1, 0)        

        // Operation error
        readonly OPERR   = new Field<SR, true>(1, 1)        

        // Programming error
        readonly PROGERR = new Field<SR, true>(1, 3)        

        // Write protected error
        readonly WRPERR  = new Field<SR, true>(1, 4)        

        // Programming alignment error
        readonly PGAERR  = new Field<SR, true>(1, 5)        

        // Size error
        readonly SIZERR  = new Field<SR, true>(1, 6)        

        // Programming sequence error
        readonly PGSERR  = new Field<SR, true>(1, 7)        

        // Fast programming data miss error
        readonly MISERR  = new Field<SR, true>(1, 8)        

        // Fast programming error
        readonly FASTERR = new Field<SR, true>(1, 9)        

        // Option and Engineering bits loading validity 
        // error
        readonly OPTVERR = new Field<SR, true>(1, 15)        

        // BSY1
        readonly BSY1    = new Field<SR, true>(1, 16)        

        // BSY2
        readonly BSY2    = new Field<SR, true>(1, 17)        

        // Programming or erase configuration busy.
        readonly CFGBSY  = new Field<SR, true>(1, 18)        
    }

    // Flash control register
    static readonly CR = new class CR extends Register<CR>
    {
        constructor() { super(0x40022014) }        

        // Programming
        readonly PG         = new Field<CR, true>(1, 0)        

        // Page erase
        readonly PER        = new Field<CR, true>(1, 1)        

        // Mass erase
        readonly MER1       = new Field<CR, true>(1, 2)        

        // Page number
        readonly PNB        = new Field<CR, true>(10, 3)        

        // BKER
        readonly BKER       = new Field<CR, true>(1, 13)        

        // MER2
        readonly MER2       = new Field<CR, true>(1, 15)        

        // Start
        readonly STRT       = new Field<CR, true>(1, 16)        

        // Options modification start
        readonly OPTSTRT    = new Field<CR, true>(1, 17)        

        // Fast programming
        readonly FSTPG      = new Field<CR, true>(1, 18)        

        // End of operation interrupt enable
        readonly EOPIE      = new Field<CR, true>(1, 24)        

        // Error interrupt enable
        readonly ERRIE      = new Field<CR, true>(1, 25)        

        // Force the option byte loading
        readonly OBL_LAUNCH = new Field<CR, true>(1, 27)        

        // Options Lock
        readonly OPTLOCK    = new Field<CR, true>(1, 30)        

        // FLASH_CR Lock
        readonly LOCK       = new Field<CR, true>(1, 31)        
    }

    // Flash ECC register
    static readonly ECCR = new class ECCR extends Register<ECCR>
    {
        constructor() { super(0x40022018) }        

        // ECC fail address
        readonly ADDR_ECC = new Field<ECCR, false>(14, 0)        

        // ECC fail for Corrected ECC Error or Double 
        // ECC Error in info block
        readonly SYSF_ECC = new Field<ECCR, false>(1, 20)        

        // ECC correction interrupt enable
        readonly ECCIE    = new Field<ECCR, true>(1, 24)        

        // ECC correction
        readonly ECCC     = new Field<ECCR, true>(1, 30)        

        // ECC detection
        readonly ECCD     = new Field<ECCR, true>(1, 31)        
    }

    // Flash option register
    static readonly OPTR = new class OPTR extends Register<OPTR>
    {
        constructor() { super(0x40022020) }        

        // Read protection level
        readonly RDP              = new Field<OPTR, true>(8, 0)        

        // nRST_STOP
        readonly nRST_STOP        = new Field<OPTR, true>(1, 13)        

        // nRST_STDBY
        readonly nRST_STDBY       = new Field<OPTR, true>(1, 14)        

        // Independent watchdog selection
        readonly IDWG_SW          = new Field<OPTR, true>(1, 16)        

        // Independent watchdog counter freeze in 
        // Stop mode
        readonly IWDG_STOP        = new Field<OPTR, true>(1, 17)        

        // Independent watchdog counter freeze in 
        // Standby mode
        readonly IWDG_STDBY       = new Field<OPTR, true>(1, 18)        

        // Window watchdog selection
        readonly WWDG_SW          = new Field<OPTR, true>(1, 19)        

        // nSWAP_BANK
        readonly nSWAP_BANK       = new Field<OPTR, true>(1, 20)        

        // DUAL_BANK
        readonly DUAL_BANK        = new Field<OPTR, true>(1, 21)        

        // SRAM parity check control
        readonly RAM_PARITY_CHECK = new Field<OPTR, true>(1, 22)        

        // nBOOT_SEL
        readonly nBOOT_SEL        = new Field<OPTR, true>(1, 24)        

        // Boot configuration
        readonly nBOOT1           = new Field<OPTR, true>(1, 25)        

        // nBOOT0 option bit
        readonly nBOOT0           = new Field<OPTR, true>(1, 26)        
    }

    // Flash WRP area A address register
    static readonly WRP1AR = new class WRP1AR extends Register<WRP1AR>
    {
        constructor() { super(0x4002202c) }        

        // WRP area A start offset
        readonly WRP1A_STRT = new Field<WRP1AR, false>(7, 0)        

        // WRP area A end offset
        readonly WRP1A_END  = new Field<WRP1AR, false>(7, 16)        
    }

    // Flash WRP area B address register
    static readonly WRP1BR = new class WRP1BR extends Register<WRP1BR>
    {
        constructor() { super(0x40022030) }        

        // WRP area B start offset
        readonly WRP1B_STRT = new Field<WRP1BR, false>(7, 0)        

        // WRP area B end offset
        readonly WRP1B_END  = new Field<WRP1BR, false>(7, 16)        
    }

    // FLASH WRP2 area A address register
    static readonly WRP2AR = new class WRP2AR extends Register<WRP2AR>
    {
        constructor() { super(0x4002204c) }        

        // WRP2A_STRT
        readonly WRP2A_STRT = new Field<WRP2AR, true>(7, 0)        

        // WRP2A_END
        readonly WRP2A_END  = new Field<WRP2AR, true>(7, 16)        
    }

    // FLASH WRP2 area B address register
    static readonly WRP2BR = new class WRP2BR extends Register<WRP2BR>
    {
        constructor() { super(0x40022050) }        

        // WRP2B_STRT
        readonly WRP2B_STRT = new Field<WRP2BR, true>(7, 0)        

        // WRP2B_END
        readonly WRP2B_END  = new Field<WRP2BR, true>(7, 16)        
    }
}

export class RCC
{
    // Clock control register
    static readonly CR = new class CR extends Register<CR>
    {
        constructor() { super(0x40021000) }        

        // HSI16 clock enable
        readonly HSION    = new Field<CR, true>(1, 8)        

        // HSI16 always enable for peripheral kernels
        readonly HSIKERON = new Field<CR, true>(1, 9)        

        // HSI16 clock ready flag
        readonly HSIRDY   = new Field<CR, true>(1, 10)        

        // HSI16 clock division factor
        readonly HSIDIV   = new Field<CR, true>(3, 11)        

        // HSE clock enable
        readonly HSEON    = new Field<CR, true>(1, 16)        

        // HSE clock ready flag
        readonly HSERDY   = new Field<CR, true>(1, 17)        

        // HSE crystal oscillator bypass
        readonly HSEBYP   = new Field<CR, true>(1, 18)        

        // Clock security system enable
        readonly CSSON    = new Field<CR, true>(1, 19)        

        // PLL enable
        readonly PLLON    = new Field<CR, true>(1, 24)        

        // PLL clock ready flag
        readonly PLLRDY   = new Field<CR, true>(1, 25)        
    }

    // Internal clock sources calibration 
    // register
    static readonly ICSCR = new class ICSCR extends Register<ICSCR>
    {
        constructor() { super(0x40021004) }        

        // HSI16 clock calibration
        readonly HSICAL  = new Field<ICSCR, false>(8, 0)        

        // HSI16 clock trimming
        readonly HSITRIM = new Field<ICSCR, true>(7, 8)        
    }

    // Clock configuration register
    static readonly CFGR = new class CFGR extends Register<CFGR>
    {
        constructor() { super(0x40021008) }        

        // Microcontroller clock output prescaler
        readonly MCOPRE  = new Field<CFGR, false>(4, 28)        

        // Microcontroller clock output
        readonly MCOSEL  = new Field<CFGR, true>(4, 24)        

        // MCO2PRE
        readonly MCO2PRE = new Field<CFGR, true>(4, 20)        

        // MCO2SEL
        readonly MCO2SEL = new Field<CFGR, true>(4, 16)        

        // APB prescaler
        readonly PPRE    = new Field<CFGR, true>(3, 12)        

        // AHB prescaler
        readonly HPRE    = new Field<CFGR, true>(4, 8)        

        // System clock switch status
        readonly SWS     = new Field<CFGR, false>(3, 3)        

        // System clock switch
        readonly SW      = new Field<CFGR, true>(3, 0)        
    }

    // PLL configuration register
    static readonly PLLSYSCFGR = new class PLLSYSCFGR extends Register<PLLSYSCFGR>
    {
        constructor() { super(0x4002100c) }        

        // PLL input clock source
        readonly PLLSRC = new Field<PLLSYSCFGR, true>(2, 0)        

        // Division factor M of the PLL input clock 
        // divider
        readonly PLLM   = new Field<PLLSYSCFGR, true>(3, 4)        

        // PLL frequency multiplication factor N
        readonly PLLN   = new Field<PLLSYSCFGR, true>(8, 8)        

        // PLLPCLK clock output enable
        readonly PLLPEN = new Field<PLLSYSCFGR, true>(1, 16)        

        // PLL VCO division factor P for PLLPCLK 
        // clock output
        readonly PLLP   = new Field<PLLSYSCFGR, true>(5, 17)        

        // PLLQCLK clock output enable
        readonly PLLQEN = new Field<PLLSYSCFGR, true>(1, 24)        

        // PLL VCO division factor Q for PLLQCLK 
        // clock output
        readonly PLLQ   = new Field<PLLSYSCFGR, true>(3, 25)        

        // PLLRCLK clock output enable
        readonly PLLREN = new Field<PLLSYSCFGR, true>(1, 28)        

        // PLL VCO division factor R for PLLRCLK 
        // clock output
        readonly PLLR   = new Field<PLLSYSCFGR, true>(3, 29)        
    }

    // Clock interrupt enable register
    static readonly CIER = new class CIER extends Register<CIER>
    {
        constructor() { super(0x40021018) }        

        // LSI ready interrupt enable
        readonly LSIRDYIE    = new Field<CIER, true>(1, 0)        

        // LSE ready interrupt enable
        readonly LSERDYIE    = new Field<CIER, true>(1, 1)        

        // HSI ready interrupt enable
        readonly HSIRDYIE    = new Field<CIER, true>(1, 3)        

        // HSE ready interrupt enable
        readonly HSERDYIE    = new Field<CIER, true>(1, 4)        

        // PLL ready interrupt enable
        readonly PLLSYSRDYIE = new Field<CIER, true>(1, 5)        
    }

    // Clock interrupt flag register
    static readonly CIFR = new class CIFR extends Register<CIFR>
    {
        constructor() { super(0x4002101c) }        

        // LSI ready interrupt flag
        readonly LSIRDYF    = new Field<CIFR, false>(1, 0)        

        // LSE ready interrupt flag
        readonly LSERDYF    = new Field<CIFR, false>(1, 1)        

        // HSI ready interrupt flag
        readonly HSIRDYF    = new Field<CIFR, false>(1, 3)        

        // HSE ready interrupt flag
        readonly HSERDYF    = new Field<CIFR, false>(1, 4)        

        // PLL ready interrupt flag
        readonly PLLSYSRDYF = new Field<CIFR, false>(1, 5)        

        // Clock security system interrupt flag
        readonly CSSF       = new Field<CIFR, false>(1, 8)        

        // LSE Clock security system interrupt flag
        readonly LSECSSF    = new Field<CIFR, false>(1, 9)        
    }

    // Clock interrupt clear register
    static readonly CICR = new class CICR extends Register<CICR>
    {
        constructor() { super(0x40021020) }        

        // LSI ready interrupt clear
        readonly LSIRDYC    = new Field<CICR, true>(1, 0)        

        // LSE ready interrupt clear
        readonly LSERDYC    = new Field<CICR, true>(1, 1)        

        // HSI ready interrupt clear
        readonly HSIRDYC    = new Field<CICR, true>(1, 3)        

        // HSE ready interrupt clear
        readonly HSERDYC    = new Field<CICR, true>(1, 4)        

        // PLL ready interrupt clear
        readonly PLLSYSRDYC = new Field<CICR, true>(1, 5)        

        // Clock security system interrupt clear
        readonly CSSC       = new Field<CICR, true>(1, 8)        

        // LSE Clock security system interrupt clear
        readonly LSECSSC    = new Field<CICR, true>(1, 9)        
    }

    // I/O port reset register
    static readonly IOPRSTR = new class IOPRSTR extends Register<IOPRSTR>
    {
        constructor() { super(0x40021024) }        

        // GPIOARST
        readonly GPIOARST = new Field<IOPRSTR, true>(1, 0)        

        // GPIOBRST
        readonly GPIOBRST = new Field<IOPRSTR, true>(1, 1)        

        // GPIOCRST
        readonly GPIOCRST = new Field<IOPRSTR, true>(1, 2)        

        // GPIODRST
        readonly GPIODRST = new Field<IOPRSTR, true>(1, 3)        

        // GPIOERST
        readonly GPIOERST = new Field<IOPRSTR, true>(1, 4)        

        // GPIOFRST
        readonly GPIOFRST = new Field<IOPRSTR, true>(1, 5)        
    }

    // AHB peripheral reset register
    static readonly AHBRSTR = new class AHBRSTR extends Register<AHBRSTR>
    {
        constructor() { super(0x40021028) }        

        // DMA1 reset
        readonly DMA1RST  = new Field<AHBRSTR, true>(1, 0)        

        // DMA1 reset
        readonly DMA2RST  = new Field<AHBRSTR, true>(1, 1)        

        // FLITF reset
        readonly FLASHRST = new Field<AHBRSTR, true>(1, 8)        

        // CRC reset
        readonly CRCRST   = new Field<AHBRSTR, true>(1, 12)        
    }

    // APB peripheral reset register 1
    static readonly APBRSTR1 = new class APBRSTR1 extends Register<APBRSTR1>
    {
        constructor() { super(0x4002102c) }        

        // TIM3 timer reset
        readonly TIM3RST   = new Field<APBRSTR1, true>(1, 1)        

        // TIM4 timer reset
        readonly TIM4RST   = new Field<APBRSTR1, true>(1, 2)        

        // TIM6 timer reset
        readonly TIM6RST   = new Field<APBRSTR1, true>(1, 4)        

        // TIM7 timer reset
        readonly TIM7RST   = new Field<APBRSTR1, true>(1, 5)        

        // USART5RST
        readonly USART5RST = new Field<APBRSTR1, true>(1, 8)        

        // USART6RST
        readonly USART6RST = new Field<APBRSTR1, true>(1, 9)        

        // USBRST
        readonly USBRST    = new Field<APBRSTR1, true>(1, 13)        

        // SPI2 reset
        readonly SPI2RST   = new Field<APBRSTR1, true>(1, 14)        

        // SPI3 reset
        readonly SPI3RST   = new Field<APBRSTR1, true>(1, 15)        

        // USART2 reset
        readonly USART2RST = new Field<APBRSTR1, true>(1, 17)        

        // USART3 reset
        readonly USART3RST = new Field<APBRSTR1, true>(1, 18)        

        // USART4 reset
        readonly USART4RST = new Field<APBRSTR1, true>(1, 19)        

        // I2C1 reset
        readonly I2C1RST   = new Field<APBRSTR1, true>(1, 21)        

        // I2C2 reset
        readonly I2C2RST   = new Field<APBRSTR1, true>(1, 22)        

        // I2C3RST reset
        readonly I2C3RST   = new Field<APBRSTR1, true>(1, 23)        

        // Debug support reset
        readonly DBGRST    = new Field<APBRSTR1, true>(1, 27)        

        // Power interface reset
        readonly PWRRST    = new Field<APBRSTR1, true>(1, 28)        
    }

    // APB peripheral reset register 2
    static readonly APBRSTR2 = new class APBRSTR2 extends Register<APBRSTR2>
    {
        constructor() { super(0x40021030) }        

        // SYSCFG, COMP and VREFBUF reset
        readonly SYSCFGRST = new Field<APBRSTR2, true>(1, 0)        

        // TIM1 timer reset
        readonly TIM1RST   = new Field<APBRSTR2, true>(1, 11)        

        // SPI1 reset
        readonly SPI1RST   = new Field<APBRSTR2, true>(1, 12)        

        // USART1 reset
        readonly USART1RST = new Field<APBRSTR2, true>(1, 14)        

        // TIM14 timer reset
        readonly TIM14RST  = new Field<APBRSTR2, true>(1, 15)        

        // TIM15 timer reset
        readonly TIM15RST  = new Field<APBRSTR2, true>(1, 16)        

        // TIM16 timer reset
        readonly TIM16RST  = new Field<APBRSTR2, true>(1, 17)        

        // TIM17 timer reset
        readonly TIM17RST  = new Field<APBRSTR2, true>(1, 18)        

        // ADC reset
        readonly ADCRST    = new Field<APBRSTR2, true>(1, 20)        
    }

    // GPIO clock enable register
    static readonly IOPENR = new class IOPENR extends Register<IOPENR>
    {
        constructor() { super(0x40021034) }        

        // I/O port A clock enable during Sleep mode
        readonly GPIOAEN = new Field<IOPENR, true>(1, 0)        

        // I/O port B clock enable during Sleep mode
        readonly GPIOBEN = new Field<IOPENR, true>(1, 1)        

        // I/O port C clock enable during Sleep mode
        readonly GPIOCEN = new Field<IOPENR, true>(1, 2)        

        // I/O port D clock enable during Sleep mode
        readonly GPIODEN = new Field<IOPENR, true>(1, 3)        

        // I/O port E clock enable during Sleep mode
        readonly GPIOEEN = new Field<IOPENR, true>(1, 4)        

        // I/O port F clock enable during Sleep mode
        readonly GPIOFEN = new Field<IOPENR, true>(1, 5)        
    }

    // AHB peripheral clock enable register
    static readonly AHBENR = new class AHBENR extends Register<AHBENR>
    {
        constructor() { super(0x40021038) }        

        // DMA1 clock enable
        readonly DMA1EN  = new Field<AHBENR, true>(1, 0)        

        // DMA2 clock enable
        readonly DMA2EN  = new Field<AHBENR, true>(1, 1)        

        // Flash memory interface clock enable
        readonly FLASHEN = new Field<AHBENR, true>(1, 8)        

        // CRC clock enable
        readonly CRCEN   = new Field<AHBENR, true>(1, 12)        
    }

    // APB peripheral clock enable register 1
    static readonly APBENR1 = new class APBENR1 extends Register<APBENR1>
    {
        constructor() { super(0x4002103c) }        

        // TIM3 timer clock enable
        readonly TIM3EN   = new Field<APBENR1, true>(1, 1)        

        // TIM4 timer clock enable
        readonly TIM4EN   = new Field<APBENR1, true>(1, 2)        

        // TIM6 timer clock enable
        readonly TIM6EN   = new Field<APBENR1, true>(1, 4)        

        // TIM7 timer clock enable
        readonly TIM7EN   = new Field<APBENR1, true>(1, 5)        

        // USART5EN
        readonly USART5EN = new Field<APBENR1, true>(1, 8)        

        // USART6EN
        readonly USART6EN = new Field<APBENR1, true>(1, 9)        

        // RTC APB clock enable
        readonly RTCAPBEN = new Field<APBENR1, true>(1, 10)        

        // WWDG clock enable
        readonly WWDGEN   = new Field<APBENR1, true>(1, 11)        

        // USBEN
        readonly USBEN    = new Field<APBENR1, true>(1, 13)        

        // SPI2 clock enable
        readonly SPI2EN   = new Field<APBENR1, true>(1, 14)        

        // SPI3 clock enable
        readonly SPI3EN   = new Field<APBENR1, true>(1, 15)        

        // USART2 clock enable
        readonly USART2EN = new Field<APBENR1, true>(1, 17)        

        // USART3 clock enable
        readonly USART3EN = new Field<APBENR1, true>(1, 18)        

        // USART4 clock enable
        readonly USART4EN = new Field<APBENR1, true>(1, 19)        

        // I2C1 clock enable
        readonly I2C1EN   = new Field<APBENR1, true>(1, 21)        

        // I2C2 clock enable
        readonly I2C2EN   = new Field<APBENR1, true>(1, 22)        

        // I2C3 clock enable
        readonly I2C3EN   = new Field<APBENR1, true>(1, 23)        

        // Debug support clock enable
        readonly DBGEN    = new Field<APBENR1, true>(1, 27)        

        // Power interface clock enable
        readonly PWREN    = new Field<APBENR1, true>(1, 28)        
    }

    // APB peripheral clock enable register 2
    static readonly APBENR2 = new class APBENR2 extends Register<APBENR2>
    {
        constructor() { super(0x40021040) }        

        // SYSCFG, COMP and VREFBUF clock enable
        readonly SYSCFGEN = new Field<APBENR2, true>(1, 0)        

        // TIM1 timer clock enable
        readonly TIM1EN   = new Field<APBENR2, true>(1, 11)        

        // SPI1 clock enable
        readonly SPI1EN   = new Field<APBENR2, true>(1, 12)        

        // USART1 clock enable
        readonly USART1EN = new Field<APBENR2, true>(1, 14)        

        // TIM14 timer clock enable
        readonly TIM14EN  = new Field<APBENR2, true>(1, 15)        

        // TIM15 timer clock enable
        readonly TIM15EN  = new Field<APBENR2, true>(1, 16)        

        // TIM16 timer clock enable
        readonly TIM16EN  = new Field<APBENR2, true>(1, 17)        

        // TIM16 timer clock enable
        readonly TIM17EN  = new Field<APBENR2, true>(1, 18)        

        // ADC clock enable
        readonly ADCEN    = new Field<APBENR2, true>(1, 20)        
    }

    // GPIO in Sleep mode clock enable register
    static readonly IOPSMENR = new class IOPSMENR extends Register<IOPSMENR>
    {
        constructor() { super(0x40021044) }        

        // I/O port A clock enable during Sleep 
        // mode
        readonly GPIOASMEN = new Field<IOPSMENR, true>(1, 0)        

        // I/O port B clock enable during Sleep 
        // mode
        readonly GPIOBSMEN = new Field<IOPSMENR, true>(1, 1)        

        // I/O port C clock enable during Sleep 
        // mode
        readonly GPIOCSMEN = new Field<IOPSMENR, true>(1, 2)        

        // I/O port D clock enable during Sleep 
        // mode
        readonly GPIODSMEN = new Field<IOPSMENR, true>(1, 3)        

        // I/O port E clock enable during Sleep 
        // mode
        readonly GPIOESMEN = new Field<IOPSMENR, true>(1, 4)        

        // I/O port F clock enable during Sleep 
        // mode
        readonly GPIOFSMEN = new Field<IOPSMENR, true>(1, 5)        
    }

    // AHB peripheral clock enable in Sleep 
    // mode register
    static readonly AHBSMENR = new class AHBSMENR extends Register<AHBSMENR>
    {
        constructor() { super(0x40021048) }        

        // DMA1 clock enable during Sleep mode
        readonly DMA1SMEN  = new Field<AHBSMENR, true>(1, 0)        

        // DMA2 clock enable during Sleep mode
        readonly DMA2SMEN  = new Field<AHBSMENR, true>(1, 1)        

        // Flash memory interface clock enable 
        // during Sleep mode
        readonly FLASHSMEN = new Field<AHBSMENR, true>(1, 8)        

        // SRAM clock enable during Sleep mode
        readonly SRAMSMEN  = new Field<AHBSMENR, true>(1, 9)        

        // CRC clock enable during Sleep mode
        readonly CRCSMEN   = new Field<AHBSMENR, true>(1, 12)        
    }

    // APB peripheral clock enable in Sleep 
    // mode register 1
    static readonly APBSMENR1 = new class APBSMENR1 extends Register<APBSMENR1>
    {
        constructor() { super(0x4002104c) }        

        // TIM3 timer clock enable during Sleep 
        // mode
        readonly TIM3SMEN   = new Field<APBSMENR1, true>(1, 1)        

        // TIM4 timer clock enable during Sleep 
        // mode
        readonly TIM4SMEN   = new Field<APBSMENR1, true>(1, 2)        

        // TIM6 timer clock enable during Sleep 
        // mode
        readonly TIM6SMEN   = new Field<APBSMENR1, true>(1, 4)        

        // TIM7 timer clock enable during Sleep 
        // mode
        readonly TIM7SMEN   = new Field<APBSMENR1, true>(1, 5)        

        // USART5 clock enable
        readonly USART5SMEN = new Field<APBSMENR1, true>(1, 8)        

        // USART6 clock enable
        readonly USART6SMEN = new Field<APBSMENR1, true>(1, 9)        

        // RTC APB clock enable during Sleep mode
        readonly RTCAPBSMEN = new Field<APBSMENR1, true>(1, 10)        

        // WWDG clock enable during Sleep mode
        readonly WWDGSMEN   = new Field<APBSMENR1, true>(1, 11)        

        // USB clock enable during Sleep mode
        readonly USBSMEN    = new Field<APBSMENR1, true>(1, 13)        

        // SPI2 clock enable during Sleep mode
        readonly SPI2SMEN   = new Field<APBSMENR1, true>(1, 14)        

        // SPI3 clock enable during Sleep mode
        readonly SPI3SMEN   = new Field<APBSMENR1, true>(1, 15)        

        // USART2 clock enable during Sleep mode
        readonly USART2SMEN = new Field<APBSMENR1, true>(1, 17)        

        // USART3 clock enable during Sleep mode
        readonly USART3SMEN = new Field<APBSMENR1, true>(1, 18)        

        // USART4 clock enable during Sleep mode
        readonly USART4SMEN = new Field<APBSMENR1, true>(1, 19)        

        // I2C1 clock enable during Sleep mode
        readonly I2C1SMEN   = new Field<APBSMENR1, true>(1, 21)        

        // I2C2 clock enable during Sleep mode
        readonly I2C2SMEN   = new Field<APBSMENR1, true>(1, 22)        

        // I2C3 clock enable during Sleep mode
        readonly I2C3SMEN   = new Field<APBSMENR1, true>(1, 23)        

        // Debug support clock enable during Sleep 
        // mode
        readonly DBGSMEN    = new Field<APBSMENR1, true>(1, 27)        

        // Power interface clock enable during 
        // Sleep mode
        readonly PWRSMEN    = new Field<APBSMENR1, true>(1, 28)        
    }

    // APB peripheral clock enable in Sleep 
    // mode register 2
    static readonly APBSMENR2 = new class APBSMENR2 extends Register<APBSMENR2>
    {
        constructor() { super(0x40021050) }        

        // SYSCFG, COMP and VREFBUF clock enable 
        // during Sleep mode
        readonly SYSCFGSMEN = new Field<APBSMENR2, true>(1, 0)        

        // TIM1 timer clock enable during Sleep 
        // mode
        readonly TIM1SMEN   = new Field<APBSMENR2, true>(1, 11)        

        // SPI1 clock enable during Sleep mode
        readonly SPI1SMEN   = new Field<APBSMENR2, true>(1, 12)        

        // USART1 clock enable during Sleep mode
        readonly USART1SMEN = new Field<APBSMENR2, true>(1, 14)        

        // TIM14 timer clock enable during Sleep 
        // mode
        readonly TIM14SMEN  = new Field<APBSMENR2, true>(1, 15)        

        // TIM15 timer clock enable during Sleep 
        // mode
        readonly TIM15SMEN  = new Field<APBSMENR2, true>(1, 16)        

        // TIM16 timer clock enable during Sleep 
        // mode
        readonly TIM16SMEN  = new Field<APBSMENR2, true>(1, 17)        

        // TIM16 timer clock enable during Sleep 
        // mode
        readonly TIM17SMEN  = new Field<APBSMENR2, true>(1, 18)        

        // ADC clock enable during Sleep mode
        readonly ADCSMEN    = new Field<APBSMENR2, true>(1, 20)        
    }

    // Peripherals independent clock 
    // configuration register
    static readonly CCIPR = new class CCIPR extends Register<CCIPR>
    {
        constructor() { super(0x40021054) }        

        // USART1 clock source selection
        readonly USART1SEL = new Field<CCIPR, true>(2, 0)        

        // USART2 clock source selection
        readonly USART2SEL = new Field<CCIPR, true>(2, 2)        

        // USART3 clock source selection
        readonly USART3SEL = new Field<CCIPR, true>(2, 4)        

        // I2C1 clock source selection
        readonly I2C1SEL   = new Field<CCIPR, true>(2, 12)        

        // I2S1 clock source selection
        readonly I2S2SEL   = new Field<CCIPR, true>(2, 14)        

        // TIM1 clock source selection
        readonly TIM1SEL   = new Field<CCIPR, true>(1, 22)        

        // TIM15 clock source selection
        readonly TIM15SEL  = new Field<CCIPR, true>(1, 24)        

        // ADCs clock source selection
        readonly ADCSEL    = new Field<CCIPR, true>(2, 30)        
    }

    // Peripherals independent clock 
    // configuration register 2
    static readonly CCIPR2 = new class CCIPR2 extends Register<CCIPR2>
    {
        constructor() { super(0x40021058) }        

        // 2S1SEL
        readonly I2S1SEL = new Field<CCIPR2, true>(2, 0)        

        // I2S2SEL
        readonly I2S2SEL = new Field<CCIPR2, true>(2, 2)        

        // USBSEL
        readonly USBSEL  = new Field<CCIPR2, true>(2, 12)        
    }

    // RTC domain control register
    static readonly BDCR = new class BDCR extends Register<BDCR>
    {
        constructor() { super(0x4002105c) }        

        // LSE oscillator enable
        readonly LSEON    = new Field<BDCR, true>(1, 0)        

        // LSE oscillator ready
        readonly LSERDY   = new Field<BDCR, false>(1, 1)        

        // LSE oscillator bypass
        readonly LSEBYP   = new Field<BDCR, true>(1, 2)        

        // LSE oscillator drive capability
        readonly LSEDRV   = new Field<BDCR, true>(2, 3)        

        // CSS on LSE enable
        readonly LSECSSON = new Field<BDCR, true>(1, 5)        

        // CSS on LSE failure Detection
        readonly LSECSSD  = new Field<BDCR, false>(1, 6)        

        // RTC clock source selection
        readonly RTCSEL   = new Field<BDCR, true>(2, 8)        

        // RTC clock enable
        readonly RTCEN    = new Field<BDCR, true>(1, 15)        

        // RTC domain software reset
        readonly BDRST    = new Field<BDCR, true>(1, 16)        

        // Low-speed clock output (LSCO) enable
        readonly LSCOEN   = new Field<BDCR, true>(1, 24)        

        // Low-speed clock output selection
        readonly LSCOSEL  = new Field<BDCR, true>(1, 25)        
    }

    // Control/status register
    static readonly CSR = new class CSR extends Register<CSR>
    {
        constructor() { super(0x40021060) }        

        // LSI oscillator enable
        readonly LSION    = new Field<CSR, true>(1, 0)        

        // LSI oscillator ready
        readonly LSIRDY   = new Field<CSR, false>(1, 1)        

        // Remove reset flags
        readonly RMVF     = new Field<CSR, true>(1, 23)        

        // Option byte loader reset flag
        readonly OBLRSTF  = new Field<CSR, false>(1, 25)        

        // Pin reset flag
        readonly PINRSTF  = new Field<CSR, false>(1, 26)        

        // BOR or POR/PDR flag
        readonly PWRRSTF  = new Field<CSR, false>(1, 27)        

        // Software reset flag
        readonly SFTRSTF  = new Field<CSR, false>(1, 28)        

        // Independent window watchdog reset flag
        readonly IWDGRSTF = new Field<CSR, false>(1, 29)        

        // Window watchdog reset flag
        readonly WWDGRSTF = new Field<CSR, false>(1, 30)        

        // Low-power reset flag
        readonly LPWRRSTF = new Field<CSR, false>(1, 31)        
    }
}

export class DBG
{
    // DBGMCU_IDCODE
    static readonly IDCODE = new class IDCODE extends Register<IDCODE>
    {
        constructor() { super(0x40015800) }        

        // Device identifier
        readonly DEV_ID = new Field<IDCODE, false>(12, 0)        

        // Revision identifie
        readonly REV_ID = new Field<IDCODE, false>(16, 16)        
    }

    // Debug MCU configuration register
    static readonly CR = new class CR extends Register<CR>
    {
        constructor() { super(0x40015804) }        

        // Debug Stop mode
        readonly DBG_STOP    = new Field<CR, true>(1, 1)        

        // Debug Standby mode
        readonly DBG_STANDBY = new Field<CR, true>(1, 2)        
    }

    // Debug MCU APB1 freeze register1
    static readonly APB_FZ1 = new class APB_FZ1 extends Register<APB_FZ1>
    {
        constructor() { super(0x40015808) }        

        // TIM2 counter stopped when core is halted
        readonly DBG_TIM2_STOP = new Field<APB_FZ1, true>(1, 0)        

        // TIM3 counter stopped when core is halted
        readonly DBG_TIM3_STOP = new Field<APB_FZ1, true>(1, 1)        

        // RTC counter stopped when core is halted
        readonly DBG_RTC_STOP  = new Field<APB_FZ1, true>(1, 10)        

        // Window watchdog counter stopped when 
        // core is halted
        readonly DBG_WWDG_STOP = new Field<APB_FZ1, true>(1, 11)        

        // Independent watchdog counter stopped 
        // when core is halted
        readonly DBG_IWDG_STOP = new Field<APB_FZ1, true>(1, 12)        

        // I2C1 SMBUS timeout counter stopped when 
        // core is halted
        readonly DBG_I2C1_STOP = new Field<APB_FZ1, true>(1, 21)        
    }

    // Debug MCU APB1 freeze register 2
    static readonly APB_FZ2 = new class APB_FZ2 extends Register<APB_FZ2>
    {
        constructor() { super(0x4001580c) }        

        // TIM1 counter stopped when core is halted
        readonly DBG_TIM1_STOP  = new Field<APB_FZ2, true>(1, 11)        

        // DBG_TIM14_STOP
        readonly DBG_TIM14_STOP = new Field<APB_FZ2, true>(1, 15)        

        // DBG_TIM16_STOP
        readonly DBG_TIM16_STOP = new Field<APB_FZ2, true>(1, 17)        

        // DBG_TIM17_STOP
        readonly DBG_TIM17_STOP = new Field<APB_FZ2, true>(1, 18)        
    }
}
