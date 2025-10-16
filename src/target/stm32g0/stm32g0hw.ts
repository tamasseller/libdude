import {Register, Field} from '../../data/memoryMappedRegister'

export class ADC
{
    // ADC interrupt and status register
    static readonly ADC_ISR = new class ADC_ISR extends Register<ADC_ISR>
    {
        constructor() { super(0x40012400) }        

        // ADC ready This bit is set by hardware after 
        // the ADC has been enabled (ADEN=1) and when 
        // the ADC reaches a state where it is ready to 
        // accept conversion requests. It is cleared by 
        // software writing 1 to it.
        readonly ADRDY = new Field<ADC_ISR, true>(1, 0)        

        // End of sampling flag This bit is set by 
        // hardware during the conversion, at the end of 
        // the sampling phase.It is cleared by software 
        // by programming it to '1'.
        readonly EOSMP = new Field<ADC_ISR, true>(1, 1)        

        // End of conversion flag This bit is set by 
        // hardware at the end of each conversion of a 
        // channel when a new data result is available 
        // in the ADC_DR register. It is cleared by 
        // software writing 1 to it or by reading the 
        // ADC_DR register.
        readonly EOC   = new Field<ADC_ISR, true>(1, 2)        

        // End of sequence flag This bit is set by 
        // hardware at the end of the conversion of a 
        // sequence of channels selected by the CHSEL 
        // bits. It is cleared by software writing 1 to 
        // it.
        readonly EOS   = new Field<ADC_ISR, true>(1, 3)        

        // ADC overrun This bit is set by hardware when 
        // an overrun occurs, meaning that a new 
        // conversion has complete while the EOC flag 
        // was already set. It is cleared by software 
        // writing 1 to it.
        readonly OVR   = new Field<ADC_ISR, true>(1, 4)        

        // Analog watchdog 1 flag This bit is set by 
        // hardware when the converted voltage crosses 
        // the values programmed in ADC_TR1 and ADC_HR1 
        // registers. It is cleared by software by 
        // programming it to 1.
        readonly AWD1  = new Field<ADC_ISR, true>(1, 7)        

        // Analog watchdog 2 flag This bit is set by 
        // hardware when the converted voltage crosses 
        // the values programmed in ADC_AWD2TR and 
        // ADC_AWD2TR registers. It is cleared by 
        // software programming it it.
        readonly AWD2  = new Field<ADC_ISR, true>(1, 8)        

        // Analog watchdog 3 flag This bit is set by 
        // hardware when the converted voltage crosses 
        // the values programmed in ADC_AWD3TR and 
        // ADC_AWD3TR registers. It is cleared by 
        // software by programming it to 1.
        readonly AWD3  = new Field<ADC_ISR, true>(1, 9)        

        // End Of Calibration flag This bit is set by 
        // hardware when calibration is complete. It is 
        // cleared by software writing 1 to it.
        readonly EOCAL = new Field<ADC_ISR, true>(1, 11)        

        // Channel Configuration Ready flag This flag 
        // bit is set by hardware when the channel 
        // configuration is applied after programming 
        // to ADC_CHSELR register or changing CHSELRMOD 
        // or SCANDIR. It is cleared by software by 
        // programming it to it. Note: When the 
        // software configures the channels (by 
        // programming ADC_CHSELR or changing CHSELRMOD 
        // or SCANDIR), it must wait until the CCRDY 
        // flag rises before configuring again or 
        // starting conversions, otherwise the new 
        // configuration (or the START bit) is ignored. 
        // Once the flag is asserted, if the software 
        // needs to configure again the channels, it 
        // must clear the CCRDY flag before proceeding 
        // with a new configuration.
        readonly CCRDY = new Field<ADC_ISR, true>(1, 13)        
    }

    // ADC interrupt enable register
    static readonly ADC_IER = new class ADC_IER extends Register<ADC_IER>
    {
        constructor() { super(0x40012404) }        

        // ADC ready interrupt enable This bit is set 
        // and cleared by software to enable/disable 
        // the ADC Ready interrupt. Note: The software 
        // is allowed to write this bit only when 
        // ADSTART bit is cleared to 0 (this ensures 
        // that no conversion is ongoing).
        readonly ADRDYIE = new Field<ADC_IER, true>(1, 0)        

        // End of sampling flag interrupt enable This 
        // bit is set and cleared by software to 
        // enable/disable the end of the sampling 
        // phase interrupt. Note: The software is 
        // allowed to write this bit only when ADSTART 
        // bit is cleared to 0 (this ensures that no 
        // conversion is ongoing).
        readonly EOSMPIE = new Field<ADC_IER, true>(1, 1)        

        // End of conversion interrupt enable This bit 
        // is set and cleared by software to 
        // enable/disable the end of conversion 
        // interrupt. Note: The software is allowed to 
        // write this bit only when ADSTART bit is 
        // cleared to 0 (this ensures that no 
        // conversion is ongoing).
        readonly EOCIE   = new Field<ADC_IER, true>(1, 2)        

        // End of conversion sequence interrupt enable 
        // This bit is set and cleared by software to 
        // enable/disable the end of sequence of 
        // conversions interrupt. Note: The software 
        // is allowed to write this bit only when 
        // ADSTART bit is cleared to 0 (this ensures 
        // that no conversion is ongoing).
        readonly EOSIE   = new Field<ADC_IER, true>(1, 3)        

        // Overrun interrupt enable This bit is set 
        // and cleared by software to enable/disable 
        // the overrun interrupt. Note: The software 
        // is allowed to write this bit only when 
        // ADSTART bit is cleared to 0 (this ensures 
        // that no conversion is ongoing).
        readonly OVRIE   = new Field<ADC_IER, true>(1, 4)        

        // Analog watchdog 1 interrupt enable This bit 
        // is set and cleared by software to 
        // enable/disable the analog watchdog 
        // interrupt. Note: The Software is allowed to 
        // write this bit only when ADSTART bit is 
        // cleared to 0 (this ensures that no 
        // conversion is ongoing).
        readonly AWD1IE  = new Field<ADC_IER, true>(1, 7)        

        // Analog watchdog 2 interrupt enable This bit 
        // is set and cleared by software to 
        // enable/disable the analog watchdog 
        // interrupt. Note: The Software is allowed to 
        // write this bit only when ADSTART bit is 
        // cleared to 0 (this ensures that no 
        // conversion is ongoing).
        readonly AWD2IE  = new Field<ADC_IER, true>(1, 8)        

        // Analog watchdog 3 interrupt enable This bit 
        // is set and cleared by software to 
        // enable/disable the analog watchdog 
        // interrupt. Note: The Software is allowed to 
        // write this bit only when ADSTART bit is 
        // cleared to 0 (this ensures that no 
        // conversion is ongoing).
        readonly AWD3IE  = new Field<ADC_IER, true>(1, 9)        

        // End of calibration interrupt enable This 
        // bit is set and cleared by software to 
        // enable/disable the end of calibration 
        // interrupt. Note: The software is allowed 
        // to write this bit only when ADSTART bit is 
        // cleared to 0 (this ensures that no 
        // conversion is ongoing).
        readonly EOCALIE = new Field<ADC_IER, true>(1, 11)        

        // Channel Configuration Ready Interrupt 
        // enable This bit is set and cleared by 
        // software to enable/disable the channel 
        // configuration ready interrupt. Note: The 
        // software is allowed to write this bit only 
        // when ADSTART bit is cleared to 0 (this 
        // ensures that no conversion is ongoing).
        readonly CCRDYIE = new Field<ADC_IER, true>(1, 13)        
    }

    // ADC control register
    static readonly ADC_CR = new class ADC_CR extends Register<ADC_CR>
    {
        constructor() { super(0x40012408) }        

        // ADC enable command This bit is set by 
        // software to enable the ADC. The ADC is 
        // effectively ready to operate once the ADRDY 
        // flag has been set. It is cleared by 
        // hardware when the ADC is disabled, after 
        // the execution of the ADDIS command. Note: 
        // The software is allowed to set ADEN only 
        // when all bits of ADC_CR registers are 0 
        // (ADCAL=0, ADSTP=0, ADSTART=0, ADDIS=0 and 
        // ADEN=0)
        readonly ADEN     = new Field<ADC_CR, true>(1, 0)        

        // ADC disable command This bit is set by 
        // software to disable the ADC (ADDIS command) 
        // and put it into power-down state (OFF 
        // state). It is cleared by hardware once the 
        // ADC is effectively disabled (ADEN is also 
        // cleared by hardware at this time). Note: 
        // Setting ADDIS to '1' is only effective when 
        // ADEN=1 and ADSTART=0 (which ensures that no 
        // conversion is ongoing)
        readonly ADDIS    = new Field<ADC_CR, true>(1, 1)        

        // ADC start conversion command This bit is 
        // set by software to start ADC conversion. 
        // Depending on the EXTEN [1:0] configuration 
        // bits, a conversion either starts 
        // immediately (software trigger 
        // configuration) or once a hardware trigger 
        // event occurs (hardware trigger 
        // configuration). It is cleared by hardware: 
        // In single conversion mode (CONT=0, 
        // DISCEN=0), when software trigger is 
        // selected (EXTEN=00): at the assertion of 
        // the end of Conversion Sequence (EOS) flag. 
        // In discontinuous conversion mode(CONT=0, 
        // DISCEN=1), when the software trigger is 
        // selected (EXTEN=00): at the assertion of 
        // the end of Conversion (EOC) flag. In all 
        // other cases: after the execution of the 
        // ADSTP command, at the same time as the 
        // ADSTP bit is cleared by hardware. Note: The 
        // software is allowed to set ADSTART only 
        // when ADEN=1 and ADDIS=0 (ADC is enabled and 
        // there is no pending request to disable the 
        // ADC). After writing to ADC_CHSELR register 
        // or changing CHSELRMOD or SCANDIRW, it is 
        // mandatory to wait until CCRDY flag is 
        // asserted before setting ADSTART, otherwise, 
        // the value written to ADSTART is ignored.
        readonly ADSTART  = new Field<ADC_CR, true>(1, 2)        

        // ADC stop conversion command This bit is set 
        // by software to stop and discard an ongoing 
        // conversion (ADSTP Command). It is cleared 
        // by hardware when the conversion is 
        // effectively discarded and the ADC is ready 
        // to accept a new start conversion command. 
        // Note: Setting ADSTP to '1' is only 
        // effective when ADSTART=1 and ADDIS=0 (ADC 
        // is enabled and may be converting and there 
        // is no pending request to disable the ADC)
        readonly ADSTP    = new Field<ADC_CR, true>(1, 4)        

        // ADC Voltage Regulator Enable This bit is 
        // set by software, to enable the ADC 
        // internal voltage regulator. The voltage 
        // regulator output is available after 
        // tADCVREG_SETUP. It is cleared by software 
        // to disable the voltage regulator. It can 
        // be cleared only if ADEN is et to 0. Note: 
        // The software is allowed to program this 
        // bit field only when the ADC is disabled 
        // (ADCAL=0, ADSTART=0, ADSTP=0, ADDIS=0 and 
        // ADEN=0).
        readonly ADVREGEN = new Field<ADC_CR, true>(1, 28)        

        // ADC calibration This bit is set by 
        // software to start the calibration of the 
        // ADC. It is cleared by hardware after 
        // calibration is complete. Note: The 
        // software is allowed to set ADCAL only when 
        // the ADC is disabled (ADCAL=0, ADSTART=0, 
        // ADSTP=0, ADDIS=0 and ADEN=0). The software 
        // is allowed to update the calibration 
        // factor by writing ADC_CALFACT only when 
        // ADEN=1 and ADSTART=0 (ADC enabled and no 
        // conversion is ongoing).
        readonly ADCAL    = new Field<ADC_CR, true>(1, 31)        
    }

    // ADC configuration register 1
    static readonly ADC_CFGR1 = new class ADC_CFGR1 extends Register<ADC_CFGR1>
    {
        constructor() { super(0x4001240c) }        

        // Direct memory access enable This bit is 
        // set and cleared by software to enable 
        // the generation of DMA requests. This 
        // allows the DMA controller to be used to 
        // manage automatically the converted data. 
        // For more details, refer to . Note: The 
        // software is allowed to write this bit 
        // only when ADSTART bit is cleared to 0 
        // (this ensures that no conversion is 
        // ongoing).
        readonly DMAEN     = new Field<ADC_CFGR1, true>(1, 0)        

        // Direct memory access configuration This 
        // bit is set and cleared by software to 
        // select between two DMA modes of 
        // operation and is effective only when 
        // DMAEN=1. For more details, refer to 
        // page351 Note: The software is allowed to 
        // write this bit only when ADSTART bit is 
        // cleared to 0 (this ensures that no 
        // conversion is ongoing).
        readonly DMACFG    = new Field<ADC_CFGR1, true>(1, 1)        

        // Scan sequence direction This bit is set 
        // and cleared by software to select the 
        // direction in which the channels is 
        // scanned in the sequence. It is effective 
        // only if CHSELMOD bit is cleared to 0. 
        // Note: The software is allowed to write 
        // this bit only when ADSTART bit is 
        // cleared to 0 (this ensures that no 
        // conversion is ongoing). If CCRDY is not 
        // yet asserted after channel configuration 
        // (writing ADC_CHSELR register or changing 
        // CHSELRMOD or SCANDIR), the value written 
        // to this bit is ignored.
        readonly SCANDIR   = new Field<ADC_CFGR1, true>(1, 2)        

        // Data resolution These bits are written 
        // by software to select the resolution of 
        // the conversion. Note: The software is 
        // allowed to write these bits only when 
        // ADEN=0.
        readonly RES       = new Field<ADC_CFGR1, true>(2, 3)        

        // Data alignment This bit is set and 
        // cleared by software to select right or 
        // left alignment. Refer to Data alignment 
        // and resolution (oversampling disabled: 
        // OVSE = 0) on page349 Note: The software 
        // is allowed to write this bit only when 
        // ADSTART bit is cleared to 0 (this 
        // ensures that no conversion is ongoing).
        readonly ALIGN     = new Field<ADC_CFGR1, true>(1, 5)        

        // External trigger selection These bits 
        // select the external event used to 
        // trigger the start of conversion (refer 
        // to External triggers for details): Note: 
        // The software is allowed to write this 
        // bit only when ADSTART bit is cleared to 
        // 0 (this ensures that no conversion is 
        // ongoing).
        readonly EXTSEL    = new Field<ADC_CFGR1, true>(3, 6)        

        // External trigger enable and polarity 
        // selection These bits are set and cleared 
        // by software to select the external 
        // trigger polarity and enable the trigger. 
        // Note: The software is allowed to write 
        // this bit only when ADSTART bit is 
        // cleared to 0 (this ensures that no 
        // conversion is ongoing).
        readonly EXTEN     = new Field<ADC_CFGR1, true>(2, 10)        

        // Overrun management mode This bit is set 
        // and cleared by software and configure 
        // the way data overruns are managed. Note: 
        // The software is allowed to write this 
        // bit only when ADSTART bit is cleared to 
        // 0 (this ensures that no conversion is 
        // ongoing).
        readonly OVRMOD    = new Field<ADC_CFGR1, true>(1, 12)        

        // Single / continuous conversion mode This 
        // bit is set and cleared by software. If 
        // it is set, conversion takes place 
        // continuously until it is cleared. Note: 
        // It is not possible to have both 
        // discontinuous mode and continuous mode 
        // enabled: it is forbidden to set both 
        // bits DISCEN=1 and CONT=1. The software 
        // is allowed to write this bit only when 
        // ADSTART bit is cleared to 0 (this 
        // ensures that no conversion is ongoing).
        readonly CONT      = new Field<ADC_CFGR1, true>(1, 13)        

        // Wait conversion mode This bit is set and 
        // cleared by software to enable/disable 
        // wait conversion mode.. Note: The 
        // software is allowed to write this bit 
        // only when ADSTART bit is cleared to 0 
        // (this ensures that no conversion is 
        // ongoing).
        readonly WAIT      = new Field<ADC_CFGR1, true>(1, 14)        

        // Auto-off mode This bit is set and 
        // cleared by software to enable/disable 
        // auto-off mode.. Note: The software is 
        // allowed to write this bit only when 
        // ADSTART bit is cleared to 0 (this 
        // ensures that no conversion is ongoing).
        readonly AUTOFF    = new Field<ADC_CFGR1, true>(1, 15)        

        // Discontinuous mode This bit is set and 
        // cleared by software to enable/disable 
        // discontinuous mode. Note: It is not 
        // possible to have both discontinuous mode 
        // and continuous mode enabled: it is 
        // forbidden to set both bits DISCEN=1 and 
        // CONT=1. The software is allowed to write 
        // this bit only when ADSTART bit is 
        // cleared to 0 (this ensures that no 
        // conversion is ongoing).
        readonly DISCEN    = new Field<ADC_CFGR1, true>(1, 16)        

        // Mode selection of the ADC_CHSELR 
        // register This bit is set and cleared by 
        // software to control the ADC_CHSELR 
        // feature: Note: The software is allowed 
        // to write this bit only when ADSTART bit 
        // is cleared to 0 (this ensures that no 
        // conversion is ongoing). If CCRDY is not 
        // yet asserted after channel configuration 
        // (writing ADC_CHSELR register or changing 
        // CHSELRMOD or SCANDIR), the value written 
        // to this bit is ignored.
        readonly CHSELRMOD = new Field<ADC_CFGR1, true>(1, 21)        

        // Enable the watchdog on a single channel 
        // or on all channels This bit is set and 
        // cleared by software to enable the analog 
        // watchdog on the channel identified by 
        // the AWDCH[4:0] bits or on all the 
        // channels Note: The software is allowed 
        // to write this bit only when ADSTART bit 
        // is cleared to 0 (this ensures that no 
        // conversion is ongoing).
        readonly AWD1SGL   = new Field<ADC_CFGR1, true>(1, 22)        

        // Analog watchdog enable This bit is set 
        // and cleared by software. Note: The 
        // software is allowed to write this bit 
        // only when ADSTART bit is cleared to 0 
        // (this ensures that no conversion is 
        // ongoing).
        readonly AWD1EN    = new Field<ADC_CFGR1, true>(1, 23)        

        // Analog watchdog channel selection These 
        // bits are set and cleared by software. 
        // They select the input channel to be 
        // guarded by the analog watchdog. ..... 
        // Others: Reserved Note: The channel 
        // selected by the AWDCH[4:0] bits must be 
        // also set into the CHSELR register. The 
        // software is allowed to write this bit 
        // only when ADSTART bit is cleared to 0 
        // (this ensures that no conversion is 
        // ongoing).
        readonly AWD1CH    = new Field<ADC_CFGR1, true>(5, 26)        
    }

    // ADC configuration register 2
    static readonly ADC_CFGR2 = new class ADC_CFGR2 extends Register<ADC_CFGR2>
    {
        constructor() { super(0x40012410) }        

        // Oversampler Enable This bit is set and 
        // cleared by software. Note: Software is 
        // allowed to write this bit only when 
        // ADSTART=0 (which ensures that no 
        // conversion is ongoing).
        readonly OVSE   = new Field<ADC_CFGR2, true>(1, 0)        

        // Oversampling ratio This bit filed defines 
        // the number of oversampling ratio. Note: 
        // The software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that no 
        // conversion is ongoing).
        readonly OVSR   = new Field<ADC_CFGR2, true>(3, 2)        

        // Oversampling shift This bit is set and 
        // cleared by software. Others: Reserved 
        // Note: The software is allowed to write 
        // this bit only when ADSTART=0 (which 
        // ensures that no conversion is ongoing).
        readonly OVSS   = new Field<ADC_CFGR2, true>(4, 5)        

        // Triggered Oversampling This bit is set and 
        // cleared by software. Note: The software is 
        // allowed to write this bit only when 
        // ADSTART=0 (which ensures that no 
        // conversion is ongoing).
        readonly TOVS   = new Field<ADC_CFGR2, true>(1, 9)        

        // Low frequency trigger mode enable This 
        // bit is set and cleared by software. Note: 
        // The software is allowed to write this bit 
        // only when ADSTART bit is cleared to 0 
        // (this ensures that no conversion is 
        // ongoing).
        readonly LFTRIG = new Field<ADC_CFGR2, true>(1, 29)        

        // ADC clock mode These bits are set and 
        // cleared by software to define how the 
        // analog ADC is clocked: In all synchronous 
        // clock modes, there is no jitter in the 
        // delay from a timer trigger to the start 
        // of a conversion. Note: The software is 
        // allowed to write these bits only when the 
        // ADC is disabled (ADCAL=0, ADSTART=0, 
        // ADSTP=0, ADDIS=0 and ADEN=0).
        readonly CKMODE = new Field<ADC_CFGR2, true>(2, 30)        
    }

    // ADC sampling time register
    static readonly ADC_SMPR = new class ADC_SMPR extends Register<ADC_SMPR>
    {
        constructor() { super(0x40012414) }        

        // Sampling time selection 1 These bits are 
        // written by software to select the 
        // sampling time that applies to all 
        // channels. Note: The software is allowed 
        // to write this bit only when ADSTART=0 
        // (which ensures that no conversion is 
        // ongoing).
        readonly SMP1     = new Field<ADC_SMPR, true>(3, 0)        

        // Sampling time selection 2 These bits are 
        // written by software to select the 
        // sampling time that applies to all 
        // channels. Note: The software is allowed 
        // to write this bit only when ADSTART=0 
        // (which ensures that no conversion is 
        // ongoing).
        readonly SMP2     = new Field<ADC_SMPR, true>(3, 4)        

        // Channel-x sampling time selection These 
        // bits are written by software to define 
        // which sampling time is used. Note: The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing).
        readonly SMPSEL0  = new Field<ADC_SMPR, true>(1, 8)        

        // Channel-x sampling time selection These 
        // bits are written by software to define 
        // which sampling time is used. Note: The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing).
        readonly SMPSEL1  = new Field<ADC_SMPR, true>(1, 9)        

        // Channel-x sampling time selection These 
        // bits are written by software to define 
        // which sampling time is used. Note: The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing).
        readonly SMPSEL2  = new Field<ADC_SMPR, true>(1, 10)        

        // Channel-x sampling time selection These 
        // bits are written by software to define 
        // which sampling time is used. Note: The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing).
        readonly SMPSEL3  = new Field<ADC_SMPR, true>(1, 11)        

        // Channel-x sampling time selection These 
        // bits are written by software to define 
        // which sampling time is used. Note: The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing).
        readonly SMPSEL4  = new Field<ADC_SMPR, true>(1, 12)        

        // Channel-x sampling time selection These 
        // bits are written by software to define 
        // which sampling time is used. Note: The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing).
        readonly SMPSEL5  = new Field<ADC_SMPR, true>(1, 13)        

        // Channel-x sampling time selection These 
        // bits are written by software to define 
        // which sampling time is used. Note: The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing).
        readonly SMPSEL6  = new Field<ADC_SMPR, true>(1, 14)        

        // Channel-x sampling time selection These 
        // bits are written by software to define 
        // which sampling time is used. Note: The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing).
        readonly SMPSEL7  = new Field<ADC_SMPR, true>(1, 15)        

        // Channel-x sampling time selection These 
        // bits are written by software to define 
        // which sampling time is used. Note: The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing).
        readonly SMPSEL8  = new Field<ADC_SMPR, true>(1, 16)        

        // Channel-x sampling time selection These 
        // bits are written by software to define 
        // which sampling time is used. Note: The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing).
        readonly SMPSEL9  = new Field<ADC_SMPR, true>(1, 17)        

        // Channel-x sampling time selection These 
        // bits are written by software to define 
        // which sampling time is used. Note: The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing).
        readonly SMPSEL10 = new Field<ADC_SMPR, true>(1, 18)        

        // Channel-x sampling time selection These 
        // bits are written by software to define 
        // which sampling time is used. Note: The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing).
        readonly SMPSEL11 = new Field<ADC_SMPR, true>(1, 19)        

        // Channel-x sampling time selection These 
        // bits are written by software to define 
        // which sampling time is used. Note: The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing).
        readonly SMPSEL12 = new Field<ADC_SMPR, true>(1, 20)        

        // Channel-x sampling time selection These 
        // bits are written by software to define 
        // which sampling time is used. Note: The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing).
        readonly SMPSEL13 = new Field<ADC_SMPR, true>(1, 21)        

        // Channel-x sampling time selection These 
        // bits are written by software to define 
        // which sampling time is used. Note: The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing).
        readonly SMPSEL14 = new Field<ADC_SMPR, true>(1, 22)        

        // Channel-x sampling time selection These 
        // bits are written by software to define 
        // which sampling time is used. Note: The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing).
        readonly SMPSEL15 = new Field<ADC_SMPR, true>(1, 23)        

        // Channel-x sampling time selection These 
        // bits are written by software to define 
        // which sampling time is used. Note: The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing).
        readonly SMPSEL16 = new Field<ADC_SMPR, true>(1, 24)        

        // Channel-x sampling time selection These 
        // bits are written by software to define 
        // which sampling time is used. Note: The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing).
        readonly SMPSEL17 = new Field<ADC_SMPR, true>(1, 25)        

        // Channel-x sampling time selection These 
        // bits are written by software to define 
        // which sampling time is used. Note: The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing).
        readonly SMPSEL18 = new Field<ADC_SMPR, true>(1, 26)        
    }

    // ADC watchdog threshold register
    static readonly ADC_AWD1TR = new class ADC_AWD1TR extends Register<ADC_AWD1TR>
    {
        constructor() { super(0x40012420) }        

        // Analog watchdog 1 lower threshold These 
        // bits are written by software to define the 
        // lower threshold for the analog watchdog. 
        // Refer to ADC_AWDxTR) on page355.
        readonly LT1 = new Field<ADC_AWD1TR, true>(12, 0)        

        // Analog watchdog 1 higher threshold These 
        // bits are written by software to define the 
        // higher threshold for the analog watchdog. 
        // Refer to ADC_AWDxTR) on page355.
        readonly HT1 = new Field<ADC_AWD1TR, true>(12, 16)        
    }

    // ADC watchdog threshold register
    static readonly ADC_AWD2TR = new class ADC_AWD2TR extends Register<ADC_AWD2TR>
    {
        constructor() { super(0x40012424) }        

        // Analog watchdog 2 lower threshold These 
        // bits are written by software to define the 
        // lower threshold for the analog watchdog. 
        // Refer to ADC_AWDxTR) on page355.
        readonly LT2 = new Field<ADC_AWD2TR, true>(12, 0)        

        // Analog watchdog 2 higher threshold These 
        // bits are written by software to define the 
        // higher threshold for the analog watchdog. 
        // Refer to ADC_AWDxTR) on page355.
        readonly HT2 = new Field<ADC_AWD2TR, true>(12, 16)        
    }

    // ADC channel selection register 
    // [alternate]
    static readonly ADC_CHSELR_0 = new class ADC_CHSELR_0 extends Register<ADC_CHSELR_0>
    {
        constructor() { super(0x40012428) }        

        // Channel-x selection These bits are 
        // written by software and define which 
        // channels are part of the sequence of 
        // channels to be converted. Refer to  for 
        // ADC inputs connected to external 
        // channels and internal sources. Note: The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing). If CCRDY is 
        // not yet asserted after channel 
        // configuration (writing ADC_CHSELR 
        // register or changing CHSELRMOD or 
        // SCANDIR), the value written to this bit 
        // is ignored.
        readonly CHSEL0  = new Field<ADC_CHSELR_0, true>(1, 0)        

        // Channel-x selection These bits are 
        // written by software and define which 
        // channels are part of the sequence of 
        // channels to be converted. Refer to  for 
        // ADC inputs connected to external 
        // channels and internal sources. Note: The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing). If CCRDY is 
        // not yet asserted after channel 
        // configuration (writing ADC_CHSELR 
        // register or changing CHSELRMOD or 
        // SCANDIR), the value written to this bit 
        // is ignored.
        readonly CHSEL1  = new Field<ADC_CHSELR_0, true>(1, 1)        

        // Channel-x selection These bits are 
        // written by software and define which 
        // channels are part of the sequence of 
        // channels to be converted. Refer to  for 
        // ADC inputs connected to external 
        // channels and internal sources. Note: The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing). If CCRDY is 
        // not yet asserted after channel 
        // configuration (writing ADC_CHSELR 
        // register or changing CHSELRMOD or 
        // SCANDIR), the value written to this bit 
        // is ignored.
        readonly CHSEL2  = new Field<ADC_CHSELR_0, true>(1, 2)        

        // Channel-x selection These bits are 
        // written by software and define which 
        // channels are part of the sequence of 
        // channels to be converted. Refer to  for 
        // ADC inputs connected to external 
        // channels and internal sources. Note: The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing). If CCRDY is 
        // not yet asserted after channel 
        // configuration (writing ADC_CHSELR 
        // register or changing CHSELRMOD or 
        // SCANDIR), the value written to this bit 
        // is ignored.
        readonly CHSEL3  = new Field<ADC_CHSELR_0, true>(1, 3)        

        // Channel-x selection These bits are 
        // written by software and define which 
        // channels are part of the sequence of 
        // channels to be converted. Refer to  for 
        // ADC inputs connected to external 
        // channels and internal sources. Note: The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing). If CCRDY is 
        // not yet asserted after channel 
        // configuration (writing ADC_CHSELR 
        // register or changing CHSELRMOD or 
        // SCANDIR), the value written to this bit 
        // is ignored.
        readonly CHSEL4  = new Field<ADC_CHSELR_0, true>(1, 4)        

        // Channel-x selection These bits are 
        // written by software and define which 
        // channels are part of the sequence of 
        // channels to be converted. Refer to  for 
        // ADC inputs connected to external 
        // channels and internal sources. Note: The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing). If CCRDY is 
        // not yet asserted after channel 
        // configuration (writing ADC_CHSELR 
        // register or changing CHSELRMOD or 
        // SCANDIR), the value written to this bit 
        // is ignored.
        readonly CHSEL5  = new Field<ADC_CHSELR_0, true>(1, 5)        

        // Channel-x selection These bits are 
        // written by software and define which 
        // channels are part of the sequence of 
        // channels to be converted. Refer to  for 
        // ADC inputs connected to external 
        // channels and internal sources. Note: The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing). If CCRDY is 
        // not yet asserted after channel 
        // configuration (writing ADC_CHSELR 
        // register or changing CHSELRMOD or 
        // SCANDIR), the value written to this bit 
        // is ignored.
        readonly CHSEL6  = new Field<ADC_CHSELR_0, true>(1, 6)        

        // Channel-x selection These bits are 
        // written by software and define which 
        // channels are part of the sequence of 
        // channels to be converted. Refer to  for 
        // ADC inputs connected to external 
        // channels and internal sources. Note: The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing). If CCRDY is 
        // not yet asserted after channel 
        // configuration (writing ADC_CHSELR 
        // register or changing CHSELRMOD or 
        // SCANDIR), the value written to this bit 
        // is ignored.
        readonly CHSEL7  = new Field<ADC_CHSELR_0, true>(1, 7)        

        // Channel-x selection These bits are 
        // written by software and define which 
        // channels are part of the sequence of 
        // channels to be converted. Refer to  for 
        // ADC inputs connected to external 
        // channels and internal sources. Note: The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing). If CCRDY is 
        // not yet asserted after channel 
        // configuration (writing ADC_CHSELR 
        // register or changing CHSELRMOD or 
        // SCANDIR), the value written to this bit 
        // is ignored.
        readonly CHSEL8  = new Field<ADC_CHSELR_0, true>(1, 8)        

        // Channel-x selection These bits are 
        // written by software and define which 
        // channels are part of the sequence of 
        // channels to be converted. Refer to  for 
        // ADC inputs connected to external 
        // channels and internal sources. Note: The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing). If CCRDY is 
        // not yet asserted after channel 
        // configuration (writing ADC_CHSELR 
        // register or changing CHSELRMOD or 
        // SCANDIR), the value written to this bit 
        // is ignored.
        readonly CHSEL9  = new Field<ADC_CHSELR_0, true>(1, 9)        

        // Channel-x selection These bits are 
        // written by software and define which 
        // channels are part of the sequence of 
        // channels to be converted. Refer to  for 
        // ADC inputs connected to external 
        // channels and internal sources. Note: The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing). If CCRDY is 
        // not yet asserted after channel 
        // configuration (writing ADC_CHSELR 
        // register or changing CHSELRMOD or 
        // SCANDIR), the value written to this bit 
        // is ignored.
        readonly CHSEL10 = new Field<ADC_CHSELR_0, true>(1, 10)        

        // Channel-x selection These bits are 
        // written by software and define which 
        // channels are part of the sequence of 
        // channels to be converted. Refer to  for 
        // ADC inputs connected to external 
        // channels and internal sources. Note: The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing). If CCRDY is 
        // not yet asserted after channel 
        // configuration (writing ADC_CHSELR 
        // register or changing CHSELRMOD or 
        // SCANDIR), the value written to this bit 
        // is ignored.
        readonly CHSEL11 = new Field<ADC_CHSELR_0, true>(1, 11)        

        // Channel-x selection These bits are 
        // written by software and define which 
        // channels are part of the sequence of 
        // channels to be converted. Refer to  for 
        // ADC inputs connected to external 
        // channels and internal sources. Note: The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing). If CCRDY is 
        // not yet asserted after channel 
        // configuration (writing ADC_CHSELR 
        // register or changing CHSELRMOD or 
        // SCANDIR), the value written to this bit 
        // is ignored.
        readonly CHSEL12 = new Field<ADC_CHSELR_0, true>(1, 12)        

        // Channel-x selection These bits are 
        // written by software and define which 
        // channels are part of the sequence of 
        // channels to be converted. Refer to  for 
        // ADC inputs connected to external 
        // channels and internal sources. Note: The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing). If CCRDY is 
        // not yet asserted after channel 
        // configuration (writing ADC_CHSELR 
        // register or changing CHSELRMOD or 
        // SCANDIR), the value written to this bit 
        // is ignored.
        readonly CHSEL13 = new Field<ADC_CHSELR_0, true>(1, 13)        

        // Channel-x selection These bits are 
        // written by software and define which 
        // channels are part of the sequence of 
        // channels to be converted. Refer to  for 
        // ADC inputs connected to external 
        // channels and internal sources. Note: The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing). If CCRDY is 
        // not yet asserted after channel 
        // configuration (writing ADC_CHSELR 
        // register or changing CHSELRMOD or 
        // SCANDIR), the value written to this bit 
        // is ignored.
        readonly CHSEL14 = new Field<ADC_CHSELR_0, true>(1, 14)        

        // Channel-x selection These bits are 
        // written by software and define which 
        // channels are part of the sequence of 
        // channels to be converted. Refer to  for 
        // ADC inputs connected to external 
        // channels and internal sources. Note: The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing). If CCRDY is 
        // not yet asserted after channel 
        // configuration (writing ADC_CHSELR 
        // register or changing CHSELRMOD or 
        // SCANDIR), the value written to this bit 
        // is ignored.
        readonly CHSEL15 = new Field<ADC_CHSELR_0, true>(1, 15)        

        // Channel-x selection These bits are 
        // written by software and define which 
        // channels are part of the sequence of 
        // channels to be converted. Refer to  for 
        // ADC inputs connected to external 
        // channels and internal sources. Note: The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing). If CCRDY is 
        // not yet asserted after channel 
        // configuration (writing ADC_CHSELR 
        // register or changing CHSELRMOD or 
        // SCANDIR), the value written to this bit 
        // is ignored.
        readonly CHSEL16 = new Field<ADC_CHSELR_0, true>(1, 16)        

        // Channel-x selection These bits are 
        // written by software and define which 
        // channels are part of the sequence of 
        // channels to be converted. Refer to  for 
        // ADC inputs connected to external 
        // channels and internal sources. Note: The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing). If CCRDY is 
        // not yet asserted after channel 
        // configuration (writing ADC_CHSELR 
        // register or changing CHSELRMOD or 
        // SCANDIR), the value written to this bit 
        // is ignored.
        readonly CHSEL17 = new Field<ADC_CHSELR_0, true>(1, 17)        

        // Channel-x selection These bits are 
        // written by software and define which 
        // channels are part of the sequence of 
        // channels to be converted. Refer to  for 
        // ADC inputs connected to external 
        // channels and internal sources. Note: The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing). If CCRDY is 
        // not yet asserted after channel 
        // configuration (writing ADC_CHSELR 
        // register or changing CHSELRMOD or 
        // SCANDIR), the value written to this bit 
        // is ignored.
        readonly CHSEL18 = new Field<ADC_CHSELR_0, true>(1, 18)        
    }

    // channel selection register CHSELRMOD = 1 
    // in ADC_CFGR1
    static readonly ADC_CHSELR_1 = new class ADC_CHSELR_1 extends Register<ADC_CHSELR_1>
    {
        constructor() { super(0x40012428) }        

        // 1st conversion of the sequence These bits 
        // are programmed by software with the 
        // channel number (0...14) assigned to the 
        // 8th conversion of the sequence. 0b1111 
        // indicates end of the sequence. When 0b1111 
        // (end of sequence) is programmed to the 
        // lower sequence channels, these bits are 
        // ignored. Refer to SQ8[3:0] for a 
        // definition of channel selection. Note: The 
        // software is allowed to write this bit only 
        // when ADSTART=0 (which ensures that no 
        // conversion is ongoing).
        readonly SQ1 = new Field<ADC_CHSELR_1, true>(4, 0)        

        // 2nd conversion of the sequence These bits 
        // are programmed by software with the 
        // channel number (0...14) assigned to the 
        // 8th conversion of the sequence. 0b1111 
        // indicates end of the sequence. When 0b1111 
        // (end of sequence) is programmed to the 
        // lower sequence channels, these bits are 
        // ignored. Refer to SQ8[3:0] for a 
        // definition of channel selection. Note: The 
        // software is allowed to write this bit only 
        // when ADSTART=0 (which ensures that no 
        // conversion is ongoing).
        readonly SQ2 = new Field<ADC_CHSELR_1, true>(4, 4)        

        // 3rd conversion of the sequence These bits 
        // are programmed by software with the 
        // channel number (0...14) assigned to the 
        // 8th conversion of the sequence. 0b1111 
        // indicates end of the sequence. When 0b1111 
        // (end of sequence) is programmed to the 
        // lower sequence channels, these bits are 
        // ignored. Refer to SQ8[3:0] for a 
        // definition of channel selection. Note: The 
        // software is allowed to write this bit only 
        // when ADSTART=0 (which ensures that no 
        // conversion is ongoing).
        readonly SQ3 = new Field<ADC_CHSELR_1, true>(4, 8)        

        // 4th conversion of the sequence These bits 
        // are programmed by software with the 
        // channel number (0...14) assigned to the 
        // 8th conversion of the sequence. 0b1111 
        // indicates end of the sequence. When 
        // 0b1111 (end of sequence) is programmed to 
        // the lower sequence channels, these bits 
        // are ignored. Refer to SQ8[3:0] for a 
        // definition of channel selection. Note: 
        // The software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing).
        readonly SQ4 = new Field<ADC_CHSELR_1, true>(4, 12)        

        // 5th conversion of the sequence These bits 
        // are programmed by software with the 
        // channel number (0...14) assigned to the 
        // 8th conversion of the sequence. 0b1111 
        // indicates end of the sequence. When 
        // 0b1111 (end of sequence) is programmed to 
        // the lower sequence channels, these bits 
        // are ignored. Refer to SQ8[3:0] for a 
        // definition of channel selection. Note: 
        // The software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing).
        readonly SQ5 = new Field<ADC_CHSELR_1, true>(4, 16)        

        // 6th conversion of the sequence These bits 
        // are programmed by software with the 
        // channel number (0...14) assigned to the 
        // 8th conversion of the sequence. 0b1111 
        // indicates end of the sequence. When 
        // 0b1111 (end of sequence) is programmed to 
        // the lower sequence channels, these bits 
        // are ignored. Refer to SQ8[3:0] for a 
        // definition of channel selection. Note: 
        // The software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing).
        readonly SQ6 = new Field<ADC_CHSELR_1, true>(4, 20)        

        // 7th conversion of the sequence These bits 
        // are programmed by software with the 
        // channel number (0...14) assigned to the 
        // 8th conversion of the sequence. 0b1111 
        // indicates end of the sequence. When 
        // 0b1111 (end of sequence) is programmed to 
        // the lower sequence channels, these bits 
        // are ignored. Refer to SQ8[3:0] for a 
        // definition of channel selection. Note: 
        // The software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing).
        readonly SQ7 = new Field<ADC_CHSELR_1, true>(4, 24)        

        // 8th conversion of the sequence These bits 
        // are programmed by software with the 
        // channel number (0...14) assigned to the 
        // 8th conversion of the sequence. 0b1111 
        // indicates the end of the sequence. When 
        // 0b1111 (end of sequence) is programmed to 
        // the lower sequence channels, these bits 
        // are ignored. ... Note: The software is 
        // allowed to write this bit only when 
        // ADSTART=0 (which ensures that no 
        // conversion is ongoing).
        readonly SQ8 = new Field<ADC_CHSELR_1, true>(4, 28)        
    }

    // ADC watchdog threshold register
    static readonly ADC_AWD3TR = new class ADC_AWD3TR extends Register<ADC_AWD3TR>
    {
        constructor() { super(0x4001242c) }        

        // Analog watchdog 3lower threshold These bits 
        // are written by software to define the lower 
        // threshold for the analog watchdog. Refer to 
        // ADC_AWDxTR) on page355.
        readonly LT3 = new Field<ADC_AWD3TR, true>(12, 0)        

        // Analog watchdog 3 higher threshold These 
        // bits are written by software to define the 
        // higher threshold for the analog watchdog. 
        // Refer to ADC_AWDxTR) on page355.
        readonly HT3 = new Field<ADC_AWD3TR, true>(12, 16)        
    }

    // ADC data register
    static readonly ADC_DR = new class ADC_DR extends Register<ADC_DR>
    {
        constructor() { super(0x40012440) }        

        // Converted data These bits are read-only. They 
        // contain the conversion result from the last 
        // converted channel. The data are left- or 
        // right-aligned as shown in OVSE = 0) on 
        // page349. Just after a calibration is 
        // complete, DATA[6:0] contains the calibration 
        // factor.
        readonly DATA = new Field<ADC_DR, false>(16, 0)        
    }

    // ADC Analog Watchdog 2 Configuration 
    // register
    static readonly ADC_AWD2CR = new class ADC_AWD2CR extends Register<ADC_AWD2CR>
    {
        constructor() { super(0x400124a0) }        

        // Analog watchdog channel selection These 
        // bits are set and cleared by software. 
        // They enable and select the input 
        // channels to be guarded by analog 
        // watchdog 2 (AWD2). Note: The channels 
        // selected through ADC_AWD2CR must be also 
        // configured into the ADC_CHSELR 
        // registers. Refer to SQ8[3:0] for a 
        // definition of channel selection. The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing).
        readonly AWD2CH0  = new Field<ADC_AWD2CR, true>(1, 0)        

        // Analog watchdog channel selection These 
        // bits are set and cleared by software. 
        // They enable and select the input 
        // channels to be guarded by analog 
        // watchdog 2 (AWD2). Note: The channels 
        // selected through ADC_AWD2CR must be also 
        // configured into the ADC_CHSELR 
        // registers. Refer to SQ8[3:0] for a 
        // definition of channel selection. The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing).
        readonly AWD2CH1  = new Field<ADC_AWD2CR, true>(1, 1)        

        // Analog watchdog channel selection These 
        // bits are set and cleared by software. 
        // They enable and select the input 
        // channels to be guarded by analog 
        // watchdog 2 (AWD2). Note: The channels 
        // selected through ADC_AWD2CR must be also 
        // configured into the ADC_CHSELR 
        // registers. Refer to SQ8[3:0] for a 
        // definition of channel selection. The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing).
        readonly AWD2CH2  = new Field<ADC_AWD2CR, true>(1, 2)        

        // Analog watchdog channel selection These 
        // bits are set and cleared by software. 
        // They enable and select the input 
        // channels to be guarded by analog 
        // watchdog 2 (AWD2). Note: The channels 
        // selected through ADC_AWD2CR must be also 
        // configured into the ADC_CHSELR 
        // registers. Refer to SQ8[3:0] for a 
        // definition of channel selection. The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing).
        readonly AWD2CH3  = new Field<ADC_AWD2CR, true>(1, 3)        

        // Analog watchdog channel selection These 
        // bits are set and cleared by software. 
        // They enable and select the input 
        // channels to be guarded by analog 
        // watchdog 2 (AWD2). Note: The channels 
        // selected through ADC_AWD2CR must be also 
        // configured into the ADC_CHSELR 
        // registers. Refer to SQ8[3:0] for a 
        // definition of channel selection. The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing).
        readonly AWD2CH4  = new Field<ADC_AWD2CR, true>(1, 4)        

        // Analog watchdog channel selection These 
        // bits are set and cleared by software. 
        // They enable and select the input 
        // channels to be guarded by analog 
        // watchdog 2 (AWD2). Note: The channels 
        // selected through ADC_AWD2CR must be also 
        // configured into the ADC_CHSELR 
        // registers. Refer to SQ8[3:0] for a 
        // definition of channel selection. The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing).
        readonly AWD2CH5  = new Field<ADC_AWD2CR, true>(1, 5)        

        // Analog watchdog channel selection These 
        // bits are set and cleared by software. 
        // They enable and select the input 
        // channels to be guarded by analog 
        // watchdog 2 (AWD2). Note: The channels 
        // selected through ADC_AWD2CR must be also 
        // configured into the ADC_CHSELR 
        // registers. Refer to SQ8[3:0] for a 
        // definition of channel selection. The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing).
        readonly AWD2CH6  = new Field<ADC_AWD2CR, true>(1, 6)        

        // Analog watchdog channel selection These 
        // bits are set and cleared by software. 
        // They enable and select the input 
        // channels to be guarded by analog 
        // watchdog 2 (AWD2). Note: The channels 
        // selected through ADC_AWD2CR must be also 
        // configured into the ADC_CHSELR 
        // registers. Refer to SQ8[3:0] for a 
        // definition of channel selection. The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing).
        readonly AWD2CH7  = new Field<ADC_AWD2CR, true>(1, 7)        

        // Analog watchdog channel selection These 
        // bits are set and cleared by software. 
        // They enable and select the input 
        // channels to be guarded by analog 
        // watchdog 2 (AWD2). Note: The channels 
        // selected through ADC_AWD2CR must be also 
        // configured into the ADC_CHSELR 
        // registers. Refer to SQ8[3:0] for a 
        // definition of channel selection. The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing).
        readonly AWD2CH8  = new Field<ADC_AWD2CR, true>(1, 8)        

        // Analog watchdog channel selection These 
        // bits are set and cleared by software. 
        // They enable and select the input 
        // channels to be guarded by analog 
        // watchdog 2 (AWD2). Note: The channels 
        // selected through ADC_AWD2CR must be also 
        // configured into the ADC_CHSELR 
        // registers. Refer to SQ8[3:0] for a 
        // definition of channel selection. The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing).
        readonly AWD2CH9  = new Field<ADC_AWD2CR, true>(1, 9)        

        // Analog watchdog channel selection These 
        // bits are set and cleared by software. 
        // They enable and select the input 
        // channels to be guarded by analog 
        // watchdog 2 (AWD2). Note: The channels 
        // selected through ADC_AWD2CR must be also 
        // configured into the ADC_CHSELR 
        // registers. Refer to SQ8[3:0] for a 
        // definition of channel selection. The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing).
        readonly AWD2CH10 = new Field<ADC_AWD2CR, true>(1, 10)        

        // Analog watchdog channel selection These 
        // bits are set and cleared by software. 
        // They enable and select the input 
        // channels to be guarded by analog 
        // watchdog 2 (AWD2). Note: The channels 
        // selected through ADC_AWD2CR must be also 
        // configured into the ADC_CHSELR 
        // registers. Refer to SQ8[3:0] for a 
        // definition of channel selection. The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing).
        readonly AWD2CH11 = new Field<ADC_AWD2CR, true>(1, 11)        

        // Analog watchdog channel selection These 
        // bits are set and cleared by software. 
        // They enable and select the input 
        // channels to be guarded by analog 
        // watchdog 2 (AWD2). Note: The channels 
        // selected through ADC_AWD2CR must be also 
        // configured into the ADC_CHSELR 
        // registers. Refer to SQ8[3:0] for a 
        // definition of channel selection. The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing).
        readonly AWD2CH12 = new Field<ADC_AWD2CR, true>(1, 12)        

        // Analog watchdog channel selection These 
        // bits are set and cleared by software. 
        // They enable and select the input 
        // channels to be guarded by analog 
        // watchdog 2 (AWD2). Note: The channels 
        // selected through ADC_AWD2CR must be also 
        // configured into the ADC_CHSELR 
        // registers. Refer to SQ8[3:0] for a 
        // definition of channel selection. The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing).
        readonly AWD2CH13 = new Field<ADC_AWD2CR, true>(1, 13)        

        // Analog watchdog channel selection These 
        // bits are set and cleared by software. 
        // They enable and select the input 
        // channels to be guarded by analog 
        // watchdog 2 (AWD2). Note: The channels 
        // selected through ADC_AWD2CR must be also 
        // configured into the ADC_CHSELR 
        // registers. Refer to SQ8[3:0] for a 
        // definition of channel selection. The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing).
        readonly AWD2CH14 = new Field<ADC_AWD2CR, true>(1, 14)        

        // Analog watchdog channel selection These 
        // bits are set and cleared by software. 
        // They enable and select the input 
        // channels to be guarded by analog 
        // watchdog 2 (AWD2). Note: The channels 
        // selected through ADC_AWD2CR must be also 
        // configured into the ADC_CHSELR 
        // registers. Refer to SQ8[3:0] for a 
        // definition of channel selection. The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing).
        readonly AWD2CH15 = new Field<ADC_AWD2CR, true>(1, 15)        

        // Analog watchdog channel selection These 
        // bits are set and cleared by software. 
        // They enable and select the input 
        // channels to be guarded by analog 
        // watchdog 2 (AWD2). Note: The channels 
        // selected through ADC_AWD2CR must be also 
        // configured into the ADC_CHSELR 
        // registers. Refer to SQ8[3:0] for a 
        // definition of channel selection. The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing).
        readonly AWD2CH16 = new Field<ADC_AWD2CR, true>(1, 16)        

        // Analog watchdog channel selection These 
        // bits are set and cleared by software. 
        // They enable and select the input 
        // channels to be guarded by analog 
        // watchdog 2 (AWD2). Note: The channels 
        // selected through ADC_AWD2CR must be also 
        // configured into the ADC_CHSELR 
        // registers. Refer to SQ8[3:0] for a 
        // definition of channel selection. The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing).
        readonly AWD2CH17 = new Field<ADC_AWD2CR, true>(1, 17)        

        // Analog watchdog channel selection These 
        // bits are set and cleared by software. 
        // They enable and select the input 
        // channels to be guarded by analog 
        // watchdog 2 (AWD2). Note: The channels 
        // selected through ADC_AWD2CR must be also 
        // configured into the ADC_CHSELR 
        // registers. Refer to SQ8[3:0] for a 
        // definition of channel selection. The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing).
        readonly AWD2CH18 = new Field<ADC_AWD2CR, true>(1, 18)        
    }

    // ADC Analog Watchdog 3 Configuration 
    // register
    static readonly ADC_AWD3CR = new class ADC_AWD3CR extends Register<ADC_AWD3CR>
    {
        constructor() { super(0x400124a4) }        

        // Analog watchdog channel selection These 
        // bits are set and cleared by software. 
        // They enable and select the input 
        // channels to be guarded by analog 
        // watchdog 3 (AWD3). Note: The channels 
        // selected through ADC_AWD3CR must be also 
        // configured into the ADC_CHSELR 
        // registers. Refer to SQ8[3:0] for a 
        // definition of channel selection. The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing).
        readonly AWD3CH0  = new Field<ADC_AWD3CR, true>(1, 0)        

        // Analog watchdog channel selection These 
        // bits are set and cleared by software. 
        // They enable and select the input 
        // channels to be guarded by analog 
        // watchdog 3 (AWD3). Note: The channels 
        // selected through ADC_AWD3CR must be also 
        // configured into the ADC_CHSELR 
        // registers. Refer to SQ8[3:0] for a 
        // definition of channel selection. The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing).
        readonly AWD3CH1  = new Field<ADC_AWD3CR, true>(1, 1)        

        // Analog watchdog channel selection These 
        // bits are set and cleared by software. 
        // They enable and select the input 
        // channels to be guarded by analog 
        // watchdog 3 (AWD3). Note: The channels 
        // selected through ADC_AWD3CR must be also 
        // configured into the ADC_CHSELR 
        // registers. Refer to SQ8[3:0] for a 
        // definition of channel selection. The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing).
        readonly AWD3CH2  = new Field<ADC_AWD3CR, true>(1, 2)        

        // Analog watchdog channel selection These 
        // bits are set and cleared by software. 
        // They enable and select the input 
        // channels to be guarded by analog 
        // watchdog 3 (AWD3). Note: The channels 
        // selected through ADC_AWD3CR must be also 
        // configured into the ADC_CHSELR 
        // registers. Refer to SQ8[3:0] for a 
        // definition of channel selection. The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing).
        readonly AWD3CH3  = new Field<ADC_AWD3CR, true>(1, 3)        

        // Analog watchdog channel selection These 
        // bits are set and cleared by software. 
        // They enable and select the input 
        // channels to be guarded by analog 
        // watchdog 3 (AWD3). Note: The channels 
        // selected through ADC_AWD3CR must be also 
        // configured into the ADC_CHSELR 
        // registers. Refer to SQ8[3:0] for a 
        // definition of channel selection. The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing).
        readonly AWD3CH4  = new Field<ADC_AWD3CR, true>(1, 4)        

        // Analog watchdog channel selection These 
        // bits are set and cleared by software. 
        // They enable and select the input 
        // channels to be guarded by analog 
        // watchdog 3 (AWD3). Note: The channels 
        // selected through ADC_AWD3CR must be also 
        // configured into the ADC_CHSELR 
        // registers. Refer to SQ8[3:0] for a 
        // definition of channel selection. The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing).
        readonly AWD3CH5  = new Field<ADC_AWD3CR, true>(1, 5)        

        // Analog watchdog channel selection These 
        // bits are set and cleared by software. 
        // They enable and select the input 
        // channels to be guarded by analog 
        // watchdog 3 (AWD3). Note: The channels 
        // selected through ADC_AWD3CR must be also 
        // configured into the ADC_CHSELR 
        // registers. Refer to SQ8[3:0] for a 
        // definition of channel selection. The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing).
        readonly AWD3CH6  = new Field<ADC_AWD3CR, true>(1, 6)        

        // Analog watchdog channel selection These 
        // bits are set and cleared by software. 
        // They enable and select the input 
        // channels to be guarded by analog 
        // watchdog 3 (AWD3). Note: The channels 
        // selected through ADC_AWD3CR must be also 
        // configured into the ADC_CHSELR 
        // registers. Refer to SQ8[3:0] for a 
        // definition of channel selection. The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing).
        readonly AWD3CH7  = new Field<ADC_AWD3CR, true>(1, 7)        

        // Analog watchdog channel selection These 
        // bits are set and cleared by software. 
        // They enable and select the input 
        // channels to be guarded by analog 
        // watchdog 3 (AWD3). Note: The channels 
        // selected through ADC_AWD3CR must be also 
        // configured into the ADC_CHSELR 
        // registers. Refer to SQ8[3:0] for a 
        // definition of channel selection. The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing).
        readonly AWD3CH8  = new Field<ADC_AWD3CR, true>(1, 8)        

        // Analog watchdog channel selection These 
        // bits are set and cleared by software. 
        // They enable and select the input 
        // channels to be guarded by analog 
        // watchdog 3 (AWD3). Note: The channels 
        // selected through ADC_AWD3CR must be also 
        // configured into the ADC_CHSELR 
        // registers. Refer to SQ8[3:0] for a 
        // definition of channel selection. The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing).
        readonly AWD3CH9  = new Field<ADC_AWD3CR, true>(1, 9)        

        // Analog watchdog channel selection These 
        // bits are set and cleared by software. 
        // They enable and select the input 
        // channels to be guarded by analog 
        // watchdog 3 (AWD3). Note: The channels 
        // selected through ADC_AWD3CR must be also 
        // configured into the ADC_CHSELR 
        // registers. Refer to SQ8[3:0] for a 
        // definition of channel selection. The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing).
        readonly AWD3CH10 = new Field<ADC_AWD3CR, true>(1, 10)        

        // Analog watchdog channel selection These 
        // bits are set and cleared by software. 
        // They enable and select the input 
        // channels to be guarded by analog 
        // watchdog 3 (AWD3). Note: The channels 
        // selected through ADC_AWD3CR must be also 
        // configured into the ADC_CHSELR 
        // registers. Refer to SQ8[3:0] for a 
        // definition of channel selection. The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing).
        readonly AWD3CH11 = new Field<ADC_AWD3CR, true>(1, 11)        

        // Analog watchdog channel selection These 
        // bits are set and cleared by software. 
        // They enable and select the input 
        // channels to be guarded by analog 
        // watchdog 3 (AWD3). Note: The channels 
        // selected through ADC_AWD3CR must be also 
        // configured into the ADC_CHSELR 
        // registers. Refer to SQ8[3:0] for a 
        // definition of channel selection. The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing).
        readonly AWD3CH12 = new Field<ADC_AWD3CR, true>(1, 12)        

        // Analog watchdog channel selection These 
        // bits are set and cleared by software. 
        // They enable and select the input 
        // channels to be guarded by analog 
        // watchdog 3 (AWD3). Note: The channels 
        // selected through ADC_AWD3CR must be also 
        // configured into the ADC_CHSELR 
        // registers. Refer to SQ8[3:0] for a 
        // definition of channel selection. The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing).
        readonly AWD3CH13 = new Field<ADC_AWD3CR, true>(1, 13)        

        // Analog watchdog channel selection These 
        // bits are set and cleared by software. 
        // They enable and select the input 
        // channels to be guarded by analog 
        // watchdog 3 (AWD3). Note: The channels 
        // selected through ADC_AWD3CR must be also 
        // configured into the ADC_CHSELR 
        // registers. Refer to SQ8[3:0] for a 
        // definition of channel selection. The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing).
        readonly AWD3CH14 = new Field<ADC_AWD3CR, true>(1, 14)        

        // Analog watchdog channel selection These 
        // bits are set and cleared by software. 
        // They enable and select the input 
        // channels to be guarded by analog 
        // watchdog 3 (AWD3). Note: The channels 
        // selected through ADC_AWD3CR must be also 
        // configured into the ADC_CHSELR 
        // registers. Refer to SQ8[3:0] for a 
        // definition of channel selection. The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing).
        readonly AWD3CH15 = new Field<ADC_AWD3CR, true>(1, 15)        

        // Analog watchdog channel selection These 
        // bits are set and cleared by software. 
        // They enable and select the input 
        // channels to be guarded by analog 
        // watchdog 3 (AWD3). Note: The channels 
        // selected through ADC_AWD3CR must be also 
        // configured into the ADC_CHSELR 
        // registers. Refer to SQ8[3:0] for a 
        // definition of channel selection. The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing).
        readonly AWD3CH16 = new Field<ADC_AWD3CR, true>(1, 16)        

        // Analog watchdog channel selection These 
        // bits are set and cleared by software. 
        // They enable and select the input 
        // channels to be guarded by analog 
        // watchdog 3 (AWD3). Note: The channels 
        // selected through ADC_AWD3CR must be also 
        // configured into the ADC_CHSELR 
        // registers. Refer to SQ8[3:0] for a 
        // definition of channel selection. The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing).
        readonly AWD3CH17 = new Field<ADC_AWD3CR, true>(1, 17)        

        // Analog watchdog channel selection These 
        // bits are set and cleared by software. 
        // They enable and select the input 
        // channels to be guarded by analog 
        // watchdog 3 (AWD3). Note: The channels 
        // selected through ADC_AWD3CR must be also 
        // configured into the ADC_CHSELR 
        // registers. Refer to SQ8[3:0] for a 
        // definition of channel selection. The 
        // software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that 
        // no conversion is ongoing).
        readonly AWD3CH18 = new Field<ADC_AWD3CR, true>(1, 18)        
    }

    // ADC Calibration factor
    static readonly ADC_CALFACT = new class ADC_CALFACT extends Register<ADC_CALFACT>
    {
        constructor() { super(0x400124b4) }        

        // Calibration factor These bits are 
        // written by hardware or by software. Once 
        // a calibration is complete,they are 
        // updated by hardware with the calibration 
        // factors. Software can write these bits 
        // with a new calibration factor. If the 
        // new calibration factor is different from 
        // the current one stored into the analog 
        // ADC, it is then applied once a new 
        // calibration is launched. Just after a 
        // calibration is complete, DATA[6:0] 
        // contains the calibration factor. Note: 
        // Software can write these bits only when 
        // ADEN=1 (ADC is enabled and no 
        // calibration is ongoing and no conversion 
        // is ongoing). Refer to SQ8[3:0] for a 
        // definition of channel selection.
        readonly CALFACT = new Field<ADC_CALFACT, true>(7, 0)        
    }

    // ADC common configuration register
    static readonly ADC_CCR = new class ADC_CCR extends Register<ADC_CCR>
    {
        constructor() { super(0x40012708) }        

        // ADC prescaler Set and cleared by software 
        // to select the frequency of the clock to the 
        // ADC. Other: Reserved Note: Software is 
        // allowed to write these bits only when the 
        // ADC is disabled (ADCAL=0, ADSTART=0, 
        // ADSTP=0, ADDIS=0 and ADEN=0).
        readonly PRESC  = new Field<ADC_CCR, true>(4, 18)        

        // VREFINT enable This bit is set and cleared 
        // by software to enable/disable the VREFINT. 
        // Note: Software is allowed to write this bit 
        // only when ADSTART=0 (which ensures that no 
        // conversion is ongoing).
        readonly VREFEN = new Field<ADC_CCR, true>(1, 22)        

        // Temperature sensor enable This bit is set 
        // and cleared by software to enable/disable 
        // the temperature sensor. Note: Software is 
        // allowed to write this bit only when 
        // ADSTART=0 (which ensures that no conversion 
        // is ongoing).
        readonly TSEN   = new Field<ADC_CCR, true>(1, 23)        

        // VBAT enable This bit is set and cleared by 
        // software to enable/disable the VBAT 
        // channel. Note: The software is allowed to 
        // write this bit only when ADSTART=0 (which 
        // ensures that no conversion is ongoing)
        readonly VBATEN = new Field<ADC_CCR, true>(1, 24)        
    }
}

export class IWDG
{
    // Key register
    static readonly KR = new class KR extends Register<KR>
    {
        constructor() { super(0x40003000) }        

        // Key value (write only, read 0x0000)
        readonly KEY = new Field<KR, true>(16, 0)        
    }

    // Prescaler register
    static readonly PR = new class PR extends Register<PR>
    {
        constructor() { super(0x40003004) }        

        // Prescaler divider
        readonly PR = new Field<PR, true>(3, 0)        
    }

    // Reload register
    static readonly RLR = new class RLR extends Register<RLR>
    {
        constructor() { super(0x40003008) }        

        // Watchdog counter reload value
        readonly RL = new Field<RLR, true>(12, 0)        
    }

    // Status register
    static readonly SR = new class SR extends Register<SR>
    {
        constructor() { super(0x4000300c) }        

        // Watchdog counter window value update
        readonly WVU = new Field<SR, false>(1, 2)        

        // Watchdog counter reload value update
        readonly RVU = new Field<SR, false>(1, 1)        

        // Watchdog prescaler value update
        readonly PVU = new Field<SR, false>(1, 0)        
    }

    // Window register
    static readonly WINR = new class WINR extends Register<WINR>
    {
        constructor() { super(0x40003010) }        

        // Watchdog counter window value
        readonly WIN = new Field<WINR, true>(12, 0)        
    }
}

export class WWDG
{
    // Control register
    static readonly CR = new class CR extends Register<CR>
    {
        constructor() { super(0x40002c00) }        

        // Activation bit
        readonly WDGA = new Field<CR, true>(1, 7)        

        // 7-bit counter (MSB to LSB)
        readonly T    = new Field<CR, true>(7, 0)        
    }

    // Configuration register
    static readonly CFR = new class CFR extends Register<CFR>
    {
        constructor() { super(0x40002c04) }        

        // Timer base
        readonly WDGTB = new Field<CFR, true>(3, 11)        

        // Early wakeup interrupt
        readonly EWI   = new Field<CFR, true>(1, 9)        

        // 7-bit window value
        readonly W     = new Field<CFR, true>(7, 0)        
    }

    // Status register
    static readonly SR = new class SR extends Register<SR>
    {
        constructor() { super(0x40002c08) }        

        // Early wakeup interrupt flag
        readonly EWIF = new Field<SR, true>(1, 0)        
    }
}

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

export class PWR
{
    // Power control register 1
    static readonly CR1 = new class CR1 extends Register<CR1>
    {
        constructor() { super(0x40007000) }        

        // Low-power run
        readonly LPR       = new Field<CR1, true>(1, 14)        

        // Voltage scaling range selection
        readonly VOS       = new Field<CR1, true>(2, 9)        

        // Disable backup domain write protection
        readonly DBP       = new Field<CR1, true>(1, 8)        

        // Flash memory powered down during Low-power 
        // sleep mode
        readonly FPD_LPSLP = new Field<CR1, true>(1, 5)        

        // Flash memory powered down during Low-power 
        // run mode
        readonly FPD_LPRUN = new Field<CR1, true>(1, 4)        

        // Flash memory powered down during Stop mode
        readonly FPD_STOP  = new Field<CR1, true>(1, 3)        

        // Low-power mode selection
        readonly LPMS      = new Field<CR1, true>(3, 0)        
    }

    // Power control register 2
    static readonly CR2 = new class CR2 extends Register<CR2>
    {
        constructor() { super(0x40007004) }        

        // USV
        readonly USV = new Field<CR2, true>(1, 10)        
    }

    // Power control register 3
    static readonly CR3 = new class CR3 extends Register<CR3>
    {
        constructor() { super(0x40007008) }        

        // Enable Wakeup pin WKUP1
        readonly EWUP1 = new Field<CR3, true>(1, 0)        

        // Enable Wakeup pin WKUP2
        readonly EWUP2 = new Field<CR3, true>(1, 1)        

        // Enable Wakeup pin WKUP3
        readonly EWUP3 = new Field<CR3, true>(1, 2)        

        // Enable Wakeup pin WKUP4
        readonly EWUP4 = new Field<CR3, true>(1, 3)        

        // Enable WKUP5 wakeup pin
        readonly EWUP5 = new Field<CR3, true>(1, 4)        

        // Enable WKUP6 wakeup pin
        readonly EWUP6 = new Field<CR3, true>(1, 5)        

        // Apply pull-up and pull-down configuration
        readonly APC   = new Field<CR3, true>(1, 10)        

        // Enable internal wakeup line
        readonly EIWUL = new Field<CR3, true>(1, 15)        
    }

    // Power control register 4
    static readonly CR4 = new class CR4 extends Register<CR4>
    {
        constructor() { super(0x4000700c) }        

        // Wakeup pin WKUP1 polarity
        readonly WP1  = new Field<CR4, true>(1, 0)        

        // Wakeup pin WKUP2 polarity
        readonly WP2  = new Field<CR4, true>(1, 1)        

        // Wakeup pin WKUP3 polarity
        readonly WP3  = new Field<CR4, true>(1, 2)        

        // Wakeup pin WKUP4 polarity
        readonly WP4  = new Field<CR4, true>(1, 3)        

        // Wakeup pin WKUP5 polarity
        readonly WP5  = new Field<CR4, true>(1, 4)        

        // WKUP6 wakeup pin polarity
        readonly WP6  = new Field<CR4, true>(1, 5)        

        // VBAT battery charging enable
        readonly VBE  = new Field<CR4, true>(1, 8)        

        // VBAT battery charging resistor selection
        readonly VBRS = new Field<CR4, true>(1, 9)        
    }

    // Power status register 1
    static readonly SR1 = new class SR1 extends Register<SR1>
    {
        constructor() { super(0x40007010) }        

        // Wakeup flag 1
        readonly WUF1 = new Field<SR1, false>(1, 0)        

        // Wakeup flag 2
        readonly WUF2 = new Field<SR1, false>(1, 1)        

        // Wakeup flag 3
        readonly WUF3 = new Field<SR1, false>(1, 2)        

        // Wakeup flag 4
        readonly WUF4 = new Field<SR1, false>(1, 3)        

        // Wakeup flag 5
        readonly WUF5 = new Field<SR1, false>(1, 4)        

        // Wakeup flag 6
        readonly WUF6 = new Field<SR1, false>(1, 5)        

        // Standby flag
        readonly SBF  = new Field<SR1, false>(1, 8)        

        // Wakeup flag internal
        readonly WUFI = new Field<SR1, false>(1, 15)        
    }

    // Power status register 2
    static readonly SR2 = new class SR2 extends Register<SR2>
    {
        constructor() { super(0x40007014) }        

        // Voltage scaling flag
        readonly VOSF      = new Field<SR2, false>(1, 10)        

        // Low-power regulator flag
        readonly REGLPF    = new Field<SR2, false>(1, 9)        

        // Low-power regulator started
        readonly REGLPS    = new Field<SR2, false>(1, 8)        

        // Flash ready flag
        readonly FLASH_RDY = new Field<SR2, false>(1, 7)        
    }

    // Power status clear register
    static readonly SCR = new class SCR extends Register<SCR>
    {
        constructor() { super(0x40007018) }        

        // Clear standby flag
        readonly CSBF  = new Field<SCR, true>(1, 8)        

        // Clear wakeup flag 6
        readonly CWUF6 = new Field<SCR, true>(1, 5)        

        // Clear wakeup flag 5
        readonly CWUF5 = new Field<SCR, true>(1, 4)        

        // Clear wakeup flag 4
        readonly CWUF4 = new Field<SCR, true>(1, 3)        

        // Clear wakeup flag 3
        readonly CWUF3 = new Field<SCR, true>(1, 2)        

        // Clear wakeup flag 2
        readonly CWUF2 = new Field<SCR, true>(1, 1)        

        // Clear wakeup flag 1
        readonly CWUF1 = new Field<SCR, true>(1, 0)        
    }

    // Power Port A pull-up control register
    static readonly PUCRA = new class PUCRA extends Register<PUCRA>
    {
        constructor() { super(0x40007020) }        

        // Port A pull-up bit y (y=0..15)
        readonly PU15 = new Field<PUCRA, true>(1, 15)        

        // Port A pull-up bit y (y=0..15)
        readonly PU14 = new Field<PUCRA, true>(1, 14)        

        // Port A pull-up bit y (y=0..15)
        readonly PU13 = new Field<PUCRA, true>(1, 13)        

        // Port A pull-up bit y (y=0..15)
        readonly PU12 = new Field<PUCRA, true>(1, 12)        

        // Port A pull-up bit y (y=0..15)
        readonly PU11 = new Field<PUCRA, true>(1, 11)        

        // Port A pull-up bit y (y=0..15)
        readonly PU10 = new Field<PUCRA, true>(1, 10)        

        // Port A pull-up bit y (y=0..15)
        readonly PU9  = new Field<PUCRA, true>(1, 9)        

        // Port A pull-up bit y (y=0..15)
        readonly PU8  = new Field<PUCRA, true>(1, 8)        

        // Port A pull-up bit y (y=0..15)
        readonly PU7  = new Field<PUCRA, true>(1, 7)        

        // Port A pull-up bit y (y=0..15)
        readonly PU6  = new Field<PUCRA, true>(1, 6)        

        // Port A pull-up bit y (y=0..15)
        readonly PU5  = new Field<PUCRA, true>(1, 5)        

        // Port A pull-up bit y (y=0..15)
        readonly PU4  = new Field<PUCRA, true>(1, 4)        

        // Port A pull-up bit y (y=0..15)
        readonly PU3  = new Field<PUCRA, true>(1, 3)        

        // Port A pull-up bit y (y=0..15)
        readonly PU2  = new Field<PUCRA, true>(1, 2)        

        // Port A pull-up bit y (y=0..15)
        readonly PU1  = new Field<PUCRA, true>(1, 1)        

        // Port A pull-up bit y (y=0..15)
        readonly PU0  = new Field<PUCRA, true>(1, 0)        
    }

    // Power Port A pull-down control register
    static readonly PDCRA = new class PDCRA extends Register<PDCRA>
    {
        constructor() { super(0x40007024) }        

        // Port A pull-down bit y (y=0..15)
        readonly PD15 = new Field<PDCRA, true>(1, 15)        

        // Port A pull-down bit y (y=0..15)
        readonly PD14 = new Field<PDCRA, true>(1, 14)        

        // Port A pull-down bit y (y=0..15)
        readonly PD13 = new Field<PDCRA, true>(1, 13)        

        // Port A pull-down bit y (y=0..15)
        readonly PD12 = new Field<PDCRA, true>(1, 12)        

        // Port A pull-down bit y (y=0..15)
        readonly PD11 = new Field<PDCRA, true>(1, 11)        

        // Port A pull-down bit y (y=0..15)
        readonly PD10 = new Field<PDCRA, true>(1, 10)        

        // Port A pull-down bit y (y=0..15)
        readonly PD9  = new Field<PDCRA, true>(1, 9)        

        // Port A pull-down bit y (y=0..15)
        readonly PD8  = new Field<PDCRA, true>(1, 8)        

        // Port A pull-down bit y (y=0..15)
        readonly PD7  = new Field<PDCRA, true>(1, 7)        

        // Port A pull-down bit y (y=0..15)
        readonly PD6  = new Field<PDCRA, true>(1, 6)        

        // Port A pull-down bit y (y=0..15)
        readonly PD5  = new Field<PDCRA, true>(1, 5)        

        // Port A pull-down bit y (y=0..15)
        readonly PD4  = new Field<PDCRA, true>(1, 4)        

        // Port A pull-down bit y (y=0..15)
        readonly PD3  = new Field<PDCRA, true>(1, 3)        

        // Port A pull-down bit y (y=0..15)
        readonly PD2  = new Field<PDCRA, true>(1, 2)        

        // Port A pull-down bit y (y=0..15)
        readonly PD1  = new Field<PDCRA, true>(1, 1)        

        // Port A pull-down bit y (y=0..15)
        readonly PD0  = new Field<PDCRA, true>(1, 0)        
    }

    // Power Port B pull-up control register
    static readonly PUCRB = new class PUCRB extends Register<PUCRB>
    {
        constructor() { super(0x40007028) }        

        // Port B pull-up bit y (y=0..15)
        readonly PU15 = new Field<PUCRB, true>(1, 15)        

        // Port B pull-up bit y (y=0..15)
        readonly PU14 = new Field<PUCRB, true>(1, 14)        

        // Port B pull-up bit y (y=0..15)
        readonly PU13 = new Field<PUCRB, true>(1, 13)        

        // Port B pull-up bit y (y=0..15)
        readonly PU12 = new Field<PUCRB, true>(1, 12)        

        // Port B pull-up bit y (y=0..15)
        readonly PU11 = new Field<PUCRB, true>(1, 11)        

        // Port B pull-up bit y (y=0..15)
        readonly PU10 = new Field<PUCRB, true>(1, 10)        

        // Port B pull-up bit y (y=0..15)
        readonly PU9  = new Field<PUCRB, true>(1, 9)        

        // Port B pull-up bit y (y=0..15)
        readonly PU8  = new Field<PUCRB, true>(1, 8)        

        // Port B pull-up bit y (y=0..15)
        readonly PU7  = new Field<PUCRB, true>(1, 7)        

        // Port B pull-up bit y (y=0..15)
        readonly PU6  = new Field<PUCRB, true>(1, 6)        

        // Port B pull-up bit y (y=0..15)
        readonly PU5  = new Field<PUCRB, true>(1, 5)        

        // Port B pull-up bit y (y=0..15)
        readonly PU4  = new Field<PUCRB, true>(1, 4)        

        // Port B pull-up bit y (y=0..15)
        readonly PU3  = new Field<PUCRB, true>(1, 3)        

        // Port B pull-up bit y (y=0..15)
        readonly PU2  = new Field<PUCRB, true>(1, 2)        

        // Port B pull-up bit y (y=0..15)
        readonly PU1  = new Field<PUCRB, true>(1, 1)        

        // Port B pull-up bit y (y=0..15)
        readonly PU0  = new Field<PUCRB, true>(1, 0)        
    }

    // Power Port B pull-down control register
    static readonly PDCRB = new class PDCRB extends Register<PDCRB>
    {
        constructor() { super(0x4000702c) }        

        // Port B pull-down bit y (y=0..15)
        readonly PD15 = new Field<PDCRB, true>(1, 15)        

        // Port B pull-down bit y (y=0..15)
        readonly PD14 = new Field<PDCRB, true>(1, 14)        

        // Port B pull-down bit y (y=0..15)
        readonly PD13 = new Field<PDCRB, true>(1, 13)        

        // Port B pull-down bit y (y=0..15)
        readonly PD12 = new Field<PDCRB, true>(1, 12)        

        // Port B pull-down bit y (y=0..15)
        readonly PD11 = new Field<PDCRB, true>(1, 11)        

        // Port B pull-down bit y (y=0..15)
        readonly PD10 = new Field<PDCRB, true>(1, 10)        

        // Port B pull-down bit y (y=0..15)
        readonly PD9  = new Field<PDCRB, true>(1, 9)        

        // Port B pull-down bit y (y=0..15)
        readonly PD8  = new Field<PDCRB, true>(1, 8)        

        // Port B pull-down bit y (y=0..15)
        readonly PD7  = new Field<PDCRB, true>(1, 7)        

        // Port B pull-down bit y (y=0..15)
        readonly PD6  = new Field<PDCRB, true>(1, 6)        

        // Port B pull-down bit y (y=0..15)
        readonly PD5  = new Field<PDCRB, true>(1, 5)        

        // Port B pull-down bit y (y=0..15)
        readonly PD4  = new Field<PDCRB, true>(1, 4)        

        // Port B pull-down bit y (y=0..15)
        readonly PD3  = new Field<PDCRB, true>(1, 3)        

        // Port B pull-down bit y (y=0..15)
        readonly PD2  = new Field<PDCRB, true>(1, 2)        

        // Port B pull-down bit y (y=0..15)
        readonly PD1  = new Field<PDCRB, true>(1, 1)        

        // Port B pull-down bit y (y=0..15)
        readonly PD0  = new Field<PDCRB, true>(1, 0)        
    }

    // Power Port C pull-up control register
    static readonly PUCRC = new class PUCRC extends Register<PUCRC>
    {
        constructor() { super(0x40007030) }        

        // Port C pull-up bit y (y=0..15)
        readonly PU15 = new Field<PUCRC, true>(1, 15)        

        // Port C pull-up bit y (y=0..15)
        readonly PU14 = new Field<PUCRC, true>(1, 14)        

        // Port C pull-up bit y (y=0..15)
        readonly PU13 = new Field<PUCRC, true>(1, 13)        

        // Port C pull-up bit y (y=0..15)
        readonly PU12 = new Field<PUCRC, true>(1, 12)        

        // Port C pull-up bit y (y=0..15)
        readonly PU11 = new Field<PUCRC, true>(1, 11)        

        // Port C pull-up bit y (y=0..15)
        readonly PU10 = new Field<PUCRC, true>(1, 10)        

        // Port C pull-up bit y (y=0..15)
        readonly PU9  = new Field<PUCRC, true>(1, 9)        

        // Port C pull-up bit y (y=0..15)
        readonly PU8  = new Field<PUCRC, true>(1, 8)        

        // Port C pull-up bit y (y=0..15)
        readonly PU7  = new Field<PUCRC, true>(1, 7)        

        // Port C pull-up bit y (y=0..15)
        readonly PU6  = new Field<PUCRC, true>(1, 6)        

        // Port C pull-up bit y (y=0..15)
        readonly PU5  = new Field<PUCRC, true>(1, 5)        

        // Port C pull-up bit y (y=0..15)
        readonly PU4  = new Field<PUCRC, true>(1, 4)        

        // Port C pull-up bit y (y=0..15)
        readonly PU3  = new Field<PUCRC, true>(1, 3)        

        // Port C pull-up bit y (y=0..15)
        readonly PU2  = new Field<PUCRC, true>(1, 2)        

        // Port C pull-up bit y (y=0..15)
        readonly PU1  = new Field<PUCRC, true>(1, 1)        

        // Port C pull-up bit y (y=0..15)
        readonly PU0  = new Field<PUCRC, true>(1, 0)        
    }

    // Power Port C pull-down control register
    static readonly PDCRC = new class PDCRC extends Register<PDCRC>
    {
        constructor() { super(0x40007034) }        

        // Port C pull-down bit y (y=0..15)
        readonly PD15 = new Field<PDCRC, true>(1, 15)        

        // Port C pull-down bit y (y=0..15)
        readonly PD14 = new Field<PDCRC, true>(1, 14)        

        // Port C pull-down bit y (y=0..15)
        readonly PD13 = new Field<PDCRC, true>(1, 13)        

        // Port C pull-down bit y (y=0..15)
        readonly PD12 = new Field<PDCRC, true>(1, 12)        

        // Port C pull-down bit y (y=0..15)
        readonly PD11 = new Field<PDCRC, true>(1, 11)        

        // Port C pull-down bit y (y=0..15)
        readonly PD10 = new Field<PDCRC, true>(1, 10)        

        // Port C pull-down bit y (y=0..15)
        readonly PD9  = new Field<PDCRC, true>(1, 9)        

        // Port C pull-down bit y (y=0..15)
        readonly PD8  = new Field<PDCRC, true>(1, 8)        

        // Port C pull-down bit y (y=0..15)
        readonly PD7  = new Field<PDCRC, true>(1, 7)        

        // Port C pull-down bit y (y=0..15)
        readonly PD6  = new Field<PDCRC, true>(1, 6)        

        // Port C pull-down bit y (y=0..15)
        readonly PD5  = new Field<PDCRC, true>(1, 5)        

        // Port C pull-down bit y (y=0..15)
        readonly PD4  = new Field<PDCRC, true>(1, 4)        

        // Port C pull-down bit y (y=0..15)
        readonly PD3  = new Field<PDCRC, true>(1, 3)        

        // Port C pull-down bit y (y=0..15)
        readonly PD2  = new Field<PDCRC, true>(1, 2)        

        // Port C pull-down bit y (y=0..15)
        readonly PD1  = new Field<PDCRC, true>(1, 1)        

        // Port C pull-down bit y (y=0..15)
        readonly PD0  = new Field<PDCRC, true>(1, 0)        
    }

    // Power Port D pull-up control register
    static readonly PUCRD = new class PUCRD extends Register<PUCRD>
    {
        constructor() { super(0x40007038) }        

        // Port D pull-up bit y (y=0..15)
        readonly PU15 = new Field<PUCRD, true>(1, 15)        

        // Port D pull-up bit y (y=0..15)
        readonly PU14 = new Field<PUCRD, true>(1, 14)        

        // Port D pull-up bit y (y=0..15)
        readonly PU13 = new Field<PUCRD, true>(1, 13)        

        // Port D pull-up bit y (y=0..15)
        readonly PU12 = new Field<PUCRD, true>(1, 12)        

        // Port D pull-up bit y (y=0..15)
        readonly PU11 = new Field<PUCRD, true>(1, 11)        

        // Port D pull-up bit y (y=0..15)
        readonly PU10 = new Field<PUCRD, true>(1, 10)        

        // Port D pull-up bit y (y=0..15)
        readonly PU9  = new Field<PUCRD, true>(1, 9)        

        // Port D pull-up bit y (y=0..15)
        readonly PU8  = new Field<PUCRD, true>(1, 8)        

        // Port D pull-up bit y (y=0..15)
        readonly PU7  = new Field<PUCRD, true>(1, 7)        

        // Port D pull-up bit y (y=0..15)
        readonly PU6  = new Field<PUCRD, true>(1, 6)        

        // Port D pull-up bit y (y=0..15)
        readonly PU5  = new Field<PUCRD, true>(1, 5)        

        // Port D pull-up bit y (y=0..15)
        readonly PU4  = new Field<PUCRD, true>(1, 4)        

        // Port D pull-up bit y (y=0..15)
        readonly PU3  = new Field<PUCRD, true>(1, 3)        

        // Port D pull-up bit y (y=0..15)
        readonly PU2  = new Field<PUCRD, true>(1, 2)        

        // Port D pull-up bit y (y=0..15)
        readonly PU1  = new Field<PUCRD, true>(1, 1)        

        // Port D pull-up bit y (y=0..15)
        readonly PU0  = new Field<PUCRD, true>(1, 0)        
    }

    // Power Port D pull-down control register
    static readonly PDCRD = new class PDCRD extends Register<PDCRD>
    {
        constructor() { super(0x4000703c) }        

        // Port D pull-down bit y (y=0..15)
        readonly PD15 = new Field<PDCRD, true>(1, 15)        

        // Port D pull-down bit y (y=0..15)
        readonly PD14 = new Field<PDCRD, true>(1, 14)        

        // Port D pull-down bit y (y=0..15)
        readonly PD13 = new Field<PDCRD, true>(1, 13)        

        // Port D pull-down bit y (y=0..15)
        readonly PD12 = new Field<PDCRD, true>(1, 12)        

        // Port D pull-down bit y (y=0..15)
        readonly PD11 = new Field<PDCRD, true>(1, 11)        

        // Port D pull-down bit y (y=0..15)
        readonly PD10 = new Field<PDCRD, true>(1, 10)        

        // Port D pull-down bit y (y=0..15)
        readonly PD9  = new Field<PDCRD, true>(1, 9)        

        // Port D pull-down bit y (y=0..15)
        readonly PD8  = new Field<PDCRD, true>(1, 8)        

        // Port D pull-down bit y (y=0..15)
        readonly PD7  = new Field<PDCRD, true>(1, 7)        

        // Port D pull-down bit y (y=0..15)
        readonly PD6  = new Field<PDCRD, true>(1, 6)        

        // Port D pull-down bit y (y=0..15)
        readonly PD5  = new Field<PDCRD, true>(1, 5)        

        // Port D pull-down bit y (y=0..15)
        readonly PD4  = new Field<PDCRD, true>(1, 4)        

        // Port D pull-down bit y (y=0..15)
        readonly PD3  = new Field<PDCRD, true>(1, 3)        

        // Port D pull-down bit y (y=0..15)
        readonly PD2  = new Field<PDCRD, true>(1, 2)        

        // Port D pull-down bit y (y=0..15)
        readonly PD1  = new Field<PDCRD, true>(1, 1)        

        // Port D pull-down bit y (y=0..15)
        readonly PD0  = new Field<PDCRD, true>(1, 0)        
    }

    // Power Port E pull-UP control register
    static readonly PUCRE = new class PUCRE extends Register<PUCRE>
    {
        constructor() { super(0x40007040) }        

        // Port E pull-up bit y (y=0..15)
        readonly PU15 = new Field<PUCRE, true>(1, 15)        

        // Port E pull-up bit y (y=0..15)
        readonly PU14 = new Field<PUCRE, true>(1, 14)        

        // Port E pull-up bit y (y=0..15)
        readonly PU13 = new Field<PUCRE, true>(1, 13)        

        // Port E pull-up bit y (y=0..15)
        readonly PU12 = new Field<PUCRE, true>(1, 12)        

        // Port E pull-up bit y (y=0..15)
        readonly PU11 = new Field<PUCRE, true>(1, 11)        

        // Port E pull-up bit y (y=0..15)
        readonly PU10 = new Field<PUCRE, true>(1, 10)        

        // Port E pull-up bit y (y=0..15)
        readonly PU9  = new Field<PUCRE, true>(1, 9)        

        // Port E pull-up bit y (y=0..15)
        readonly PU8  = new Field<PUCRE, true>(1, 8)        

        // Port E pull-up bit y (y=0..15)
        readonly PU7  = new Field<PUCRE, true>(1, 7)        

        // Port E pull-up bit y (y=0..15)
        readonly PU6  = new Field<PUCRE, true>(1, 6)        

        // Port E pull-up bit y (y=0..15)
        readonly PU5  = new Field<PUCRE, true>(1, 5)        

        // Port E pull-up bit y (y=0..15)
        readonly PU4  = new Field<PUCRE, true>(1, 4)        

        // Port E pull-up bit y (y=0..15)
        readonly PU3  = new Field<PUCRE, true>(1, 3)        

        // Port E pull-up bit y (y=0..15)
        readonly PU2  = new Field<PUCRE, true>(1, 2)        

        // Port E pull-up bit y (y=0..15)
        readonly PU1  = new Field<PUCRE, true>(1, 1)        

        // Port E pull-up bit y (y=0..15)
        readonly PU0  = new Field<PUCRE, true>(1, 0)        
    }

    // Power Port E pull-down control register
    static readonly PDCRE = new class PDCRE extends Register<PDCRE>
    {
        constructor() { super(0x40007044) }        

        // Port E pull-down bit y (y=0..15)
        readonly PD15 = new Field<PDCRE, true>(1, 15)        

        // Port E pull-down bit y (y=0..15)
        readonly PD14 = new Field<PDCRE, true>(1, 14)        

        // Port E pull-down bit y (y=0..15)
        readonly PD13 = new Field<PDCRE, true>(1, 13)        

        // Port E pull-down bit y (y=0..15)
        readonly PD12 = new Field<PDCRE, true>(1, 12)        

        // Port E pull-down bit y (y=0..15)
        readonly PD11 = new Field<PDCRE, true>(1, 11)        

        // Port E pull-down bit y (y=0..15)
        readonly PD10 = new Field<PDCRE, true>(1, 10)        

        // Port E pull-down bit y (y=0..15)
        readonly PD9  = new Field<PDCRE, true>(1, 9)        

        // Port E pull-down bit y (y=0..15)
        readonly PD8  = new Field<PDCRE, true>(1, 8)        

        // Port E pull-down bit y (y=0..15)
        readonly PD7  = new Field<PDCRE, true>(1, 7)        

        // Port E pull-down bit y (y=0..15)
        readonly PD6  = new Field<PDCRE, true>(1, 6)        

        // Port E pull-down bit y (y=0..15)
        readonly PD5  = new Field<PDCRE, true>(1, 5)        

        // Port E pull-down bit y (y=0..15)
        readonly PD4  = new Field<PDCRE, true>(1, 4)        

        // Port E pull-down bit y (y=0..15)
        readonly PD3  = new Field<PDCRE, true>(1, 3)        

        // Port E pull-down bit y (y=0..15)
        readonly PD2  = new Field<PDCRE, true>(1, 2)        

        // Port E pull-down bit y (y=0..15)
        readonly PD1  = new Field<PDCRE, true>(1, 1)        

        // Port E pull-down bit y (y=0..15)
        readonly PD0  = new Field<PDCRE, true>(1, 0)        
    }

    // Power Port F pull-up control register
    static readonly PUCRF = new class PUCRF extends Register<PUCRF>
    {
        constructor() { super(0x40007048) }        

        // Port F pull-up bit y (y=0..15)
        readonly PU13 = new Field<PUCRF, true>(1, 13)        

        // Port F pull-up bit y (y=0..15)
        readonly PU12 = new Field<PUCRF, true>(1, 12)        

        // Port F pull-up bit y (y=0..15)
        readonly PU11 = new Field<PUCRF, true>(1, 11)        

        // Port F pull-up bit y (y=0..15)
        readonly PU10 = new Field<PUCRF, true>(1, 10)        

        // Port F pull-up bit y (y=0..15)
        readonly PU9  = new Field<PUCRF, true>(1, 9)        

        // Port F pull-up bit y (y=0..15)
        readonly PU8  = new Field<PUCRF, true>(1, 8)        

        // Port F pull-up bit y (y=0..15)
        readonly PU7  = new Field<PUCRF, true>(1, 7)        

        // Port F pull-up bit y (y=0..15)
        readonly PU6  = new Field<PUCRF, true>(1, 6)        

        // Port F pull-up bit y (y=0..15)
        readonly PU5  = new Field<PUCRF, true>(1, 5)        

        // Port F pull-up bit y (y=0..15)
        readonly PU4  = new Field<PUCRF, true>(1, 4)        

        // Port F pull-up bit y (y=0..15)
        readonly PU3  = new Field<PUCRF, true>(1, 3)        

        // Port F pull-up bit y (y=0..15)
        readonly PU2  = new Field<PUCRF, true>(1, 2)        

        // Port F pull-up bit y (y=0..15)
        readonly PU1  = new Field<PUCRF, true>(1, 1)        

        // Port F pull-up bit y (y=0..15)
        readonly PU0  = new Field<PUCRF, true>(1, 0)        
    }

    // Power Port F pull-down control register
    static readonly PDCRF = new class PDCRF extends Register<PDCRF>
    {
        constructor() { super(0x4000704c) }        

        // Port F pull-down bit y (y=0..15)
        readonly PD13 = new Field<PDCRF, true>(1, 13)        

        // Port F pull-down bit y (y=0..15)
        readonly PD12 = new Field<PDCRF, true>(1, 12)        

        // Port F pull-down bit y (y=0..15)
        readonly PD11 = new Field<PDCRF, true>(1, 11)        

        // Port F pull-down bit y (y=0..15)
        readonly PD10 = new Field<PDCRF, true>(1, 10)        

        // Port F pull-down bit y (y=0..15)
        readonly PD9  = new Field<PDCRF, true>(1, 9)        

        // Port F pull-down bit y (y=0..15)
        readonly PD8  = new Field<PDCRF, true>(1, 8)        

        // Port F pull-down bit y (y=0..15)
        readonly PD7  = new Field<PDCRF, true>(1, 7)        

        // Port F pull-down bit y (y=0..15)
        readonly PD6  = new Field<PDCRF, true>(1, 6)        

        // Port F pull-down bit y (y=0..15)
        readonly PD5  = new Field<PDCRF, true>(1, 5)        

        // Port F pull-down bit y (y=0..15)
        readonly PD4  = new Field<PDCRF, true>(1, 4)        

        // Port F pull-down bit y (y=0..15)
        readonly PD3  = new Field<PDCRF, true>(1, 3)        

        // Port F pull-down bit y (y=0..15)
        readonly PD2  = new Field<PDCRF, true>(1, 2)        

        // Port F pull-down bit y (y=0..15)
        readonly PD1  = new Field<PDCRF, true>(1, 1)        

        // Port F pull-down bit y (y=0..15)
        readonly PD0  = new Field<PDCRF, true>(1, 0)        
    }
}

export class DMA1
{
    // DMA interrupt status register
    static readonly DMA_ISR = new class DMA_ISR extends Register<DMA_ISR>
    {
        constructor() { super(0x40020000) }        

        // global interrupt flag for channel 1
        readonly GIF1  = new Field<DMA_ISR, false>(1, 0)        

        // transfer complete (TC) flag for channel 1
        readonly TCIF1 = new Field<DMA_ISR, false>(1, 1)        

        // half transfer (HT) flag for channel 1
        readonly HTIF1 = new Field<DMA_ISR, false>(1, 2)        

        // transfer error (TE) flag for channel 1
        readonly TEIF1 = new Field<DMA_ISR, false>(1, 3)        

        // global interrupt flag for channel 2
        readonly GIF2  = new Field<DMA_ISR, false>(1, 4)        

        // transfer complete (TC) flag for channel 2
        readonly TCIF2 = new Field<DMA_ISR, false>(1, 5)        

        // half transfer (HT) flag for channel 2
        readonly HTIF2 = new Field<DMA_ISR, false>(1, 6)        

        // transfer error (TE) flag for channel 2
        readonly TEIF2 = new Field<DMA_ISR, false>(1, 7)        

        // global interrupt flag for channel 3
        readonly GIF3  = new Field<DMA_ISR, false>(1, 8)        

        // transfer complete (TC) flag for channel 3
        readonly TCIF3 = new Field<DMA_ISR, false>(1, 9)        

        // half transfer (HT) flag for channel 3
        readonly HTIF3 = new Field<DMA_ISR, false>(1, 10)        

        // transfer error (TE) flag for channel 3
        readonly TEIF3 = new Field<DMA_ISR, false>(1, 11)        

        // global interrupt flag for channel 4
        readonly GIF4  = new Field<DMA_ISR, false>(1, 12)        

        // transfer complete (TC) flag for channel 4
        readonly TCIF4 = new Field<DMA_ISR, false>(1, 13)        

        // half transfer (HT) flag for channel 4
        readonly HTIF4 = new Field<DMA_ISR, false>(1, 14)        

        // transfer error (TE) flag for channel 4
        readonly TEIF4 = new Field<DMA_ISR, false>(1, 15)        

        // global interrupt flag for channel 5
        readonly GIF5  = new Field<DMA_ISR, false>(1, 16)        

        // transfer complete (TC) flag for channel 5
        readonly TCIF5 = new Field<DMA_ISR, false>(1, 17)        

        // half transfer (HT) flag for channel 5
        readonly HTIF5 = new Field<DMA_ISR, false>(1, 18)        

        // transfer error (TE) flag for channel 5
        readonly TEIF5 = new Field<DMA_ISR, false>(1, 19)        

        // global interrupt flag for channel 6
        readonly GIF6  = new Field<DMA_ISR, false>(1, 20)        

        // transfer complete (TC) flag for channel 6
        readonly TCIF6 = new Field<DMA_ISR, false>(1, 21)        

        // half transfer (HT) flag for channel 6
        readonly HTIF6 = new Field<DMA_ISR, false>(1, 22)        

        // transfer error (TE) flag for channel 6
        readonly TEIF6 = new Field<DMA_ISR, false>(1, 23)        

        // global interrupt flag for channel 7
        readonly GIF7  = new Field<DMA_ISR, false>(1, 24)        

        // transfer complete (TC) flag for channel 7
        readonly TCIF7 = new Field<DMA_ISR, false>(1, 25)        

        // half transfer (HT) flag for channel 7
        readonly HTIF7 = new Field<DMA_ISR, false>(1, 26)        

        // transfer error (TE) flag for channel 7
        readonly TEIF7 = new Field<DMA_ISR, false>(1, 27)        
    }

    // DMA interrupt flag clear register
    static readonly DMA_IFCR = new class DMA_IFCR extends Register<DMA_IFCR>
    {
        constructor() { super(0x40020004) }        

        // global interrupt flag clear for channel 1
        readonly CGIF1  = new Field<DMA_IFCR, true>(1, 0)        

        // transfer complete flag clear for channel 1
        readonly CTCIF1 = new Field<DMA_IFCR, true>(1, 1)        

        // half transfer flag clear for channel 1
        readonly CHTIF1 = new Field<DMA_IFCR, true>(1, 2)        

        // transfer error flag clear for channel 1
        readonly CTEIF1 = new Field<DMA_IFCR, true>(1, 3)        

        // global interrupt flag clear for channel 2
        readonly CGIF2  = new Field<DMA_IFCR, true>(1, 4)        

        // transfer complete flag clear for channel 2
        readonly CTCIF2 = new Field<DMA_IFCR, true>(1, 5)        

        // half transfer flag clear for channel 2
        readonly CHTIF2 = new Field<DMA_IFCR, true>(1, 6)        

        // transfer error flag clear for channel 2
        readonly CTEIF2 = new Field<DMA_IFCR, true>(1, 7)        

        // global interrupt flag clear for channel 3
        readonly CGIF3  = new Field<DMA_IFCR, true>(1, 8)        

        // transfer complete flag clear for channel 3
        readonly CTCIF3 = new Field<DMA_IFCR, true>(1, 9)        

        // half transfer flag clear for channel 3
        readonly CHTIF3 = new Field<DMA_IFCR, true>(1, 10)        

        // transfer error flag clear for channel 3
        readonly CTEIF3 = new Field<DMA_IFCR, true>(1, 11)        

        // global interrupt flag clear for channel 4
        readonly CGIF4  = new Field<DMA_IFCR, true>(1, 12)        

        // transfer complete flag clear for channel 4
        readonly CTCIF4 = new Field<DMA_IFCR, true>(1, 13)        

        // half transfer flag clear for channel 4
        readonly CHTIF4 = new Field<DMA_IFCR, true>(1, 14)        

        // transfer error flag clear for channel 4
        readonly CTEIF4 = new Field<DMA_IFCR, true>(1, 15)        

        // global interrupt flag clear for channel 5
        readonly CGIF5  = new Field<DMA_IFCR, true>(1, 16)        

        // transfer complete flag clear for channel 5
        readonly CTCIF5 = new Field<DMA_IFCR, true>(1, 17)        

        // half transfer flag clear for channel 5
        readonly CHTIF5 = new Field<DMA_IFCR, true>(1, 18)        

        // transfer error flag clear for channel 5
        readonly CTEIF5 = new Field<DMA_IFCR, true>(1, 19)        

        // global interrupt flag clear for channel 6
        readonly CGIF6  = new Field<DMA_IFCR, true>(1, 20)        

        // transfer complete flag clear for channel 6
        readonly CTCIF6 = new Field<DMA_IFCR, true>(1, 21)        

        // half transfer flag clear for channel 6
        readonly CHTIF6 = new Field<DMA_IFCR, true>(1, 22)        

        // transfer error flag clear for channel 6
        readonly CTEIF6 = new Field<DMA_IFCR, true>(1, 23)        

        // global interrupt flag clear for channel 7
        readonly CGIF7  = new Field<DMA_IFCR, true>(1, 24)        

        // transfer complete flag clear for channel 7
        readonly CTCIF7 = new Field<DMA_IFCR, true>(1, 25)        

        // half transfer flag clear for channel 7
        readonly CHTIF7 = new Field<DMA_IFCR, true>(1, 26)        

        // transfer error flag clear for channel 7
        readonly CTEIF7 = new Field<DMA_IFCR, true>(1, 27)        
    }

    // DMA channel 1 configuration register
    static readonly DMA_CCR1 = new class DMA_CCR1 extends Register<DMA_CCR1>
    {
        constructor() { super(0x40020008) }        

        // channel enable When a channel transfer 
        // error occurs, this bit is cleared by 
        // hardware. It can not be set again by 
        // software (channel x re-activated) until 
        // the TEIFx bit of the DMA_ISR register is 
        // cleared (by setting the CTEIFx bit of the 
        // DMA_IFCR register). Note: this bit is set 
        // and cleared by software.
        readonly EN      = new Field<DMA_CCR1, true>(1, 0)        

        // transfer complete interrupt enable Note: 
        // this bit is set and cleared by software. 
        // It must not be written when the channel is 
        // enabled (EN = 1). It is not read-only when 
        // the channel is enabled (EN=1).
        readonly TCIE    = new Field<DMA_CCR1, true>(1, 1)        

        // half transfer interrupt enable Note: this 
        // bit is set and cleared by software. It 
        // must not be written when the channel is 
        // enabled (EN = 1). It is not read-only when 
        // the channel is enabled (EN=1).
        readonly HTIE    = new Field<DMA_CCR1, true>(1, 2)        

        // transfer error interrupt enable Note: this 
        // bit is set and cleared by software. It 
        // must not be written when the channel is 
        // enabled (EN = 1). It is not read-only when 
        // the channel is enabled (EN=1).
        readonly TEIE    = new Field<DMA_CCR1, true>(1, 3)        

        // data transfer direction This bit must be 
        // set only in memory-to-peripheral and 
        // peripheral-to-memory modes. Source 
        // attributes are defined by PSIZE and PINC, 
        // plus the DMA_CPARx register. This is still 
        // valid in a memory-to-memory mode. 
        // Destination attributes are defined by 
        // MSIZE and MINC, plus the DMA_CMARx 
        // register. This is still valid in a 
        // peripheral-to-peripheral mode. Destination 
        // attributes are defined by PSIZE and PINC, 
        // plus the DMA_CPARx register. This is still 
        // valid in a memory-to-memory mode. Source 
        // attributes are defined by MSIZE and MINC, 
        // plus the DMA_CMARx register. This is still 
        // valid in a peripheral-to-peripheral mode. 
        // Note: this bit is set and cleared by 
        // software. It must not be written when the 
        // channel is enabled (EN = 1). It is 
        // read-only when the channel is enabled 
        // (EN=1).
        readonly DIR     = new Field<DMA_CCR1, true>(1, 4)        

        // circular mode Note: this bit is set and 
        // cleared by software. It must not be 
        // written when the channel is enabled (EN = 
        // 1). It is not read-only when the channel 
        // is enabled (EN=1).
        readonly CIRC    = new Field<DMA_CCR1, true>(1, 5)        

        // peripheral increment mode Defines the 
        // increment mode for each DMA transfer to 
        // the identified peripheral. n 
        // memory-to-memory mode, this field 
        // identifies the memory destination if DIR=1 
        // and the memory source if DIR=0. In 
        // peripheral-to-peripheral mode, this field 
        // identifies the peripheral destination if 
        // DIR=1 and the peripheral source if DIR=0. 
        // Note: this bit is set and cleared by 
        // software. It must not be written when the 
        // channel is enabled (EN = 1). It is 
        // read-only when the channel is enabled 
        // (EN=1).
        readonly PINC    = new Field<DMA_CCR1, true>(1, 6)        

        // memory increment mode Defines the 
        // increment mode for each DMA transfer to 
        // the identified memory. In memory-to-memory 
        // mode, this field identifies the memory 
        // source if DIR=1 and the memory destination 
        // if DIR=0. In peripheral-to-peripheral 
        // mode, this field identifies the peripheral 
        // source if DIR=1 and the peripheral 
        // destination if DIR=0. Note: this bit is 
        // set and cleared by software. It must not 
        // be written when the channel is enabled (EN 
        // = 1). It is read-only when the channel is 
        // enabled (EN=1).
        readonly MINC    = new Field<DMA_CCR1, true>(1, 7)        

        // peripheral size Defines the data size of 
        // each DMA transfer to the identified 
        // peripheral. In memory-to-memory mode, this 
        // field identifies the memory destination if 
        // DIR=1 and the memory source if DIR=0. In 
        // peripheral-to-peripheral mode, this field 
        // identifies the peripheral destination if 
        // DIR=1 and the peripheral source if DIR=0. 
        // Note: this field is set and cleared by 
        // software. It must not be written when the 
        // channel is enabled (EN = 1). It is 
        // read-only when the channel is enabled 
        // (EN=1).
        readonly PSIZE   = new Field<DMA_CCR1, true>(2, 8)        

        // memory size Defines the data size of each 
        // DMA transfer to the identified memory. In 
        // memory-to-memory mode, this field 
        // identifies the memory source if DIR=1 and 
        // the memory destination if DIR=0. In 
        // peripheral-to-peripheral mode, this field 
        // identifies the peripheral source if DIR=1 
        // and the peripheral destination if DIR=0. 
        // Note: this field is set and cleared by 
        // software. It must not be written when the 
        // channel is enabled (EN = 1). It is 
        // read-only when the channel is enabled 
        // (EN=1).
        readonly MSIZE   = new Field<DMA_CCR1, true>(2, 10)        

        // priority level Note: this field is set 
        // and cleared by software. It must not be 
        // written when the channel is enabled (EN = 
        // 1). It is read-only when the channel is 
        // enabled (EN=1).
        readonly PL      = new Field<DMA_CCR1, true>(2, 12)        

        // memory-to-memory mode Note: this bit is 
        // set and cleared by software. It must not 
        // be written when the channel is enabled 
        // (EN = 1). It is read-only when the 
        // channel is enabled (EN=1).
        readonly MEM2MEM = new Field<DMA_CCR1, true>(1, 14)        
    }

    // DMA channel x number of data register
    static readonly DMA_CNDTR1 = new class DMA_CNDTR1 extends Register<DMA_CNDTR1>
    {
        constructor() { super(0x4002000c) }        

        // number of data to transfer (0 to 216-1) 
        // This field is updated by hardware when the 
        // channel is enabled: It is decremented after 
        // each single DMA 'read followed by write' 
        // transfer, indicating the remaining amount 
        // of data items to transfer. It is kept at 
        // zero when the programmed amount of data to 
        // transfer is reached, if the channel is not 
        // in circular mode (CIRC=0 in the DMA_CCRx 
        // register). It is reloaded automatically by 
        // the previously programmed value, when the 
        // transfer is complete, if the channel is in 
        // circular mode (CIRC=1). If this field is 
        // zero, no transfer can be served whatever 
        // the channel status (enabled or not). Note: 
        // this field is set and cleared by software. 
        // It must not be written when the channel is 
        // enabled (EN = 1). It is read-only when the 
        // channel is enabled (EN=1).
        readonly NDT = new Field<DMA_CNDTR1, true>(16, 0)        
    }

    // DMA channel x peripheral address 
    // register
    static readonly DMA_CPAR1 = new class DMA_CPAR1 extends Register<DMA_CPAR1>
    {
        constructor() { super(0x40020010) }        

        // peripheral address It contains the base 
        // address of the peripheral data register 
        // from/to which the data will be read/written. 
        // When PSIZE[1:0]=01 (16 bits), bit 0 of 
        // PA[31:0] is ignored. Access is automatically 
        // aligned to a half-word address. When PSIZE=10 
        // (32 bits), bits 1 and 0 of PA[31:0] are 
        // ignored. Access is automatically aligned to a 
        // word address. In memory-to-memory mode, this 
        // register identifies the memory destination 
        // address if DIR=1 and the memory source 
        // address if DIR=0. In peripheral-to-peripheral 
        // mode, this register identifies the peripheral 
        // destination address DIR=1 and the peripheral 
        // source address if DIR=0. Note: this register 
        // is set and cleared by software. It must not 
        // be written when the channel is enabled (EN = 
        // 1). It is not read-only when the channel is 
        // enabled (EN=1).
        readonly PA = new Field<DMA_CPAR1, true>(32, 0)        
    }

    // DMA channel x memory address register
    static readonly DMA_CMAR1 = new class DMA_CMAR1 extends Register<DMA_CMAR1>
    {
        constructor() { super(0x40020014) }        

        // peripheral address It contains the base 
        // address of the memory from/to which the data 
        // will be read/written. When MSIZE[1:0]=01 (16 
        // bits), bit 0 of MA[31:0] is ignored. Access 
        // is automatically aligned to a half-word 
        // address. When MSIZE=10 (32 bits), bits 1 and 
        // 0 of MA[31:0] are ignored. Access is 
        // automatically aligned to a word address. In 
        // memory-to-memory mode, this register 
        // identifies the memory source address if DIR=1 
        // and the memory destination address if DIR=0. 
        // In peripheral-to-peripheral mode, this 
        // register identifies the peripheral source 
        // address DIR=1 and the peripheral destination 
        // address if DIR=0. Note: this register is set 
        // and cleared by software. It must not be 
        // written when the channel is enabled (EN = 1). 
        // It is not read-only when the channel is 
        // enabled (EN=1).
        readonly MA = new Field<DMA_CMAR1, true>(32, 0)        
    }

    // DMA channel 2 configuration register
    static readonly DMA_CCR2 = new class DMA_CCR2 extends Register<DMA_CCR2>
    {
        constructor() { super(0x4002001c) }        

        // channel enable When a channel transfer 
        // error occurs, this bit is cleared by 
        // hardware. It can not be set again by 
        // software (channel x re-activated) until 
        // the TEIFx bit of the DMA_ISR register is 
        // cleared (by setting the CTEIFx bit of the 
        // DMA_IFCR register). Note: this bit is set 
        // and cleared by software.
        readonly EN      = new Field<DMA_CCR2, true>(1, 0)        

        // transfer complete interrupt enable Note: 
        // this bit is set and cleared by software. 
        // It must not be written when the channel is 
        // enabled (EN = 1). It is not read-only when 
        // the channel is enabled (EN=1).
        readonly TCIE    = new Field<DMA_CCR2, true>(1, 1)        

        // half transfer interrupt enable Note: this 
        // bit is set and cleared by software. It 
        // must not be written when the channel is 
        // enabled (EN = 1). It is not read-only when 
        // the channel is enabled (EN=1).
        readonly HTIE    = new Field<DMA_CCR2, true>(1, 2)        

        // transfer error interrupt enable Note: this 
        // bit is set and cleared by software. It 
        // must not be written when the channel is 
        // enabled (EN = 1). It is not read-only when 
        // the channel is enabled (EN=1).
        readonly TEIE    = new Field<DMA_CCR2, true>(1, 3)        

        // data transfer direction This bit must be 
        // set only in memory-to-peripheral and 
        // peripheral-to-memory modes. Source 
        // attributes are defined by PSIZE and PINC, 
        // plus the DMA_CPARx register. This is still 
        // valid in a memory-to-memory mode. 
        // Destination attributes are defined by 
        // MSIZE and MINC, plus the DMA_CMARx 
        // register. This is still valid in a 
        // peripheral-to-peripheral mode. Destination 
        // attributes are defined by PSIZE and PINC, 
        // plus the DMA_CPARx register. This is still 
        // valid in a memory-to-memory mode. Source 
        // attributes are defined by MSIZE and MINC, 
        // plus the DMA_CMARx register. This is still 
        // valid in a peripheral-to-peripheral mode. 
        // Note: this bit is set and cleared by 
        // software. It must not be written when the 
        // channel is enabled (EN = 1). It is 
        // read-only when the channel is enabled 
        // (EN=1).
        readonly DIR     = new Field<DMA_CCR2, true>(1, 4)        

        // circular mode Note: this bit is set and 
        // cleared by software. It must not be 
        // written when the channel is enabled (EN = 
        // 1). It is not read-only when the channel 
        // is enabled (EN=1).
        readonly CIRC    = new Field<DMA_CCR2, true>(1, 5)        

        // peripheral increment mode Defines the 
        // increment mode for each DMA transfer to 
        // the identified peripheral. n 
        // memory-to-memory mode, this field 
        // identifies the memory destination if DIR=1 
        // and the memory source if DIR=0. In 
        // peripheral-to-peripheral mode, this field 
        // identifies the peripheral destination if 
        // DIR=1 and the peripheral source if DIR=0. 
        // Note: this bit is set and cleared by 
        // software. It must not be written when the 
        // channel is enabled (EN = 1). It is 
        // read-only when the channel is enabled 
        // (EN=1).
        readonly PINC    = new Field<DMA_CCR2, true>(1, 6)        

        // memory increment mode Defines the 
        // increment mode for each DMA transfer to 
        // the identified memory. In memory-to-memory 
        // mode, this field identifies the memory 
        // source if DIR=1 and the memory destination 
        // if DIR=0. In peripheral-to-peripheral 
        // mode, this field identifies the peripheral 
        // source if DIR=1 and the peripheral 
        // destination if DIR=0. Note: this bit is 
        // set and cleared by software. It must not 
        // be written when the channel is enabled (EN 
        // = 1). It is read-only when the channel is 
        // enabled (EN=1).
        readonly MINC    = new Field<DMA_CCR2, true>(1, 7)        

        // peripheral size Defines the data size of 
        // each DMA transfer to the identified 
        // peripheral. In memory-to-memory mode, this 
        // field identifies the memory destination if 
        // DIR=1 and the memory source if DIR=0. In 
        // peripheral-to-peripheral mode, this field 
        // identifies the peripheral destination if 
        // DIR=1 and the peripheral source if DIR=0. 
        // Note: this field is set and cleared by 
        // software. It must not be written when the 
        // channel is enabled (EN = 1). It is 
        // read-only when the channel is enabled 
        // (EN=1).
        readonly PSIZE   = new Field<DMA_CCR2, true>(2, 8)        

        // memory size Defines the data size of each 
        // DMA transfer to the identified memory. In 
        // memory-to-memory mode, this field 
        // identifies the memory source if DIR=1 and 
        // the memory destination if DIR=0. In 
        // peripheral-to-peripheral mode, this field 
        // identifies the peripheral source if DIR=1 
        // and the peripheral destination if DIR=0. 
        // Note: this field is set and cleared by 
        // software. It must not be written when the 
        // channel is enabled (EN = 1). It is 
        // read-only when the channel is enabled 
        // (EN=1).
        readonly MSIZE   = new Field<DMA_CCR2, true>(2, 10)        

        // priority level Note: this field is set 
        // and cleared by software. It must not be 
        // written when the channel is enabled (EN = 
        // 1). It is read-only when the channel is 
        // enabled (EN=1).
        readonly PL      = new Field<DMA_CCR2, true>(2, 12)        

        // memory-to-memory mode Note: this bit is 
        // set and cleared by software. It must not 
        // be written when the channel is enabled 
        // (EN = 1). It is read-only when the 
        // channel is enabled (EN=1).
        readonly MEM2MEM = new Field<DMA_CCR2, true>(1, 14)        
    }

    // DMA channel x number of data register
    static readonly DMA_CNDTR2 = new class DMA_CNDTR2 extends Register<DMA_CNDTR2>
    {
        constructor() { super(0x40020020) }        

        // number of data to transfer (0 to 216-1) 
        // This field is updated by hardware when the 
        // channel is enabled: It is decremented after 
        // each single DMA 'read followed by write' 
        // transfer, indicating the remaining amount 
        // of data items to transfer. It is kept at 
        // zero when the programmed amount of data to 
        // transfer is reached, if the channel is not 
        // in circular mode (CIRC=0 in the DMA_CCRx 
        // register). It is reloaded automatically by 
        // the previously programmed value, when the 
        // transfer is complete, if the channel is in 
        // circular mode (CIRC=1). If this field is 
        // zero, no transfer can be served whatever 
        // the channel status (enabled or not). Note: 
        // this field is set and cleared by software. 
        // It must not be written when the channel is 
        // enabled (EN = 1). It is read-only when the 
        // channel is enabled (EN=1).
        readonly NDT = new Field<DMA_CNDTR2, true>(16, 0)        
    }

    // DMA channel x peripheral address 
    // register
    static readonly DMA_CPAR2 = new class DMA_CPAR2 extends Register<DMA_CPAR2>
    {
        constructor() { super(0x40020024) }        

        // peripheral address It contains the base 
        // address of the peripheral data register 
        // from/to which the data will be read/written. 
        // When PSIZE[1:0]=01 (16 bits), bit 0 of 
        // PA[31:0] is ignored. Access is automatically 
        // aligned to a half-word address. When PSIZE=10 
        // (32 bits), bits 1 and 0 of PA[31:0] are 
        // ignored. Access is automatically aligned to a 
        // word address. In memory-to-memory mode, this 
        // register identifies the memory destination 
        // address if DIR=1 and the memory source 
        // address if DIR=0. In peripheral-to-peripheral 
        // mode, this register identifies the peripheral 
        // destination address DIR=1 and the peripheral 
        // source address if DIR=0. Note: this register 
        // is set and cleared by software. It must not 
        // be written when the channel is enabled (EN = 
        // 1). It is not read-only when the channel is 
        // enabled (EN=1).
        readonly PA = new Field<DMA_CPAR2, true>(32, 0)        
    }

    // DMA channel x memory address register
    static readonly DMA_CMAR2 = new class DMA_CMAR2 extends Register<DMA_CMAR2>
    {
        constructor() { super(0x40020028) }        

        // peripheral address It contains the base 
        // address of the memory from/to which the data 
        // will be read/written. When MSIZE[1:0]=01 (16 
        // bits), bit 0 of MA[31:0] is ignored. Access 
        // is automatically aligned to a half-word 
        // address. When MSIZE=10 (32 bits), bits 1 and 
        // 0 of MA[31:0] are ignored. Access is 
        // automatically aligned to a word address. In 
        // memory-to-memory mode, this register 
        // identifies the memory source address if DIR=1 
        // and the memory destination address if DIR=0. 
        // In peripheral-to-peripheral mode, this 
        // register identifies the peripheral source 
        // address DIR=1 and the peripheral destination 
        // address if DIR=0. Note: this register is set 
        // and cleared by software. It must not be 
        // written when the channel is enabled (EN = 1). 
        // It is not read-only when the channel is 
        // enabled (EN=1).
        readonly MA = new Field<DMA_CMAR2, true>(32, 0)        
    }

    // DMA channel 3 configuration register
    static readonly DMA_CCR3 = new class DMA_CCR3 extends Register<DMA_CCR3>
    {
        constructor() { super(0x40020030) }        

        // channel enable When a channel transfer 
        // error occurs, this bit is cleared by 
        // hardware. It can not be set again by 
        // software (channel x re-activated) until 
        // the TEIFx bit of the DMA_ISR register is 
        // cleared (by setting the CTEIFx bit of the 
        // DMA_IFCR register). Note: this bit is set 
        // and cleared by software.
        readonly EN      = new Field<DMA_CCR3, true>(1, 0)        

        // transfer complete interrupt enable Note: 
        // this bit is set and cleared by software. 
        // It must not be written when the channel is 
        // enabled (EN = 1). It is not read-only when 
        // the channel is enabled (EN=1).
        readonly TCIE    = new Field<DMA_CCR3, true>(1, 1)        

        // half transfer interrupt enable Note: this 
        // bit is set and cleared by software. It 
        // must not be written when the channel is 
        // enabled (EN = 1). It is not read-only when 
        // the channel is enabled (EN=1).
        readonly HTIE    = new Field<DMA_CCR3, true>(1, 2)        

        // transfer error interrupt enable Note: this 
        // bit is set and cleared by software. It 
        // must not be written when the channel is 
        // enabled (EN = 1). It is not read-only when 
        // the channel is enabled (EN=1).
        readonly TEIE    = new Field<DMA_CCR3, true>(1, 3)        

        // data transfer direction This bit must be 
        // set only in memory-to-peripheral and 
        // peripheral-to-memory modes. Source 
        // attributes are defined by PSIZE and PINC, 
        // plus the DMA_CPARx register. This is still 
        // valid in a memory-to-memory mode. 
        // Destination attributes are defined by 
        // MSIZE and MINC, plus the DMA_CMARx 
        // register. This is still valid in a 
        // peripheral-to-peripheral mode. Destination 
        // attributes are defined by PSIZE and PINC, 
        // plus the DMA_CPARx register. This is still 
        // valid in a memory-to-memory mode. Source 
        // attributes are defined by MSIZE and MINC, 
        // plus the DMA_CMARx register. This is still 
        // valid in a peripheral-to-peripheral mode. 
        // Note: this bit is set and cleared by 
        // software. It must not be written when the 
        // channel is enabled (EN = 1). It is 
        // read-only when the channel is enabled 
        // (EN=1).
        readonly DIR     = new Field<DMA_CCR3, true>(1, 4)        

        // circular mode Note: this bit is set and 
        // cleared by software. It must not be 
        // written when the channel is enabled (EN = 
        // 1). It is not read-only when the channel 
        // is enabled (EN=1).
        readonly CIRC    = new Field<DMA_CCR3, true>(1, 5)        

        // peripheral increment mode Defines the 
        // increment mode for each DMA transfer to 
        // the identified peripheral. n 
        // memory-to-memory mode, this field 
        // identifies the memory destination if DIR=1 
        // and the memory source if DIR=0. In 
        // peripheral-to-peripheral mode, this field 
        // identifies the peripheral destination if 
        // DIR=1 and the peripheral source if DIR=0. 
        // Note: this bit is set and cleared by 
        // software. It must not be written when the 
        // channel is enabled (EN = 1). It is 
        // read-only when the channel is enabled 
        // (EN=1).
        readonly PINC    = new Field<DMA_CCR3, true>(1, 6)        

        // memory increment mode Defines the 
        // increment mode for each DMA transfer to 
        // the identified memory. In memory-to-memory 
        // mode, this field identifies the memory 
        // source if DIR=1 and the memory destination 
        // if DIR=0. In peripheral-to-peripheral 
        // mode, this field identifies the peripheral 
        // source if DIR=1 and the peripheral 
        // destination if DIR=0. Note: this bit is 
        // set and cleared by software. It must not 
        // be written when the channel is enabled (EN 
        // = 1). It is read-only when the channel is 
        // enabled (EN=1).
        readonly MINC    = new Field<DMA_CCR3, true>(1, 7)        

        // peripheral size Defines the data size of 
        // each DMA transfer to the identified 
        // peripheral. In memory-to-memory mode, this 
        // field identifies the memory destination if 
        // DIR=1 and the memory source if DIR=0. In 
        // peripheral-to-peripheral mode, this field 
        // identifies the peripheral destination if 
        // DIR=1 and the peripheral source if DIR=0. 
        // Note: this field is set and cleared by 
        // software. It must not be written when the 
        // channel is enabled (EN = 1). It is 
        // read-only when the channel is enabled 
        // (EN=1).
        readonly PSIZE   = new Field<DMA_CCR3, true>(2, 8)        

        // memory size Defines the data size of each 
        // DMA transfer to the identified memory. In 
        // memory-to-memory mode, this field 
        // identifies the memory source if DIR=1 and 
        // the memory destination if DIR=0. In 
        // peripheral-to-peripheral mode, this field 
        // identifies the peripheral source if DIR=1 
        // and the peripheral destination if DIR=0. 
        // Note: this field is set and cleared by 
        // software. It must not be written when the 
        // channel is enabled (EN = 1). It is 
        // read-only when the channel is enabled 
        // (EN=1).
        readonly MSIZE   = new Field<DMA_CCR3, true>(2, 10)        

        // priority level Note: this field is set 
        // and cleared by software. It must not be 
        // written when the channel is enabled (EN = 
        // 1). It is read-only when the channel is 
        // enabled (EN=1).
        readonly PL      = new Field<DMA_CCR3, true>(2, 12)        

        // memory-to-memory mode Note: this bit is 
        // set and cleared by software. It must not 
        // be written when the channel is enabled 
        // (EN = 1). It is read-only when the 
        // channel is enabled (EN=1).
        readonly MEM2MEM = new Field<DMA_CCR3, true>(1, 14)        
    }

    // DMA channel x configuration register
    static readonly DMA_CNDTR3 = new class DMA_CNDTR3 extends Register<DMA_CNDTR3>
    {
        constructor() { super(0x40020034) }        

        // number of data to transfer (0 to 216-1) 
        // This field is updated by hardware when the 
        // channel is enabled: It is decremented after 
        // each single DMA 'read followed by write' 
        // transfer, indicating the remaining amount 
        // of data items to transfer. It is kept at 
        // zero when the programmed amount of data to 
        // transfer is reached, if the channel is not 
        // in circular mode (CIRC=0 in the DMA_CCRx 
        // register). It is reloaded automatically by 
        // the previously programmed value, when the 
        // transfer is complete, if the channel is in 
        // circular mode (CIRC=1). If this field is 
        // zero, no transfer can be served whatever 
        // the channel status (enabled or not). Note: 
        // this field is set and cleared by software. 
        // It must not be written when the channel is 
        // enabled (EN = 1). It is read-only when the 
        // channel is enabled (EN=1).
        readonly NDT = new Field<DMA_CNDTR3, true>(16, 0)        
    }

    // DMA channel x peripheral address 
    // register
    static readonly DMA_CPAR3 = new class DMA_CPAR3 extends Register<DMA_CPAR3>
    {
        constructor() { super(0x40020038) }        

        // peripheral address It contains the base 
        // address of the peripheral data register 
        // from/to which the data will be read/written. 
        // When PSIZE[1:0]=01 (16 bits), bit 0 of 
        // PA[31:0] is ignored. Access is automatically 
        // aligned to a half-word address. When PSIZE=10 
        // (32 bits), bits 1 and 0 of PA[31:0] are 
        // ignored. Access is automatically aligned to a 
        // word address. In memory-to-memory mode, this 
        // register identifies the memory destination 
        // address if DIR=1 and the memory source 
        // address if DIR=0. In peripheral-to-peripheral 
        // mode, this register identifies the peripheral 
        // destination address DIR=1 and the peripheral 
        // source address if DIR=0. Note: this register 
        // is set and cleared by software. It must not 
        // be written when the channel is enabled (EN = 
        // 1). It is not read-only when the channel is 
        // enabled (EN=1).
        readonly PA = new Field<DMA_CPAR3, true>(32, 0)        
    }

    // DMA channel x memory address register
    static readonly DMA_CMAR3 = new class DMA_CMAR3 extends Register<DMA_CMAR3>
    {
        constructor() { super(0x4002003c) }        

        // peripheral address It contains the base 
        // address of the memory from/to which the data 
        // will be read/written. When MSIZE[1:0]=01 (16 
        // bits), bit 0 of MA[31:0] is ignored. Access 
        // is automatically aligned to a half-word 
        // address. When MSIZE=10 (32 bits), bits 1 and 
        // 0 of MA[31:0] are ignored. Access is 
        // automatically aligned to a word address. In 
        // memory-to-memory mode, this register 
        // identifies the memory source address if DIR=1 
        // and the memory destination address if DIR=0. 
        // In peripheral-to-peripheral mode, this 
        // register identifies the peripheral source 
        // address DIR=1 and the peripheral destination 
        // address if DIR=0. Note: this register is set 
        // and cleared by software. It must not be 
        // written when the channel is enabled (EN = 1). 
        // It is not read-only when the channel is 
        // enabled (EN=1).
        readonly MA = new Field<DMA_CMAR3, true>(32, 0)        
    }

    // DMA channel 4 configuration register
    static readonly DMA_CCR4 = new class DMA_CCR4 extends Register<DMA_CCR4>
    {
        constructor() { super(0x40020044) }        

        // channel enable When a channel transfer 
        // error occurs, this bit is cleared by 
        // hardware. It can not be set again by 
        // software (channel x re-activated) until 
        // the TEIFx bit of the DMA_ISR register is 
        // cleared (by setting the CTEIFx bit of the 
        // DMA_IFCR register). Note: this bit is set 
        // and cleared by software.
        readonly EN      = new Field<DMA_CCR4, true>(1, 0)        

        // transfer complete interrupt enable Note: 
        // this bit is set and cleared by software. 
        // It must not be written when the channel is 
        // enabled (EN = 1). It is not read-only when 
        // the channel is enabled (EN=1).
        readonly TCIE    = new Field<DMA_CCR4, true>(1, 1)        

        // half transfer interrupt enable Note: this 
        // bit is set and cleared by software. It 
        // must not be written when the channel is 
        // enabled (EN = 1). It is not read-only when 
        // the channel is enabled (EN=1).
        readonly HTIE    = new Field<DMA_CCR4, true>(1, 2)        

        // transfer error interrupt enable Note: this 
        // bit is set and cleared by software. It 
        // must not be written when the channel is 
        // enabled (EN = 1). It is not read-only when 
        // the channel is enabled (EN=1).
        readonly TEIE    = new Field<DMA_CCR4, true>(1, 3)        

        // data transfer direction This bit must be 
        // set only in memory-to-peripheral and 
        // peripheral-to-memory modes. Source 
        // attributes are defined by PSIZE and PINC, 
        // plus the DMA_CPARx register. This is still 
        // valid in a memory-to-memory mode. 
        // Destination attributes are defined by 
        // MSIZE and MINC, plus the DMA_CMARx 
        // register. This is still valid in a 
        // peripheral-to-peripheral mode. Destination 
        // attributes are defined by PSIZE and PINC, 
        // plus the DMA_CPARx register. This is still 
        // valid in a memory-to-memory mode. Source 
        // attributes are defined by MSIZE and MINC, 
        // plus the DMA_CMARx register. This is still 
        // valid in a peripheral-to-peripheral mode. 
        // Note: this bit is set and cleared by 
        // software. It must not be written when the 
        // channel is enabled (EN = 1). It is 
        // read-only when the channel is enabled 
        // (EN=1).
        readonly DIR     = new Field<DMA_CCR4, true>(1, 4)        

        // circular mode Note: this bit is set and 
        // cleared by software. It must not be 
        // written when the channel is enabled (EN = 
        // 1). It is not read-only when the channel 
        // is enabled (EN=1).
        readonly CIRC    = new Field<DMA_CCR4, true>(1, 5)        

        // peripheral increment mode Defines the 
        // increment mode for each DMA transfer to 
        // the identified peripheral. n 
        // memory-to-memory mode, this field 
        // identifies the memory destination if DIR=1 
        // and the memory source if DIR=0. In 
        // peripheral-to-peripheral mode, this field 
        // identifies the peripheral destination if 
        // DIR=1 and the peripheral source if DIR=0. 
        // Note: this bit is set and cleared by 
        // software. It must not be written when the 
        // channel is enabled (EN = 1). It is 
        // read-only when the channel is enabled 
        // (EN=1).
        readonly PINC    = new Field<DMA_CCR4, true>(1, 6)        

        // memory increment mode Defines the 
        // increment mode for each DMA transfer to 
        // the identified memory. In memory-to-memory 
        // mode, this field identifies the memory 
        // source if DIR=1 and the memory destination 
        // if DIR=0. In peripheral-to-peripheral 
        // mode, this field identifies the peripheral 
        // source if DIR=1 and the peripheral 
        // destination if DIR=0. Note: this bit is 
        // set and cleared by software. It must not 
        // be written when the channel is enabled (EN 
        // = 1). It is read-only when the channel is 
        // enabled (EN=1).
        readonly MINC    = new Field<DMA_CCR4, true>(1, 7)        

        // peripheral size Defines the data size of 
        // each DMA transfer to the identified 
        // peripheral. In memory-to-memory mode, this 
        // field identifies the memory destination if 
        // DIR=1 and the memory source if DIR=0. In 
        // peripheral-to-peripheral mode, this field 
        // identifies the peripheral destination if 
        // DIR=1 and the peripheral source if DIR=0. 
        // Note: this field is set and cleared by 
        // software. It must not be written when the 
        // channel is enabled (EN = 1). It is 
        // read-only when the channel is enabled 
        // (EN=1).
        readonly PSIZE   = new Field<DMA_CCR4, true>(2, 8)        

        // memory size Defines the data size of each 
        // DMA transfer to the identified memory. In 
        // memory-to-memory mode, this field 
        // identifies the memory source if DIR=1 and 
        // the memory destination if DIR=0. In 
        // peripheral-to-peripheral mode, this field 
        // identifies the peripheral source if DIR=1 
        // and the peripheral destination if DIR=0. 
        // Note: this field is set and cleared by 
        // software. It must not be written when the 
        // channel is enabled (EN = 1). It is 
        // read-only when the channel is enabled 
        // (EN=1).
        readonly MSIZE   = new Field<DMA_CCR4, true>(2, 10)        

        // priority level Note: this field is set 
        // and cleared by software. It must not be 
        // written when the channel is enabled (EN = 
        // 1). It is read-only when the channel is 
        // enabled (EN=1).
        readonly PL      = new Field<DMA_CCR4, true>(2, 12)        

        // memory-to-memory mode Note: this bit is 
        // set and cleared by software. It must not 
        // be written when the channel is enabled 
        // (EN = 1). It is read-only when the 
        // channel is enabled (EN=1).
        readonly MEM2MEM = new Field<DMA_CCR4, true>(1, 14)        
    }

    // DMA channel x configuration register
    static readonly DMA_CNDTR4 = new class DMA_CNDTR4 extends Register<DMA_CNDTR4>
    {
        constructor() { super(0x40020048) }        

        // number of data to transfer (0 to 216-1) 
        // This field is updated by hardware when the 
        // channel is enabled: It is decremented after 
        // each single DMA 'read followed by write' 
        // transfer, indicating the remaining amount 
        // of data items to transfer. It is kept at 
        // zero when the programmed amount of data to 
        // transfer is reached, if the channel is not 
        // in circular mode (CIRC=0 in the DMA_CCRx 
        // register). It is reloaded automatically by 
        // the previously programmed value, when the 
        // transfer is complete, if the channel is in 
        // circular mode (CIRC=1). If this field is 
        // zero, no transfer can be served whatever 
        // the channel status (enabled or not). Note: 
        // this field is set and cleared by software. 
        // It must not be written when the channel is 
        // enabled (EN = 1). It is read-only when the 
        // channel is enabled (EN=1).
        readonly NDT = new Field<DMA_CNDTR4, true>(16, 0)        
    }

    // DMA channel x peripheral address 
    // register
    static readonly DMA_CPAR4 = new class DMA_CPAR4 extends Register<DMA_CPAR4>
    {
        constructor() { super(0x4002004c) }        

        // peripheral address It contains the base 
        // address of the peripheral data register 
        // from/to which the data will be read/written. 
        // When PSIZE[1:0]=01 (16 bits), bit 0 of 
        // PA[31:0] is ignored. Access is automatically 
        // aligned to a half-word address. When PSIZE=10 
        // (32 bits), bits 1 and 0 of PA[31:0] are 
        // ignored. Access is automatically aligned to a 
        // word address. In memory-to-memory mode, this 
        // register identifies the memory destination 
        // address if DIR=1 and the memory source 
        // address if DIR=0. In peripheral-to-peripheral 
        // mode, this register identifies the peripheral 
        // destination address DIR=1 and the peripheral 
        // source address if DIR=0. Note: this register 
        // is set and cleared by software. It must not 
        // be written when the channel is enabled (EN = 
        // 1). It is not read-only when the channel is 
        // enabled (EN=1).
        readonly PA = new Field<DMA_CPAR4, true>(32, 0)        
    }

    // DMA channel x memory address register
    static readonly DMA_CMAR4 = new class DMA_CMAR4 extends Register<DMA_CMAR4>
    {
        constructor() { super(0x40020050) }        

        // peripheral address It contains the base 
        // address of the memory from/to which the data 
        // will be read/written. When MSIZE[1:0]=01 (16 
        // bits), bit 0 of MA[31:0] is ignored. Access 
        // is automatically aligned to a half-word 
        // address. When MSIZE=10 (32 bits), bits 1 and 
        // 0 of MA[31:0] are ignored. Access is 
        // automatically aligned to a word address. In 
        // memory-to-memory mode, this register 
        // identifies the memory source address if DIR=1 
        // and the memory destination address if DIR=0. 
        // In peripheral-to-peripheral mode, this 
        // register identifies the peripheral source 
        // address DIR=1 and the peripheral destination 
        // address if DIR=0. Note: this register is set 
        // and cleared by software. It must not be 
        // written when the channel is enabled (EN = 1). 
        // It is not read-only when the channel is 
        // enabled (EN=1).
        readonly MA = new Field<DMA_CMAR4, true>(32, 0)        
    }

    // DMA channel 5 configuration register
    static readonly DMA_CCR5 = new class DMA_CCR5 extends Register<DMA_CCR5>
    {
        constructor() { super(0x40020058) }        

        // channel enable When a channel transfer 
        // error occurs, this bit is cleared by 
        // hardware. It can not be set again by 
        // software (channel x re-activated) until 
        // the TEIFx bit of the DMA_ISR register is 
        // cleared (by setting the CTEIFx bit of the 
        // DMA_IFCR register). Note: this bit is set 
        // and cleared by software.
        readonly EN      = new Field<DMA_CCR5, true>(1, 0)        

        // transfer complete interrupt enable Note: 
        // this bit is set and cleared by software. 
        // It must not be written when the channel is 
        // enabled (EN = 1). It is not read-only when 
        // the channel is enabled (EN=1).
        readonly TCIE    = new Field<DMA_CCR5, true>(1, 1)        

        // half transfer interrupt enable Note: this 
        // bit is set and cleared by software. It 
        // must not be written when the channel is 
        // enabled (EN = 1). It is not read-only when 
        // the channel is enabled (EN=1).
        readonly HTIE    = new Field<DMA_CCR5, true>(1, 2)        

        // transfer error interrupt enable Note: this 
        // bit is set and cleared by software. It 
        // must not be written when the channel is 
        // enabled (EN = 1). It is not read-only when 
        // the channel is enabled (EN=1).
        readonly TEIE    = new Field<DMA_CCR5, true>(1, 3)        

        // data transfer direction This bit must be 
        // set only in memory-to-peripheral and 
        // peripheral-to-memory modes. Source 
        // attributes are defined by PSIZE and PINC, 
        // plus the DMA_CPARx register. This is still 
        // valid in a memory-to-memory mode. 
        // Destination attributes are defined by 
        // MSIZE and MINC, plus the DMA_CMARx 
        // register. This is still valid in a 
        // peripheral-to-peripheral mode. Destination 
        // attributes are defined by PSIZE and PINC, 
        // plus the DMA_CPARx register. This is still 
        // valid in a memory-to-memory mode. Source 
        // attributes are defined by MSIZE and MINC, 
        // plus the DMA_CMARx register. This is still 
        // valid in a peripheral-to-peripheral mode. 
        // Note: this bit is set and cleared by 
        // software. It must not be written when the 
        // channel is enabled (EN = 1). It is 
        // read-only when the channel is enabled 
        // (EN=1).
        readonly DIR     = new Field<DMA_CCR5, true>(1, 4)        

        // circular mode Note: this bit is set and 
        // cleared by software. It must not be 
        // written when the channel is enabled (EN = 
        // 1). It is not read-only when the channel 
        // is enabled (EN=1).
        readonly CIRC    = new Field<DMA_CCR5, true>(1, 5)        

        // peripheral increment mode Defines the 
        // increment mode for each DMA transfer to 
        // the identified peripheral. n 
        // memory-to-memory mode, this field 
        // identifies the memory destination if DIR=1 
        // and the memory source if DIR=0. In 
        // peripheral-to-peripheral mode, this field 
        // identifies the peripheral destination if 
        // DIR=1 and the peripheral source if DIR=0. 
        // Note: this bit is set and cleared by 
        // software. It must not be written when the 
        // channel is enabled (EN = 1). It is 
        // read-only when the channel is enabled 
        // (EN=1).
        readonly PINC    = new Field<DMA_CCR5, true>(1, 6)        

        // memory increment mode Defines the 
        // increment mode for each DMA transfer to 
        // the identified memory. In memory-to-memory 
        // mode, this field identifies the memory 
        // source if DIR=1 and the memory destination 
        // if DIR=0. In peripheral-to-peripheral 
        // mode, this field identifies the peripheral 
        // source if DIR=1 and the peripheral 
        // destination if DIR=0. Note: this bit is 
        // set and cleared by software. It must not 
        // be written when the channel is enabled (EN 
        // = 1). It is read-only when the channel is 
        // enabled (EN=1).
        readonly MINC    = new Field<DMA_CCR5, true>(1, 7)        

        // peripheral size Defines the data size of 
        // each DMA transfer to the identified 
        // peripheral. In memory-to-memory mode, this 
        // field identifies the memory destination if 
        // DIR=1 and the memory source if DIR=0. In 
        // peripheral-to-peripheral mode, this field 
        // identifies the peripheral destination if 
        // DIR=1 and the peripheral source if DIR=0. 
        // Note: this field is set and cleared by 
        // software. It must not be written when the 
        // channel is enabled (EN = 1). It is 
        // read-only when the channel is enabled 
        // (EN=1).
        readonly PSIZE   = new Field<DMA_CCR5, true>(2, 8)        

        // memory size Defines the data size of each 
        // DMA transfer to the identified memory. In 
        // memory-to-memory mode, this field 
        // identifies the memory source if DIR=1 and 
        // the memory destination if DIR=0. In 
        // peripheral-to-peripheral mode, this field 
        // identifies the peripheral source if DIR=1 
        // and the peripheral destination if DIR=0. 
        // Note: this field is set and cleared by 
        // software. It must not be written when the 
        // channel is enabled (EN = 1). It is 
        // read-only when the channel is enabled 
        // (EN=1).
        readonly MSIZE   = new Field<DMA_CCR5, true>(2, 10)        

        // priority level Note: this field is set 
        // and cleared by software. It must not be 
        // written when the channel is enabled (EN = 
        // 1). It is read-only when the channel is 
        // enabled (EN=1).
        readonly PL      = new Field<DMA_CCR5, true>(2, 12)        

        // memory-to-memory mode Note: this bit is 
        // set and cleared by software. It must not 
        // be written when the channel is enabled 
        // (EN = 1). It is read-only when the 
        // channel is enabled (EN=1).
        readonly MEM2MEM = new Field<DMA_CCR5, true>(1, 14)        
    }

    // DMA channel x configuration register
    static readonly DMA_CNDTR5 = new class DMA_CNDTR5 extends Register<DMA_CNDTR5>
    {
        constructor() { super(0x4002005c) }        

        // number of data to transfer (0 to 216-1) 
        // This field is updated by hardware when the 
        // channel is enabled: It is decremented after 
        // each single DMA 'read followed by write' 
        // transfer, indicating the remaining amount 
        // of data items to transfer. It is kept at 
        // zero when the programmed amount of data to 
        // transfer is reached, if the channel is not 
        // in circular mode (CIRC=0 in the DMA_CCRx 
        // register). It is reloaded automatically by 
        // the previously programmed value, when the 
        // transfer is complete, if the channel is in 
        // circular mode (CIRC=1). If this field is 
        // zero, no transfer can be served whatever 
        // the channel status (enabled or not). Note: 
        // this field is set and cleared by software. 
        // It must not be written when the channel is 
        // enabled (EN = 1). It is read-only when the 
        // channel is enabled (EN=1).
        readonly NDT = new Field<DMA_CNDTR5, true>(16, 0)        
    }

    // DMA channel x peripheral address 
    // register
    static readonly DMA_CPAR5 = new class DMA_CPAR5 extends Register<DMA_CPAR5>
    {
        constructor() { super(0x40020060) }        

        // peripheral address It contains the base 
        // address of the peripheral data register 
        // from/to which the data will be read/written. 
        // When PSIZE[1:0]=01 (16 bits), bit 0 of 
        // PA[31:0] is ignored. Access is automatically 
        // aligned to a half-word address. When PSIZE=10 
        // (32 bits), bits 1 and 0 of PA[31:0] are 
        // ignored. Access is automatically aligned to a 
        // word address. In memory-to-memory mode, this 
        // register identifies the memory destination 
        // address if DIR=1 and the memory source 
        // address if DIR=0. In peripheral-to-peripheral 
        // mode, this register identifies the peripheral 
        // destination address DIR=1 and the peripheral 
        // source address if DIR=0. Note: this register 
        // is set and cleared by software. It must not 
        // be written when the channel is enabled (EN = 
        // 1). It is not read-only when the channel is 
        // enabled (EN=1).
        readonly PA = new Field<DMA_CPAR5, true>(32, 0)        
    }

    // DMA channel x memory address register
    static readonly DMA_CMAR5 = new class DMA_CMAR5 extends Register<DMA_CMAR5>
    {
        constructor() { super(0x40020064) }        

        // peripheral address It contains the base 
        // address of the memory from/to which the data 
        // will be read/written. When MSIZE[1:0]=01 (16 
        // bits), bit 0 of MA[31:0] is ignored. Access 
        // is automatically aligned to a half-word 
        // address. When MSIZE=10 (32 bits), bits 1 and 
        // 0 of MA[31:0] are ignored. Access is 
        // automatically aligned to a word address. In 
        // memory-to-memory mode, this register 
        // identifies the memory source address if DIR=1 
        // and the memory destination address if DIR=0. 
        // In peripheral-to-peripheral mode, this 
        // register identifies the peripheral source 
        // address DIR=1 and the peripheral destination 
        // address if DIR=0. Note: this register is set 
        // and cleared by software. It must not be 
        // written when the channel is enabled (EN = 1). 
        // It is not read-only when the channel is 
        // enabled (EN=1).
        readonly MA = new Field<DMA_CMAR5, true>(32, 0)        
    }

    // DMA channel 6 configuration register
    static readonly DMA_CCR6 = new class DMA_CCR6 extends Register<DMA_CCR6>
    {
        constructor() { super(0x4002006c) }        

        // channel enable When a channel transfer 
        // error occurs, this bit is cleared by 
        // hardware. It can not be set again by 
        // software (channel x re-activated) until 
        // the TEIFx bit of the DMA_ISR register is 
        // cleared (by setting the CTEIFx bit of the 
        // DMA_IFCR register). Note: this bit is set 
        // and cleared by software.
        readonly EN      = new Field<DMA_CCR6, true>(1, 0)        

        // transfer complete interrupt enable Note: 
        // this bit is set and cleared by software. 
        // It must not be written when the channel is 
        // enabled (EN = 1). It is not read-only when 
        // the channel is enabled (EN=1).
        readonly TCIE    = new Field<DMA_CCR6, true>(1, 1)        

        // half transfer interrupt enable Note: this 
        // bit is set and cleared by software. It 
        // must not be written when the channel is 
        // enabled (EN = 1). It is not read-only when 
        // the channel is enabled (EN=1).
        readonly HTIE    = new Field<DMA_CCR6, true>(1, 2)        

        // transfer error interrupt enable Note: this 
        // bit is set and cleared by software. It 
        // must not be written when the channel is 
        // enabled (EN = 1). It is not read-only when 
        // the channel is enabled (EN=1).
        readonly TEIE    = new Field<DMA_CCR6, true>(1, 3)        

        // data transfer direction This bit must be 
        // set only in memory-to-peripheral and 
        // peripheral-to-memory modes. Source 
        // attributes are defined by PSIZE and PINC, 
        // plus the DMA_CPARx register. This is still 
        // valid in a memory-to-memory mode. 
        // Destination attributes are defined by 
        // MSIZE and MINC, plus the DMA_CMARx 
        // register. This is still valid in a 
        // peripheral-to-peripheral mode. Destination 
        // attributes are defined by PSIZE and PINC, 
        // plus the DMA_CPARx register. This is still 
        // valid in a memory-to-memory mode. Source 
        // attributes are defined by MSIZE and MINC, 
        // plus the DMA_CMARx register. This is still 
        // valid in a peripheral-to-peripheral mode. 
        // Note: this bit is set and cleared by 
        // software. It must not be written when the 
        // channel is enabled (EN = 1). It is 
        // read-only when the channel is enabled 
        // (EN=1).
        readonly DIR     = new Field<DMA_CCR6, true>(1, 4)        

        // circular mode Note: this bit is set and 
        // cleared by software. It must not be 
        // written when the channel is enabled (EN = 
        // 1). It is not read-only when the channel 
        // is enabled (EN=1).
        readonly CIRC    = new Field<DMA_CCR6, true>(1, 5)        

        // peripheral increment mode Defines the 
        // increment mode for each DMA transfer to 
        // the identified peripheral. n 
        // memory-to-memory mode, this field 
        // identifies the memory destination if DIR=1 
        // and the memory source if DIR=0. In 
        // peripheral-to-peripheral mode, this field 
        // identifies the peripheral destination if 
        // DIR=1 and the peripheral source if DIR=0. 
        // Note: this bit is set and cleared by 
        // software. It must not be written when the 
        // channel is enabled (EN = 1). It is 
        // read-only when the channel is enabled 
        // (EN=1).
        readonly PINC    = new Field<DMA_CCR6, true>(1, 6)        

        // memory increment mode Defines the 
        // increment mode for each DMA transfer to 
        // the identified memory. In memory-to-memory 
        // mode, this field identifies the memory 
        // source if DIR=1 and the memory destination 
        // if DIR=0. In peripheral-to-peripheral 
        // mode, this field identifies the peripheral 
        // source if DIR=1 and the peripheral 
        // destination if DIR=0. Note: this bit is 
        // set and cleared by software. It must not 
        // be written when the channel is enabled (EN 
        // = 1). It is read-only when the channel is 
        // enabled (EN=1).
        readonly MINC    = new Field<DMA_CCR6, true>(1, 7)        

        // peripheral size Defines the data size of 
        // each DMA transfer to the identified 
        // peripheral. In memory-to-memory mode, this 
        // field identifies the memory destination if 
        // DIR=1 and the memory source if DIR=0. In 
        // peripheral-to-peripheral mode, this field 
        // identifies the peripheral destination if 
        // DIR=1 and the peripheral source if DIR=0. 
        // Note: this field is set and cleared by 
        // software. It must not be written when the 
        // channel is enabled (EN = 1). It is 
        // read-only when the channel is enabled 
        // (EN=1).
        readonly PSIZE   = new Field<DMA_CCR6, true>(2, 8)        

        // memory size Defines the data size of each 
        // DMA transfer to the identified memory. In 
        // memory-to-memory mode, this field 
        // identifies the memory source if DIR=1 and 
        // the memory destination if DIR=0. In 
        // peripheral-to-peripheral mode, this field 
        // identifies the peripheral source if DIR=1 
        // and the peripheral destination if DIR=0. 
        // Note: this field is set and cleared by 
        // software. It must not be written when the 
        // channel is enabled (EN = 1). It is 
        // read-only when the channel is enabled 
        // (EN=1).
        readonly MSIZE   = new Field<DMA_CCR6, true>(2, 10)        

        // priority level Note: this field is set 
        // and cleared by software. It must not be 
        // written when the channel is enabled (EN = 
        // 1). It is read-only when the channel is 
        // enabled (EN=1).
        readonly PL      = new Field<DMA_CCR6, true>(2, 12)        

        // memory-to-memory mode Note: this bit is 
        // set and cleared by software. It must not 
        // be written when the channel is enabled 
        // (EN = 1). It is read-only when the 
        // channel is enabled (EN=1).
        readonly MEM2MEM = new Field<DMA_CCR6, true>(1, 14)        
    }

    // DMA channel x configuration register
    static readonly DMA_CNDTR6 = new class DMA_CNDTR6 extends Register<DMA_CNDTR6>
    {
        constructor() { super(0x40020070) }        

        // number of data to transfer (0 to 216-1) 
        // This field is updated by hardware when the 
        // channel is enabled: It is decremented after 
        // each single DMA 'read followed by write' 
        // transfer, indicating the remaining amount 
        // of data items to transfer. It is kept at 
        // zero when the programmed amount of data to 
        // transfer is reached, if the channel is not 
        // in circular mode (CIRC=0 in the DMA_CCRx 
        // register). It is reloaded automatically by 
        // the previously programmed value, when the 
        // transfer is complete, if the channel is in 
        // circular mode (CIRC=1). If this field is 
        // zero, no transfer can be served whatever 
        // the channel status (enabled or not). Note: 
        // this field is set and cleared by software. 
        // It must not be written when the channel is 
        // enabled (EN = 1). It is read-only when the 
        // channel is enabled (EN=1).
        readonly NDT = new Field<DMA_CNDTR6, true>(16, 0)        
    }

    // DMA channel x peripheral address 
    // register
    static readonly DMA_CPAR6 = new class DMA_CPAR6 extends Register<DMA_CPAR6>
    {
        constructor() { super(0x40020074) }        

        // peripheral address It contains the base 
        // address of the peripheral data register 
        // from/to which the data will be read/written. 
        // When PSIZE[1:0]=01 (16 bits), bit 0 of 
        // PA[31:0] is ignored. Access is automatically 
        // aligned to a half-word address. When PSIZE=10 
        // (32 bits), bits 1 and 0 of PA[31:0] are 
        // ignored. Access is automatically aligned to a 
        // word address. In memory-to-memory mode, this 
        // register identifies the memory destination 
        // address if DIR=1 and the memory source 
        // address if DIR=0. In peripheral-to-peripheral 
        // mode, this register identifies the peripheral 
        // destination address DIR=1 and the peripheral 
        // source address if DIR=0. Note: this register 
        // is set and cleared by software. It must not 
        // be written when the channel is enabled (EN = 
        // 1). It is not read-only when the channel is 
        // enabled (EN=1).
        readonly PA = new Field<DMA_CPAR6, true>(32, 0)        
    }

    // DMA channel x memory address register
    static readonly DMA_CMAR6 = new class DMA_CMAR6 extends Register<DMA_CMAR6>
    {
        constructor() { super(0x40020078) }        

        // peripheral address It contains the base 
        // address of the memory from/to which the data 
        // will be read/written. When MSIZE[1:0]=01 (16 
        // bits), bit 0 of MA[31:0] is ignored. Access 
        // is automatically aligned to a half-word 
        // address. When MSIZE=10 (32 bits), bits 1 and 
        // 0 of MA[31:0] are ignored. Access is 
        // automatically aligned to a word address. In 
        // memory-to-memory mode, this register 
        // identifies the memory source address if DIR=1 
        // and the memory destination address if DIR=0. 
        // In peripheral-to-peripheral mode, this 
        // register identifies the peripheral source 
        // address DIR=1 and the peripheral destination 
        // address if DIR=0. Note: this register is set 
        // and cleared by software. It must not be 
        // written when the channel is enabled (EN = 1). 
        // It is not read-only when the channel is 
        // enabled (EN=1).
        readonly MA = new Field<DMA_CMAR6, true>(32, 0)        
    }

    // DMA channel 7 configuration register
    static readonly DMA_CCR7 = new class DMA_CCR7 extends Register<DMA_CCR7>
    {
        constructor() { super(0x40020080) }        

        // channel enable When a channel transfer 
        // error occurs, this bit is cleared by 
        // hardware. It can not be set again by 
        // software (channel x re-activated) until 
        // the TEIFx bit of the DMA_ISR register is 
        // cleared (by setting the CTEIFx bit of the 
        // DMA_IFCR register). Note: this bit is set 
        // and cleared by software.
        readonly EN      = new Field<DMA_CCR7, true>(1, 0)        

        // transfer complete interrupt enable Note: 
        // this bit is set and cleared by software. 
        // It must not be written when the channel is 
        // enabled (EN = 1). It is not read-only when 
        // the channel is enabled (EN=1).
        readonly TCIE    = new Field<DMA_CCR7, true>(1, 1)        

        // half transfer interrupt enable Note: this 
        // bit is set and cleared by software. It 
        // must not be written when the channel is 
        // enabled (EN = 1). It is not read-only when 
        // the channel is enabled (EN=1).
        readonly HTIE    = new Field<DMA_CCR7, true>(1, 2)        

        // transfer error interrupt enable Note: this 
        // bit is set and cleared by software. It 
        // must not be written when the channel is 
        // enabled (EN = 1). It is not read-only when 
        // the channel is enabled (EN=1).
        readonly TEIE    = new Field<DMA_CCR7, true>(1, 3)        

        // data transfer direction This bit must be 
        // set only in memory-to-peripheral and 
        // peripheral-to-memory modes. Source 
        // attributes are defined by PSIZE and PINC, 
        // plus the DMA_CPARx register. This is still 
        // valid in a memory-to-memory mode. 
        // Destination attributes are defined by 
        // MSIZE and MINC, plus the DMA_CMARx 
        // register. This is still valid in a 
        // peripheral-to-peripheral mode. Destination 
        // attributes are defined by PSIZE and PINC, 
        // plus the DMA_CPARx register. This is still 
        // valid in a memory-to-memory mode. Source 
        // attributes are defined by MSIZE and MINC, 
        // plus the DMA_CMARx register. This is still 
        // valid in a peripheral-to-peripheral mode. 
        // Note: this bit is set and cleared by 
        // software. It must not be written when the 
        // channel is enabled (EN = 1). It is 
        // read-only when the channel is enabled 
        // (EN=1).
        readonly DIR     = new Field<DMA_CCR7, true>(1, 4)        

        // circular mode Note: this bit is set and 
        // cleared by software. It must not be 
        // written when the channel is enabled (EN = 
        // 1). It is not read-only when the channel 
        // is enabled (EN=1).
        readonly CIRC    = new Field<DMA_CCR7, true>(1, 5)        

        // peripheral increment mode Defines the 
        // increment mode for each DMA transfer to 
        // the identified peripheral. n 
        // memory-to-memory mode, this field 
        // identifies the memory destination if DIR=1 
        // and the memory source if DIR=0. In 
        // peripheral-to-peripheral mode, this field 
        // identifies the peripheral destination if 
        // DIR=1 and the peripheral source if DIR=0. 
        // Note: this bit is set and cleared by 
        // software. It must not be written when the 
        // channel is enabled (EN = 1). It is 
        // read-only when the channel is enabled 
        // (EN=1).
        readonly PINC    = new Field<DMA_CCR7, true>(1, 6)        

        // memory increment mode Defines the 
        // increment mode for each DMA transfer to 
        // the identified memory. In memory-to-memory 
        // mode, this field identifies the memory 
        // source if DIR=1 and the memory destination 
        // if DIR=0. In peripheral-to-peripheral 
        // mode, this field identifies the peripheral 
        // source if DIR=1 and the peripheral 
        // destination if DIR=0. Note: this bit is 
        // set and cleared by software. It must not 
        // be written when the channel is enabled (EN 
        // = 1). It is read-only when the channel is 
        // enabled (EN=1).
        readonly MINC    = new Field<DMA_CCR7, true>(1, 7)        

        // peripheral size Defines the data size of 
        // each DMA transfer to the identified 
        // peripheral. In memory-to-memory mode, this 
        // field identifies the memory destination if 
        // DIR=1 and the memory source if DIR=0. In 
        // peripheral-to-peripheral mode, this field 
        // identifies the peripheral destination if 
        // DIR=1 and the peripheral source if DIR=0. 
        // Note: this field is set and cleared by 
        // software. It must not be written when the 
        // channel is enabled (EN = 1). It is 
        // read-only when the channel is enabled 
        // (EN=1).
        readonly PSIZE   = new Field<DMA_CCR7, true>(2, 8)        

        // memory size Defines the data size of each 
        // DMA transfer to the identified memory. In 
        // memory-to-memory mode, this field 
        // identifies the memory source if DIR=1 and 
        // the memory destination if DIR=0. In 
        // peripheral-to-peripheral mode, this field 
        // identifies the peripheral source if DIR=1 
        // and the peripheral destination if DIR=0. 
        // Note: this field is set and cleared by 
        // software. It must not be written when the 
        // channel is enabled (EN = 1). It is 
        // read-only when the channel is enabled 
        // (EN=1).
        readonly MSIZE   = new Field<DMA_CCR7, true>(2, 10)        

        // priority level Note: this field is set 
        // and cleared by software. It must not be 
        // written when the channel is enabled (EN = 
        // 1). It is read-only when the channel is 
        // enabled (EN=1).
        readonly PL      = new Field<DMA_CCR7, true>(2, 12)        

        // memory-to-memory mode Note: this bit is 
        // set and cleared by software. It must not 
        // be written when the channel is enabled 
        // (EN = 1). It is read-only when the 
        // channel is enabled (EN=1).
        readonly MEM2MEM = new Field<DMA_CCR7, true>(1, 14)        
    }

    // DMA channel x configuration register
    static readonly DMA_CNDTR7 = new class DMA_CNDTR7 extends Register<DMA_CNDTR7>
    {
        constructor() { super(0x40020084) }        

        // number of data to transfer (0 to 216-1) 
        // This field is updated by hardware when the 
        // channel is enabled: It is decremented after 
        // each single DMA 'read followed by write' 
        // transfer, indicating the remaining amount 
        // of data items to transfer. It is kept at 
        // zero when the programmed amount of data to 
        // transfer is reached, if the channel is not 
        // in circular mode (CIRC=0 in the DMA_CCRx 
        // register). It is reloaded automatically by 
        // the previously programmed value, when the 
        // transfer is complete, if the channel is in 
        // circular mode (CIRC=1). If this field is 
        // zero, no transfer can be served whatever 
        // the channel status (enabled or not). Note: 
        // this field is set and cleared by software. 
        // It must not be written when the channel is 
        // enabled (EN = 1). It is read-only when the 
        // channel is enabled (EN=1).
        readonly NDT = new Field<DMA_CNDTR7, true>(16, 0)        
    }

    // DMA channel x peripheral address 
    // register
    static readonly DMA_CPAR7 = new class DMA_CPAR7 extends Register<DMA_CPAR7>
    {
        constructor() { super(0x40020088) }        

        // peripheral address It contains the base 
        // address of the peripheral data register 
        // from/to which the data will be read/written. 
        // When PSIZE[1:0]=01 (16 bits), bit 0 of 
        // PA[31:0] is ignored. Access is automatically 
        // aligned to a half-word address. When PSIZE=10 
        // (32 bits), bits 1 and 0 of PA[31:0] are 
        // ignored. Access is automatically aligned to a 
        // word address. In memory-to-memory mode, this 
        // register identifies the memory destination 
        // address if DIR=1 and the memory source 
        // address if DIR=0. In peripheral-to-peripheral 
        // mode, this register identifies the peripheral 
        // destination address DIR=1 and the peripheral 
        // source address if DIR=0. Note: this register 
        // is set and cleared by software. It must not 
        // be written when the channel is enabled (EN = 
        // 1). It is not read-only when the channel is 
        // enabled (EN=1).
        readonly PA = new Field<DMA_CPAR7, true>(32, 0)        
    }

    // DMA channel x memory address register
    static readonly DMA_CMAR7 = new class DMA_CMAR7 extends Register<DMA_CMAR7>
    {
        constructor() { super(0x4002008c) }        

        // peripheral address It contains the base 
        // address of the memory from/to which the data 
        // will be read/written. When MSIZE[1:0]=01 (16 
        // bits), bit 0 of MA[31:0] is ignored. Access 
        // is automatically aligned to a half-word 
        // address. When MSIZE=10 (32 bits), bits 1 and 
        // 0 of MA[31:0] are ignored. Access is 
        // automatically aligned to a word address. In 
        // memory-to-memory mode, this register 
        // identifies the memory source address if DIR=1 
        // and the memory destination address if DIR=0. 
        // In peripheral-to-peripheral mode, this 
        // register identifies the peripheral source 
        // address DIR=1 and the peripheral destination 
        // address if DIR=0. Note: this register is set 
        // and cleared by software. It must not be 
        // written when the channel is enabled (EN = 1). 
        // It is not read-only when the channel is 
        // enabled (EN=1).
        readonly MA = new Field<DMA_CMAR7, true>(32, 0)        
    }
}

export class DMA2
{
    // DMA interrupt status register
    static readonly DMA_ISR = new class DMA_ISR extends Register<DMA_ISR>
    {
        constructor() { super(0x40020400) }        

        // global interrupt flag for channel 1
        readonly GIF1  = new Field<DMA_ISR, false>(1, 0)        

        // transfer complete (TC) flag for channel 1
        readonly TCIF1 = new Field<DMA_ISR, false>(1, 1)        

        // half transfer (HT) flag for channel 1
        readonly HTIF1 = new Field<DMA_ISR, false>(1, 2)        

        // transfer error (TE) flag for channel 1
        readonly TEIF1 = new Field<DMA_ISR, false>(1, 3)        

        // global interrupt flag for channel 2
        readonly GIF2  = new Field<DMA_ISR, false>(1, 4)        

        // transfer complete (TC) flag for channel 2
        readonly TCIF2 = new Field<DMA_ISR, false>(1, 5)        

        // half transfer (HT) flag for channel 2
        readonly HTIF2 = new Field<DMA_ISR, false>(1, 6)        

        // transfer error (TE) flag for channel 2
        readonly TEIF2 = new Field<DMA_ISR, false>(1, 7)        

        // global interrupt flag for channel 3
        readonly GIF3  = new Field<DMA_ISR, false>(1, 8)        

        // transfer complete (TC) flag for channel 3
        readonly TCIF3 = new Field<DMA_ISR, false>(1, 9)        

        // half transfer (HT) flag for channel 3
        readonly HTIF3 = new Field<DMA_ISR, false>(1, 10)        

        // transfer error (TE) flag for channel 3
        readonly TEIF3 = new Field<DMA_ISR, false>(1, 11)        

        // global interrupt flag for channel 4
        readonly GIF4  = new Field<DMA_ISR, false>(1, 12)        

        // transfer complete (TC) flag for channel 4
        readonly TCIF4 = new Field<DMA_ISR, false>(1, 13)        

        // half transfer (HT) flag for channel 4
        readonly HTIF4 = new Field<DMA_ISR, false>(1, 14)        

        // transfer error (TE) flag for channel 4
        readonly TEIF4 = new Field<DMA_ISR, false>(1, 15)        

        // global interrupt flag for channel 5
        readonly GIF5  = new Field<DMA_ISR, false>(1, 16)        

        // transfer complete (TC) flag for channel 5
        readonly TCIF5 = new Field<DMA_ISR, false>(1, 17)        

        // half transfer (HT) flag for channel 5
        readonly HTIF5 = new Field<DMA_ISR, false>(1, 18)        

        // transfer error (TE) flag for channel 5
        readonly TEIF5 = new Field<DMA_ISR, false>(1, 19)        

        // global interrupt flag for channel 6
        readonly GIF6  = new Field<DMA_ISR, false>(1, 20)        

        // transfer complete (TC) flag for channel 6
        readonly TCIF6 = new Field<DMA_ISR, false>(1, 21)        

        // half transfer (HT) flag for channel 6
        readonly HTIF6 = new Field<DMA_ISR, false>(1, 22)        

        // transfer error (TE) flag for channel 6
        readonly TEIF6 = new Field<DMA_ISR, false>(1, 23)        

        // global interrupt flag for channel 7
        readonly GIF7  = new Field<DMA_ISR, false>(1, 24)        

        // transfer complete (TC) flag for channel 7
        readonly TCIF7 = new Field<DMA_ISR, false>(1, 25)        

        // half transfer (HT) flag for channel 7
        readonly HTIF7 = new Field<DMA_ISR, false>(1, 26)        

        // transfer error (TE) flag for channel 7
        readonly TEIF7 = new Field<DMA_ISR, false>(1, 27)        
    }

    // DMA interrupt flag clear register
    static readonly DMA_IFCR = new class DMA_IFCR extends Register<DMA_IFCR>
    {
        constructor() { super(0x40020404) }        

        // global interrupt flag clear for channel 1
        readonly CGIF1  = new Field<DMA_IFCR, true>(1, 0)        

        // transfer complete flag clear for channel 1
        readonly CTCIF1 = new Field<DMA_IFCR, true>(1, 1)        

        // half transfer flag clear for channel 1
        readonly CHTIF1 = new Field<DMA_IFCR, true>(1, 2)        

        // transfer error flag clear for channel 1
        readonly CTEIF1 = new Field<DMA_IFCR, true>(1, 3)        

        // global interrupt flag clear for channel 2
        readonly CGIF2  = new Field<DMA_IFCR, true>(1, 4)        

        // transfer complete flag clear for channel 2
        readonly CTCIF2 = new Field<DMA_IFCR, true>(1, 5)        

        // half transfer flag clear for channel 2
        readonly CHTIF2 = new Field<DMA_IFCR, true>(1, 6)        

        // transfer error flag clear for channel 2
        readonly CTEIF2 = new Field<DMA_IFCR, true>(1, 7)        

        // global interrupt flag clear for channel 3
        readonly CGIF3  = new Field<DMA_IFCR, true>(1, 8)        

        // transfer complete flag clear for channel 3
        readonly CTCIF3 = new Field<DMA_IFCR, true>(1, 9)        

        // half transfer flag clear for channel 3
        readonly CHTIF3 = new Field<DMA_IFCR, true>(1, 10)        

        // transfer error flag clear for channel 3
        readonly CTEIF3 = new Field<DMA_IFCR, true>(1, 11)        

        // global interrupt flag clear for channel 4
        readonly CGIF4  = new Field<DMA_IFCR, true>(1, 12)        

        // transfer complete flag clear for channel 4
        readonly CTCIF4 = new Field<DMA_IFCR, true>(1, 13)        

        // half transfer flag clear for channel 4
        readonly CHTIF4 = new Field<DMA_IFCR, true>(1, 14)        

        // transfer error flag clear for channel 4
        readonly CTEIF4 = new Field<DMA_IFCR, true>(1, 15)        

        // global interrupt flag clear for channel 5
        readonly CGIF5  = new Field<DMA_IFCR, true>(1, 16)        

        // transfer complete flag clear for channel 5
        readonly CTCIF5 = new Field<DMA_IFCR, true>(1, 17)        

        // half transfer flag clear for channel 5
        readonly CHTIF5 = new Field<DMA_IFCR, true>(1, 18)        

        // transfer error flag clear for channel 5
        readonly CTEIF5 = new Field<DMA_IFCR, true>(1, 19)        

        // global interrupt flag clear for channel 6
        readonly CGIF6  = new Field<DMA_IFCR, true>(1, 20)        

        // transfer complete flag clear for channel 6
        readonly CTCIF6 = new Field<DMA_IFCR, true>(1, 21)        

        // half transfer flag clear for channel 6
        readonly CHTIF6 = new Field<DMA_IFCR, true>(1, 22)        

        // transfer error flag clear for channel 6
        readonly CTEIF6 = new Field<DMA_IFCR, true>(1, 23)        

        // global interrupt flag clear for channel 7
        readonly CGIF7  = new Field<DMA_IFCR, true>(1, 24)        

        // transfer complete flag clear for channel 7
        readonly CTCIF7 = new Field<DMA_IFCR, true>(1, 25)        

        // half transfer flag clear for channel 7
        readonly CHTIF7 = new Field<DMA_IFCR, true>(1, 26)        

        // transfer error flag clear for channel 7
        readonly CTEIF7 = new Field<DMA_IFCR, true>(1, 27)        
    }

    // DMA channel 1 configuration register
    static readonly DMA_CCR1 = new class DMA_CCR1 extends Register<DMA_CCR1>
    {
        constructor() { super(0x40020408) }        

        // channel enable When a channel transfer 
        // error occurs, this bit is cleared by 
        // hardware. It can not be set again by 
        // software (channel x re-activated) until 
        // the TEIFx bit of the DMA_ISR register is 
        // cleared (by setting the CTEIFx bit of the 
        // DMA_IFCR register). Note: this bit is set 
        // and cleared by software.
        readonly EN      = new Field<DMA_CCR1, true>(1, 0)        

        // transfer complete interrupt enable Note: 
        // this bit is set and cleared by software. 
        // It must not be written when the channel is 
        // enabled (EN = 1). It is not read-only when 
        // the channel is enabled (EN=1).
        readonly TCIE    = new Field<DMA_CCR1, true>(1, 1)        

        // half transfer interrupt enable Note: this 
        // bit is set and cleared by software. It 
        // must not be written when the channel is 
        // enabled (EN = 1). It is not read-only when 
        // the channel is enabled (EN=1).
        readonly HTIE    = new Field<DMA_CCR1, true>(1, 2)        

        // transfer error interrupt enable Note: this 
        // bit is set and cleared by software. It 
        // must not be written when the channel is 
        // enabled (EN = 1). It is not read-only when 
        // the channel is enabled (EN=1).
        readonly TEIE    = new Field<DMA_CCR1, true>(1, 3)        

        // data transfer direction This bit must be 
        // set only in memory-to-peripheral and 
        // peripheral-to-memory modes. Source 
        // attributes are defined by PSIZE and PINC, 
        // plus the DMA_CPARx register. This is still 
        // valid in a memory-to-memory mode. 
        // Destination attributes are defined by 
        // MSIZE and MINC, plus the DMA_CMARx 
        // register. This is still valid in a 
        // peripheral-to-peripheral mode. Destination 
        // attributes are defined by PSIZE and PINC, 
        // plus the DMA_CPARx register. This is still 
        // valid in a memory-to-memory mode. Source 
        // attributes are defined by MSIZE and MINC, 
        // plus the DMA_CMARx register. This is still 
        // valid in a peripheral-to-peripheral mode. 
        // Note: this bit is set and cleared by 
        // software. It must not be written when the 
        // channel is enabled (EN = 1). It is 
        // read-only when the channel is enabled 
        // (EN=1).
        readonly DIR     = new Field<DMA_CCR1, true>(1, 4)        

        // circular mode Note: this bit is set and 
        // cleared by software. It must not be 
        // written when the channel is enabled (EN = 
        // 1). It is not read-only when the channel 
        // is enabled (EN=1).
        readonly CIRC    = new Field<DMA_CCR1, true>(1, 5)        

        // peripheral increment mode Defines the 
        // increment mode for each DMA transfer to 
        // the identified peripheral. n 
        // memory-to-memory mode, this field 
        // identifies the memory destination if DIR=1 
        // and the memory source if DIR=0. In 
        // peripheral-to-peripheral mode, this field 
        // identifies the peripheral destination if 
        // DIR=1 and the peripheral source if DIR=0. 
        // Note: this bit is set and cleared by 
        // software. It must not be written when the 
        // channel is enabled (EN = 1). It is 
        // read-only when the channel is enabled 
        // (EN=1).
        readonly PINC    = new Field<DMA_CCR1, true>(1, 6)        

        // memory increment mode Defines the 
        // increment mode for each DMA transfer to 
        // the identified memory. In memory-to-memory 
        // mode, this field identifies the memory 
        // source if DIR=1 and the memory destination 
        // if DIR=0. In peripheral-to-peripheral 
        // mode, this field identifies the peripheral 
        // source if DIR=1 and the peripheral 
        // destination if DIR=0. Note: this bit is 
        // set and cleared by software. It must not 
        // be written when the channel is enabled (EN 
        // = 1). It is read-only when the channel is 
        // enabled (EN=1).
        readonly MINC    = new Field<DMA_CCR1, true>(1, 7)        

        // peripheral size Defines the data size of 
        // each DMA transfer to the identified 
        // peripheral. In memory-to-memory mode, this 
        // field identifies the memory destination if 
        // DIR=1 and the memory source if DIR=0. In 
        // peripheral-to-peripheral mode, this field 
        // identifies the peripheral destination if 
        // DIR=1 and the peripheral source if DIR=0. 
        // Note: this field is set and cleared by 
        // software. It must not be written when the 
        // channel is enabled (EN = 1). It is 
        // read-only when the channel is enabled 
        // (EN=1).
        readonly PSIZE   = new Field<DMA_CCR1, true>(2, 8)        

        // memory size Defines the data size of each 
        // DMA transfer to the identified memory. In 
        // memory-to-memory mode, this field 
        // identifies the memory source if DIR=1 and 
        // the memory destination if DIR=0. In 
        // peripheral-to-peripheral mode, this field 
        // identifies the peripheral source if DIR=1 
        // and the peripheral destination if DIR=0. 
        // Note: this field is set and cleared by 
        // software. It must not be written when the 
        // channel is enabled (EN = 1). It is 
        // read-only when the channel is enabled 
        // (EN=1).
        readonly MSIZE   = new Field<DMA_CCR1, true>(2, 10)        

        // priority level Note: this field is set 
        // and cleared by software. It must not be 
        // written when the channel is enabled (EN = 
        // 1). It is read-only when the channel is 
        // enabled (EN=1).
        readonly PL      = new Field<DMA_CCR1, true>(2, 12)        

        // memory-to-memory mode Note: this bit is 
        // set and cleared by software. It must not 
        // be written when the channel is enabled 
        // (EN = 1). It is read-only when the 
        // channel is enabled (EN=1).
        readonly MEM2MEM = new Field<DMA_CCR1, true>(1, 14)        
    }

    // DMA channel x number of data register
    static readonly DMA_CNDTR1 = new class DMA_CNDTR1 extends Register<DMA_CNDTR1>
    {
        constructor() { super(0x4002040c) }        

        // number of data to transfer (0 to 216-1) 
        // This field is updated by hardware when the 
        // channel is enabled: It is decremented after 
        // each single DMA 'read followed by write' 
        // transfer, indicating the remaining amount 
        // of data items to transfer. It is kept at 
        // zero when the programmed amount of data to 
        // transfer is reached, if the channel is not 
        // in circular mode (CIRC=0 in the DMA_CCRx 
        // register). It is reloaded automatically by 
        // the previously programmed value, when the 
        // transfer is complete, if the channel is in 
        // circular mode (CIRC=1). If this field is 
        // zero, no transfer can be served whatever 
        // the channel status (enabled or not). Note: 
        // this field is set and cleared by software. 
        // It must not be written when the channel is 
        // enabled (EN = 1). It is read-only when the 
        // channel is enabled (EN=1).
        readonly NDT = new Field<DMA_CNDTR1, true>(16, 0)        
    }

    // DMA channel x peripheral address 
    // register
    static readonly DMA_CPAR1 = new class DMA_CPAR1 extends Register<DMA_CPAR1>
    {
        constructor() { super(0x40020410) }        

        // peripheral address It contains the base 
        // address of the peripheral data register 
        // from/to which the data will be read/written. 
        // When PSIZE[1:0]=01 (16 bits), bit 0 of 
        // PA[31:0] is ignored. Access is automatically 
        // aligned to a half-word address. When PSIZE=10 
        // (32 bits), bits 1 and 0 of PA[31:0] are 
        // ignored. Access is automatically aligned to a 
        // word address. In memory-to-memory mode, this 
        // register identifies the memory destination 
        // address if DIR=1 and the memory source 
        // address if DIR=0. In peripheral-to-peripheral 
        // mode, this register identifies the peripheral 
        // destination address DIR=1 and the peripheral 
        // source address if DIR=0. Note: this register 
        // is set and cleared by software. It must not 
        // be written when the channel is enabled (EN = 
        // 1). It is not read-only when the channel is 
        // enabled (EN=1).
        readonly PA = new Field<DMA_CPAR1, true>(32, 0)        
    }

    // DMA channel x memory address register
    static readonly DMA_CMAR1 = new class DMA_CMAR1 extends Register<DMA_CMAR1>
    {
        constructor() { super(0x40020414) }        

        // peripheral address It contains the base 
        // address of the memory from/to which the data 
        // will be read/written. When MSIZE[1:0]=01 (16 
        // bits), bit 0 of MA[31:0] is ignored. Access 
        // is automatically aligned to a half-word 
        // address. When MSIZE=10 (32 bits), bits 1 and 
        // 0 of MA[31:0] are ignored. Access is 
        // automatically aligned to a word address. In 
        // memory-to-memory mode, this register 
        // identifies the memory source address if DIR=1 
        // and the memory destination address if DIR=0. 
        // In peripheral-to-peripheral mode, this 
        // register identifies the peripheral source 
        // address DIR=1 and the peripheral destination 
        // address if DIR=0. Note: this register is set 
        // and cleared by software. It must not be 
        // written when the channel is enabled (EN = 1). 
        // It is not read-only when the channel is 
        // enabled (EN=1).
        readonly MA = new Field<DMA_CMAR1, true>(32, 0)        
    }

    // DMA channel 2 configuration register
    static readonly DMA_CCR2 = new class DMA_CCR2 extends Register<DMA_CCR2>
    {
        constructor() { super(0x4002041c) }        

        // channel enable When a channel transfer 
        // error occurs, this bit is cleared by 
        // hardware. It can not be set again by 
        // software (channel x re-activated) until 
        // the TEIFx bit of the DMA_ISR register is 
        // cleared (by setting the CTEIFx bit of the 
        // DMA_IFCR register). Note: this bit is set 
        // and cleared by software.
        readonly EN      = new Field<DMA_CCR2, true>(1, 0)        

        // transfer complete interrupt enable Note: 
        // this bit is set and cleared by software. 
        // It must not be written when the channel is 
        // enabled (EN = 1). It is not read-only when 
        // the channel is enabled (EN=1).
        readonly TCIE    = new Field<DMA_CCR2, true>(1, 1)        

        // half transfer interrupt enable Note: this 
        // bit is set and cleared by software. It 
        // must not be written when the channel is 
        // enabled (EN = 1). It is not read-only when 
        // the channel is enabled (EN=1).
        readonly HTIE    = new Field<DMA_CCR2, true>(1, 2)        

        // transfer error interrupt enable Note: this 
        // bit is set and cleared by software. It 
        // must not be written when the channel is 
        // enabled (EN = 1). It is not read-only when 
        // the channel is enabled (EN=1).
        readonly TEIE    = new Field<DMA_CCR2, true>(1, 3)        

        // data transfer direction This bit must be 
        // set only in memory-to-peripheral and 
        // peripheral-to-memory modes. Source 
        // attributes are defined by PSIZE and PINC, 
        // plus the DMA_CPARx register. This is still 
        // valid in a memory-to-memory mode. 
        // Destination attributes are defined by 
        // MSIZE and MINC, plus the DMA_CMARx 
        // register. This is still valid in a 
        // peripheral-to-peripheral mode. Destination 
        // attributes are defined by PSIZE and PINC, 
        // plus the DMA_CPARx register. This is still 
        // valid in a memory-to-memory mode. Source 
        // attributes are defined by MSIZE and MINC, 
        // plus the DMA_CMARx register. This is still 
        // valid in a peripheral-to-peripheral mode. 
        // Note: this bit is set and cleared by 
        // software. It must not be written when the 
        // channel is enabled (EN = 1). It is 
        // read-only when the channel is enabled 
        // (EN=1).
        readonly DIR     = new Field<DMA_CCR2, true>(1, 4)        

        // circular mode Note: this bit is set and 
        // cleared by software. It must not be 
        // written when the channel is enabled (EN = 
        // 1). It is not read-only when the channel 
        // is enabled (EN=1).
        readonly CIRC    = new Field<DMA_CCR2, true>(1, 5)        

        // peripheral increment mode Defines the 
        // increment mode for each DMA transfer to 
        // the identified peripheral. n 
        // memory-to-memory mode, this field 
        // identifies the memory destination if DIR=1 
        // and the memory source if DIR=0. In 
        // peripheral-to-peripheral mode, this field 
        // identifies the peripheral destination if 
        // DIR=1 and the peripheral source if DIR=0. 
        // Note: this bit is set and cleared by 
        // software. It must not be written when the 
        // channel is enabled (EN = 1). It is 
        // read-only when the channel is enabled 
        // (EN=1).
        readonly PINC    = new Field<DMA_CCR2, true>(1, 6)        

        // memory increment mode Defines the 
        // increment mode for each DMA transfer to 
        // the identified memory. In memory-to-memory 
        // mode, this field identifies the memory 
        // source if DIR=1 and the memory destination 
        // if DIR=0. In peripheral-to-peripheral 
        // mode, this field identifies the peripheral 
        // source if DIR=1 and the peripheral 
        // destination if DIR=0. Note: this bit is 
        // set and cleared by software. It must not 
        // be written when the channel is enabled (EN 
        // = 1). It is read-only when the channel is 
        // enabled (EN=1).
        readonly MINC    = new Field<DMA_CCR2, true>(1, 7)        

        // peripheral size Defines the data size of 
        // each DMA transfer to the identified 
        // peripheral. In memory-to-memory mode, this 
        // field identifies the memory destination if 
        // DIR=1 and the memory source if DIR=0. In 
        // peripheral-to-peripheral mode, this field 
        // identifies the peripheral destination if 
        // DIR=1 and the peripheral source if DIR=0. 
        // Note: this field is set and cleared by 
        // software. It must not be written when the 
        // channel is enabled (EN = 1). It is 
        // read-only when the channel is enabled 
        // (EN=1).
        readonly PSIZE   = new Field<DMA_CCR2, true>(2, 8)        

        // memory size Defines the data size of each 
        // DMA transfer to the identified memory. In 
        // memory-to-memory mode, this field 
        // identifies the memory source if DIR=1 and 
        // the memory destination if DIR=0. In 
        // peripheral-to-peripheral mode, this field 
        // identifies the peripheral source if DIR=1 
        // and the peripheral destination if DIR=0. 
        // Note: this field is set and cleared by 
        // software. It must not be written when the 
        // channel is enabled (EN = 1). It is 
        // read-only when the channel is enabled 
        // (EN=1).
        readonly MSIZE   = new Field<DMA_CCR2, true>(2, 10)        

        // priority level Note: this field is set 
        // and cleared by software. It must not be 
        // written when the channel is enabled (EN = 
        // 1). It is read-only when the channel is 
        // enabled (EN=1).
        readonly PL      = new Field<DMA_CCR2, true>(2, 12)        

        // memory-to-memory mode Note: this bit is 
        // set and cleared by software. It must not 
        // be written when the channel is enabled 
        // (EN = 1). It is read-only when the 
        // channel is enabled (EN=1).
        readonly MEM2MEM = new Field<DMA_CCR2, true>(1, 14)        
    }

    // DMA channel x number of data register
    static readonly DMA_CNDTR2 = new class DMA_CNDTR2 extends Register<DMA_CNDTR2>
    {
        constructor() { super(0x40020420) }        

        // number of data to transfer (0 to 216-1) 
        // This field is updated by hardware when the 
        // channel is enabled: It is decremented after 
        // each single DMA 'read followed by write' 
        // transfer, indicating the remaining amount 
        // of data items to transfer. It is kept at 
        // zero when the programmed amount of data to 
        // transfer is reached, if the channel is not 
        // in circular mode (CIRC=0 in the DMA_CCRx 
        // register). It is reloaded automatically by 
        // the previously programmed value, when the 
        // transfer is complete, if the channel is in 
        // circular mode (CIRC=1). If this field is 
        // zero, no transfer can be served whatever 
        // the channel status (enabled or not). Note: 
        // this field is set and cleared by software. 
        // It must not be written when the channel is 
        // enabled (EN = 1). It is read-only when the 
        // channel is enabled (EN=1).
        readonly NDT = new Field<DMA_CNDTR2, true>(16, 0)        
    }

    // DMA channel x peripheral address 
    // register
    static readonly DMA_CPAR2 = new class DMA_CPAR2 extends Register<DMA_CPAR2>
    {
        constructor() { super(0x40020424) }        

        // peripheral address It contains the base 
        // address of the peripheral data register 
        // from/to which the data will be read/written. 
        // When PSIZE[1:0]=01 (16 bits), bit 0 of 
        // PA[31:0] is ignored. Access is automatically 
        // aligned to a half-word address. When PSIZE=10 
        // (32 bits), bits 1 and 0 of PA[31:0] are 
        // ignored. Access is automatically aligned to a 
        // word address. In memory-to-memory mode, this 
        // register identifies the memory destination 
        // address if DIR=1 and the memory source 
        // address if DIR=0. In peripheral-to-peripheral 
        // mode, this register identifies the peripheral 
        // destination address DIR=1 and the peripheral 
        // source address if DIR=0. Note: this register 
        // is set and cleared by software. It must not 
        // be written when the channel is enabled (EN = 
        // 1). It is not read-only when the channel is 
        // enabled (EN=1).
        readonly PA = new Field<DMA_CPAR2, true>(32, 0)        
    }

    // DMA channel x memory address register
    static readonly DMA_CMAR2 = new class DMA_CMAR2 extends Register<DMA_CMAR2>
    {
        constructor() { super(0x40020428) }        

        // peripheral address It contains the base 
        // address of the memory from/to which the data 
        // will be read/written. When MSIZE[1:0]=01 (16 
        // bits), bit 0 of MA[31:0] is ignored. Access 
        // is automatically aligned to a half-word 
        // address. When MSIZE=10 (32 bits), bits 1 and 
        // 0 of MA[31:0] are ignored. Access is 
        // automatically aligned to a word address. In 
        // memory-to-memory mode, this register 
        // identifies the memory source address if DIR=1 
        // and the memory destination address if DIR=0. 
        // In peripheral-to-peripheral mode, this 
        // register identifies the peripheral source 
        // address DIR=1 and the peripheral destination 
        // address if DIR=0. Note: this register is set 
        // and cleared by software. It must not be 
        // written when the channel is enabled (EN = 1). 
        // It is not read-only when the channel is 
        // enabled (EN=1).
        readonly MA = new Field<DMA_CMAR2, true>(32, 0)        
    }

    // DMA channel 3 configuration register
    static readonly DMA_CCR3 = new class DMA_CCR3 extends Register<DMA_CCR3>
    {
        constructor() { super(0x40020430) }        

        // channel enable When a channel transfer 
        // error occurs, this bit is cleared by 
        // hardware. It can not be set again by 
        // software (channel x re-activated) until 
        // the TEIFx bit of the DMA_ISR register is 
        // cleared (by setting the CTEIFx bit of the 
        // DMA_IFCR register). Note: this bit is set 
        // and cleared by software.
        readonly EN      = new Field<DMA_CCR3, true>(1, 0)        

        // transfer complete interrupt enable Note: 
        // this bit is set and cleared by software. 
        // It must not be written when the channel is 
        // enabled (EN = 1). It is not read-only when 
        // the channel is enabled (EN=1).
        readonly TCIE    = new Field<DMA_CCR3, true>(1, 1)        

        // half transfer interrupt enable Note: this 
        // bit is set and cleared by software. It 
        // must not be written when the channel is 
        // enabled (EN = 1). It is not read-only when 
        // the channel is enabled (EN=1).
        readonly HTIE    = new Field<DMA_CCR3, true>(1, 2)        

        // transfer error interrupt enable Note: this 
        // bit is set and cleared by software. It 
        // must not be written when the channel is 
        // enabled (EN = 1). It is not read-only when 
        // the channel is enabled (EN=1).
        readonly TEIE    = new Field<DMA_CCR3, true>(1, 3)        

        // data transfer direction This bit must be 
        // set only in memory-to-peripheral and 
        // peripheral-to-memory modes. Source 
        // attributes are defined by PSIZE and PINC, 
        // plus the DMA_CPARx register. This is still 
        // valid in a memory-to-memory mode. 
        // Destination attributes are defined by 
        // MSIZE and MINC, plus the DMA_CMARx 
        // register. This is still valid in a 
        // peripheral-to-peripheral mode. Destination 
        // attributes are defined by PSIZE and PINC, 
        // plus the DMA_CPARx register. This is still 
        // valid in a memory-to-memory mode. Source 
        // attributes are defined by MSIZE and MINC, 
        // plus the DMA_CMARx register. This is still 
        // valid in a peripheral-to-peripheral mode. 
        // Note: this bit is set and cleared by 
        // software. It must not be written when the 
        // channel is enabled (EN = 1). It is 
        // read-only when the channel is enabled 
        // (EN=1).
        readonly DIR     = new Field<DMA_CCR3, true>(1, 4)        

        // circular mode Note: this bit is set and 
        // cleared by software. It must not be 
        // written when the channel is enabled (EN = 
        // 1). It is not read-only when the channel 
        // is enabled (EN=1).
        readonly CIRC    = new Field<DMA_CCR3, true>(1, 5)        

        // peripheral increment mode Defines the 
        // increment mode for each DMA transfer to 
        // the identified peripheral. n 
        // memory-to-memory mode, this field 
        // identifies the memory destination if DIR=1 
        // and the memory source if DIR=0. In 
        // peripheral-to-peripheral mode, this field 
        // identifies the peripheral destination if 
        // DIR=1 and the peripheral source if DIR=0. 
        // Note: this bit is set and cleared by 
        // software. It must not be written when the 
        // channel is enabled (EN = 1). It is 
        // read-only when the channel is enabled 
        // (EN=1).
        readonly PINC    = new Field<DMA_CCR3, true>(1, 6)        

        // memory increment mode Defines the 
        // increment mode for each DMA transfer to 
        // the identified memory. In memory-to-memory 
        // mode, this field identifies the memory 
        // source if DIR=1 and the memory destination 
        // if DIR=0. In peripheral-to-peripheral 
        // mode, this field identifies the peripheral 
        // source if DIR=1 and the peripheral 
        // destination if DIR=0. Note: this bit is 
        // set and cleared by software. It must not 
        // be written when the channel is enabled (EN 
        // = 1). It is read-only when the channel is 
        // enabled (EN=1).
        readonly MINC    = new Field<DMA_CCR3, true>(1, 7)        

        // peripheral size Defines the data size of 
        // each DMA transfer to the identified 
        // peripheral. In memory-to-memory mode, this 
        // field identifies the memory destination if 
        // DIR=1 and the memory source if DIR=0. In 
        // peripheral-to-peripheral mode, this field 
        // identifies the peripheral destination if 
        // DIR=1 and the peripheral source if DIR=0. 
        // Note: this field is set and cleared by 
        // software. It must not be written when the 
        // channel is enabled (EN = 1). It is 
        // read-only when the channel is enabled 
        // (EN=1).
        readonly PSIZE   = new Field<DMA_CCR3, true>(2, 8)        

        // memory size Defines the data size of each 
        // DMA transfer to the identified memory. In 
        // memory-to-memory mode, this field 
        // identifies the memory source if DIR=1 and 
        // the memory destination if DIR=0. In 
        // peripheral-to-peripheral mode, this field 
        // identifies the peripheral source if DIR=1 
        // and the peripheral destination if DIR=0. 
        // Note: this field is set and cleared by 
        // software. It must not be written when the 
        // channel is enabled (EN = 1). It is 
        // read-only when the channel is enabled 
        // (EN=1).
        readonly MSIZE   = new Field<DMA_CCR3, true>(2, 10)        

        // priority level Note: this field is set 
        // and cleared by software. It must not be 
        // written when the channel is enabled (EN = 
        // 1). It is read-only when the channel is 
        // enabled (EN=1).
        readonly PL      = new Field<DMA_CCR3, true>(2, 12)        

        // memory-to-memory mode Note: this bit is 
        // set and cleared by software. It must not 
        // be written when the channel is enabled 
        // (EN = 1). It is read-only when the 
        // channel is enabled (EN=1).
        readonly MEM2MEM = new Field<DMA_CCR3, true>(1, 14)        
    }

    // DMA channel x configuration register
    static readonly DMA_CNDTR3 = new class DMA_CNDTR3 extends Register<DMA_CNDTR3>
    {
        constructor() { super(0x40020434) }        

        // number of data to transfer (0 to 216-1) 
        // This field is updated by hardware when the 
        // channel is enabled: It is decremented after 
        // each single DMA 'read followed by write' 
        // transfer, indicating the remaining amount 
        // of data items to transfer. It is kept at 
        // zero when the programmed amount of data to 
        // transfer is reached, if the channel is not 
        // in circular mode (CIRC=0 in the DMA_CCRx 
        // register). It is reloaded automatically by 
        // the previously programmed value, when the 
        // transfer is complete, if the channel is in 
        // circular mode (CIRC=1). If this field is 
        // zero, no transfer can be served whatever 
        // the channel status (enabled or not). Note: 
        // this field is set and cleared by software. 
        // It must not be written when the channel is 
        // enabled (EN = 1). It is read-only when the 
        // channel is enabled (EN=1).
        readonly NDT = new Field<DMA_CNDTR3, true>(16, 0)        
    }

    // DMA channel x peripheral address 
    // register
    static readonly DMA_CPAR3 = new class DMA_CPAR3 extends Register<DMA_CPAR3>
    {
        constructor() { super(0x40020438) }        

        // peripheral address It contains the base 
        // address of the peripheral data register 
        // from/to which the data will be read/written. 
        // When PSIZE[1:0]=01 (16 bits), bit 0 of 
        // PA[31:0] is ignored. Access is automatically 
        // aligned to a half-word address. When PSIZE=10 
        // (32 bits), bits 1 and 0 of PA[31:0] are 
        // ignored. Access is automatically aligned to a 
        // word address. In memory-to-memory mode, this 
        // register identifies the memory destination 
        // address if DIR=1 and the memory source 
        // address if DIR=0. In peripheral-to-peripheral 
        // mode, this register identifies the peripheral 
        // destination address DIR=1 and the peripheral 
        // source address if DIR=0. Note: this register 
        // is set and cleared by software. It must not 
        // be written when the channel is enabled (EN = 
        // 1). It is not read-only when the channel is 
        // enabled (EN=1).
        readonly PA = new Field<DMA_CPAR3, true>(32, 0)        
    }

    // DMA channel x memory address register
    static readonly DMA_CMAR3 = new class DMA_CMAR3 extends Register<DMA_CMAR3>
    {
        constructor() { super(0x4002043c) }        

        // peripheral address It contains the base 
        // address of the memory from/to which the data 
        // will be read/written. When MSIZE[1:0]=01 (16 
        // bits), bit 0 of MA[31:0] is ignored. Access 
        // is automatically aligned to a half-word 
        // address. When MSIZE=10 (32 bits), bits 1 and 
        // 0 of MA[31:0] are ignored. Access is 
        // automatically aligned to a word address. In 
        // memory-to-memory mode, this register 
        // identifies the memory source address if DIR=1 
        // and the memory destination address if DIR=0. 
        // In peripheral-to-peripheral mode, this 
        // register identifies the peripheral source 
        // address DIR=1 and the peripheral destination 
        // address if DIR=0. Note: this register is set 
        // and cleared by software. It must not be 
        // written when the channel is enabled (EN = 1). 
        // It is not read-only when the channel is 
        // enabled (EN=1).
        readonly MA = new Field<DMA_CMAR3, true>(32, 0)        
    }

    // DMA channel 4 configuration register
    static readonly DMA_CCR4 = new class DMA_CCR4 extends Register<DMA_CCR4>
    {
        constructor() { super(0x40020444) }        

        // channel enable When a channel transfer 
        // error occurs, this bit is cleared by 
        // hardware. It can not be set again by 
        // software (channel x re-activated) until 
        // the TEIFx bit of the DMA_ISR register is 
        // cleared (by setting the CTEIFx bit of the 
        // DMA_IFCR register). Note: this bit is set 
        // and cleared by software.
        readonly EN      = new Field<DMA_CCR4, true>(1, 0)        

        // transfer complete interrupt enable Note: 
        // this bit is set and cleared by software. 
        // It must not be written when the channel is 
        // enabled (EN = 1). It is not read-only when 
        // the channel is enabled (EN=1).
        readonly TCIE    = new Field<DMA_CCR4, true>(1, 1)        

        // half transfer interrupt enable Note: this 
        // bit is set and cleared by software. It 
        // must not be written when the channel is 
        // enabled (EN = 1). It is not read-only when 
        // the channel is enabled (EN=1).
        readonly HTIE    = new Field<DMA_CCR4, true>(1, 2)        

        // transfer error interrupt enable Note: this 
        // bit is set and cleared by software. It 
        // must not be written when the channel is 
        // enabled (EN = 1). It is not read-only when 
        // the channel is enabled (EN=1).
        readonly TEIE    = new Field<DMA_CCR4, true>(1, 3)        

        // data transfer direction This bit must be 
        // set only in memory-to-peripheral and 
        // peripheral-to-memory modes. Source 
        // attributes are defined by PSIZE and PINC, 
        // plus the DMA_CPARx register. This is still 
        // valid in a memory-to-memory mode. 
        // Destination attributes are defined by 
        // MSIZE and MINC, plus the DMA_CMARx 
        // register. This is still valid in a 
        // peripheral-to-peripheral mode. Destination 
        // attributes are defined by PSIZE and PINC, 
        // plus the DMA_CPARx register. This is still 
        // valid in a memory-to-memory mode. Source 
        // attributes are defined by MSIZE and MINC, 
        // plus the DMA_CMARx register. This is still 
        // valid in a peripheral-to-peripheral mode. 
        // Note: this bit is set and cleared by 
        // software. It must not be written when the 
        // channel is enabled (EN = 1). It is 
        // read-only when the channel is enabled 
        // (EN=1).
        readonly DIR     = new Field<DMA_CCR4, true>(1, 4)        

        // circular mode Note: this bit is set and 
        // cleared by software. It must not be 
        // written when the channel is enabled (EN = 
        // 1). It is not read-only when the channel 
        // is enabled (EN=1).
        readonly CIRC    = new Field<DMA_CCR4, true>(1, 5)        

        // peripheral increment mode Defines the 
        // increment mode for each DMA transfer to 
        // the identified peripheral. n 
        // memory-to-memory mode, this field 
        // identifies the memory destination if DIR=1 
        // and the memory source if DIR=0. In 
        // peripheral-to-peripheral mode, this field 
        // identifies the peripheral destination if 
        // DIR=1 and the peripheral source if DIR=0. 
        // Note: this bit is set and cleared by 
        // software. It must not be written when the 
        // channel is enabled (EN = 1). It is 
        // read-only when the channel is enabled 
        // (EN=1).
        readonly PINC    = new Field<DMA_CCR4, true>(1, 6)        

        // memory increment mode Defines the 
        // increment mode for each DMA transfer to 
        // the identified memory. In memory-to-memory 
        // mode, this field identifies the memory 
        // source if DIR=1 and the memory destination 
        // if DIR=0. In peripheral-to-peripheral 
        // mode, this field identifies the peripheral 
        // source if DIR=1 and the peripheral 
        // destination if DIR=0. Note: this bit is 
        // set and cleared by software. It must not 
        // be written when the channel is enabled (EN 
        // = 1). It is read-only when the channel is 
        // enabled (EN=1).
        readonly MINC    = new Field<DMA_CCR4, true>(1, 7)        

        // peripheral size Defines the data size of 
        // each DMA transfer to the identified 
        // peripheral. In memory-to-memory mode, this 
        // field identifies the memory destination if 
        // DIR=1 and the memory source if DIR=0. In 
        // peripheral-to-peripheral mode, this field 
        // identifies the peripheral destination if 
        // DIR=1 and the peripheral source if DIR=0. 
        // Note: this field is set and cleared by 
        // software. It must not be written when the 
        // channel is enabled (EN = 1). It is 
        // read-only when the channel is enabled 
        // (EN=1).
        readonly PSIZE   = new Field<DMA_CCR4, true>(2, 8)        

        // memory size Defines the data size of each 
        // DMA transfer to the identified memory. In 
        // memory-to-memory mode, this field 
        // identifies the memory source if DIR=1 and 
        // the memory destination if DIR=0. In 
        // peripheral-to-peripheral mode, this field 
        // identifies the peripheral source if DIR=1 
        // and the peripheral destination if DIR=0. 
        // Note: this field is set and cleared by 
        // software. It must not be written when the 
        // channel is enabled (EN = 1). It is 
        // read-only when the channel is enabled 
        // (EN=1).
        readonly MSIZE   = new Field<DMA_CCR4, true>(2, 10)        

        // priority level Note: this field is set 
        // and cleared by software. It must not be 
        // written when the channel is enabled (EN = 
        // 1). It is read-only when the channel is 
        // enabled (EN=1).
        readonly PL      = new Field<DMA_CCR4, true>(2, 12)        

        // memory-to-memory mode Note: this bit is 
        // set and cleared by software. It must not 
        // be written when the channel is enabled 
        // (EN = 1). It is read-only when the 
        // channel is enabled (EN=1).
        readonly MEM2MEM = new Field<DMA_CCR4, true>(1, 14)        
    }

    // DMA channel x configuration register
    static readonly DMA_CNDTR4 = new class DMA_CNDTR4 extends Register<DMA_CNDTR4>
    {
        constructor() { super(0x40020448) }        

        // number of data to transfer (0 to 216-1) 
        // This field is updated by hardware when the 
        // channel is enabled: It is decremented after 
        // each single DMA 'read followed by write' 
        // transfer, indicating the remaining amount 
        // of data items to transfer. It is kept at 
        // zero when the programmed amount of data to 
        // transfer is reached, if the channel is not 
        // in circular mode (CIRC=0 in the DMA_CCRx 
        // register). It is reloaded automatically by 
        // the previously programmed value, when the 
        // transfer is complete, if the channel is in 
        // circular mode (CIRC=1). If this field is 
        // zero, no transfer can be served whatever 
        // the channel status (enabled or not). Note: 
        // this field is set and cleared by software. 
        // It must not be written when the channel is 
        // enabled (EN = 1). It is read-only when the 
        // channel is enabled (EN=1).
        readonly NDT = new Field<DMA_CNDTR4, true>(16, 0)        
    }

    // DMA channel x peripheral address 
    // register
    static readonly DMA_CPAR4 = new class DMA_CPAR4 extends Register<DMA_CPAR4>
    {
        constructor() { super(0x4002044c) }        

        // peripheral address It contains the base 
        // address of the peripheral data register 
        // from/to which the data will be read/written. 
        // When PSIZE[1:0]=01 (16 bits), bit 0 of 
        // PA[31:0] is ignored. Access is automatically 
        // aligned to a half-word address. When PSIZE=10 
        // (32 bits), bits 1 and 0 of PA[31:0] are 
        // ignored. Access is automatically aligned to a 
        // word address. In memory-to-memory mode, this 
        // register identifies the memory destination 
        // address if DIR=1 and the memory source 
        // address if DIR=0. In peripheral-to-peripheral 
        // mode, this register identifies the peripheral 
        // destination address DIR=1 and the peripheral 
        // source address if DIR=0. Note: this register 
        // is set and cleared by software. It must not 
        // be written when the channel is enabled (EN = 
        // 1). It is not read-only when the channel is 
        // enabled (EN=1).
        readonly PA = new Field<DMA_CPAR4, true>(32, 0)        
    }

    // DMA channel x memory address register
    static readonly DMA_CMAR4 = new class DMA_CMAR4 extends Register<DMA_CMAR4>
    {
        constructor() { super(0x40020450) }        

        // peripheral address It contains the base 
        // address of the memory from/to which the data 
        // will be read/written. When MSIZE[1:0]=01 (16 
        // bits), bit 0 of MA[31:0] is ignored. Access 
        // is automatically aligned to a half-word 
        // address. When MSIZE=10 (32 bits), bits 1 and 
        // 0 of MA[31:0] are ignored. Access is 
        // automatically aligned to a word address. In 
        // memory-to-memory mode, this register 
        // identifies the memory source address if DIR=1 
        // and the memory destination address if DIR=0. 
        // In peripheral-to-peripheral mode, this 
        // register identifies the peripheral source 
        // address DIR=1 and the peripheral destination 
        // address if DIR=0. Note: this register is set 
        // and cleared by software. It must not be 
        // written when the channel is enabled (EN = 1). 
        // It is not read-only when the channel is 
        // enabled (EN=1).
        readonly MA = new Field<DMA_CMAR4, true>(32, 0)        
    }

    // DMA channel 5 configuration register
    static readonly DMA_CCR5 = new class DMA_CCR5 extends Register<DMA_CCR5>
    {
        constructor() { super(0x40020458) }        

        // channel enable When a channel transfer 
        // error occurs, this bit is cleared by 
        // hardware. It can not be set again by 
        // software (channel x re-activated) until 
        // the TEIFx bit of the DMA_ISR register is 
        // cleared (by setting the CTEIFx bit of the 
        // DMA_IFCR register). Note: this bit is set 
        // and cleared by software.
        readonly EN      = new Field<DMA_CCR5, true>(1, 0)        

        // transfer complete interrupt enable Note: 
        // this bit is set and cleared by software. 
        // It must not be written when the channel is 
        // enabled (EN = 1). It is not read-only when 
        // the channel is enabled (EN=1).
        readonly TCIE    = new Field<DMA_CCR5, true>(1, 1)        

        // half transfer interrupt enable Note: this 
        // bit is set and cleared by software. It 
        // must not be written when the channel is 
        // enabled (EN = 1). It is not read-only when 
        // the channel is enabled (EN=1).
        readonly HTIE    = new Field<DMA_CCR5, true>(1, 2)        

        // transfer error interrupt enable Note: this 
        // bit is set and cleared by software. It 
        // must not be written when the channel is 
        // enabled (EN = 1). It is not read-only when 
        // the channel is enabled (EN=1).
        readonly TEIE    = new Field<DMA_CCR5, true>(1, 3)        

        // data transfer direction This bit must be 
        // set only in memory-to-peripheral and 
        // peripheral-to-memory modes. Source 
        // attributes are defined by PSIZE and PINC, 
        // plus the DMA_CPARx register. This is still 
        // valid in a memory-to-memory mode. 
        // Destination attributes are defined by 
        // MSIZE and MINC, plus the DMA_CMARx 
        // register. This is still valid in a 
        // peripheral-to-peripheral mode. Destination 
        // attributes are defined by PSIZE and PINC, 
        // plus the DMA_CPARx register. This is still 
        // valid in a memory-to-memory mode. Source 
        // attributes are defined by MSIZE and MINC, 
        // plus the DMA_CMARx register. This is still 
        // valid in a peripheral-to-peripheral mode. 
        // Note: this bit is set and cleared by 
        // software. It must not be written when the 
        // channel is enabled (EN = 1). It is 
        // read-only when the channel is enabled 
        // (EN=1).
        readonly DIR     = new Field<DMA_CCR5, true>(1, 4)        

        // circular mode Note: this bit is set and 
        // cleared by software. It must not be 
        // written when the channel is enabled (EN = 
        // 1). It is not read-only when the channel 
        // is enabled (EN=1).
        readonly CIRC    = new Field<DMA_CCR5, true>(1, 5)        

        // peripheral increment mode Defines the 
        // increment mode for each DMA transfer to 
        // the identified peripheral. n 
        // memory-to-memory mode, this field 
        // identifies the memory destination if DIR=1 
        // and the memory source if DIR=0. In 
        // peripheral-to-peripheral mode, this field 
        // identifies the peripheral destination if 
        // DIR=1 and the peripheral source if DIR=0. 
        // Note: this bit is set and cleared by 
        // software. It must not be written when the 
        // channel is enabled (EN = 1). It is 
        // read-only when the channel is enabled 
        // (EN=1).
        readonly PINC    = new Field<DMA_CCR5, true>(1, 6)        

        // memory increment mode Defines the 
        // increment mode for each DMA transfer to 
        // the identified memory. In memory-to-memory 
        // mode, this field identifies the memory 
        // source if DIR=1 and the memory destination 
        // if DIR=0. In peripheral-to-peripheral 
        // mode, this field identifies the peripheral 
        // source if DIR=1 and the peripheral 
        // destination if DIR=0. Note: this bit is 
        // set and cleared by software. It must not 
        // be written when the channel is enabled (EN 
        // = 1). It is read-only when the channel is 
        // enabled (EN=1).
        readonly MINC    = new Field<DMA_CCR5, true>(1, 7)        

        // peripheral size Defines the data size of 
        // each DMA transfer to the identified 
        // peripheral. In memory-to-memory mode, this 
        // field identifies the memory destination if 
        // DIR=1 and the memory source if DIR=0. In 
        // peripheral-to-peripheral mode, this field 
        // identifies the peripheral destination if 
        // DIR=1 and the peripheral source if DIR=0. 
        // Note: this field is set and cleared by 
        // software. It must not be written when the 
        // channel is enabled (EN = 1). It is 
        // read-only when the channel is enabled 
        // (EN=1).
        readonly PSIZE   = new Field<DMA_CCR5, true>(2, 8)        

        // memory size Defines the data size of each 
        // DMA transfer to the identified memory. In 
        // memory-to-memory mode, this field 
        // identifies the memory source if DIR=1 and 
        // the memory destination if DIR=0. In 
        // peripheral-to-peripheral mode, this field 
        // identifies the peripheral source if DIR=1 
        // and the peripheral destination if DIR=0. 
        // Note: this field is set and cleared by 
        // software. It must not be written when the 
        // channel is enabled (EN = 1). It is 
        // read-only when the channel is enabled 
        // (EN=1).
        readonly MSIZE   = new Field<DMA_CCR5, true>(2, 10)        

        // priority level Note: this field is set 
        // and cleared by software. It must not be 
        // written when the channel is enabled (EN = 
        // 1). It is read-only when the channel is 
        // enabled (EN=1).
        readonly PL      = new Field<DMA_CCR5, true>(2, 12)        

        // memory-to-memory mode Note: this bit is 
        // set and cleared by software. It must not 
        // be written when the channel is enabled 
        // (EN = 1). It is read-only when the 
        // channel is enabled (EN=1).
        readonly MEM2MEM = new Field<DMA_CCR5, true>(1, 14)        
    }

    // DMA channel x configuration register
    static readonly DMA_CNDTR5 = new class DMA_CNDTR5 extends Register<DMA_CNDTR5>
    {
        constructor() { super(0x4002045c) }        

        // number of data to transfer (0 to 216-1) 
        // This field is updated by hardware when the 
        // channel is enabled: It is decremented after 
        // each single DMA 'read followed by write' 
        // transfer, indicating the remaining amount 
        // of data items to transfer. It is kept at 
        // zero when the programmed amount of data to 
        // transfer is reached, if the channel is not 
        // in circular mode (CIRC=0 in the DMA_CCRx 
        // register). It is reloaded automatically by 
        // the previously programmed value, when the 
        // transfer is complete, if the channel is in 
        // circular mode (CIRC=1). If this field is 
        // zero, no transfer can be served whatever 
        // the channel status (enabled or not). Note: 
        // this field is set and cleared by software. 
        // It must not be written when the channel is 
        // enabled (EN = 1). It is read-only when the 
        // channel is enabled (EN=1).
        readonly NDT = new Field<DMA_CNDTR5, true>(16, 0)        
    }

    // DMA channel x peripheral address 
    // register
    static readonly DMA_CPAR5 = new class DMA_CPAR5 extends Register<DMA_CPAR5>
    {
        constructor() { super(0x40020460) }        

        // peripheral address It contains the base 
        // address of the peripheral data register 
        // from/to which the data will be read/written. 
        // When PSIZE[1:0]=01 (16 bits), bit 0 of 
        // PA[31:0] is ignored. Access is automatically 
        // aligned to a half-word address. When PSIZE=10 
        // (32 bits), bits 1 and 0 of PA[31:0] are 
        // ignored. Access is automatically aligned to a 
        // word address. In memory-to-memory mode, this 
        // register identifies the memory destination 
        // address if DIR=1 and the memory source 
        // address if DIR=0. In peripheral-to-peripheral 
        // mode, this register identifies the peripheral 
        // destination address DIR=1 and the peripheral 
        // source address if DIR=0. Note: this register 
        // is set and cleared by software. It must not 
        // be written when the channel is enabled (EN = 
        // 1). It is not read-only when the channel is 
        // enabled (EN=1).
        readonly PA = new Field<DMA_CPAR5, true>(32, 0)        
    }

    // DMA channel x memory address register
    static readonly DMA_CMAR5 = new class DMA_CMAR5 extends Register<DMA_CMAR5>
    {
        constructor() { super(0x40020464) }        

        // peripheral address It contains the base 
        // address of the memory from/to which the data 
        // will be read/written. When MSIZE[1:0]=01 (16 
        // bits), bit 0 of MA[31:0] is ignored. Access 
        // is automatically aligned to a half-word 
        // address. When MSIZE=10 (32 bits), bits 1 and 
        // 0 of MA[31:0] are ignored. Access is 
        // automatically aligned to a word address. In 
        // memory-to-memory mode, this register 
        // identifies the memory source address if DIR=1 
        // and the memory destination address if DIR=0. 
        // In peripheral-to-peripheral mode, this 
        // register identifies the peripheral source 
        // address DIR=1 and the peripheral destination 
        // address if DIR=0. Note: this register is set 
        // and cleared by software. It must not be 
        // written when the channel is enabled (EN = 1). 
        // It is not read-only when the channel is 
        // enabled (EN=1).
        readonly MA = new Field<DMA_CMAR5, true>(32, 0)        
    }

    // DMA channel 6 configuration register
    static readonly DMA_CCR6 = new class DMA_CCR6 extends Register<DMA_CCR6>
    {
        constructor() { super(0x4002046c) }        

        // channel enable When a channel transfer 
        // error occurs, this bit is cleared by 
        // hardware. It can not be set again by 
        // software (channel x re-activated) until 
        // the TEIFx bit of the DMA_ISR register is 
        // cleared (by setting the CTEIFx bit of the 
        // DMA_IFCR register). Note: this bit is set 
        // and cleared by software.
        readonly EN      = new Field<DMA_CCR6, true>(1, 0)        

        // transfer complete interrupt enable Note: 
        // this bit is set and cleared by software. 
        // It must not be written when the channel is 
        // enabled (EN = 1). It is not read-only when 
        // the channel is enabled (EN=1).
        readonly TCIE    = new Field<DMA_CCR6, true>(1, 1)        

        // half transfer interrupt enable Note: this 
        // bit is set and cleared by software. It 
        // must not be written when the channel is 
        // enabled (EN = 1). It is not read-only when 
        // the channel is enabled (EN=1).
        readonly HTIE    = new Field<DMA_CCR6, true>(1, 2)        

        // transfer error interrupt enable Note: this 
        // bit is set and cleared by software. It 
        // must not be written when the channel is 
        // enabled (EN = 1). It is not read-only when 
        // the channel is enabled (EN=1).
        readonly TEIE    = new Field<DMA_CCR6, true>(1, 3)        

        // data transfer direction This bit must be 
        // set only in memory-to-peripheral and 
        // peripheral-to-memory modes. Source 
        // attributes are defined by PSIZE and PINC, 
        // plus the DMA_CPARx register. This is still 
        // valid in a memory-to-memory mode. 
        // Destination attributes are defined by 
        // MSIZE and MINC, plus the DMA_CMARx 
        // register. This is still valid in a 
        // peripheral-to-peripheral mode. Destination 
        // attributes are defined by PSIZE and PINC, 
        // plus the DMA_CPARx register. This is still 
        // valid in a memory-to-memory mode. Source 
        // attributes are defined by MSIZE and MINC, 
        // plus the DMA_CMARx register. This is still 
        // valid in a peripheral-to-peripheral mode. 
        // Note: this bit is set and cleared by 
        // software. It must not be written when the 
        // channel is enabled (EN = 1). It is 
        // read-only when the channel is enabled 
        // (EN=1).
        readonly DIR     = new Field<DMA_CCR6, true>(1, 4)        

        // circular mode Note: this bit is set and 
        // cleared by software. It must not be 
        // written when the channel is enabled (EN = 
        // 1). It is not read-only when the channel 
        // is enabled (EN=1).
        readonly CIRC    = new Field<DMA_CCR6, true>(1, 5)        

        // peripheral increment mode Defines the 
        // increment mode for each DMA transfer to 
        // the identified peripheral. n 
        // memory-to-memory mode, this field 
        // identifies the memory destination if DIR=1 
        // and the memory source if DIR=0. In 
        // peripheral-to-peripheral mode, this field 
        // identifies the peripheral destination if 
        // DIR=1 and the peripheral source if DIR=0. 
        // Note: this bit is set and cleared by 
        // software. It must not be written when the 
        // channel is enabled (EN = 1). It is 
        // read-only when the channel is enabled 
        // (EN=1).
        readonly PINC    = new Field<DMA_CCR6, true>(1, 6)        

        // memory increment mode Defines the 
        // increment mode for each DMA transfer to 
        // the identified memory. In memory-to-memory 
        // mode, this field identifies the memory 
        // source if DIR=1 and the memory destination 
        // if DIR=0. In peripheral-to-peripheral 
        // mode, this field identifies the peripheral 
        // source if DIR=1 and the peripheral 
        // destination if DIR=0. Note: this bit is 
        // set and cleared by software. It must not 
        // be written when the channel is enabled (EN 
        // = 1). It is read-only when the channel is 
        // enabled (EN=1).
        readonly MINC    = new Field<DMA_CCR6, true>(1, 7)        

        // peripheral size Defines the data size of 
        // each DMA transfer to the identified 
        // peripheral. In memory-to-memory mode, this 
        // field identifies the memory destination if 
        // DIR=1 and the memory source if DIR=0. In 
        // peripheral-to-peripheral mode, this field 
        // identifies the peripheral destination if 
        // DIR=1 and the peripheral source if DIR=0. 
        // Note: this field is set and cleared by 
        // software. It must not be written when the 
        // channel is enabled (EN = 1). It is 
        // read-only when the channel is enabled 
        // (EN=1).
        readonly PSIZE   = new Field<DMA_CCR6, true>(2, 8)        

        // memory size Defines the data size of each 
        // DMA transfer to the identified memory. In 
        // memory-to-memory mode, this field 
        // identifies the memory source if DIR=1 and 
        // the memory destination if DIR=0. In 
        // peripheral-to-peripheral mode, this field 
        // identifies the peripheral source if DIR=1 
        // and the peripheral destination if DIR=0. 
        // Note: this field is set and cleared by 
        // software. It must not be written when the 
        // channel is enabled (EN = 1). It is 
        // read-only when the channel is enabled 
        // (EN=1).
        readonly MSIZE   = new Field<DMA_CCR6, true>(2, 10)        

        // priority level Note: this field is set 
        // and cleared by software. It must not be 
        // written when the channel is enabled (EN = 
        // 1). It is read-only when the channel is 
        // enabled (EN=1).
        readonly PL      = new Field<DMA_CCR6, true>(2, 12)        

        // memory-to-memory mode Note: this bit is 
        // set and cleared by software. It must not 
        // be written when the channel is enabled 
        // (EN = 1). It is read-only when the 
        // channel is enabled (EN=1).
        readonly MEM2MEM = new Field<DMA_CCR6, true>(1, 14)        
    }

    // DMA channel x configuration register
    static readonly DMA_CNDTR6 = new class DMA_CNDTR6 extends Register<DMA_CNDTR6>
    {
        constructor() { super(0x40020470) }        

        // number of data to transfer (0 to 216-1) 
        // This field is updated by hardware when the 
        // channel is enabled: It is decremented after 
        // each single DMA 'read followed by write' 
        // transfer, indicating the remaining amount 
        // of data items to transfer. It is kept at 
        // zero when the programmed amount of data to 
        // transfer is reached, if the channel is not 
        // in circular mode (CIRC=0 in the DMA_CCRx 
        // register). It is reloaded automatically by 
        // the previously programmed value, when the 
        // transfer is complete, if the channel is in 
        // circular mode (CIRC=1). If this field is 
        // zero, no transfer can be served whatever 
        // the channel status (enabled or not). Note: 
        // this field is set and cleared by software. 
        // It must not be written when the channel is 
        // enabled (EN = 1). It is read-only when the 
        // channel is enabled (EN=1).
        readonly NDT = new Field<DMA_CNDTR6, true>(16, 0)        
    }

    // DMA channel x peripheral address 
    // register
    static readonly DMA_CPAR6 = new class DMA_CPAR6 extends Register<DMA_CPAR6>
    {
        constructor() { super(0x40020474) }        

        // peripheral address It contains the base 
        // address of the peripheral data register 
        // from/to which the data will be read/written. 
        // When PSIZE[1:0]=01 (16 bits), bit 0 of 
        // PA[31:0] is ignored. Access is automatically 
        // aligned to a half-word address. When PSIZE=10 
        // (32 bits), bits 1 and 0 of PA[31:0] are 
        // ignored. Access is automatically aligned to a 
        // word address. In memory-to-memory mode, this 
        // register identifies the memory destination 
        // address if DIR=1 and the memory source 
        // address if DIR=0. In peripheral-to-peripheral 
        // mode, this register identifies the peripheral 
        // destination address DIR=1 and the peripheral 
        // source address if DIR=0. Note: this register 
        // is set and cleared by software. It must not 
        // be written when the channel is enabled (EN = 
        // 1). It is not read-only when the channel is 
        // enabled (EN=1).
        readonly PA = new Field<DMA_CPAR6, true>(32, 0)        
    }

    // DMA channel x memory address register
    static readonly DMA_CMAR6 = new class DMA_CMAR6 extends Register<DMA_CMAR6>
    {
        constructor() { super(0x40020478) }        

        // peripheral address It contains the base 
        // address of the memory from/to which the data 
        // will be read/written. When MSIZE[1:0]=01 (16 
        // bits), bit 0 of MA[31:0] is ignored. Access 
        // is automatically aligned to a half-word 
        // address. When MSIZE=10 (32 bits), bits 1 and 
        // 0 of MA[31:0] are ignored. Access is 
        // automatically aligned to a word address. In 
        // memory-to-memory mode, this register 
        // identifies the memory source address if DIR=1 
        // and the memory destination address if DIR=0. 
        // In peripheral-to-peripheral mode, this 
        // register identifies the peripheral source 
        // address DIR=1 and the peripheral destination 
        // address if DIR=0. Note: this register is set 
        // and cleared by software. It must not be 
        // written when the channel is enabled (EN = 1). 
        // It is not read-only when the channel is 
        // enabled (EN=1).
        readonly MA = new Field<DMA_CMAR6, true>(32, 0)        
    }

    // DMA channel 7 configuration register
    static readonly DMA_CCR7 = new class DMA_CCR7 extends Register<DMA_CCR7>
    {
        constructor() { super(0x40020480) }        

        // channel enable When a channel transfer 
        // error occurs, this bit is cleared by 
        // hardware. It can not be set again by 
        // software (channel x re-activated) until 
        // the TEIFx bit of the DMA_ISR register is 
        // cleared (by setting the CTEIFx bit of the 
        // DMA_IFCR register). Note: this bit is set 
        // and cleared by software.
        readonly EN      = new Field<DMA_CCR7, true>(1, 0)        

        // transfer complete interrupt enable Note: 
        // this bit is set and cleared by software. 
        // It must not be written when the channel is 
        // enabled (EN = 1). It is not read-only when 
        // the channel is enabled (EN=1).
        readonly TCIE    = new Field<DMA_CCR7, true>(1, 1)        

        // half transfer interrupt enable Note: this 
        // bit is set and cleared by software. It 
        // must not be written when the channel is 
        // enabled (EN = 1). It is not read-only when 
        // the channel is enabled (EN=1).
        readonly HTIE    = new Field<DMA_CCR7, true>(1, 2)        

        // transfer error interrupt enable Note: this 
        // bit is set and cleared by software. It 
        // must not be written when the channel is 
        // enabled (EN = 1). It is not read-only when 
        // the channel is enabled (EN=1).
        readonly TEIE    = new Field<DMA_CCR7, true>(1, 3)        

        // data transfer direction This bit must be 
        // set only in memory-to-peripheral and 
        // peripheral-to-memory modes. Source 
        // attributes are defined by PSIZE and PINC, 
        // plus the DMA_CPARx register. This is still 
        // valid in a memory-to-memory mode. 
        // Destination attributes are defined by 
        // MSIZE and MINC, plus the DMA_CMARx 
        // register. This is still valid in a 
        // peripheral-to-peripheral mode. Destination 
        // attributes are defined by PSIZE and PINC, 
        // plus the DMA_CPARx register. This is still 
        // valid in a memory-to-memory mode. Source 
        // attributes are defined by MSIZE and MINC, 
        // plus the DMA_CMARx register. This is still 
        // valid in a peripheral-to-peripheral mode. 
        // Note: this bit is set and cleared by 
        // software. It must not be written when the 
        // channel is enabled (EN = 1). It is 
        // read-only when the channel is enabled 
        // (EN=1).
        readonly DIR     = new Field<DMA_CCR7, true>(1, 4)        

        // circular mode Note: this bit is set and 
        // cleared by software. It must not be 
        // written when the channel is enabled (EN = 
        // 1). It is not read-only when the channel 
        // is enabled (EN=1).
        readonly CIRC    = new Field<DMA_CCR7, true>(1, 5)        

        // peripheral increment mode Defines the 
        // increment mode for each DMA transfer to 
        // the identified peripheral. n 
        // memory-to-memory mode, this field 
        // identifies the memory destination if DIR=1 
        // and the memory source if DIR=0. In 
        // peripheral-to-peripheral mode, this field 
        // identifies the peripheral destination if 
        // DIR=1 and the peripheral source if DIR=0. 
        // Note: this bit is set and cleared by 
        // software. It must not be written when the 
        // channel is enabled (EN = 1). It is 
        // read-only when the channel is enabled 
        // (EN=1).
        readonly PINC    = new Field<DMA_CCR7, true>(1, 6)        

        // memory increment mode Defines the 
        // increment mode for each DMA transfer to 
        // the identified memory. In memory-to-memory 
        // mode, this field identifies the memory 
        // source if DIR=1 and the memory destination 
        // if DIR=0. In peripheral-to-peripheral 
        // mode, this field identifies the peripheral 
        // source if DIR=1 and the peripheral 
        // destination if DIR=0. Note: this bit is 
        // set and cleared by software. It must not 
        // be written when the channel is enabled (EN 
        // = 1). It is read-only when the channel is 
        // enabled (EN=1).
        readonly MINC    = new Field<DMA_CCR7, true>(1, 7)        

        // peripheral size Defines the data size of 
        // each DMA transfer to the identified 
        // peripheral. In memory-to-memory mode, this 
        // field identifies the memory destination if 
        // DIR=1 and the memory source if DIR=0. In 
        // peripheral-to-peripheral mode, this field 
        // identifies the peripheral destination if 
        // DIR=1 and the peripheral source if DIR=0. 
        // Note: this field is set and cleared by 
        // software. It must not be written when the 
        // channel is enabled (EN = 1). It is 
        // read-only when the channel is enabled 
        // (EN=1).
        readonly PSIZE   = new Field<DMA_CCR7, true>(2, 8)        

        // memory size Defines the data size of each 
        // DMA transfer to the identified memory. In 
        // memory-to-memory mode, this field 
        // identifies the memory source if DIR=1 and 
        // the memory destination if DIR=0. In 
        // peripheral-to-peripheral mode, this field 
        // identifies the peripheral source if DIR=1 
        // and the peripheral destination if DIR=0. 
        // Note: this field is set and cleared by 
        // software. It must not be written when the 
        // channel is enabled (EN = 1). It is 
        // read-only when the channel is enabled 
        // (EN=1).
        readonly MSIZE   = new Field<DMA_CCR7, true>(2, 10)        

        // priority level Note: this field is set 
        // and cleared by software. It must not be 
        // written when the channel is enabled (EN = 
        // 1). It is read-only when the channel is 
        // enabled (EN=1).
        readonly PL      = new Field<DMA_CCR7, true>(2, 12)        

        // memory-to-memory mode Note: this bit is 
        // set and cleared by software. It must not 
        // be written when the channel is enabled 
        // (EN = 1). It is read-only when the 
        // channel is enabled (EN=1).
        readonly MEM2MEM = new Field<DMA_CCR7, true>(1, 14)        
    }

    // DMA channel x configuration register
    static readonly DMA_CNDTR7 = new class DMA_CNDTR7 extends Register<DMA_CNDTR7>
    {
        constructor() { super(0x40020484) }        

        // number of data to transfer (0 to 216-1) 
        // This field is updated by hardware when the 
        // channel is enabled: It is decremented after 
        // each single DMA 'read followed by write' 
        // transfer, indicating the remaining amount 
        // of data items to transfer. It is kept at 
        // zero when the programmed amount of data to 
        // transfer is reached, if the channel is not 
        // in circular mode (CIRC=0 in the DMA_CCRx 
        // register). It is reloaded automatically by 
        // the previously programmed value, when the 
        // transfer is complete, if the channel is in 
        // circular mode (CIRC=1). If this field is 
        // zero, no transfer can be served whatever 
        // the channel status (enabled or not). Note: 
        // this field is set and cleared by software. 
        // It must not be written when the channel is 
        // enabled (EN = 1). It is read-only when the 
        // channel is enabled (EN=1).
        readonly NDT = new Field<DMA_CNDTR7, true>(16, 0)        
    }

    // DMA channel x peripheral address 
    // register
    static readonly DMA_CPAR7 = new class DMA_CPAR7 extends Register<DMA_CPAR7>
    {
        constructor() { super(0x40020488) }        

        // peripheral address It contains the base 
        // address of the peripheral data register 
        // from/to which the data will be read/written. 
        // When PSIZE[1:0]=01 (16 bits), bit 0 of 
        // PA[31:0] is ignored. Access is automatically 
        // aligned to a half-word address. When PSIZE=10 
        // (32 bits), bits 1 and 0 of PA[31:0] are 
        // ignored. Access is automatically aligned to a 
        // word address. In memory-to-memory mode, this 
        // register identifies the memory destination 
        // address if DIR=1 and the memory source 
        // address if DIR=0. In peripheral-to-peripheral 
        // mode, this register identifies the peripheral 
        // destination address DIR=1 and the peripheral 
        // source address if DIR=0. Note: this register 
        // is set and cleared by software. It must not 
        // be written when the channel is enabled (EN = 
        // 1). It is not read-only when the channel is 
        // enabled (EN=1).
        readonly PA = new Field<DMA_CPAR7, true>(32, 0)        
    }

    // DMA channel x memory address register
    static readonly DMA_CMAR7 = new class DMA_CMAR7 extends Register<DMA_CMAR7>
    {
        constructor() { super(0x4002048c) }        

        // peripheral address It contains the base 
        // address of the memory from/to which the data 
        // will be read/written. When MSIZE[1:0]=01 (16 
        // bits), bit 0 of MA[31:0] is ignored. Access 
        // is automatically aligned to a half-word 
        // address. When MSIZE=10 (32 bits), bits 1 and 
        // 0 of MA[31:0] are ignored. Access is 
        // automatically aligned to a word address. In 
        // memory-to-memory mode, this register 
        // identifies the memory source address if DIR=1 
        // and the memory destination address if DIR=0. 
        // In peripheral-to-peripheral mode, this 
        // register identifies the peripheral source 
        // address DIR=1 and the peripheral destination 
        // address if DIR=0. Note: this register is set 
        // and cleared by software. It must not be 
        // written when the channel is enabled (EN = 1). 
        // It is not read-only when the channel is 
        // enabled (EN=1).
        readonly MA = new Field<DMA_CMAR7, true>(32, 0)        
    }
}

export class DMAMUX
{
    // DMAMux - DMA request line multiplexer 
    // channel x control register
    static readonly C0CR = new class C0CR extends Register<C0CR>
    {
        constructor() { super(0x40020800) }        

        // Input DMA request line selected
        readonly DMAREQ_ID = new Field<C0CR, true>(8, 0)        

        // Interrupt enable at synchronization event 
        // overrun
        readonly SOIE      = new Field<C0CR, true>(1, 8)        

        // Event generation enable/disable
        readonly EGE       = new Field<C0CR, true>(1, 9)        

        // Synchronous operating mode enable/disable
        readonly SE        = new Field<C0CR, true>(1, 16)        

        // Synchronization event type selector Defines 
        // the synchronization event on the selected 
        // synchronization input:
        readonly SPOL      = new Field<C0CR, true>(2, 17)        

        // Number of DMA requests to forward Defines 
        // the number of DMA requests forwarded before 
        // output event is generated. In synchronous 
        // mode, it also defines the number of DMA 
        // requests to forward after a synchronization 
        // event, then stop forwarding. The actual 
        // number of DMA requests forwarded is 
        // NBREQ+1. Note: This field can only be 
        // written when both SE and EGE bits are 
        // reset.
        readonly NBREQ     = new Field<C0CR, true>(5, 19)        

        // Synchronization input selected
        readonly SYNC_ID   = new Field<C0CR, true>(5, 24)        
    }

    // DMAMux - DMA request line multiplexer 
    // channel x control register
    static readonly C1CR = new class C1CR extends Register<C1CR>
    {
        constructor() { super(0x40020804) }        

        // Input DMA request line selected
        readonly DMAREQ_ID = new Field<C1CR, true>(8, 0)        

        // Interrupt enable at synchronization event 
        // overrun
        readonly SOIE      = new Field<C1CR, true>(1, 8)        

        // Event generation enable/disable
        readonly EGE       = new Field<C1CR, true>(1, 9)        

        // Synchronous operating mode enable/disable
        readonly SE        = new Field<C1CR, true>(1, 16)        

        // Synchronization event type selector Defines 
        // the synchronization event on the selected 
        // synchronization input:
        readonly SPOL      = new Field<C1CR, true>(2, 17)        

        // Number of DMA requests to forward Defines 
        // the number of DMA requests forwarded before 
        // output event is generated. In synchronous 
        // mode, it also defines the number of DMA 
        // requests to forward after a synchronization 
        // event, then stop forwarding. The actual 
        // number of DMA requests forwarded is 
        // NBREQ+1. Note: This field can only be 
        // written when both SE and EGE bits are 
        // reset.
        readonly NBREQ     = new Field<C1CR, true>(5, 19)        

        // Synchronization input selected
        readonly SYNC_ID   = new Field<C1CR, true>(5, 24)        
    }

    // DMAMux - DMA request line multiplexer 
    // channel x control register
    static readonly C2CR = new class C2CR extends Register<C2CR>
    {
        constructor() { super(0x40020808) }        

        // Input DMA request line selected
        readonly DMAREQ_ID = new Field<C2CR, true>(8, 0)        

        // Interrupt enable at synchronization event 
        // overrun
        readonly SOIE      = new Field<C2CR, true>(1, 8)        

        // Event generation enable/disable
        readonly EGE       = new Field<C2CR, true>(1, 9)        

        // Synchronous operating mode enable/disable
        readonly SE        = new Field<C2CR, true>(1, 16)        

        // Synchronization event type selector Defines 
        // the synchronization event on the selected 
        // synchronization input:
        readonly SPOL      = new Field<C2CR, true>(2, 17)        

        // Number of DMA requests to forward Defines 
        // the number of DMA requests forwarded before 
        // output event is generated. In synchronous 
        // mode, it also defines the number of DMA 
        // requests to forward after a synchronization 
        // event, then stop forwarding. The actual 
        // number of DMA requests forwarded is 
        // NBREQ+1. Note: This field can only be 
        // written when both SE and EGE bits are 
        // reset.
        readonly NBREQ     = new Field<C2CR, true>(5, 19)        

        // Synchronization input selected
        readonly SYNC_ID   = new Field<C2CR, true>(5, 24)        
    }

    // DMAMux - DMA request line multiplexer 
    // channel x control register
    static readonly C3CR = new class C3CR extends Register<C3CR>
    {
        constructor() { super(0x4002080c) }        

        // Input DMA request line selected
        readonly DMAREQ_ID = new Field<C3CR, true>(8, 0)        

        // Interrupt enable at synchronization event 
        // overrun
        readonly SOIE      = new Field<C3CR, true>(1, 8)        

        // Event generation enable/disable
        readonly EGE       = new Field<C3CR, true>(1, 9)        

        // Synchronous operating mode enable/disable
        readonly SE        = new Field<C3CR, true>(1, 16)        

        // Synchronization event type selector Defines 
        // the synchronization event on the selected 
        // synchronization input:
        readonly SPOL      = new Field<C3CR, true>(2, 17)        

        // Number of DMA requests to forward Defines 
        // the number of DMA requests forwarded before 
        // output event is generated. In synchronous 
        // mode, it also defines the number of DMA 
        // requests to forward after a synchronization 
        // event, then stop forwarding. The actual 
        // number of DMA requests forwarded is 
        // NBREQ+1. Note: This field can only be 
        // written when both SE and EGE bits are 
        // reset.
        readonly NBREQ     = new Field<C3CR, true>(5, 19)        

        // Synchronization input selected
        readonly SYNC_ID   = new Field<C3CR, true>(5, 24)        
    }

    // DMAMux - DMA request line multiplexer 
    // channel x control register
    static readonly C4CR = new class C4CR extends Register<C4CR>
    {
        constructor() { super(0x40020810) }        

        // Input DMA request line selected
        readonly DMAREQ_ID = new Field<C4CR, true>(8, 0)        

        // Interrupt enable at synchronization event 
        // overrun
        readonly SOIE      = new Field<C4CR, true>(1, 8)        

        // Event generation enable/disable
        readonly EGE       = new Field<C4CR, true>(1, 9)        

        // Synchronous operating mode enable/disable
        readonly SE        = new Field<C4CR, true>(1, 16)        

        // Synchronization event type selector Defines 
        // the synchronization event on the selected 
        // synchronization input:
        readonly SPOL      = new Field<C4CR, true>(2, 17)        

        // Number of DMA requests to forward Defines 
        // the number of DMA requests forwarded before 
        // output event is generated. In synchronous 
        // mode, it also defines the number of DMA 
        // requests to forward after a synchronization 
        // event, then stop forwarding. The actual 
        // number of DMA requests forwarded is 
        // NBREQ+1. Note: This field can only be 
        // written when both SE and EGE bits are 
        // reset.
        readonly NBREQ     = new Field<C4CR, true>(5, 19)        

        // Synchronization input selected
        readonly SYNC_ID   = new Field<C4CR, true>(5, 24)        
    }

    // DMAMux - DMA request line multiplexer 
    // channel x control register
    static readonly C5CR = new class C5CR extends Register<C5CR>
    {
        constructor() { super(0x40020814) }        

        // Input DMA request line selected
        readonly DMAREQ_ID = new Field<C5CR, true>(8, 0)        

        // Interrupt enable at synchronization event 
        // overrun
        readonly SOIE      = new Field<C5CR, true>(1, 8)        

        // Event generation enable/disable
        readonly EGE       = new Field<C5CR, true>(1, 9)        

        // Synchronous operating mode enable/disable
        readonly SE        = new Field<C5CR, true>(1, 16)        

        // Synchronization event type selector Defines 
        // the synchronization event on the selected 
        // synchronization input:
        readonly SPOL      = new Field<C5CR, true>(2, 17)        

        // Number of DMA requests to forward Defines 
        // the number of DMA requests forwarded before 
        // output event is generated. In synchronous 
        // mode, it also defines the number of DMA 
        // requests to forward after a synchronization 
        // event, then stop forwarding. The actual 
        // number of DMA requests forwarded is 
        // NBREQ+1. Note: This field can only be 
        // written when both SE and EGE bits are 
        // reset.
        readonly NBREQ     = new Field<C5CR, true>(5, 19)        

        // Synchronization input selected
        readonly SYNC_ID   = new Field<C5CR, true>(5, 24)        
    }

    // DMAMux - DMA request line multiplexer 
    // channel x control register
    static readonly C6CR = new class C6CR extends Register<C6CR>
    {
        constructor() { super(0x40020818) }        

        // Input DMA request line selected
        readonly DMAREQ_ID = new Field<C6CR, true>(8, 0)        

        // Interrupt enable at synchronization event 
        // overrun
        readonly SOIE      = new Field<C6CR, true>(1, 8)        

        // Event generation enable/disable
        readonly EGE       = new Field<C6CR, true>(1, 9)        

        // Synchronous operating mode enable/disable
        readonly SE        = new Field<C6CR, true>(1, 16)        

        // Synchronization event type selector Defines 
        // the synchronization event on the selected 
        // synchronization input:
        readonly SPOL      = new Field<C6CR, true>(2, 17)        

        // Number of DMA requests to forward Defines 
        // the number of DMA requests forwarded before 
        // output event is generated. In synchronous 
        // mode, it also defines the number of DMA 
        // requests to forward after a synchronization 
        // event, then stop forwarding. The actual 
        // number of DMA requests forwarded is 
        // NBREQ+1. Note: This field can only be 
        // written when both SE and EGE bits are 
        // reset.
        readonly NBREQ     = new Field<C6CR, true>(5, 19)        

        // Synchronization input selected
        readonly SYNC_ID   = new Field<C6CR, true>(5, 24)        
    }

    // DMAMux - DMA request generator channel x 
    // control register
    static readonly RG0CR = new class RG0CR extends Register<RG0CR>
    {
        constructor() { super(0x40020900) }        

        // DMA request trigger input selected
        readonly SIG_ID = new Field<RG0CR, true>(5, 0)        

        // Interrupt enable at trigger event overrun
        readonly OIE    = new Field<RG0CR, true>(1, 8)        

        // DMA request generator channel enable/disable
        readonly GE     = new Field<RG0CR, true>(1, 16)        

        // DMA request generator trigger event type 
        // selection Defines the trigger event on the 
        // selected DMA request trigger input
        readonly GPOL   = new Field<RG0CR, true>(2, 17)        

        // Number of DMA requests to generate Defines 
        // the number of DMA requests generated after a 
        // trigger event, then stop generating. The 
        // actual number of generated DMA requests is 
        // GNBREQ+1. Note: This field can only be 
        // written when GE bit is reset.
        readonly GNBREQ = new Field<RG0CR, true>(5, 19)        
    }

    // DMAMux - DMA request generator channel x 
    // control register
    static readonly RG1CR = new class RG1CR extends Register<RG1CR>
    {
        constructor() { super(0x40020904) }        

        // DMA request trigger input selected
        readonly SIG_ID = new Field<RG1CR, true>(5, 0)        

        // Interrupt enable at trigger event overrun
        readonly OIE    = new Field<RG1CR, true>(1, 8)        

        // DMA request generator channel enable/disable
        readonly GE     = new Field<RG1CR, true>(1, 16)        

        // DMA request generator trigger event type 
        // selection Defines the trigger event on the 
        // selected DMA request trigger input
        readonly GPOL   = new Field<RG1CR, true>(2, 17)        

        // Number of DMA requests to generate Defines 
        // the number of DMA requests generated after a 
        // trigger event, then stop generating. The 
        // actual number of generated DMA requests is 
        // GNBREQ+1. Note: This field can only be 
        // written when GE bit is reset.
        readonly GNBREQ = new Field<RG1CR, true>(5, 19)        
    }

    // DMAMux - DMA request generator channel x 
    // control register
    static readonly RG2CR = new class RG2CR extends Register<RG2CR>
    {
        constructor() { super(0x40020908) }        

        // DMA request trigger input selected
        readonly SIG_ID = new Field<RG2CR, true>(5, 0)        

        // Interrupt enable at trigger event overrun
        readonly OIE    = new Field<RG2CR, true>(1, 8)        

        // DMA request generator channel enable/disable
        readonly GE     = new Field<RG2CR, true>(1, 16)        

        // DMA request generator trigger event type 
        // selection Defines the trigger event on the 
        // selected DMA request trigger input
        readonly GPOL   = new Field<RG2CR, true>(2, 17)        

        // Number of DMA requests to generate Defines 
        // the number of DMA requests generated after a 
        // trigger event, then stop generating. The 
        // actual number of generated DMA requests is 
        // GNBREQ+1. Note: This field can only be 
        // written when GE bit is reset.
        readonly GNBREQ = new Field<RG2CR, true>(5, 19)        
    }

    // DMAMux - DMA request generator channel x 
    // control register
    static readonly RG3CR = new class RG3CR extends Register<RG3CR>
    {
        constructor() { super(0x4002090c) }        

        // DMA request trigger input selected
        readonly SIG_ID = new Field<RG3CR, true>(5, 0)        

        // Interrupt enable at trigger event overrun
        readonly OIE    = new Field<RG3CR, true>(1, 8)        

        // DMA request generator channel enable/disable
        readonly GE     = new Field<RG3CR, true>(1, 16)        

        // DMA request generator trigger event type 
        // selection Defines the trigger event on the 
        // selected DMA request trigger input
        readonly GPOL   = new Field<RG3CR, true>(2, 17)        

        // Number of DMA requests to generate Defines 
        // the number of DMA requests generated after a 
        // trigger event, then stop generating. The 
        // actual number of generated DMA requests is 
        // GNBREQ+1. Note: This field can only be 
        // written when GE bit is reset.
        readonly GNBREQ = new Field<RG3CR, true>(5, 19)        
    }

    // DMAMux - DMA request generator status 
    // register
    static readonly RGSR = new class RGSR extends Register<RGSR>
    {
        constructor() { super(0x40020940) }        

        // Trigger event overrun flag The flag is set when a 
        // trigger event occurs on DMA request generator 
        // channel x, while the DMA request generator counter 
        // value is lower than GNBREQ. The flag is cleared by 
        // writing 1 to the corresponding COFx bit in 
        // DMAMUX_RGCFR register.
        readonly OF = new Field<RGSR, false>(4, 0)        
    }

    // DMAMux - DMA request generator clear 
    // flag register
    static readonly RGCFR = new class RGCFR extends Register<RGCFR>
    {
        constructor() { super(0x40020944) }        

        // Clear trigger event overrun flag Upon setting, 
        // this bit clears the corresponding overrun flag 
        // OFx in the DMAMUX_RGCSR register.
        readonly COF = new Field<RGCFR, true>(4, 0)        
    }
}

export class GPIOA
{
    // GPIO port mode register
    static readonly MODER = new class MODER extends Register<MODER>
    {
        constructor() { super(0x50000000) }        

        // Port x configuration bits (y = 0..15)
        readonly MODER15 = new Field<MODER, true>(2, 30)        

        // Port x configuration bits (y = 0..15)
        readonly MODER14 = new Field<MODER, true>(2, 28)        

        // Port x configuration bits (y = 0..15)
        readonly MODER13 = new Field<MODER, true>(2, 26)        

        // Port x configuration bits (y = 0..15)
        readonly MODER12 = new Field<MODER, true>(2, 24)        

        // Port x configuration bits (y = 0..15)
        readonly MODER11 = new Field<MODER, true>(2, 22)        

        // Port x configuration bits (y = 0..15)
        readonly MODER10 = new Field<MODER, true>(2, 20)        

        // Port x configuration bits (y = 0..15)
        readonly MODER9  = new Field<MODER, true>(2, 18)        

        // Port x configuration bits (y = 0..15)
        readonly MODER8  = new Field<MODER, true>(2, 16)        

        // Port x configuration bits (y = 0..15)
        readonly MODER7  = new Field<MODER, true>(2, 14)        

        // Port x configuration bits (y = 0..15)
        readonly MODER6  = new Field<MODER, true>(2, 12)        

        // Port x configuration bits (y = 0..15)
        readonly MODER5  = new Field<MODER, true>(2, 10)        

        // Port x configuration bits (y = 0..15)
        readonly MODER4  = new Field<MODER, true>(2, 8)        

        // Port x configuration bits (y = 0..15)
        readonly MODER3  = new Field<MODER, true>(2, 6)        

        // Port x configuration bits (y = 0..15)
        readonly MODER2  = new Field<MODER, true>(2, 4)        

        // Port x configuration bits (y = 0..15)
        readonly MODER1  = new Field<MODER, true>(2, 2)        

        // Port x configuration bits (y = 0..15)
        readonly MODER0  = new Field<MODER, true>(2, 0)        
    }

    // GPIO port output type register
    static readonly OTYPER = new class OTYPER extends Register<OTYPER>
    {
        constructor() { super(0x50000004) }        

        // Port x configuration bits (y = 0..15)
        readonly OT15 = new Field<OTYPER, true>(1, 15)        

        // Port x configuration bits (y = 0..15)
        readonly OT14 = new Field<OTYPER, true>(1, 14)        

        // Port x configuration bits (y = 0..15)
        readonly OT13 = new Field<OTYPER, true>(1, 13)        

        // Port x configuration bits (y = 0..15)
        readonly OT12 = new Field<OTYPER, true>(1, 12)        

        // Port x configuration bits (y = 0..15)
        readonly OT11 = new Field<OTYPER, true>(1, 11)        

        // Port x configuration bits (y = 0..15)
        readonly OT10 = new Field<OTYPER, true>(1, 10)        

        // Port x configuration bits (y = 0..15)
        readonly OT9  = new Field<OTYPER, true>(1, 9)        

        // Port x configuration bits (y = 0..15)
        readonly OT8  = new Field<OTYPER, true>(1, 8)        

        // Port x configuration bits (y = 0..15)
        readonly OT7  = new Field<OTYPER, true>(1, 7)        

        // Port x configuration bits (y = 0..15)
        readonly OT6  = new Field<OTYPER, true>(1, 6)        

        // Port x configuration bits (y = 0..15)
        readonly OT5  = new Field<OTYPER, true>(1, 5)        

        // Port x configuration bits (y = 0..15)
        readonly OT4  = new Field<OTYPER, true>(1, 4)        

        // Port x configuration bits (y = 0..15)
        readonly OT3  = new Field<OTYPER, true>(1, 3)        

        // Port x configuration bits (y = 0..15)
        readonly OT2  = new Field<OTYPER, true>(1, 2)        

        // Port x configuration bits (y = 0..15)
        readonly OT1  = new Field<OTYPER, true>(1, 1)        

        // Port x configuration bits (y = 0..15)
        readonly OT0  = new Field<OTYPER, true>(1, 0)        
    }

    // GPIO port output speed register
    static readonly OSPEEDR = new class OSPEEDR extends Register<OSPEEDR>
    {
        constructor() { super(0x50000008) }        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR15 = new Field<OSPEEDR, true>(2, 30)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR14 = new Field<OSPEEDR, true>(2, 28)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR13 = new Field<OSPEEDR, true>(2, 26)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR12 = new Field<OSPEEDR, true>(2, 24)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR11 = new Field<OSPEEDR, true>(2, 22)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR10 = new Field<OSPEEDR, true>(2, 20)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR9  = new Field<OSPEEDR, true>(2, 18)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR8  = new Field<OSPEEDR, true>(2, 16)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR7  = new Field<OSPEEDR, true>(2, 14)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR6  = new Field<OSPEEDR, true>(2, 12)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR5  = new Field<OSPEEDR, true>(2, 10)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR4  = new Field<OSPEEDR, true>(2, 8)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR3  = new Field<OSPEEDR, true>(2, 6)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR2  = new Field<OSPEEDR, true>(2, 4)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR1  = new Field<OSPEEDR, true>(2, 2)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR0  = new Field<OSPEEDR, true>(2, 0)        
    }

    // GPIO port pull-up/pull-down register
    static readonly PUPDR = new class PUPDR extends Register<PUPDR>
    {
        constructor() { super(0x5000000c) }        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR15 = new Field<PUPDR, true>(2, 30)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR14 = new Field<PUPDR, true>(2, 28)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR13 = new Field<PUPDR, true>(2, 26)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR12 = new Field<PUPDR, true>(2, 24)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR11 = new Field<PUPDR, true>(2, 22)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR10 = new Field<PUPDR, true>(2, 20)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR9  = new Field<PUPDR, true>(2, 18)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR8  = new Field<PUPDR, true>(2, 16)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR7  = new Field<PUPDR, true>(2, 14)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR6  = new Field<PUPDR, true>(2, 12)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR5  = new Field<PUPDR, true>(2, 10)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR4  = new Field<PUPDR, true>(2, 8)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR3  = new Field<PUPDR, true>(2, 6)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR2  = new Field<PUPDR, true>(2, 4)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR1  = new Field<PUPDR, true>(2, 2)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR0  = new Field<PUPDR, true>(2, 0)        
    }

    // GPIO port input data register
    static readonly IDR = new class IDR extends Register<IDR>
    {
        constructor() { super(0x50000010) }        

        // Port input data (y = 0..15)
        readonly IDR15 = new Field<IDR, false>(1, 15)        

        // Port input data (y = 0..15)
        readonly IDR14 = new Field<IDR, false>(1, 14)        

        // Port input data (y = 0..15)
        readonly IDR13 = new Field<IDR, false>(1, 13)        

        // Port input data (y = 0..15)
        readonly IDR12 = new Field<IDR, false>(1, 12)        

        // Port input data (y = 0..15)
        readonly IDR11 = new Field<IDR, false>(1, 11)        

        // Port input data (y = 0..15)
        readonly IDR10 = new Field<IDR, false>(1, 10)        

        // Port input data (y = 0..15)
        readonly IDR9  = new Field<IDR, false>(1, 9)        

        // Port input data (y = 0..15)
        readonly IDR8  = new Field<IDR, false>(1, 8)        

        // Port input data (y = 0..15)
        readonly IDR7  = new Field<IDR, false>(1, 7)        

        // Port input data (y = 0..15)
        readonly IDR6  = new Field<IDR, false>(1, 6)        

        // Port input data (y = 0..15)
        readonly IDR5  = new Field<IDR, false>(1, 5)        

        // Port input data (y = 0..15)
        readonly IDR4  = new Field<IDR, false>(1, 4)        

        // Port input data (y = 0..15)
        readonly IDR3  = new Field<IDR, false>(1, 3)        

        // Port input data (y = 0..15)
        readonly IDR2  = new Field<IDR, false>(1, 2)        

        // Port input data (y = 0..15)
        readonly IDR1  = new Field<IDR, false>(1, 1)        

        // Port input data (y = 0..15)
        readonly IDR0  = new Field<IDR, false>(1, 0)        
    }

    // GPIO port output data register
    static readonly ODR = new class ODR extends Register<ODR>
    {
        constructor() { super(0x50000014) }        

        // Port output data (y = 0..15)
        readonly ODR15 = new Field<ODR, true>(1, 15)        

        // Port output data (y = 0..15)
        readonly ODR14 = new Field<ODR, true>(1, 14)        

        // Port output data (y = 0..15)
        readonly ODR13 = new Field<ODR, true>(1, 13)        

        // Port output data (y = 0..15)
        readonly ODR12 = new Field<ODR, true>(1, 12)        

        // Port output data (y = 0..15)
        readonly ODR11 = new Field<ODR, true>(1, 11)        

        // Port output data (y = 0..15)
        readonly ODR10 = new Field<ODR, true>(1, 10)        

        // Port output data (y = 0..15)
        readonly ODR9  = new Field<ODR, true>(1, 9)        

        // Port output data (y = 0..15)
        readonly ODR8  = new Field<ODR, true>(1, 8)        

        // Port output data (y = 0..15)
        readonly ODR7  = new Field<ODR, true>(1, 7)        

        // Port output data (y = 0..15)
        readonly ODR6  = new Field<ODR, true>(1, 6)        

        // Port output data (y = 0..15)
        readonly ODR5  = new Field<ODR, true>(1, 5)        

        // Port output data (y = 0..15)
        readonly ODR4  = new Field<ODR, true>(1, 4)        

        // Port output data (y = 0..15)
        readonly ODR3  = new Field<ODR, true>(1, 3)        

        // Port output data (y = 0..15)
        readonly ODR2  = new Field<ODR, true>(1, 2)        

        // Port output data (y = 0..15)
        readonly ODR1  = new Field<ODR, true>(1, 1)        

        // Port output data (y = 0..15)
        readonly ODR0  = new Field<ODR, true>(1, 0)        
    }

    // GPIO port bit set/reset register
    static readonly BSRR = new class BSRR extends Register<BSRR>
    {
        constructor() { super(0x50000018) }        

        // Port x reset bit y (y = 0..15)
        readonly BR15 = new Field<BSRR, true>(1, 31)        

        // Port x reset bit y (y = 0..15)
        readonly BR14 = new Field<BSRR, true>(1, 30)        

        // Port x reset bit y (y = 0..15)
        readonly BR13 = new Field<BSRR, true>(1, 29)        

        // Port x reset bit y (y = 0..15)
        readonly BR12 = new Field<BSRR, true>(1, 28)        

        // Port x reset bit y (y = 0..15)
        readonly BR11 = new Field<BSRR, true>(1, 27)        

        // Port x reset bit y (y = 0..15)
        readonly BR10 = new Field<BSRR, true>(1, 26)        

        // Port x reset bit y (y = 0..15)
        readonly BR9  = new Field<BSRR, true>(1, 25)        

        // Port x reset bit y (y = 0..15)
        readonly BR8  = new Field<BSRR, true>(1, 24)        

        // Port x reset bit y (y = 0..15)
        readonly BR7  = new Field<BSRR, true>(1, 23)        

        // Port x reset bit y (y = 0..15)
        readonly BR6  = new Field<BSRR, true>(1, 22)        

        // Port x reset bit y (y = 0..15)
        readonly BR5  = new Field<BSRR, true>(1, 21)        

        // Port x reset bit y (y = 0..15)
        readonly BR4  = new Field<BSRR, true>(1, 20)        

        // Port x reset bit y (y = 0..15)
        readonly BR3  = new Field<BSRR, true>(1, 19)        

        // Port x reset bit y (y = 0..15)
        readonly BR2  = new Field<BSRR, true>(1, 18)        

        // Port x reset bit y (y = 0..15)
        readonly BR1  = new Field<BSRR, true>(1, 17)        

        // Port x set bit y (y= 0..15)
        readonly BR0  = new Field<BSRR, true>(1, 16)        

        // Port x set bit y (y= 0..15)
        readonly BS15 = new Field<BSRR, true>(1, 15)        

        // Port x set bit y (y= 0..15)
        readonly BS14 = new Field<BSRR, true>(1, 14)        

        // Port x set bit y (y= 0..15)
        readonly BS13 = new Field<BSRR, true>(1, 13)        

        // Port x set bit y (y= 0..15)
        readonly BS12 = new Field<BSRR, true>(1, 12)        

        // Port x set bit y (y= 0..15)
        readonly BS11 = new Field<BSRR, true>(1, 11)        

        // Port x set bit y (y= 0..15)
        readonly BS10 = new Field<BSRR, true>(1, 10)        

        // Port x set bit y (y= 0..15)
        readonly BS9  = new Field<BSRR, true>(1, 9)        

        // Port x set bit y (y= 0..15)
        readonly BS8  = new Field<BSRR, true>(1, 8)        

        // Port x set bit y (y= 0..15)
        readonly BS7  = new Field<BSRR, true>(1, 7)        

        // Port x set bit y (y= 0..15)
        readonly BS6  = new Field<BSRR, true>(1, 6)        

        // Port x set bit y (y= 0..15)
        readonly BS5  = new Field<BSRR, true>(1, 5)        

        // Port x set bit y (y= 0..15)
        readonly BS4  = new Field<BSRR, true>(1, 4)        

        // Port x set bit y (y= 0..15)
        readonly BS3  = new Field<BSRR, true>(1, 3)        

        // Port x set bit y (y= 0..15)
        readonly BS2  = new Field<BSRR, true>(1, 2)        

        // Port x set bit y (y= 0..15)
        readonly BS1  = new Field<BSRR, true>(1, 1)        

        // Port x set bit y (y= 0..15)
        readonly BS0  = new Field<BSRR, true>(1, 0)        
    }

    // GPIO port configuration lock register
    static readonly LCKR = new class LCKR extends Register<LCKR>
    {
        constructor() { super(0x5000001c) }        

        // Port x lock bit y (y= 0..15)
        readonly LCKK  = new Field<LCKR, true>(1, 16)        

        // Port x lock bit y (y= 0..15)
        readonly LCK15 = new Field<LCKR, true>(1, 15)        

        // Port x lock bit y (y= 0..15)
        readonly LCK14 = new Field<LCKR, true>(1, 14)        

        // Port x lock bit y (y= 0..15)
        readonly LCK13 = new Field<LCKR, true>(1, 13)        

        // Port x lock bit y (y= 0..15)
        readonly LCK12 = new Field<LCKR, true>(1, 12)        

        // Port x lock bit y (y= 0..15)
        readonly LCK11 = new Field<LCKR, true>(1, 11)        

        // Port x lock bit y (y= 0..15)
        readonly LCK10 = new Field<LCKR, true>(1, 10)        

        // Port x lock bit y (y= 0..15)
        readonly LCK9  = new Field<LCKR, true>(1, 9)        

        // Port x lock bit y (y= 0..15)
        readonly LCK8  = new Field<LCKR, true>(1, 8)        

        // Port x lock bit y (y= 0..15)
        readonly LCK7  = new Field<LCKR, true>(1, 7)        

        // Port x lock bit y (y= 0..15)
        readonly LCK6  = new Field<LCKR, true>(1, 6)        

        // Port x lock bit y (y= 0..15)
        readonly LCK5  = new Field<LCKR, true>(1, 5)        

        // Port x lock bit y (y= 0..15)
        readonly LCK4  = new Field<LCKR, true>(1, 4)        

        // Port x lock bit y (y= 0..15)
        readonly LCK3  = new Field<LCKR, true>(1, 3)        

        // Port x lock bit y (y= 0..15)
        readonly LCK2  = new Field<LCKR, true>(1, 2)        

        // Port x lock bit y (y= 0..15)
        readonly LCK1  = new Field<LCKR, true>(1, 1)        

        // Port x lock bit y (y= 0..15)
        readonly LCK0  = new Field<LCKR, true>(1, 0)        
    }

    // GPIO alternate function low register
    static readonly AFRL = new class AFRL extends Register<AFRL>
    {
        constructor() { super(0x50000020) }        

        // Alternate function selection for port x bit y 
        // (y = 0..7)
        readonly AFSEL7 = new Field<AFRL, true>(4, 28)        

        // Alternate function selection for port x bit y 
        // (y = 0..7)
        readonly AFSEL6 = new Field<AFRL, true>(4, 24)        

        // Alternate function selection for port x bit y 
        // (y = 0..7)
        readonly AFSEL5 = new Field<AFRL, true>(4, 20)        

        // Alternate function selection for port x bit y 
        // (y = 0..7)
        readonly AFSEL4 = new Field<AFRL, true>(4, 16)        

        // Alternate function selection for port x bit y 
        // (y = 0..7)
        readonly AFSEL3 = new Field<AFRL, true>(4, 12)        

        // Alternate function selection for port x bit y 
        // (y = 0..7)
        readonly AFSEL2 = new Field<AFRL, true>(4, 8)        

        // Alternate function selection for port x bit y 
        // (y = 0..7)
        readonly AFSEL1 = new Field<AFRL, true>(4, 4)        

        // Alternate function selection for port x bit y 
        // (y = 0..7)
        readonly AFSEL0 = new Field<AFRL, true>(4, 0)        
    }

    // GPIO alternate function high register
    static readonly AFRH = new class AFRH extends Register<AFRH>
    {
        constructor() { super(0x50000024) }        

        // Alternate function selection for port x bit y 
        // (y = 8..15)
        readonly AFSEL15 = new Field<AFRH, true>(4, 28)        

        // Alternate function selection for port x bit y 
        // (y = 8..15)
        readonly AFSEL14 = new Field<AFRH, true>(4, 24)        

        // Alternate function selection for port x bit y 
        // (y = 8..15)
        readonly AFSEL13 = new Field<AFRH, true>(4, 20)        

        // Alternate function selection for port x bit y 
        // (y = 8..15)
        readonly AFSEL12 = new Field<AFRH, true>(4, 16)        

        // Alternate function selection for port x bit y 
        // (y = 8..15)
        readonly AFSEL11 = new Field<AFRH, true>(4, 12)        

        // Alternate function selection for port x bit y 
        // (y = 8..15)
        readonly AFSEL10 = new Field<AFRH, true>(4, 8)        

        // Alternate function selection for port x bit y 
        // (y = 8..15)
        readonly AFSEL9  = new Field<AFRH, true>(4, 4)        

        // Alternate function selection for port x bit y 
        // (y = 8..15)
        readonly AFSEL8  = new Field<AFRH, true>(4, 0)        
    }

    // port bit reset register
    static readonly BRR = new class BRR extends Register<BRR>
    {
        constructor() { super(0x50000028) }        

        // Port Reset bit
        readonly BR0  = new Field<BRR, true>(1, 0)        

        // Port Reset bit
        readonly BR1  = new Field<BRR, true>(1, 1)        

        // Port Reset bit
        readonly BR2  = new Field<BRR, true>(1, 2)        

        // Port Reset bit
        readonly BR3  = new Field<BRR, true>(1, 3)        

        // Port Reset bit
        readonly BR4  = new Field<BRR, true>(1, 4)        

        // Port Reset bit
        readonly BR5  = new Field<BRR, true>(1, 5)        

        // Port Reset bit
        readonly BR6  = new Field<BRR, true>(1, 6)        

        // Port Reset bit
        readonly BR7  = new Field<BRR, true>(1, 7)        

        // Port Reset bit
        readonly BR8  = new Field<BRR, true>(1, 8)        

        // Port Reset bit
        readonly BR9  = new Field<BRR, true>(1, 9)        

        // Port Reset bit
        readonly BR10 = new Field<BRR, true>(1, 10)        

        // Port Reset bit
        readonly BR11 = new Field<BRR, true>(1, 11)        

        // Port Reset bit
        readonly BR12 = new Field<BRR, true>(1, 12)        

        // Port Reset bit
        readonly BR13 = new Field<BRR, true>(1, 13)        

        // Port Reset bit
        readonly BR14 = new Field<BRR, true>(1, 14)        

        // Port Reset bit
        readonly BR15 = new Field<BRR, true>(1, 15)        
    }
}

export class GPIOB
{
    // GPIO port mode register
    static readonly MODER = new class MODER extends Register<MODER>
    {
        constructor() { super(0x50000400) }        

        // Port x configuration bits (y = 0..15)
        readonly MODER15 = new Field<MODER, true>(2, 30)        

        // Port x configuration bits (y = 0..15)
        readonly MODER14 = new Field<MODER, true>(2, 28)        

        // Port x configuration bits (y = 0..15)
        readonly MODER13 = new Field<MODER, true>(2, 26)        

        // Port x configuration bits (y = 0..15)
        readonly MODER12 = new Field<MODER, true>(2, 24)        

        // Port x configuration bits (y = 0..15)
        readonly MODER11 = new Field<MODER, true>(2, 22)        

        // Port x configuration bits (y = 0..15)
        readonly MODER10 = new Field<MODER, true>(2, 20)        

        // Port x configuration bits (y = 0..15)
        readonly MODER9  = new Field<MODER, true>(2, 18)        

        // Port x configuration bits (y = 0..15)
        readonly MODER8  = new Field<MODER, true>(2, 16)        

        // Port x configuration bits (y = 0..15)
        readonly MODER7  = new Field<MODER, true>(2, 14)        

        // Port x configuration bits (y = 0..15)
        readonly MODER6  = new Field<MODER, true>(2, 12)        

        // Port x configuration bits (y = 0..15)
        readonly MODER5  = new Field<MODER, true>(2, 10)        

        // Port x configuration bits (y = 0..15)
        readonly MODER4  = new Field<MODER, true>(2, 8)        

        // Port x configuration bits (y = 0..15)
        readonly MODER3  = new Field<MODER, true>(2, 6)        

        // Port x configuration bits (y = 0..15)
        readonly MODER2  = new Field<MODER, true>(2, 4)        

        // Port x configuration bits (y = 0..15)
        readonly MODER1  = new Field<MODER, true>(2, 2)        

        // Port x configuration bits (y = 0..15)
        readonly MODER0  = new Field<MODER, true>(2, 0)        
    }

    // GPIO port output type register
    static readonly OTYPER = new class OTYPER extends Register<OTYPER>
    {
        constructor() { super(0x50000404) }        

        // Port x configuration bits (y = 0..15)
        readonly OT15 = new Field<OTYPER, true>(1, 15)        

        // Port x configuration bits (y = 0..15)
        readonly OT14 = new Field<OTYPER, true>(1, 14)        

        // Port x configuration bits (y = 0..15)
        readonly OT13 = new Field<OTYPER, true>(1, 13)        

        // Port x configuration bits (y = 0..15)
        readonly OT12 = new Field<OTYPER, true>(1, 12)        

        // Port x configuration bits (y = 0..15)
        readonly OT11 = new Field<OTYPER, true>(1, 11)        

        // Port x configuration bits (y = 0..15)
        readonly OT10 = new Field<OTYPER, true>(1, 10)        

        // Port x configuration bits (y = 0..15)
        readonly OT9  = new Field<OTYPER, true>(1, 9)        

        // Port x configuration bits (y = 0..15)
        readonly OT8  = new Field<OTYPER, true>(1, 8)        

        // Port x configuration bits (y = 0..15)
        readonly OT7  = new Field<OTYPER, true>(1, 7)        

        // Port x configuration bits (y = 0..15)
        readonly OT6  = new Field<OTYPER, true>(1, 6)        

        // Port x configuration bits (y = 0..15)
        readonly OT5  = new Field<OTYPER, true>(1, 5)        

        // Port x configuration bits (y = 0..15)
        readonly OT4  = new Field<OTYPER, true>(1, 4)        

        // Port x configuration bits (y = 0..15)
        readonly OT3  = new Field<OTYPER, true>(1, 3)        

        // Port x configuration bits (y = 0..15)
        readonly OT2  = new Field<OTYPER, true>(1, 2)        

        // Port x configuration bits (y = 0..15)
        readonly OT1  = new Field<OTYPER, true>(1, 1)        

        // Port x configuration bits (y = 0..15)
        readonly OT0  = new Field<OTYPER, true>(1, 0)        
    }

    // GPIO port output speed register
    static readonly OSPEEDR = new class OSPEEDR extends Register<OSPEEDR>
    {
        constructor() { super(0x50000408) }        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR15 = new Field<OSPEEDR, true>(2, 30)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR14 = new Field<OSPEEDR, true>(2, 28)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR13 = new Field<OSPEEDR, true>(2, 26)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR12 = new Field<OSPEEDR, true>(2, 24)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR11 = new Field<OSPEEDR, true>(2, 22)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR10 = new Field<OSPEEDR, true>(2, 20)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR9  = new Field<OSPEEDR, true>(2, 18)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR8  = new Field<OSPEEDR, true>(2, 16)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR7  = new Field<OSPEEDR, true>(2, 14)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR6  = new Field<OSPEEDR, true>(2, 12)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR5  = new Field<OSPEEDR, true>(2, 10)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR4  = new Field<OSPEEDR, true>(2, 8)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR3  = new Field<OSPEEDR, true>(2, 6)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR2  = new Field<OSPEEDR, true>(2, 4)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR1  = new Field<OSPEEDR, true>(2, 2)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR0  = new Field<OSPEEDR, true>(2, 0)        
    }

    // GPIO port pull-up/pull-down register
    static readonly PUPDR = new class PUPDR extends Register<PUPDR>
    {
        constructor() { super(0x5000040c) }        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR15 = new Field<PUPDR, true>(2, 30)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR14 = new Field<PUPDR, true>(2, 28)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR13 = new Field<PUPDR, true>(2, 26)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR12 = new Field<PUPDR, true>(2, 24)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR11 = new Field<PUPDR, true>(2, 22)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR10 = new Field<PUPDR, true>(2, 20)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR9  = new Field<PUPDR, true>(2, 18)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR8  = new Field<PUPDR, true>(2, 16)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR7  = new Field<PUPDR, true>(2, 14)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR6  = new Field<PUPDR, true>(2, 12)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR5  = new Field<PUPDR, true>(2, 10)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR4  = new Field<PUPDR, true>(2, 8)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR3  = new Field<PUPDR, true>(2, 6)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR2  = new Field<PUPDR, true>(2, 4)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR1  = new Field<PUPDR, true>(2, 2)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR0  = new Field<PUPDR, true>(2, 0)        
    }

    // GPIO port input data register
    static readonly IDR = new class IDR extends Register<IDR>
    {
        constructor() { super(0x50000410) }        

        // Port input data (y = 0..15)
        readonly IDR15 = new Field<IDR, false>(1, 15)        

        // Port input data (y = 0..15)
        readonly IDR14 = new Field<IDR, false>(1, 14)        

        // Port input data (y = 0..15)
        readonly IDR13 = new Field<IDR, false>(1, 13)        

        // Port input data (y = 0..15)
        readonly IDR12 = new Field<IDR, false>(1, 12)        

        // Port input data (y = 0..15)
        readonly IDR11 = new Field<IDR, false>(1, 11)        

        // Port input data (y = 0..15)
        readonly IDR10 = new Field<IDR, false>(1, 10)        

        // Port input data (y = 0..15)
        readonly IDR9  = new Field<IDR, false>(1, 9)        

        // Port input data (y = 0..15)
        readonly IDR8  = new Field<IDR, false>(1, 8)        

        // Port input data (y = 0..15)
        readonly IDR7  = new Field<IDR, false>(1, 7)        

        // Port input data (y = 0..15)
        readonly IDR6  = new Field<IDR, false>(1, 6)        

        // Port input data (y = 0..15)
        readonly IDR5  = new Field<IDR, false>(1, 5)        

        // Port input data (y = 0..15)
        readonly IDR4  = new Field<IDR, false>(1, 4)        

        // Port input data (y = 0..15)
        readonly IDR3  = new Field<IDR, false>(1, 3)        

        // Port input data (y = 0..15)
        readonly IDR2  = new Field<IDR, false>(1, 2)        

        // Port input data (y = 0..15)
        readonly IDR1  = new Field<IDR, false>(1, 1)        

        // Port input data (y = 0..15)
        readonly IDR0  = new Field<IDR, false>(1, 0)
    }

    // GPIO port output data register
    static readonly ODR = new class ODR extends Register<ODR>
    {
        constructor() { super(0x50000414) }        

        // Port output data (y = 0..15)
        readonly ODR15 = new Field<ODR, true>(1, 15)        

        // Port output data (y = 0..15)
        readonly ODR14 = new Field<ODR, true>(1, 14)        

        // Port output data (y = 0..15)
        readonly ODR13 = new Field<ODR, true>(1, 13)        

        // Port output data (y = 0..15)
        readonly ODR12 = new Field<ODR, true>(1, 12)        

        // Port output data (y = 0..15)
        readonly ODR11 = new Field<ODR, true>(1, 11)        

        // Port output data (y = 0..15)
        readonly ODR10 = new Field<ODR, true>(1, 10)        

        // Port output data (y = 0..15)
        readonly ODR9  = new Field<ODR, true>(1, 9)        

        // Port output data (y = 0..15)
        readonly ODR8  = new Field<ODR, true>(1, 8)        

        // Port output data (y = 0..15)
        readonly ODR7  = new Field<ODR, true>(1, 7)        

        // Port output data (y = 0..15)
        readonly ODR6  = new Field<ODR, true>(1, 6)        

        // Port output data (y = 0..15)
        readonly ODR5  = new Field<ODR, true>(1, 5)        

        // Port output data (y = 0..15)
        readonly ODR4  = new Field<ODR, true>(1, 4)        

        // Port output data (y = 0..15)
        readonly ODR3  = new Field<ODR, true>(1, 3)        

        // Port output data (y = 0..15)
        readonly ODR2  = new Field<ODR, true>(1, 2)        

        // Port output data (y = 0..15)
        readonly ODR1  = new Field<ODR, true>(1, 1)        

        // Port output data (y = 0..15)
        readonly ODR0  = new Field<ODR, true>(1, 0)        
    }

    // GPIO port bit set/reset register
    static readonly BSRR = new class BSRR extends Register<BSRR>
    {
        constructor() { super(0x50000418) }        

        // Port x reset bit y (y = 0..15)
        readonly BR15 = new Field<BSRR, true>(1, 31)        

        // Port x reset bit y (y = 0..15)
        readonly BR14 = new Field<BSRR, true>(1, 30)        

        // Port x reset bit y (y = 0..15)
        readonly BR13 = new Field<BSRR, true>(1, 29)        

        // Port x reset bit y (y = 0..15)
        readonly BR12 = new Field<BSRR, true>(1, 28)        

        // Port x reset bit y (y = 0..15)
        readonly BR11 = new Field<BSRR, true>(1, 27)        

        // Port x reset bit y (y = 0..15)
        readonly BR10 = new Field<BSRR, true>(1, 26)        

        // Port x reset bit y (y = 0..15)
        readonly BR9  = new Field<BSRR, true>(1, 25)        

        // Port x reset bit y (y = 0..15)
        readonly BR8  = new Field<BSRR, true>(1, 24)        

        // Port x reset bit y (y = 0..15)
        readonly BR7  = new Field<BSRR, true>(1, 23)        

        // Port x reset bit y (y = 0..15)
        readonly BR6  = new Field<BSRR, true>(1, 22)        

        // Port x reset bit y (y = 0..15)
        readonly BR5  = new Field<BSRR, true>(1, 21)        

        // Port x reset bit y (y = 0..15)
        readonly BR4  = new Field<BSRR, true>(1, 20)        

        // Port x reset bit y (y = 0..15)
        readonly BR3  = new Field<BSRR, true>(1, 19)        

        // Port x reset bit y (y = 0..15)
        readonly BR2  = new Field<BSRR, true>(1, 18)        

        // Port x reset bit y (y = 0..15)
        readonly BR1  = new Field<BSRR, true>(1, 17)        

        // Port x set bit y (y= 0..15)
        readonly BR0  = new Field<BSRR, true>(1, 16)        

        // Port x set bit y (y= 0..15)
        readonly BS15 = new Field<BSRR, true>(1, 15)        

        // Port x set bit y (y= 0..15)
        readonly BS14 = new Field<BSRR, true>(1, 14)        

        // Port x set bit y (y= 0..15)
        readonly BS13 = new Field<BSRR, true>(1, 13)        

        // Port x set bit y (y= 0..15)
        readonly BS12 = new Field<BSRR, true>(1, 12)        

        // Port x set bit y (y= 0..15)
        readonly BS11 = new Field<BSRR, true>(1, 11)        

        // Port x set bit y (y= 0..15)
        readonly BS10 = new Field<BSRR, true>(1, 10)        

        // Port x set bit y (y= 0..15)
        readonly BS9  = new Field<BSRR, true>(1, 9)        

        // Port x set bit y (y= 0..15)
        readonly BS8  = new Field<BSRR, true>(1, 8)        

        // Port x set bit y (y= 0..15)
        readonly BS7  = new Field<BSRR, true>(1, 7)        

        // Port x set bit y (y= 0..15)
        readonly BS6  = new Field<BSRR, true>(1, 6)        

        // Port x set bit y (y= 0..15)
        readonly BS5  = new Field<BSRR, true>(1, 5)        

        // Port x set bit y (y= 0..15)
        readonly BS4  = new Field<BSRR, true>(1, 4)        

        // Port x set bit y (y= 0..15)
        readonly BS3  = new Field<BSRR, true>(1, 3)        

        // Port x set bit y (y= 0..15)
        readonly BS2  = new Field<BSRR, true>(1, 2)        

        // Port x set bit y (y= 0..15)
        readonly BS1  = new Field<BSRR, true>(1, 1)        

        // Port x set bit y (y= 0..15)
        readonly BS0  = new Field<BSRR, true>(1, 0)        
    }

    // GPIO port configuration lock register
    static readonly LCKR = new class LCKR extends Register<LCKR>
    {
        constructor() { super(0x5000041c) }        

        // Port x lock bit y (y= 0..15)
        readonly LCKK  = new Field<LCKR, true>(1, 16)        

        // Port x lock bit y (y= 0..15)
        readonly LCK15 = new Field<LCKR, true>(1, 15)        

        // Port x lock bit y (y= 0..15)
        readonly LCK14 = new Field<LCKR, true>(1, 14)        

        // Port x lock bit y (y= 0..15)
        readonly LCK13 = new Field<LCKR, true>(1, 13)        

        // Port x lock bit y (y= 0..15)
        readonly LCK12 = new Field<LCKR, true>(1, 12)        

        // Port x lock bit y (y= 0..15)
        readonly LCK11 = new Field<LCKR, true>(1, 11)        

        // Port x lock bit y (y= 0..15)
        readonly LCK10 = new Field<LCKR, true>(1, 10)        

        // Port x lock bit y (y= 0..15)
        readonly LCK9  = new Field<LCKR, true>(1, 9)        

        // Port x lock bit y (y= 0..15)
        readonly LCK8  = new Field<LCKR, true>(1, 8)        

        // Port x lock bit y (y= 0..15)
        readonly LCK7  = new Field<LCKR, true>(1, 7)        

        // Port x lock bit y (y= 0..15)
        readonly LCK6  = new Field<LCKR, true>(1, 6)        

        // Port x lock bit y (y= 0..15)
        readonly LCK5  = new Field<LCKR, true>(1, 5)        

        // Port x lock bit y (y= 0..15)
        readonly LCK4  = new Field<LCKR, true>(1, 4)        

        // Port x lock bit y (y= 0..15)
        readonly LCK3  = new Field<LCKR, true>(1, 3)        

        // Port x lock bit y (y= 0..15)
        readonly LCK2  = new Field<LCKR, true>(1, 2)        

        // Port x lock bit y (y= 0..15)
        readonly LCK1  = new Field<LCKR, true>(1, 1)        

        // Port x lock bit y (y= 0..15)
        readonly LCK0  = new Field<LCKR, true>(1, 0)        
    }

    // GPIO alternate function low register
    static readonly AFRL = new class AFRL extends Register<AFRL>
    {
        constructor() { super(0x50000420) }        

        // Alternate function selection for port x bit y 
        // (y = 0..7)
        readonly AFSEL7 = new Field<AFRL, true>(4, 28)        

        // Alternate function selection for port x bit y 
        // (y = 0..7)
        readonly AFSEL6 = new Field<AFRL, true>(4, 24)        

        // Alternate function selection for port x bit y 
        // (y = 0..7)
        readonly AFSEL5 = new Field<AFRL, true>(4, 20)        

        // Alternate function selection for port x bit y 
        // (y = 0..7)
        readonly AFSEL4 = new Field<AFRL, true>(4, 16)        

        // Alternate function selection for port x bit y 
        // (y = 0..7)
        readonly AFSEL3 = new Field<AFRL, true>(4, 12)        

        // Alternate function selection for port x bit y 
        // (y = 0..7)
        readonly AFSEL2 = new Field<AFRL, true>(4, 8)        

        // Alternate function selection for port x bit y 
        // (y = 0..7)
        readonly AFSEL1 = new Field<AFRL, true>(4, 4)        

        // Alternate function selection for port x bit y 
        // (y = 0..7)
        readonly AFSEL0 = new Field<AFRL, true>(4, 0)        
    }

    // GPIO alternate function high register
    static readonly AFRH = new class AFRH extends Register<AFRH>
    {
        constructor() { super(0x50000424) }        

        // Alternate function selection for port x bit y 
        // (y = 8..15)
        readonly AFSEL15 = new Field<AFRH, true>(4, 28)        

        // Alternate function selection for port x bit y 
        // (y = 8..15)
        readonly AFSEL14 = new Field<AFRH, true>(4, 24)        

        // Alternate function selection for port x bit y 
        // (y = 8..15)
        readonly AFSEL13 = new Field<AFRH, true>(4, 20)        

        // Alternate function selection for port x bit y 
        // (y = 8..15)
        readonly AFSEL12 = new Field<AFRH, true>(4, 16)        

        // Alternate function selection for port x bit y 
        // (y = 8..15)
        readonly AFSEL11 = new Field<AFRH, true>(4, 12)        

        // Alternate function selection for port x bit y 
        // (y = 8..15)
        readonly AFSEL10 = new Field<AFRH, true>(4, 8)        

        // Alternate function selection for port x bit y 
        // (y = 8..15)
        readonly AFSEL9  = new Field<AFRH, true>(4, 4)        

        // Alternate function selection for port x bit y 
        // (y = 8..15)
        readonly AFSEL8  = new Field<AFRH, true>(4, 0)        
    }

    // port bit reset register
    static readonly BRR = new class BRR extends Register<BRR>
    {
        constructor() { super(0x50000428) }        

        // Port Reset bit
        readonly BR0  = new Field<BRR, true>(1, 0)        

        // Port Reset bit
        readonly BR1  = new Field<BRR, true>(1, 1)        

        // Port Reset bit
        readonly BR2  = new Field<BRR, true>(1, 2)        

        // Port Reset bit
        readonly BR3  = new Field<BRR, true>(1, 3)        

        // Port Reset bit
        readonly BR4  = new Field<BRR, true>(1, 4)        

        // Port Reset bit
        readonly BR5  = new Field<BRR, true>(1, 5)        

        // Port Reset bit
        readonly BR6  = new Field<BRR, true>(1, 6)        

        // Port Reset bit
        readonly BR7  = new Field<BRR, true>(1, 7)        

        // Port Reset bit
        readonly BR8  = new Field<BRR, true>(1, 8)        

        // Port Reset bit
        readonly BR9  = new Field<BRR, true>(1, 9)        

        // Port Reset bit
        readonly BR10 = new Field<BRR, true>(1, 10)        

        // Port Reset bit
        readonly BR11 = new Field<BRR, true>(1, 11)        

        // Port Reset bit
        readonly BR12 = new Field<BRR, true>(1, 12)        

        // Port Reset bit
        readonly BR13 = new Field<BRR, true>(1, 13)        

        // Port Reset bit
        readonly BR14 = new Field<BRR, true>(1, 14)        

        // Port Reset bit
        readonly BR15 = new Field<BRR, true>(1, 15)        
    }
}

export class GPIOC
{
    // GPIO port mode register
    static readonly MODER = new class MODER extends Register<MODER>
    {
        constructor() { super(0x50000800) }        

        // Port x configuration bits (y = 0..15)
        readonly MODER15 = new Field<MODER, true>(2, 30)        

        // Port x configuration bits (y = 0..15)
        readonly MODER14 = new Field<MODER, true>(2, 28)        

        // Port x configuration bits (y = 0..15)
        readonly MODER13 = new Field<MODER, true>(2, 26)        

        // Port x configuration bits (y = 0..15)
        readonly MODER12 = new Field<MODER, true>(2, 24)        

        // Port x configuration bits (y = 0..15)
        readonly MODER11 = new Field<MODER, true>(2, 22)        

        // Port x configuration bits (y = 0..15)
        readonly MODER10 = new Field<MODER, true>(2, 20)        

        // Port x configuration bits (y = 0..15)
        readonly MODER9  = new Field<MODER, true>(2, 18)        

        // Port x configuration bits (y = 0..15)
        readonly MODER8  = new Field<MODER, true>(2, 16)        

        // Port x configuration bits (y = 0..15)
        readonly MODER7  = new Field<MODER, true>(2, 14)        

        // Port x configuration bits (y = 0..15)
        readonly MODER6  = new Field<MODER, true>(2, 12)        

        // Port x configuration bits (y = 0..15)
        readonly MODER5  = new Field<MODER, true>(2, 10)        

        // Port x configuration bits (y = 0..15)
        readonly MODER4  = new Field<MODER, true>(2, 8)        

        // Port x configuration bits (y = 0..15)
        readonly MODER3  = new Field<MODER, true>(2, 6)        

        // Port x configuration bits (y = 0..15)
        readonly MODER2  = new Field<MODER, true>(2, 4)        

        // Port x configuration bits (y = 0..15)
        readonly MODER1  = new Field<MODER, true>(2, 2)        

        // Port x configuration bits (y = 0..15)
        readonly MODER0  = new Field<MODER, true>(2, 0)        
    }

    // GPIO port output type register
    static readonly OTYPER = new class OTYPER extends Register<OTYPER>
    {
        constructor() { super(0x50000804) }        

        // Port x configuration bits (y = 0..15)
        readonly OT15 = new Field<OTYPER, true>(1, 15)        

        // Port x configuration bits (y = 0..15)
        readonly OT14 = new Field<OTYPER, true>(1, 14)        

        // Port x configuration bits (y = 0..15)
        readonly OT13 = new Field<OTYPER, true>(1, 13)        

        // Port x configuration bits (y = 0..15)
        readonly OT12 = new Field<OTYPER, true>(1, 12)        

        // Port x configuration bits (y = 0..15)
        readonly OT11 = new Field<OTYPER, true>(1, 11)        

        // Port x configuration bits (y = 0..15)
        readonly OT10 = new Field<OTYPER, true>(1, 10)        

        // Port x configuration bits (y = 0..15)
        readonly OT9  = new Field<OTYPER, true>(1, 9)        

        // Port x configuration bits (y = 0..15)
        readonly OT8  = new Field<OTYPER, true>(1, 8)        

        // Port x configuration bits (y = 0..15)
        readonly OT7  = new Field<OTYPER, true>(1, 7)        

        // Port x configuration bits (y = 0..15)
        readonly OT6  = new Field<OTYPER, true>(1, 6)        

        // Port x configuration bits (y = 0..15)
        readonly OT5  = new Field<OTYPER, true>(1, 5)        

        // Port x configuration bits (y = 0..15)
        readonly OT4  = new Field<OTYPER, true>(1, 4)        

        // Port x configuration bits (y = 0..15)
        readonly OT3  = new Field<OTYPER, true>(1, 3)        

        // Port x configuration bits (y = 0..15)
        readonly OT2  = new Field<OTYPER, true>(1, 2)        

        // Port x configuration bits (y = 0..15)
        readonly OT1  = new Field<OTYPER, true>(1, 1)        

        // Port x configuration bits (y = 0..15)
        readonly OT0  = new Field<OTYPER, true>(1, 0)        
    }

    // GPIO port output speed register
    static readonly OSPEEDR = new class OSPEEDR extends Register<OSPEEDR>
    {
        constructor() { super(0x50000808) }        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR15 = new Field<OSPEEDR, true>(2, 30)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR14 = new Field<OSPEEDR, true>(2, 28)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR13 = new Field<OSPEEDR, true>(2, 26)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR12 = new Field<OSPEEDR, true>(2, 24)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR11 = new Field<OSPEEDR, true>(2, 22)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR10 = new Field<OSPEEDR, true>(2, 20)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR9  = new Field<OSPEEDR, true>(2, 18)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR8  = new Field<OSPEEDR, true>(2, 16)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR7  = new Field<OSPEEDR, true>(2, 14)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR6  = new Field<OSPEEDR, true>(2, 12)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR5  = new Field<OSPEEDR, true>(2, 10)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR4  = new Field<OSPEEDR, true>(2, 8)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR3  = new Field<OSPEEDR, true>(2, 6)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR2  = new Field<OSPEEDR, true>(2, 4)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR1  = new Field<OSPEEDR, true>(2, 2)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR0  = new Field<OSPEEDR, true>(2, 0)        
    }

    // GPIO port pull-up/pull-down register
    static readonly PUPDR = new class PUPDR extends Register<PUPDR>
    {
        constructor() { super(0x5000080c) }        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR15 = new Field<PUPDR, true>(2, 30)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR14 = new Field<PUPDR, true>(2, 28)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR13 = new Field<PUPDR, true>(2, 26)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR12 = new Field<PUPDR, true>(2, 24)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR11 = new Field<PUPDR, true>(2, 22)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR10 = new Field<PUPDR, true>(2, 20)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR9  = new Field<PUPDR, true>(2, 18)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR8  = new Field<PUPDR, true>(2, 16)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR7  = new Field<PUPDR, true>(2, 14)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR6  = new Field<PUPDR, true>(2, 12)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR5  = new Field<PUPDR, true>(2, 10)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR4  = new Field<PUPDR, true>(2, 8)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR3  = new Field<PUPDR, true>(2, 6)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR2  = new Field<PUPDR, true>(2, 4)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR1  = new Field<PUPDR, true>(2, 2)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR0  = new Field<PUPDR, true>(2, 0)        
    }

    // GPIO port input data register
    static readonly IDR = new class IDR extends Register<IDR>
    {
        constructor() { super(0x50000810) }        

        // Port input data (y = 0..15)
        readonly IDR15 = new Field<IDR, false>(1, 15)        

        // Port input data (y = 0..15)
        readonly IDR14 = new Field<IDR, false>(1, 14)        

        // Port input data (y = 0..15)
        readonly IDR13 = new Field<IDR, false>(1, 13)        

        // Port input data (y = 0..15)
        readonly IDR12 = new Field<IDR, false>(1, 12)        

        // Port input data (y = 0..15)
        readonly IDR11 = new Field<IDR, false>(1, 11)        

        // Port input data (y = 0..15)
        readonly IDR10 = new Field<IDR, false>(1, 10)        

        // Port input data (y = 0..15)
        readonly IDR9  = new Field<IDR, false>(1, 9)        

        // Port input data (y = 0..15)
        readonly IDR8  = new Field<IDR, false>(1, 8)        

        // Port input data (y = 0..15)
        readonly IDR7  = new Field<IDR, false>(1, 7)        

        // Port input data (y = 0..15)
        readonly IDR6  = new Field<IDR, false>(1, 6)        

        // Port input data (y = 0..15)
        readonly IDR5  = new Field<IDR, false>(1, 5)        

        // Port input data (y = 0..15)
        readonly IDR4  = new Field<IDR, false>(1, 4)        

        // Port input data (y = 0..15)
        readonly IDR3  = new Field<IDR, false>(1, 3)        

        // Port input data (y = 0..15)
        readonly IDR2  = new Field<IDR, false>(1, 2)        

        // Port input data (y = 0..15)
        readonly IDR1  = new Field<IDR, false>(1, 1)        

        // Port input data (y = 0..15)
        readonly IDR0  = new Field<IDR, false>(1, 0)        
    }

    // GPIO port output data register
    static readonly ODR = new class ODR extends Register<ODR>
    {
        constructor() { super(0x50000814) }        

        // Port output data (y = 0..15)
        readonly ODR15 = new Field<ODR, true>(1, 15)        

        // Port output data (y = 0..15)
        readonly ODR14 = new Field<ODR, true>(1, 14)        

        // Port output data (y = 0..15)
        readonly ODR13 = new Field<ODR, true>(1, 13)        

        // Port output data (y = 0..15)
        readonly ODR12 = new Field<ODR, true>(1, 12)        

        // Port output data (y = 0..15)
        readonly ODR11 = new Field<ODR, true>(1, 11)        

        // Port output data (y = 0..15)
        readonly ODR10 = new Field<ODR, true>(1, 10)        

        // Port output data (y = 0..15)
        readonly ODR9  = new Field<ODR, true>(1, 9)        

        // Port output data (y = 0..15)
        readonly ODR8  = new Field<ODR, true>(1, 8)        

        // Port output data (y = 0..15)
        readonly ODR7  = new Field<ODR, true>(1, 7)        

        // Port output data (y = 0..15)
        readonly ODR6  = new Field<ODR, true>(1, 6)        

        // Port output data (y = 0..15)
        readonly ODR5  = new Field<ODR, true>(1, 5)        

        // Port output data (y = 0..15)
        readonly ODR4  = new Field<ODR, true>(1, 4)        

        // Port output data (y = 0..15)
        readonly ODR3  = new Field<ODR, true>(1, 3)        

        // Port output data (y = 0..15)
        readonly ODR2  = new Field<ODR, true>(1, 2)        

        // Port output data (y = 0..15)
        readonly ODR1  = new Field<ODR, true>(1, 1)        

        // Port output data (y = 0..15)
        readonly ODR0  = new Field<ODR, true>(1, 0)        
    }

    // GPIO port bit set/reset register
    static readonly BSRR = new class BSRR extends Register<BSRR>
    {
        constructor() { super(0x50000818) }        

        // Port x reset bit y (y = 0..15)
        readonly BR15 = new Field<BSRR, true>(1, 31)        

        // Port x reset bit y (y = 0..15)
        readonly BR14 = new Field<BSRR, true>(1, 30)        

        // Port x reset bit y (y = 0..15)
        readonly BR13 = new Field<BSRR, true>(1, 29)        

        // Port x reset bit y (y = 0..15)
        readonly BR12 = new Field<BSRR, true>(1, 28)        

        // Port x reset bit y (y = 0..15)
        readonly BR11 = new Field<BSRR, true>(1, 27)        

        // Port x reset bit y (y = 0..15)
        readonly BR10 = new Field<BSRR, true>(1, 26)        

        // Port x reset bit y (y = 0..15)
        readonly BR9  = new Field<BSRR, true>(1, 25)        

        // Port x reset bit y (y = 0..15)
        readonly BR8  = new Field<BSRR, true>(1, 24)        

        // Port x reset bit y (y = 0..15)
        readonly BR7  = new Field<BSRR, true>(1, 23)        

        // Port x reset bit y (y = 0..15)
        readonly BR6  = new Field<BSRR, true>(1, 22)        

        // Port x reset bit y (y = 0..15)
        readonly BR5  = new Field<BSRR, true>(1, 21)        

        // Port x reset bit y (y = 0..15)
        readonly BR4  = new Field<BSRR, true>(1, 20)        

        // Port x reset bit y (y = 0..15)
        readonly BR3  = new Field<BSRR, true>(1, 19)        

        // Port x reset bit y (y = 0..15)
        readonly BR2  = new Field<BSRR, true>(1, 18)        

        // Port x reset bit y (y = 0..15)
        readonly BR1  = new Field<BSRR, true>(1, 17)        

        // Port x set bit y (y= 0..15)
        readonly BR0  = new Field<BSRR, true>(1, 16)        

        // Port x set bit y (y= 0..15)
        readonly BS15 = new Field<BSRR, true>(1, 15)        

        // Port x set bit y (y= 0..15)
        readonly BS14 = new Field<BSRR, true>(1, 14)        

        // Port x set bit y (y= 0..15)
        readonly BS13 = new Field<BSRR, true>(1, 13)        

        // Port x set bit y (y= 0..15)
        readonly BS12 = new Field<BSRR, true>(1, 12)        

        // Port x set bit y (y= 0..15)
        readonly BS11 = new Field<BSRR, true>(1, 11)        

        // Port x set bit y (y= 0..15)
        readonly BS10 = new Field<BSRR, true>(1, 10)        

        // Port x set bit y (y= 0..15)
        readonly BS9  = new Field<BSRR, true>(1, 9)        

        // Port x set bit y (y= 0..15)
        readonly BS8  = new Field<BSRR, true>(1, 8)        

        // Port x set bit y (y= 0..15)
        readonly BS7  = new Field<BSRR, true>(1, 7)        

        // Port x set bit y (y= 0..15)
        readonly BS6  = new Field<BSRR, true>(1, 6)        

        // Port x set bit y (y= 0..15)
        readonly BS5  = new Field<BSRR, true>(1, 5)        

        // Port x set bit y (y= 0..15)
        readonly BS4  = new Field<BSRR, true>(1, 4)        

        // Port x set bit y (y= 0..15)
        readonly BS3  = new Field<BSRR, true>(1, 3)        

        // Port x set bit y (y= 0..15)
        readonly BS2  = new Field<BSRR, true>(1, 2)        

        // Port x set bit y (y= 0..15)
        readonly BS1  = new Field<BSRR, true>(1, 1)        

        // Port x set bit y (y= 0..15)
        readonly BS0  = new Field<BSRR, true>(1, 0)        
    }

    // GPIO port configuration lock register
    static readonly LCKR = new class LCKR extends Register<LCKR>
    {
        constructor() { super(0x5000081c) }        

        // Port x lock bit y (y= 0..15)
        readonly LCKK  = new Field<LCKR, true>(1, 16)        

        // Port x lock bit y (y= 0..15)
        readonly LCK15 = new Field<LCKR, true>(1, 15)        

        // Port x lock bit y (y= 0..15)
        readonly LCK14 = new Field<LCKR, true>(1, 14)        

        // Port x lock bit y (y= 0..15)
        readonly LCK13 = new Field<LCKR, true>(1, 13)        

        // Port x lock bit y (y= 0..15)
        readonly LCK12 = new Field<LCKR, true>(1, 12)        

        // Port x lock bit y (y= 0..15)
        readonly LCK11 = new Field<LCKR, true>(1, 11)        

        // Port x lock bit y (y= 0..15)
        readonly LCK10 = new Field<LCKR, true>(1, 10)        

        // Port x lock bit y (y= 0..15)
        readonly LCK9  = new Field<LCKR, true>(1, 9)        

        // Port x lock bit y (y= 0..15)
        readonly LCK8  = new Field<LCKR, true>(1, 8)        

        // Port x lock bit y (y= 0..15)
        readonly LCK7  = new Field<LCKR, true>(1, 7)        

        // Port x lock bit y (y= 0..15)
        readonly LCK6  = new Field<LCKR, true>(1, 6)        

        // Port x lock bit y (y= 0..15)
        readonly LCK5  = new Field<LCKR, true>(1, 5)        

        // Port x lock bit y (y= 0..15)
        readonly LCK4  = new Field<LCKR, true>(1, 4)        

        // Port x lock bit y (y= 0..15)
        readonly LCK3  = new Field<LCKR, true>(1, 3)        

        // Port x lock bit y (y= 0..15)
        readonly LCK2  = new Field<LCKR, true>(1, 2)        

        // Port x lock bit y (y= 0..15)
        readonly LCK1  = new Field<LCKR, true>(1, 1)        

        // Port x lock bit y (y= 0..15)
        readonly LCK0  = new Field<LCKR, true>(1, 0)        
    }

    // GPIO alternate function low register
    static readonly AFRL = new class AFRL extends Register<AFRL>
    {
        constructor() { super(0x50000820) }        

        // Alternate function selection for port x bit y 
        // (y = 0..7)
        readonly AFSEL7 = new Field<AFRL, true>(4, 28)        

        // Alternate function selection for port x bit y 
        // (y = 0..7)
        readonly AFSEL6 = new Field<AFRL, true>(4, 24)        

        // Alternate function selection for port x bit y 
        // (y = 0..7)
        readonly AFSEL5 = new Field<AFRL, true>(4, 20)        

        // Alternate function selection for port x bit y 
        // (y = 0..7)
        readonly AFSEL4 = new Field<AFRL, true>(4, 16)        

        // Alternate function selection for port x bit y 
        // (y = 0..7)
        readonly AFSEL3 = new Field<AFRL, true>(4, 12)        

        // Alternate function selection for port x bit y 
        // (y = 0..7)
        readonly AFSEL2 = new Field<AFRL, true>(4, 8)        

        // Alternate function selection for port x bit y 
        // (y = 0..7)
        readonly AFSEL1 = new Field<AFRL, true>(4, 4)        

        // Alternate function selection for port x bit y 
        // (y = 0..7)
        readonly AFSEL0 = new Field<AFRL, true>(4, 0)        
    }

    // GPIO alternate function high register
    static readonly AFRH = new class AFRH extends Register<AFRH>
    {
        constructor() { super(0x50000824) }        

        // Alternate function selection for port x bit y 
        // (y = 8..15)
        readonly AFSEL15 = new Field<AFRH, true>(4, 28)        

        // Alternate function selection for port x bit y 
        // (y = 8..15)
        readonly AFSEL14 = new Field<AFRH, true>(4, 24)        

        // Alternate function selection for port x bit y 
        // (y = 8..15)
        readonly AFSEL13 = new Field<AFRH, true>(4, 20)        

        // Alternate function selection for port x bit y 
        // (y = 8..15)
        readonly AFSEL12 = new Field<AFRH, true>(4, 16)        

        // Alternate function selection for port x bit y 
        // (y = 8..15)
        readonly AFSEL11 = new Field<AFRH, true>(4, 12)        

        // Alternate function selection for port x bit y 
        // (y = 8..15)
        readonly AFSEL10 = new Field<AFRH, true>(4, 8)        

        // Alternate function selection for port x bit y 
        // (y = 8..15)
        readonly AFSEL9  = new Field<AFRH, true>(4, 4)        

        // Alternate function selection for port x bit y 
        // (y = 8..15)
        readonly AFSEL8  = new Field<AFRH, true>(4, 0)        
    }

    // port bit reset register
    static readonly BRR = new class BRR extends Register<BRR>
    {
        constructor() { super(0x50000828) }        

        // Port Reset bit
        readonly BR0  = new Field<BRR, true>(1, 0)        

        // Port Reset bit
        readonly BR1  = new Field<BRR, true>(1, 1)        

        // Port Reset bit
        readonly BR2  = new Field<BRR, true>(1, 2)        

        // Port Reset bit
        readonly BR3  = new Field<BRR, true>(1, 3)        

        // Port Reset bit
        readonly BR4  = new Field<BRR, true>(1, 4)        

        // Port Reset bit
        readonly BR5  = new Field<BRR, true>(1, 5)        

        // Port Reset bit
        readonly BR6  = new Field<BRR, true>(1, 6)        

        // Port Reset bit
        readonly BR7  = new Field<BRR, true>(1, 7)        

        // Port Reset bit
        readonly BR8  = new Field<BRR, true>(1, 8)        

        // Port Reset bit
        readonly BR9  = new Field<BRR, true>(1, 9)        

        // Port Reset bit
        readonly BR10 = new Field<BRR, true>(1, 10)        

        // Port Reset bit
        readonly BR11 = new Field<BRR, true>(1, 11)        

        // Port Reset bit
        readonly BR12 = new Field<BRR, true>(1, 12)        

        // Port Reset bit
        readonly BR13 = new Field<BRR, true>(1, 13)        

        // Port Reset bit
        readonly BR14 = new Field<BRR, true>(1, 14)        

        // Port Reset bit
        readonly BR15 = new Field<BRR, true>(1, 15)        
    }
}

export class GPIOD
{
    // GPIO port mode register
    static readonly MODER = new class MODER extends Register<MODER>
    {
        constructor() { super(0x50000c00) }        

        // Port x configuration bits (y = 0..15)
        readonly MODER15 = new Field<MODER, true>(2, 30)        

        // Port x configuration bits (y = 0..15)
        readonly MODER14 = new Field<MODER, true>(2, 28)        

        // Port x configuration bits (y = 0..15)
        readonly MODER13 = new Field<MODER, true>(2, 26)        

        // Port x configuration bits (y = 0..15)
        readonly MODER12 = new Field<MODER, true>(2, 24)        

        // Port x configuration bits (y = 0..15)
        readonly MODER11 = new Field<MODER, true>(2, 22)        

        // Port x configuration bits (y = 0..15)
        readonly MODER10 = new Field<MODER, true>(2, 20)        

        // Port x configuration bits (y = 0..15)
        readonly MODER9  = new Field<MODER, true>(2, 18)        

        // Port x configuration bits (y = 0..15)
        readonly MODER8  = new Field<MODER, true>(2, 16)        

        // Port x configuration bits (y = 0..15)
        readonly MODER7  = new Field<MODER, true>(2, 14)        

        // Port x configuration bits (y = 0..15)
        readonly MODER6  = new Field<MODER, true>(2, 12)        

        // Port x configuration bits (y = 0..15)
        readonly MODER5  = new Field<MODER, true>(2, 10)        

        // Port x configuration bits (y = 0..15)
        readonly MODER4  = new Field<MODER, true>(2, 8)        

        // Port x configuration bits (y = 0..15)
        readonly MODER3  = new Field<MODER, true>(2, 6)        

        // Port x configuration bits (y = 0..15)
        readonly MODER2  = new Field<MODER, true>(2, 4)        

        // Port x configuration bits (y = 0..15)
        readonly MODER1  = new Field<MODER, true>(2, 2)        

        // Port x configuration bits (y = 0..15)
        readonly MODER0  = new Field<MODER, true>(2, 0)        
    }

    // GPIO port output type register
    static readonly OTYPER = new class OTYPER extends Register<OTYPER>
    {
        constructor() { super(0x50000c04) }        

        // Port x configuration bits (y = 0..15)
        readonly OT15 = new Field<OTYPER, true>(1, 15)        

        // Port x configuration bits (y = 0..15)
        readonly OT14 = new Field<OTYPER, true>(1, 14)        

        // Port x configuration bits (y = 0..15)
        readonly OT13 = new Field<OTYPER, true>(1, 13)        

        // Port x configuration bits (y = 0..15)
        readonly OT12 = new Field<OTYPER, true>(1, 12)        

        // Port x configuration bits (y = 0..15)
        readonly OT11 = new Field<OTYPER, true>(1, 11)        

        // Port x configuration bits (y = 0..15)
        readonly OT10 = new Field<OTYPER, true>(1, 10)        

        // Port x configuration bits (y = 0..15)
        readonly OT9  = new Field<OTYPER, true>(1, 9)        

        // Port x configuration bits (y = 0..15)
        readonly OT8  = new Field<OTYPER, true>(1, 8)        

        // Port x configuration bits (y = 0..15)
        readonly OT7  = new Field<OTYPER, true>(1, 7)        

        // Port x configuration bits (y = 0..15)
        readonly OT6  = new Field<OTYPER, true>(1, 6)        

        // Port x configuration bits (y = 0..15)
        readonly OT5  = new Field<OTYPER, true>(1, 5)        

        // Port x configuration bits (y = 0..15)
        readonly OT4  = new Field<OTYPER, true>(1, 4)        

        // Port x configuration bits (y = 0..15)
        readonly OT3  = new Field<OTYPER, true>(1, 3)        

        // Port x configuration bits (y = 0..15)
        readonly OT2  = new Field<OTYPER, true>(1, 2)        

        // Port x configuration bits (y = 0..15)
        readonly OT1  = new Field<OTYPER, true>(1, 1)        

        // Port x configuration bits (y = 0..15)
        readonly OT0  = new Field<OTYPER, true>(1, 0)        
    }

    // GPIO port output speed register
    static readonly OSPEEDR = new class OSPEEDR extends Register<OSPEEDR>
    {
        constructor() { super(0x50000c08) }        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR15 = new Field<OSPEEDR, true>(2, 30)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR14 = new Field<OSPEEDR, true>(2, 28)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR13 = new Field<OSPEEDR, true>(2, 26)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR12 = new Field<OSPEEDR, true>(2, 24)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR11 = new Field<OSPEEDR, true>(2, 22)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR10 = new Field<OSPEEDR, true>(2, 20)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR9  = new Field<OSPEEDR, true>(2, 18)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR8  = new Field<OSPEEDR, true>(2, 16)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR7  = new Field<OSPEEDR, true>(2, 14)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR6  = new Field<OSPEEDR, true>(2, 12)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR5  = new Field<OSPEEDR, true>(2, 10)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR4  = new Field<OSPEEDR, true>(2, 8)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR3  = new Field<OSPEEDR, true>(2, 6)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR2  = new Field<OSPEEDR, true>(2, 4)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR1  = new Field<OSPEEDR, true>(2, 2)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR0  = new Field<OSPEEDR, true>(2, 0)        
    }

    // GPIO port pull-up/pull-down register
    static readonly PUPDR = new class PUPDR extends Register<PUPDR>
    {
        constructor() { super(0x50000c0c) }        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR15 = new Field<PUPDR, true>(2, 30)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR14 = new Field<PUPDR, true>(2, 28)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR13 = new Field<PUPDR, true>(2, 26)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR12 = new Field<PUPDR, true>(2, 24)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR11 = new Field<PUPDR, true>(2, 22)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR10 = new Field<PUPDR, true>(2, 20)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR9  = new Field<PUPDR, true>(2, 18)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR8  = new Field<PUPDR, true>(2, 16)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR7  = new Field<PUPDR, true>(2, 14)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR6  = new Field<PUPDR, true>(2, 12)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR5  = new Field<PUPDR, true>(2, 10)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR4  = new Field<PUPDR, true>(2, 8)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR3  = new Field<PUPDR, true>(2, 6)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR2  = new Field<PUPDR, true>(2, 4)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR1  = new Field<PUPDR, true>(2, 2)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR0  = new Field<PUPDR, true>(2, 0)        
    }

    // GPIO port input data register
    static readonly IDR = new class IDR extends Register<IDR>
    {
        constructor() { super(0x50000c10) }        

        // Port input data (y = 0..15)
        readonly IDR15 = new Field<IDR, false>(1, 15)        

        // Port input data (y = 0..15)
        readonly IDR14 = new Field<IDR, false>(1, 14)        

        // Port input data (y = 0..15)
        readonly IDR13 = new Field<IDR, false>(1, 13)        

        // Port input data (y = 0..15)
        readonly IDR12 = new Field<IDR, false>(1, 12)        

        // Port input data (y = 0..15)
        readonly IDR11 = new Field<IDR, false>(1, 11)        

        // Port input data (y = 0..15)
        readonly IDR10 = new Field<IDR, false>(1, 10)        

        // Port input data (y = 0..15)
        readonly IDR9  = new Field<IDR, false>(1, 9)        

        // Port input data (y = 0..15)
        readonly IDR8  = new Field<IDR, false>(1, 8)        

        // Port input data (y = 0..15)
        readonly IDR7  = new Field<IDR, false>(1, 7)        

        // Port input data (y = 0..15)
        readonly IDR6  = new Field<IDR, false>(1, 6)        

        // Port input data (y = 0..15)
        readonly IDR5  = new Field<IDR, false>(1, 5)        

        // Port input data (y = 0..15)
        readonly IDR4  = new Field<IDR, false>(1, 4)        

        // Port input data (y = 0..15)
        readonly IDR3  = new Field<IDR, false>(1, 3)        

        // Port input data (y = 0..15)
        readonly IDR2  = new Field<IDR, false>(1, 2)        

        // Port input data (y = 0..15)
        readonly IDR1  = new Field<IDR, false>(1, 1)        

        // Port input data (y = 0..15)
        readonly IDR0  = new Field<IDR, false>(1, 0)        
    }

    // GPIO port output data register
    static readonly ODR = new class ODR extends Register<ODR>
    {
        constructor() { super(0x50000c14) }        

        // Port output data (y = 0..15)
        readonly ODR15 = new Field<ODR, true>(1, 15)        

        // Port output data (y = 0..15)
        readonly ODR14 = new Field<ODR, true>(1, 14)        

        // Port output data (y = 0..15)
        readonly ODR13 = new Field<ODR, true>(1, 13)        

        // Port output data (y = 0..15)
        readonly ODR12 = new Field<ODR, true>(1, 12)        

        // Port output data (y = 0..15)
        readonly ODR11 = new Field<ODR, true>(1, 11)        

        // Port output data (y = 0..15)
        readonly ODR10 = new Field<ODR, true>(1, 10)        

        // Port output data (y = 0..15)
        readonly ODR9  = new Field<ODR, true>(1, 9)        

        // Port output data (y = 0..15)
        readonly ODR8  = new Field<ODR, true>(1, 8)        

        // Port output data (y = 0..15)
        readonly ODR7  = new Field<ODR, true>(1, 7)        

        // Port output data (y = 0..15)
        readonly ODR6  = new Field<ODR, true>(1, 6)        

        // Port output data (y = 0..15)
        readonly ODR5  = new Field<ODR, true>(1, 5)        

        // Port output data (y = 0..15)
        readonly ODR4  = new Field<ODR, true>(1, 4)        

        // Port output data (y = 0..15)
        readonly ODR3  = new Field<ODR, true>(1, 3)        

        // Port output data (y = 0..15)
        readonly ODR2  = new Field<ODR, true>(1, 2)        

        // Port output data (y = 0..15)
        readonly ODR1  = new Field<ODR, true>(1, 1)        

        // Port output data (y = 0..15)
        readonly ODR0  = new Field<ODR, true>(1, 0)        
    }

    // GPIO port bit set/reset register
    static readonly BSRR = new class BSRR extends Register<BSRR>
    {
        constructor() { super(0x50000c18) }        

        // Port x reset bit y (y = 0..15)
        readonly BR15 = new Field<BSRR, true>(1, 31)        

        // Port x reset bit y (y = 0..15)
        readonly BR14 = new Field<BSRR, true>(1, 30)        

        // Port x reset bit y (y = 0..15)
        readonly BR13 = new Field<BSRR, true>(1, 29)        

        // Port x reset bit y (y = 0..15)
        readonly BR12 = new Field<BSRR, true>(1, 28)        

        // Port x reset bit y (y = 0..15)
        readonly BR11 = new Field<BSRR, true>(1, 27)        

        // Port x reset bit y (y = 0..15)
        readonly BR10 = new Field<BSRR, true>(1, 26)        

        // Port x reset bit y (y = 0..15)
        readonly BR9  = new Field<BSRR, true>(1, 25)        

        // Port x reset bit y (y = 0..15)
        readonly BR8  = new Field<BSRR, true>(1, 24)        

        // Port x reset bit y (y = 0..15)
        readonly BR7  = new Field<BSRR, true>(1, 23)        

        // Port x reset bit y (y = 0..15)
        readonly BR6  = new Field<BSRR, true>(1, 22)        

        // Port x reset bit y (y = 0..15)
        readonly BR5  = new Field<BSRR, true>(1, 21)        

        // Port x reset bit y (y = 0..15)
        readonly BR4  = new Field<BSRR, true>(1, 20)        

        // Port x reset bit y (y = 0..15)
        readonly BR3  = new Field<BSRR, true>(1, 19)        

        // Port x reset bit y (y = 0..15)
        readonly BR2  = new Field<BSRR, true>(1, 18)        

        // Port x reset bit y (y = 0..15)
        readonly BR1  = new Field<BSRR, true>(1, 17)        

        // Port x set bit y (y= 0..15)
        readonly BR0  = new Field<BSRR, true>(1, 16)        

        // Port x set bit y (y= 0..15)
        readonly BS15 = new Field<BSRR, true>(1, 15)        

        // Port x set bit y (y= 0..15)
        readonly BS14 = new Field<BSRR, true>(1, 14)        

        // Port x set bit y (y= 0..15)
        readonly BS13 = new Field<BSRR, true>(1, 13)        

        // Port x set bit y (y= 0..15)
        readonly BS12 = new Field<BSRR, true>(1, 12)        

        // Port x set bit y (y= 0..15)
        readonly BS11 = new Field<BSRR, true>(1, 11)        

        // Port x set bit y (y= 0..15)
        readonly BS10 = new Field<BSRR, true>(1, 10)        

        // Port x set bit y (y= 0..15)
        readonly BS9  = new Field<BSRR, true>(1, 9)        

        // Port x set bit y (y= 0..15)
        readonly BS8  = new Field<BSRR, true>(1, 8)        

        // Port x set bit y (y= 0..15)
        readonly BS7  = new Field<BSRR, true>(1, 7)        

        // Port x set bit y (y= 0..15)
        readonly BS6  = new Field<BSRR, true>(1, 6)        

        // Port x set bit y (y= 0..15)
        readonly BS5  = new Field<BSRR, true>(1, 5)        

        // Port x set bit y (y= 0..15)
        readonly BS4  = new Field<BSRR, true>(1, 4)        

        // Port x set bit y (y= 0..15)
        readonly BS3  = new Field<BSRR, true>(1, 3)        

        // Port x set bit y (y= 0..15)
        readonly BS2  = new Field<BSRR, true>(1, 2)        

        // Port x set bit y (y= 0..15)
        readonly BS1  = new Field<BSRR, true>(1, 1)        

        // Port x set bit y (y= 0..15)
        readonly BS0  = new Field<BSRR, true>(1, 0)        
    }

    // GPIO port configuration lock register
    static readonly LCKR = new class LCKR extends Register<LCKR>
    {
        constructor() { super(0x50000c1c) }        

        // Port x lock bit y (y= 0..15)
        readonly LCKK  = new Field<LCKR, true>(1, 16)        

        // Port x lock bit y (y= 0..15)
        readonly LCK15 = new Field<LCKR, true>(1, 15)        

        // Port x lock bit y (y= 0..15)
        readonly LCK14 = new Field<LCKR, true>(1, 14)        

        // Port x lock bit y (y= 0..15)
        readonly LCK13 = new Field<LCKR, true>(1, 13)        

        // Port x lock bit y (y= 0..15)
        readonly LCK12 = new Field<LCKR, true>(1, 12)        

        // Port x lock bit y (y= 0..15)
        readonly LCK11 = new Field<LCKR, true>(1, 11)        

        // Port x lock bit y (y= 0..15)
        readonly LCK10 = new Field<LCKR, true>(1, 10)        

        // Port x lock bit y (y= 0..15)
        readonly LCK9  = new Field<LCKR, true>(1, 9)        

        // Port x lock bit y (y= 0..15)
        readonly LCK8  = new Field<LCKR, true>(1, 8)        

        // Port x lock bit y (y= 0..15)
        readonly LCK7  = new Field<LCKR, true>(1, 7)        

        // Port x lock bit y (y= 0..15)
        readonly LCK6  = new Field<LCKR, true>(1, 6)        

        // Port x lock bit y (y= 0..15)
        readonly LCK5  = new Field<LCKR, true>(1, 5)        

        // Port x lock bit y (y= 0..15)
        readonly LCK4  = new Field<LCKR, true>(1, 4)        

        // Port x lock bit y (y= 0..15)
        readonly LCK3  = new Field<LCKR, true>(1, 3)        

        // Port x lock bit y (y= 0..15)
        readonly LCK2  = new Field<LCKR, true>(1, 2)        

        // Port x lock bit y (y= 0..15)
        readonly LCK1  = new Field<LCKR, true>(1, 1)        

        // Port x lock bit y (y= 0..15)
        readonly LCK0  = new Field<LCKR, true>(1, 0)        
    }

    // GPIO alternate function low register
    static readonly AFRL = new class AFRL extends Register<AFRL>
    {
        constructor() { super(0x50000c20) }        

        // Alternate function selection for port x bit y 
        // (y = 0..7)
        readonly AFSEL7 = new Field<AFRL, true>(4, 28)        

        // Alternate function selection for port x bit y 
        // (y = 0..7)
        readonly AFSEL6 = new Field<AFRL, true>(4, 24)        

        // Alternate function selection for port x bit y 
        // (y = 0..7)
        readonly AFSEL5 = new Field<AFRL, true>(4, 20)        

        // Alternate function selection for port x bit y 
        // (y = 0..7)
        readonly AFSEL4 = new Field<AFRL, true>(4, 16)        

        // Alternate function selection for port x bit y 
        // (y = 0..7)
        readonly AFSEL3 = new Field<AFRL, true>(4, 12)        

        // Alternate function selection for port x bit y 
        // (y = 0..7)
        readonly AFSEL2 = new Field<AFRL, true>(4, 8)        

        // Alternate function selection for port x bit y 
        // (y = 0..7)
        readonly AFSEL1 = new Field<AFRL, true>(4, 4)        

        // Alternate function selection for port x bit y 
        // (y = 0..7)
        readonly AFSEL0 = new Field<AFRL, true>(4, 0)        
    }

    // GPIO alternate function high register
    static readonly AFRH = new class AFRH extends Register<AFRH>
    {
        constructor() { super(0x50000c24) }        

        // Alternate function selection for port x bit y 
        // (y = 8..15)
        readonly AFSEL15 = new Field<AFRH, true>(4, 28)        

        // Alternate function selection for port x bit y 
        // (y = 8..15)
        readonly AFSEL14 = new Field<AFRH, true>(4, 24)        

        // Alternate function selection for port x bit y 
        // (y = 8..15)
        readonly AFSEL13 = new Field<AFRH, true>(4, 20)        

        // Alternate function selection for port x bit y 
        // (y = 8..15)
        readonly AFSEL12 = new Field<AFRH, true>(4, 16)        

        // Alternate function selection for port x bit y 
        // (y = 8..15)
        readonly AFSEL11 = new Field<AFRH, true>(4, 12)        

        // Alternate function selection for port x bit y 
        // (y = 8..15)
        readonly AFSEL10 = new Field<AFRH, true>(4, 8)        

        // Alternate function selection for port x bit y 
        // (y = 8..15)
        readonly AFSEL9  = new Field<AFRH, true>(4, 4)        

        // Alternate function selection for port x bit y 
        // (y = 8..15)
        readonly AFSEL8  = new Field<AFRH, true>(4, 0)        
    }

    // port bit reset register
    static readonly BRR = new class BRR extends Register<BRR>
    {
        constructor() { super(0x50000c28) }        

        // Port Reset bit
        readonly BR0  = new Field<BRR, true>(1, 0)        

        // Port Reset bit
        readonly BR1  = new Field<BRR, true>(1, 1)        

        // Port Reset bit
        readonly BR2  = new Field<BRR, true>(1, 2)        

        // Port Reset bit
        readonly BR3  = new Field<BRR, true>(1, 3)        

        // Port Reset bit
        readonly BR4  = new Field<BRR, true>(1, 4)        

        // Port Reset bit
        readonly BR5  = new Field<BRR, true>(1, 5)        

        // Port Reset bit
        readonly BR6  = new Field<BRR, true>(1, 6)        

        // Port Reset bit
        readonly BR7  = new Field<BRR, true>(1, 7)        

        // Port Reset bit
        readonly BR8  = new Field<BRR, true>(1, 8)        

        // Port Reset bit
        readonly BR9  = new Field<BRR, true>(1, 9)        

        // Port Reset bit
        readonly BR10 = new Field<BRR, true>(1, 10)        

        // Port Reset bit
        readonly BR11 = new Field<BRR, true>(1, 11)        

        // Port Reset bit
        readonly BR12 = new Field<BRR, true>(1, 12)        

        // Port Reset bit
        readonly BR13 = new Field<BRR, true>(1, 13)        

        // Port Reset bit
        readonly BR14 = new Field<BRR, true>(1, 14)        

        // Port Reset bit
        readonly BR15 = new Field<BRR, true>(1, 15)        
    }
}

export class GPIOF
{
    // GPIO port mode register
    static readonly MODER = new class MODER extends Register<MODER>
    {
        constructor() { super(0x50001400) }        

        // Port x configuration bits (y = 0..15)
        readonly MODER15 = new Field<MODER, true>(2, 30)        

        // Port x configuration bits (y = 0..15)
        readonly MODER14 = new Field<MODER, true>(2, 28)        

        // Port x configuration bits (y = 0..15)
        readonly MODER13 = new Field<MODER, true>(2, 26)        

        // Port x configuration bits (y = 0..15)
        readonly MODER12 = new Field<MODER, true>(2, 24)        

        // Port x configuration bits (y = 0..15)
        readonly MODER11 = new Field<MODER, true>(2, 22)        

        // Port x configuration bits (y = 0..15)
        readonly MODER10 = new Field<MODER, true>(2, 20)        

        // Port x configuration bits (y = 0..15)
        readonly MODER9  = new Field<MODER, true>(2, 18)        

        // Port x configuration bits (y = 0..15)
        readonly MODER8  = new Field<MODER, true>(2, 16)        

        // Port x configuration bits (y = 0..15)
        readonly MODER7  = new Field<MODER, true>(2, 14)        

        // Port x configuration bits (y = 0..15)
        readonly MODER6  = new Field<MODER, true>(2, 12)        

        // Port x configuration bits (y = 0..15)
        readonly MODER5  = new Field<MODER, true>(2, 10)        

        // Port x configuration bits (y = 0..15)
        readonly MODER4  = new Field<MODER, true>(2, 8)        

        // Port x configuration bits (y = 0..15)
        readonly MODER3  = new Field<MODER, true>(2, 6)        

        // Port x configuration bits (y = 0..15)
        readonly MODER2  = new Field<MODER, true>(2, 4)        

        // Port x configuration bits (y = 0..15)
        readonly MODER1  = new Field<MODER, true>(2, 2)        

        // Port x configuration bits (y = 0..15)
        readonly MODER0  = new Field<MODER, true>(2, 0)        
    }

    // GPIO port output type register
    static readonly OTYPER = new class OTYPER extends Register<OTYPER>
    {
        constructor() { super(0x50001404) }        

        // Port x configuration bits (y = 0..15)
        readonly OT15 = new Field<OTYPER, true>(1, 15)        

        // Port x configuration bits (y = 0..15)
        readonly OT14 = new Field<OTYPER, true>(1, 14)        

        // Port x configuration bits (y = 0..15)
        readonly OT13 = new Field<OTYPER, true>(1, 13)        

        // Port x configuration bits (y = 0..15)
        readonly OT12 = new Field<OTYPER, true>(1, 12)        

        // Port x configuration bits (y = 0..15)
        readonly OT11 = new Field<OTYPER, true>(1, 11)        

        // Port x configuration bits (y = 0..15)
        readonly OT10 = new Field<OTYPER, true>(1, 10)        

        // Port x configuration bits (y = 0..15)
        readonly OT9  = new Field<OTYPER, true>(1, 9)        

        // Port x configuration bits (y = 0..15)
        readonly OT8  = new Field<OTYPER, true>(1, 8)        

        // Port x configuration bits (y = 0..15)
        readonly OT7  = new Field<OTYPER, true>(1, 7)        

        // Port x configuration bits (y = 0..15)
        readonly OT6  = new Field<OTYPER, true>(1, 6)        

        // Port x configuration bits (y = 0..15)
        readonly OT5  = new Field<OTYPER, true>(1, 5)        

        // Port x configuration bits (y = 0..15)
        readonly OT4  = new Field<OTYPER, true>(1, 4)        

        // Port x configuration bits (y = 0..15)
        readonly OT3  = new Field<OTYPER, true>(1, 3)        

        // Port x configuration bits (y = 0..15)
        readonly OT2  = new Field<OTYPER, true>(1, 2)        

        // Port x configuration bits (y = 0..15)
        readonly OT1  = new Field<OTYPER, true>(1, 1)        

        // Port x configuration bits (y = 0..15)
        readonly OT0  = new Field<OTYPER, true>(1, 0)        
    }

    // GPIO port output speed register
    static readonly OSPEEDR = new class OSPEEDR extends Register<OSPEEDR>
    {
        constructor() { super(0x50001408) }        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR15 = new Field<OSPEEDR, true>(2, 30)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR14 = new Field<OSPEEDR, true>(2, 28)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR13 = new Field<OSPEEDR, true>(2, 26)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR12 = new Field<OSPEEDR, true>(2, 24)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR11 = new Field<OSPEEDR, true>(2, 22)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR10 = new Field<OSPEEDR, true>(2, 20)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR9  = new Field<OSPEEDR, true>(2, 18)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR8  = new Field<OSPEEDR, true>(2, 16)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR7  = new Field<OSPEEDR, true>(2, 14)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR6  = new Field<OSPEEDR, true>(2, 12)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR5  = new Field<OSPEEDR, true>(2, 10)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR4  = new Field<OSPEEDR, true>(2, 8)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR3  = new Field<OSPEEDR, true>(2, 6)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR2  = new Field<OSPEEDR, true>(2, 4)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR1  = new Field<OSPEEDR, true>(2, 2)        

        // Port x configuration bits (y = 0..15)
        readonly OSPEEDR0  = new Field<OSPEEDR, true>(2, 0)        
    }

    // GPIO port pull-up/pull-down register
    static readonly PUPDR = new class PUPDR extends Register<PUPDR>
    {
        constructor() { super(0x5000140c) }        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR15 = new Field<PUPDR, true>(2, 30)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR14 = new Field<PUPDR, true>(2, 28)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR13 = new Field<PUPDR, true>(2, 26)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR12 = new Field<PUPDR, true>(2, 24)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR11 = new Field<PUPDR, true>(2, 22)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR10 = new Field<PUPDR, true>(2, 20)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR9  = new Field<PUPDR, true>(2, 18)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR8  = new Field<PUPDR, true>(2, 16)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR7  = new Field<PUPDR, true>(2, 14)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR6  = new Field<PUPDR, true>(2, 12)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR5  = new Field<PUPDR, true>(2, 10)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR4  = new Field<PUPDR, true>(2, 8)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR3  = new Field<PUPDR, true>(2, 6)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR2  = new Field<PUPDR, true>(2, 4)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR1  = new Field<PUPDR, true>(2, 2)        

        // Port x configuration bits (y = 0..15)
        readonly PUPDR0  = new Field<PUPDR, true>(2, 0)        
    }

    // GPIO port input data register
    static readonly IDR = new class IDR extends Register<IDR>
    {
        constructor() { super(0x50001410) }        

        // Port input data (y = 0..15)
        readonly IDR15 = new Field<IDR, false>(1, 15)        

        // Port input data (y = 0..15)
        readonly IDR14 = new Field<IDR, false>(1, 14)        

        // Port input data (y = 0..15)
        readonly IDR13 = new Field<IDR, false>(1, 13)        

        // Port input data (y = 0..15)
        readonly IDR12 = new Field<IDR, false>(1, 12)        

        // Port input data (y = 0..15)
        readonly IDR11 = new Field<IDR, false>(1, 11)        

        // Port input data (y = 0..15)
        readonly IDR10 = new Field<IDR, false>(1, 10)        

        // Port input data (y = 0..15)
        readonly IDR9  = new Field<IDR, false>(1, 9)        

        // Port input data (y = 0..15)
        readonly IDR8  = new Field<IDR, false>(1, 8)        

        // Port input data (y = 0..15)
        readonly IDR7  = new Field<IDR, false>(1, 7)        

        // Port input data (y = 0..15)
        readonly IDR6  = new Field<IDR, false>(1, 6)        

        // Port input data (y = 0..15)
        readonly IDR5  = new Field<IDR, false>(1, 5)        

        // Port input data (y = 0..15)
        readonly IDR4  = new Field<IDR, false>(1, 4)        

        // Port input data (y = 0..15)
        readonly IDR3  = new Field<IDR, false>(1, 3)        

        // Port input data (y = 0..15)
        readonly IDR2  = new Field<IDR, false>(1, 2)        

        // Port input data (y = 0..15)
        readonly IDR1  = new Field<IDR, false>(1, 1)        

        // Port input data (y = 0..15)
        readonly IDR0  = new Field<IDR, false>(1, 0)        
    }

    // GPIO port output data register
    static readonly ODR = new class ODR extends Register<ODR>
    {
        constructor() { super(0x50001414) }        

        // Port output data (y = 0..15)
        readonly ODR15 = new Field<ODR, true>(1, 15)        

        // Port output data (y = 0..15)
        readonly ODR14 = new Field<ODR, true>(1, 14)        

        // Port output data (y = 0..15)
        readonly ODR13 = new Field<ODR, true>(1, 13)        

        // Port output data (y = 0..15)
        readonly ODR12 = new Field<ODR, true>(1, 12)        

        // Port output data (y = 0..15)
        readonly ODR11 = new Field<ODR, true>(1, 11)        

        // Port output data (y = 0..15)
        readonly ODR10 = new Field<ODR, true>(1, 10)        

        // Port output data (y = 0..15)
        readonly ODR9  = new Field<ODR, true>(1, 9)        

        // Port output data (y = 0..15)
        readonly ODR8  = new Field<ODR, true>(1, 8)        

        // Port output data (y = 0..15)
        readonly ODR7  = new Field<ODR, true>(1, 7)        

        // Port output data (y = 0..15)
        readonly ODR6  = new Field<ODR, true>(1, 6)        

        // Port output data (y = 0..15)
        readonly ODR5  = new Field<ODR, true>(1, 5)        

        // Port output data (y = 0..15)
        readonly ODR4  = new Field<ODR, true>(1, 4)        

        // Port output data (y = 0..15)
        readonly ODR3  = new Field<ODR, true>(1, 3)        

        // Port output data (y = 0..15)
        readonly ODR2  = new Field<ODR, true>(1, 2)        

        // Port output data (y = 0..15)
        readonly ODR1  = new Field<ODR, true>(1, 1)        

        // Port output data (y = 0..15)
        readonly ODR0  = new Field<ODR, true>(1, 0)        
    }

    // GPIO port bit set/reset register
    static readonly BSRR = new class BSRR extends Register<BSRR>
    {
        constructor() { super(0x50001418) }        

        // Port x reset bit y (y = 0..15)
        readonly BR15 = new Field<BSRR, true>(1, 31)        

        // Port x reset bit y (y = 0..15)
        readonly BR14 = new Field<BSRR, true>(1, 30)        

        // Port x reset bit y (y = 0..15)
        readonly BR13 = new Field<BSRR, true>(1, 29)        

        // Port x reset bit y (y = 0..15)
        readonly BR12 = new Field<BSRR, true>(1, 28)        

        // Port x reset bit y (y = 0..15)
        readonly BR11 = new Field<BSRR, true>(1, 27)        

        // Port x reset bit y (y = 0..15)
        readonly BR10 = new Field<BSRR, true>(1, 26)        

        // Port x reset bit y (y = 0..15)
        readonly BR9  = new Field<BSRR, true>(1, 25)        

        // Port x reset bit y (y = 0..15)
        readonly BR8  = new Field<BSRR, true>(1, 24)        

        // Port x reset bit y (y = 0..15)
        readonly BR7  = new Field<BSRR, true>(1, 23)        

        // Port x reset bit y (y = 0..15)
        readonly BR6  = new Field<BSRR, true>(1, 22)        

        // Port x reset bit y (y = 0..15)
        readonly BR5  = new Field<BSRR, true>(1, 21)        

        // Port x reset bit y (y = 0..15)
        readonly BR4  = new Field<BSRR, true>(1, 20)        

        // Port x reset bit y (y = 0..15)
        readonly BR3  = new Field<BSRR, true>(1, 19)        

        // Port x reset bit y (y = 0..15)
        readonly BR2  = new Field<BSRR, true>(1, 18)        

        // Port x reset bit y (y = 0..15)
        readonly BR1  = new Field<BSRR, true>(1, 17)        

        // Port x set bit y (y= 0..15)
        readonly BR0  = new Field<BSRR, true>(1, 16)        

        // Port x set bit y (y= 0..15)
        readonly BS15 = new Field<BSRR, true>(1, 15)        

        // Port x set bit y (y= 0..15)
        readonly BS14 = new Field<BSRR, true>(1, 14)        

        // Port x set bit y (y= 0..15)
        readonly BS13 = new Field<BSRR, true>(1, 13)        

        // Port x set bit y (y= 0..15)
        readonly BS12 = new Field<BSRR, true>(1, 12)        

        // Port x set bit y (y= 0..15)
        readonly BS11 = new Field<BSRR, true>(1, 11)        

        // Port x set bit y (y= 0..15)
        readonly BS10 = new Field<BSRR, true>(1, 10)        

        // Port x set bit y (y= 0..15)
        readonly BS9  = new Field<BSRR, true>(1, 9)        

        // Port x set bit y (y= 0..15)
        readonly BS8  = new Field<BSRR, true>(1, 8)        

        // Port x set bit y (y= 0..15)
        readonly BS7  = new Field<BSRR, true>(1, 7)        

        // Port x set bit y (y= 0..15)
        readonly BS6  = new Field<BSRR, true>(1, 6)        

        // Port x set bit y (y= 0..15)
        readonly BS5  = new Field<BSRR, true>(1, 5)        

        // Port x set bit y (y= 0..15)
        readonly BS4  = new Field<BSRR, true>(1, 4)        

        // Port x set bit y (y= 0..15)
        readonly BS3  = new Field<BSRR, true>(1, 3)        

        // Port x set bit y (y= 0..15)
        readonly BS2  = new Field<BSRR, true>(1, 2)        

        // Port x set bit y (y= 0..15)
        readonly BS1  = new Field<BSRR, true>(1, 1)        

        // Port x set bit y (y= 0..15)
        readonly BS0  = new Field<BSRR, true>(1, 0)        
    }

    // GPIO port configuration lock register
    static readonly LCKR = new class LCKR extends Register<LCKR>
    {
        constructor() { super(0x5000141c) }        

        // Port x lock bit y (y= 0..15)
        readonly LCKK  = new Field<LCKR, true>(1, 16)        

        // Port x lock bit y (y= 0..15)
        readonly LCK15 = new Field<LCKR, true>(1, 15)        

        // Port x lock bit y (y= 0..15)
        readonly LCK14 = new Field<LCKR, true>(1, 14)        

        // Port x lock bit y (y= 0..15)
        readonly LCK13 = new Field<LCKR, true>(1, 13)        

        // Port x lock bit y (y= 0..15)
        readonly LCK12 = new Field<LCKR, true>(1, 12)        

        // Port x lock bit y (y= 0..15)
        readonly LCK11 = new Field<LCKR, true>(1, 11)        

        // Port x lock bit y (y= 0..15)
        readonly LCK10 = new Field<LCKR, true>(1, 10)        

        // Port x lock bit y (y= 0..15)
        readonly LCK9  = new Field<LCKR, true>(1, 9)        

        // Port x lock bit y (y= 0..15)
        readonly LCK8  = new Field<LCKR, true>(1, 8)        

        // Port x lock bit y (y= 0..15)
        readonly LCK7  = new Field<LCKR, true>(1, 7)        

        // Port x lock bit y (y= 0..15)
        readonly LCK6  = new Field<LCKR, true>(1, 6)        

        // Port x lock bit y (y= 0..15)
        readonly LCK5  = new Field<LCKR, true>(1, 5)        

        // Port x lock bit y (y= 0..15)
        readonly LCK4  = new Field<LCKR, true>(1, 4)        

        // Port x lock bit y (y= 0..15)
        readonly LCK3  = new Field<LCKR, true>(1, 3)        

        // Port x lock bit y (y= 0..15)
        readonly LCK2  = new Field<LCKR, true>(1, 2)        

        // Port x lock bit y (y= 0..15)
        readonly LCK1  = new Field<LCKR, true>(1, 1)        

        // Port x lock bit y (y= 0..15)
        readonly LCK0  = new Field<LCKR, true>(1, 0)        
    }

    // GPIO alternate function low register
    static readonly AFRL = new class AFRL extends Register<AFRL>
    {
        constructor() { super(0x50001420) }        

        // Alternate function selection for port x bit y 
        // (y = 0..7)
        readonly AFSEL7 = new Field<AFRL, true>(4, 28)        

        // Alternate function selection for port x bit y 
        // (y = 0..7)
        readonly AFSEL6 = new Field<AFRL, true>(4, 24)        

        // Alternate function selection for port x bit y 
        // (y = 0..7)
        readonly AFSEL5 = new Field<AFRL, true>(4, 20)        

        // Alternate function selection for port x bit y 
        // (y = 0..7)
        readonly AFSEL4 = new Field<AFRL, true>(4, 16)        

        // Alternate function selection for port x bit y 
        // (y = 0..7)
        readonly AFSEL3 = new Field<AFRL, true>(4, 12)        

        // Alternate function selection for port x bit y 
        // (y = 0..7)
        readonly AFSEL2 = new Field<AFRL, true>(4, 8)        

        // Alternate function selection for port x bit y 
        // (y = 0..7)
        readonly AFSEL1 = new Field<AFRL, true>(4, 4)        

        // Alternate function selection for port x bit y 
        // (y = 0..7)
        readonly AFSEL0 = new Field<AFRL, true>(4, 0)        
    }

    // GPIO alternate function high register
    static readonly AFRH = new class AFRH extends Register<AFRH>
    {
        constructor() { super(0x50001424) }        

        // Alternate function selection for port x bit y 
        // (y = 8..15)
        readonly AFSEL15 = new Field<AFRH, true>(4, 28)        

        // Alternate function selection for port x bit y 
        // (y = 8..15)
        readonly AFSEL14 = new Field<AFRH, true>(4, 24)        

        // Alternate function selection for port x bit y 
        // (y = 8..15)
        readonly AFSEL13 = new Field<AFRH, true>(4, 20)        

        // Alternate function selection for port x bit y 
        // (y = 8..15)
        readonly AFSEL12 = new Field<AFRH, true>(4, 16)        

        // Alternate function selection for port x bit y 
        // (y = 8..15)
        readonly AFSEL11 = new Field<AFRH, true>(4, 12)        

        // Alternate function selection for port x bit y 
        // (y = 8..15)
        readonly AFSEL10 = new Field<AFRH, true>(4, 8)        

        // Alternate function selection for port x bit y 
        // (y = 8..15)
        readonly AFSEL9  = new Field<AFRH, true>(4, 4)        

        // Alternate function selection for port x bit y 
        // (y = 8..15)
        readonly AFSEL8  = new Field<AFRH, true>(4, 0)        
    }

    // port bit reset register
    static readonly BRR = new class BRR extends Register<BRR>
    {
        constructor() { super(0x50001428) }        

        // Port Reset bit
        readonly BR0  = new Field<BRR, true>(1, 0)        

        // Port Reset bit
        readonly BR1  = new Field<BRR, true>(1, 1)        

        // Port Reset bit
        readonly BR2  = new Field<BRR, true>(1, 2)        

        // Port Reset bit
        readonly BR3  = new Field<BRR, true>(1, 3)        

        // Port Reset bit
        readonly BR4  = new Field<BRR, true>(1, 4)        

        // Port Reset bit
        readonly BR5  = new Field<BRR, true>(1, 5)        

        // Port Reset bit
        readonly BR6  = new Field<BRR, true>(1, 6)        

        // Port Reset bit
        readonly BR7  = new Field<BRR, true>(1, 7)        

        // Port Reset bit
        readonly BR8  = new Field<BRR, true>(1, 8)        

        // Port Reset bit
        readonly BR9  = new Field<BRR, true>(1, 9)        

        // Port Reset bit
        readonly BR10 = new Field<BRR, true>(1, 10)        

        // Port Reset bit
        readonly BR11 = new Field<BRR, true>(1, 11)        

        // Port Reset bit
        readonly BR12 = new Field<BRR, true>(1, 12)        

        // Port Reset bit
        readonly BR13 = new Field<BRR, true>(1, 13)        

        // Port Reset bit
        readonly BR14 = new Field<BRR, true>(1, 14)        

        // Port Reset bit
        readonly BR15 = new Field<BRR, true>(1, 15)        
    }
}

export class CRC
{
    // Data register
    static readonly DR = new class DR extends Register<DR>
    {
        constructor() { super(0x40023000) }        

        // Data register bits
        readonly DR = new Field<DR, true>(32, 0)        
    }

    // Independent data register
    static readonly IDR = new class IDR extends Register<IDR>
    {
        constructor() { super(0x40023004) }        

        // General-purpose 32-bit data register bits
        readonly IDR = new Field<IDR, true>(32, 0)        
    }

    // Control register
    static readonly CR = new class CR extends Register<CR>
    {
        constructor() { super(0x40023008) }        

        // Reverse output data
        readonly REV_OUT  = new Field<CR, true>(1, 7)        

        // Reverse input data
        readonly REV_IN   = new Field<CR, true>(2, 5)        

        // Polynomial size
        readonly POLYSIZE = new Field<CR, true>(2, 3)        

        // RESET bit
        readonly RESET    = new Field<CR, true>(1, 0)        
    }

    // Initial CRC value
    static readonly INIT = new class INIT extends Register<INIT>
    {
        constructor() { super(0x40023010) }        

        // Programmable initial CRC value
        readonly CRC_INIT = new Field<INIT, true>(32, 0)        
    }

    // polynomial
    static readonly POL = new class POL extends Register<POL>
    {
        constructor() { super(0x40023014) }        

        // Programmable polynomial
        readonly POL = new Field<POL, true>(32, 0)        
    }
}

export class EXTI
{
    // EXTI rising trigger selection register
    static readonly RTSR1 = new class RTSR1 extends Register<RTSR1>
    {
        constructor() { super(0x40021800) }        

        // Rising trigger event configuration bit of 
        // Configurable Event line
        readonly RT0  = new Field<RTSR1, true>(1, 0)        

        // Rising trigger event configuration bit of 
        // Configurable Event line
        readonly RT1  = new Field<RTSR1, true>(1, 1)        

        // Rising trigger event configuration bit of 
        // Configurable Event line
        readonly RT2  = new Field<RTSR1, true>(1, 2)        

        // Rising trigger event configuration bit of 
        // Configurable Event line
        readonly RT3  = new Field<RTSR1, true>(1, 3)        

        // Rising trigger event configuration bit of 
        // Configurable Event line
        readonly RT4  = new Field<RTSR1, true>(1, 4)        

        // Rising trigger event configuration bit of 
        // Configurable Event line
        readonly RT5  = new Field<RTSR1, true>(1, 5)        

        // Rising trigger event configuration bit of 
        // Configurable Event line
        readonly RT6  = new Field<RTSR1, true>(1, 6)        

        // Rising trigger event configuration bit of 
        // Configurable Event line
        readonly RT7  = new Field<RTSR1, true>(1, 7)        

        // Rising trigger event configuration bit of 
        // Configurable Event line
        readonly RT8  = new Field<RTSR1, true>(1, 8)        

        // Rising trigger event configuration bit of 
        // Configurable Event line
        readonly RT9  = new Field<RTSR1, true>(1, 9)        

        // Rising trigger event configuration bit of 
        // Configurable Event line
        readonly RT10 = new Field<RTSR1, true>(1, 10)        

        // Rising trigger event configuration bit of 
        // Configurable Event line
        readonly RT11 = new Field<RTSR1, true>(1, 11)        

        // Rising trigger event configuration bit of 
        // Configurable Event line
        readonly RT12 = new Field<RTSR1, true>(1, 12)        

        // Rising trigger event configuration bit of 
        // Configurable Event line
        readonly RT13 = new Field<RTSR1, true>(1, 13)        

        // Rising trigger event configuration bit of 
        // Configurable Event line
        readonly RT14 = new Field<RTSR1, true>(1, 14)        

        // Rising trigger event configuration bit of 
        // Configurable Event line
        readonly RT15 = new Field<RTSR1, true>(1, 15)        
    }

    // EXTI falling trigger selection register
    static readonly FTSR1 = new class FTSR1 extends Register<FTSR1>
    {
        constructor() { super(0x40021804) }        

        // Falling trigger event configuration bit of 
        // configurable line
        readonly FT0  = new Field<FTSR1, true>(1, 0)        

        // Falling trigger event configuration bit of 
        // configurable line
        readonly FT1  = new Field<FTSR1, true>(1, 1)        

        // Falling trigger event configuration bit of 
        // configurable line
        readonly FT2  = new Field<FTSR1, true>(1, 2)        

        // Falling trigger event configuration bit of 
        // configurable line
        readonly FT3  = new Field<FTSR1, true>(1, 3)        

        // Falling trigger event configuration bit of 
        // configurable line
        readonly FT4  = new Field<FTSR1, true>(1, 4)        

        // Falling trigger event configuration bit of 
        // configurable line
        readonly FT5  = new Field<FTSR1, true>(1, 5)        

        // Falling trigger event configuration bit of 
        // configurable line
        readonly FT6  = new Field<FTSR1, true>(1, 6)        

        // Falling trigger event configuration bit of 
        // configurable line
        readonly FT7  = new Field<FTSR1, true>(1, 7)        

        // Falling trigger event configuration bit of 
        // configurable line
        readonly FT8  = new Field<FTSR1, true>(1, 8)        

        // Falling trigger event configuration bit of 
        // configurable line
        readonly FT9  = new Field<FTSR1, true>(1, 9)        

        // Falling trigger event configuration bit of 
        // configurable line
        readonly FT10 = new Field<FTSR1, true>(1, 10)        

        // Falling trigger event configuration bit of 
        // configurable line
        readonly FT11 = new Field<FTSR1, true>(1, 11)        

        // Falling trigger event configuration bit of 
        // configurable line
        readonly FT12 = new Field<FTSR1, true>(1, 12)        

        // Falling trigger event configuration bit of 
        // configurable line
        readonly FT13 = new Field<FTSR1, true>(1, 13)        

        // Falling trigger event configuration bit of 
        // configurable line
        readonly FT14 = new Field<FTSR1, true>(1, 14)        

        // Falling trigger event configuration bit of 
        // configurable line
        readonly FT15 = new Field<FTSR1, true>(1, 15)        
    }

    // EXTI software interrupt event register
    static readonly SWIER1 = new class SWIER1 extends Register<SWIER1>
    {
        constructor() { super(0x40021808) }        

        // Software rising edge event trigger on line
        readonly SWI0  = new Field<SWIER1, true>(1, 0)        

        // Software rising edge event trigger on line
        readonly SWI1  = new Field<SWIER1, true>(1, 1)        

        // Software rising edge event trigger on line
        readonly SWI2  = new Field<SWIER1, true>(1, 2)        

        // Software rising edge event trigger on line
        readonly SWI3  = new Field<SWIER1, true>(1, 3)        

        // Software rising edge event trigger on line
        readonly SWI4  = new Field<SWIER1, true>(1, 4)        

        // Software rising edge event trigger on line
        readonly SWI5  = new Field<SWIER1, true>(1, 5)        

        // Software rising edge event trigger on line
        readonly SWI6  = new Field<SWIER1, true>(1, 6)        

        // Software rising edge event trigger on line
        readonly SWI7  = new Field<SWIER1, true>(1, 7)        

        // Software rising edge event trigger on line
        readonly SWI8  = new Field<SWIER1, true>(1, 8)        

        // Software rising edge event trigger on line
        readonly SWI9  = new Field<SWIER1, true>(1, 9)        

        // Software rising edge event trigger on line
        readonly SWI10 = new Field<SWIER1, true>(1, 10)        

        // Software rising edge event trigger on line
        readonly SWI11 = new Field<SWIER1, true>(1, 11)        

        // Software rising edge event trigger on line
        readonly SWI12 = new Field<SWIER1, true>(1, 12)        

        // Software rising edge event trigger on line
        readonly SWI13 = new Field<SWIER1, true>(1, 13)        

        // Software rising edge event trigger on line
        readonly SWI14 = new Field<SWIER1, true>(1, 14)        

        // Software rising edge event trigger on line
        readonly SWI15 = new Field<SWIER1, true>(1, 15)        
    }

    // EXTI rising edge pending register
    static readonly RPR1 = new class RPR1 extends Register<RPR1>
    {
        constructor() { super(0x4002180c) }        

        // Rising edge event pending for configurable line
        readonly RPIF0  = new Field<RPR1, true>(1, 0)        

        // Rising edge event pending for configurable line
        readonly RPIF1  = new Field<RPR1, true>(1, 1)        

        // Rising edge event pending for configurable line
        readonly RPIF2  = new Field<RPR1, true>(1, 2)        

        // Rising edge event pending for configurable line
        readonly RPIF3  = new Field<RPR1, true>(1, 3)        

        // Rising edge event pending for configurable line
        readonly RPIF4  = new Field<RPR1, true>(1, 4)        

        // configurable event inputs x rising edge Pending 
        // bit
        readonly RPIF5  = new Field<RPR1, true>(1, 5)        

        // Rising edge event pending for configurable line
        readonly RPIF6  = new Field<RPR1, true>(1, 6)        

        // Rising edge event pending for configurable line
        readonly RPIF7  = new Field<RPR1, true>(1, 7)        

        // Rising edge event pending for configurable line
        readonly RPIF8  = new Field<RPR1, true>(1, 8)        

        // Rising edge event pending for configurable line
        readonly RPIF9  = new Field<RPR1, true>(1, 9)        

        // Rising edge event pending for configurable 
        // line
        readonly RPIF10 = new Field<RPR1, true>(1, 10)        

        // Rising edge event pending for configurable 
        // line
        readonly RPIF11 = new Field<RPR1, true>(1, 11)        

        // Rising edge event pending for configurable 
        // line
        readonly RPIF12 = new Field<RPR1, true>(1, 12)        

        // Rising edge event pending for configurable 
        // line
        readonly RPIF13 = new Field<RPR1, true>(1, 13)        

        // Rising edge event pending for configurable 
        // line
        readonly RPIF14 = new Field<RPR1, true>(1, 14)        

        // Rising edge event pending for configurable 
        // line
        readonly RPIF15 = new Field<RPR1, true>(1, 15)        
    }

    // EXTI falling edge pending register
    static readonly FPR1 = new class FPR1 extends Register<FPR1>
    {
        constructor() { super(0x40021810) }        

        // Falling edge event pending for configurable 
        // line
        readonly FPIF0  = new Field<FPR1, true>(1, 0)        

        // Falling edge event pending for configurable 
        // line
        readonly FPIF1  = new Field<FPR1, true>(1, 1)        

        // Falling edge event pending for configurable 
        // line
        readonly FPIF2  = new Field<FPR1, true>(1, 2)        

        // Falling edge event pending for configurable 
        // line
        readonly FPIF3  = new Field<FPR1, true>(1, 3)        

        // Falling edge event pending for configurable 
        // line
        readonly FPIF4  = new Field<FPR1, true>(1, 4)        

        // Falling edge event pending for configurable 
        // line
        readonly FPIF5  = new Field<FPR1, true>(1, 5)        

        // Falling edge event pending for configurable 
        // line
        readonly FPIF6  = new Field<FPR1, true>(1, 6)        

        // Falling edge event pending for configurable 
        // line
        readonly FPIF7  = new Field<FPR1, true>(1, 7)        

        // Falling edge event pending for configurable 
        // line
        readonly FPIF8  = new Field<FPR1, true>(1, 8)        

        // Falling edge event pending for configurable 
        // line
        readonly FPIF9  = new Field<FPR1, true>(1, 9)        

        // Falling edge event pending for configurable 
        // line
        readonly FPIF10 = new Field<FPR1, true>(1, 10)        

        // Falling edge event pending for configurable 
        // line
        readonly FPIF11 = new Field<FPR1, true>(1, 11)        

        // Falling edge event pending for configurable 
        // line
        readonly FPIF12 = new Field<FPR1, true>(1, 12)        

        // Falling edge event pending for configurable 
        // line
        readonly FPIF13 = new Field<FPR1, true>(1, 13)        

        // Falling edge event pending for configurable 
        // line
        readonly FPIF14 = new Field<FPR1, true>(1, 14)        

        // Falling edge event pending for configurable 
        // line
        readonly FPIF15 = new Field<FPR1, true>(1, 15)        
    }

    // EXTI external interrupt selection 
    // register
    static readonly EXTICR1 = new class EXTICR1 extends Register<EXTICR1>
    {
        constructor() { super(0x40021860) }        

        // GPIO port selection
        readonly EXTI0_7   = new Field<EXTICR1, true>(8, 0)        

        // GPIO port selection
        readonly EXTI8_15  = new Field<EXTICR1, true>(8, 8)        

        // GPIO port selection
        readonly EXTI16_23 = new Field<EXTICR1, true>(8, 16)        

        // GPIO port selection
        readonly EXTI24_31 = new Field<EXTICR1, true>(8, 24)        
    }

    // EXTI external interrupt selection 
    // register
    static readonly EXTICR2 = new class EXTICR2 extends Register<EXTICR2>
    {
        constructor() { super(0x40021864) }        

        // GPIO port selection
        readonly EXTI0_7   = new Field<EXTICR2, true>(8, 0)        

        // GPIO port selection
        readonly EXTI8_15  = new Field<EXTICR2, true>(8, 8)        

        // GPIO port selection
        readonly EXTI16_23 = new Field<EXTICR2, true>(8, 16)        

        // GPIO port selection
        readonly EXTI24_31 = new Field<EXTICR2, true>(8, 24)        
    }

    // EXTI external interrupt selection 
    // register
    static readonly EXTICR3 = new class EXTICR3 extends Register<EXTICR3>
    {
        constructor() { super(0x40021868) }        

        // GPIO port selection
        readonly EXTI0_7   = new Field<EXTICR3, true>(8, 0)        

        // GPIO port selection
        readonly EXTI8_15  = new Field<EXTICR3, true>(8, 8)        

        // GPIO port selection
        readonly EXTI16_23 = new Field<EXTICR3, true>(8, 16)        

        // GPIO port selection
        readonly EXTI24_31 = new Field<EXTICR3, true>(8, 24)        
    }

    // EXTI external interrupt selection 
    // register
    static readonly EXTICR4 = new class EXTICR4 extends Register<EXTICR4>
    {
        constructor() { super(0x4002186c) }        

        // GPIO port selection
        readonly EXTI0_7   = new Field<EXTICR4, true>(8, 0)        

        // GPIO port selection
        readonly EXTI8_15  = new Field<EXTICR4, true>(8, 8)        

        // GPIO port selection
        readonly EXTI16_23 = new Field<EXTICR4, true>(8, 16)        

        // GPIO port selection
        readonly EXTI24_31 = new Field<EXTICR4, true>(8, 24)        
    }

    // EXTI CPU wakeup with interrupt mask 
    // register
    static readonly IMR1 = new class IMR1 extends Register<IMR1>
    {
        constructor() { super(0x40021880) }        

        // CPU wakeup with interrupt mask on event input
        readonly IM0  = new Field<IMR1, true>(1, 0)        

        // CPU wakeup with interrupt mask on event input
        readonly IM1  = new Field<IMR1, true>(1, 1)        

        // CPU wakeup with interrupt mask on event input
        readonly IM2  = new Field<IMR1, true>(1, 2)        

        // CPU wakeup with interrupt mask on event input
        readonly IM3  = new Field<IMR1, true>(1, 3)        

        // CPU wakeup with interrupt mask on event input
        readonly IM4  = new Field<IMR1, true>(1, 4)        

        // CPU wakeup with interrupt mask on event input
        readonly IM5  = new Field<IMR1, true>(1, 5)        

        // CPU wakeup with interrupt mask on event input
        readonly IM6  = new Field<IMR1, true>(1, 6)        

        // CPU wakeup with interrupt mask on event input
        readonly IM7  = new Field<IMR1, true>(1, 7)        

        // CPU wakeup with interrupt mask on event input
        readonly IM8  = new Field<IMR1, true>(1, 8)        

        // CPU wakeup with interrupt mask on event input
        readonly IM9  = new Field<IMR1, true>(1, 9)        

        // CPU wakeup with interrupt mask on event input
        readonly IM10 = new Field<IMR1, true>(1, 10)        

        // CPU wakeup with interrupt mask on event input
        readonly IM11 = new Field<IMR1, true>(1, 11)        

        // CPU wakeup with interrupt mask on event input
        readonly IM12 = new Field<IMR1, true>(1, 12)        

        // CPU wakeup with interrupt mask on event input
        readonly IM13 = new Field<IMR1, true>(1, 13)        

        // CPU wakeup with interrupt mask on event input
        readonly IM14 = new Field<IMR1, true>(1, 14)        

        // CPU wakeup with interrupt mask on event input
        readonly IM15 = new Field<IMR1, true>(1, 15)        

        // CPU wakeup with interrupt mask on event input
        readonly IM19 = new Field<IMR1, true>(1, 19)        

        // CPU wakeup with interrupt mask on event input
        readonly IM21 = new Field<IMR1, true>(1, 21)        

        // CPU wakeup with interrupt mask on event input
        readonly IM22 = new Field<IMR1, true>(1, 22)        

        // CPU wakeup with interrupt mask on event input
        readonly IM23 = new Field<IMR1, true>(1, 23)        

        // CPU wakeup with interrupt mask on event input
        readonly IM24 = new Field<IMR1, true>(1, 24)        

        // CPU wakeup with interrupt mask on event input
        readonly IM25 = new Field<IMR1, true>(1, 25)        

        // CPU wakeup with interrupt mask on event input
        readonly IM26 = new Field<IMR1, true>(1, 26)        

        // CPU wakeup with interrupt mask on event input
        readonly IM31 = new Field<IMR1, true>(1, 31)        
    }

    // EXTI CPU wakeup with event mask register
    static readonly EMR1 = new class EMR1 extends Register<EMR1>
    {
        constructor() { super(0x40021884) }        

        // CPU wakeup with event mask on event input
        readonly EM0  = new Field<EMR1, true>(1, 0)        

        // CPU wakeup with event mask on event input
        readonly EM1  = new Field<EMR1, true>(1, 1)        

        // CPU wakeup with event mask on event input
        readonly EM2  = new Field<EMR1, true>(1, 2)        

        // CPU wakeup with event mask on event input
        readonly EM3  = new Field<EMR1, true>(1, 3)        

        // CPU wakeup with event mask on event input
        readonly EM4  = new Field<EMR1, true>(1, 4)        

        // CPU wakeup with event mask on event input
        readonly EM5  = new Field<EMR1, true>(1, 5)        

        // CPU wakeup with event mask on event input
        readonly EM6  = new Field<EMR1, true>(1, 6)        

        // CPU wakeup with event mask on event input
        readonly EM7  = new Field<EMR1, true>(1, 7)        

        // CPU wakeup with event mask on event input
        readonly EM8  = new Field<EMR1, true>(1, 8)        

        // CPU wakeup with event mask on event input
        readonly EM9  = new Field<EMR1, true>(1, 9)        

        // CPU wakeup with event mask on event input
        readonly EM10 = new Field<EMR1, true>(1, 10)        

        // CPU wakeup with event mask on event input
        readonly EM11 = new Field<EMR1, true>(1, 11)        

        // CPU wakeup with event mask on event input
        readonly EM12 = new Field<EMR1, true>(1, 12)        

        // CPU wakeup with event mask on event input
        readonly EM13 = new Field<EMR1, true>(1, 13)        

        // CPU wakeup with event mask on event input
        readonly EM14 = new Field<EMR1, true>(1, 14)        

        // CPU wakeup with event mask on event input
        readonly EM15 = new Field<EMR1, true>(1, 15)        

        // CPU wakeup with event mask on event input
        readonly EM19 = new Field<EMR1, true>(1, 19)        

        // CPU wakeup with event mask on event input
        readonly EM21 = new Field<EMR1, true>(1, 21)        

        // CPU wakeup with event mask on event input
        readonly EM23 = new Field<EMR1, true>(1, 23)        

        // CPU wakeup with event mask on event input
        readonly EM25 = new Field<EMR1, true>(1, 25)        

        // CPU wakeup with event mask on event input
        readonly EM26 = new Field<EMR1, true>(1, 26)        

        // CPU wakeup with event mask on event input
        readonly EM31 = new Field<EMR1, true>(1, 31)        
    }
}

export class TIM16
{
    // control register 1
    static readonly CR1 = new class CR1 extends Register<CR1>
    {
        constructor() { super(0x40014400) }        

        // Counter enable
        readonly CEN      = new Field<CR1, true>(1, 0)        

        // Update disable
        readonly UDIS     = new Field<CR1, true>(1, 1)        

        // Update request source
        readonly URS      = new Field<CR1, true>(1, 2)        

        // One-pulse mode
        readonly OPM      = new Field<CR1, true>(1, 3)        

        // Auto-reload preload enable
        readonly ARPE     = new Field<CR1, true>(1, 7)        

        // Clock division
        readonly CKD      = new Field<CR1, true>(2, 8)        

        // UIF status bit remapping
        readonly UIFREMAP = new Field<CR1, true>(1, 11)        
    }

    // control register 2
    static readonly CR2 = new class CR2 extends Register<CR2>
    {
        constructor() { super(0x40014404) }        

        // Output Idle state 1
        readonly OIS1N = new Field<CR2, true>(1, 9)        

        // Output Idle state 1
        readonly OIS1  = new Field<CR2, true>(1, 8)        

        // Capture/compare DMA selection
        readonly CCDS  = new Field<CR2, true>(1, 3)        

        // Capture/compare control update selection
        readonly CCUS  = new Field<CR2, true>(1, 2)        

        // Capture/compare preloaded control
        readonly CCPC  = new Field<CR2, true>(1, 0)        
    }

    // DMA/Interrupt enable register
    static readonly DIER = new class DIER extends Register<DIER>
    {
        constructor() { super(0x4001440c) }        

        // COM DMA request enable
        readonly COMDE = new Field<DIER, true>(1, 13)        

        // Capture/Compare 1 DMA request enable
        readonly CC1DE = new Field<DIER, true>(1, 9)        

        // Update DMA request enable
        readonly UDE   = new Field<DIER, true>(1, 8)        

        // Break interrupt enable
        readonly BIE   = new Field<DIER, true>(1, 7)        

        // COM interrupt enable
        readonly COMIE = new Field<DIER, true>(1, 5)        

        // Capture/Compare 1 interrupt enable
        readonly CC1IE = new Field<DIER, true>(1, 1)        

        // Update interrupt enable
        readonly UIE   = new Field<DIER, true>(1, 0)        
    }

    // status register
    static readonly SR = new class SR extends Register<SR>
    {
        constructor() { super(0x40014410) }        

        // Capture/Compare 1 overcapture flag
        readonly CC1OF = new Field<SR, true>(1, 9)        

        // Break interrupt flag
        readonly BIF   = new Field<SR, true>(1, 7)        

        // COM interrupt flag
        readonly COMIF = new Field<SR, true>(1, 5)        

        // Capture/compare 1 interrupt flag
        readonly CC1IF = new Field<SR, true>(1, 1)        

        // Update interrupt flag
        readonly UIF   = new Field<SR, true>(1, 0)        
    }

    // event generation register
    static readonly EGR = new class EGR extends Register<EGR>
    {
        constructor() { super(0x40014414) }        

        // Break generation
        readonly BG   = new Field<EGR, true>(1, 7)        

        // Capture/Compare control update generation
        readonly COMG = new Field<EGR, true>(1, 5)        

        // Capture/compare 1 generation
        readonly CC1G = new Field<EGR, true>(1, 1)        

        // Update generation
        readonly UG   = new Field<EGR, true>(1, 0)        
    }

    // capture/compare mode register (output 
    // mode)
    static readonly CCMR1_Output = new class CCMR1_Output extends Register<CCMR1_Output>
    {
        constructor() { super(0x40014418) }        

        // Output Compare 1 mode
        readonly OC1M_2 = new Field<CCMR1_Output, true>(1, 16)        

        // Output Compare 1 mode
        readonly OC1M   = new Field<CCMR1_Output, true>(3, 4)        

        // Output Compare 1 preload enable
        readonly OC1PE  = new Field<CCMR1_Output, true>(1, 3)        

        // Output Compare 1 fast enable
        readonly OC1FE  = new Field<CCMR1_Output, true>(1, 2)        

        // Capture/Compare 1 selection
        readonly CC1S   = new Field<CCMR1_Output, true>(2, 0)        
    }

    // capture/compare mode register 1 (input 
    // mode)
    static readonly CCMR1_Input = new class CCMR1_Input extends Register<CCMR1_Input>
    {
        constructor() { super(0x40014418) }        

        // Input capture 1 filter
        readonly IC1F   = new Field<CCMR1_Input, true>(4, 4)        

        // Input capture 1 prescaler
        readonly IC1PSC = new Field<CCMR1_Input, true>(2, 2)        

        // Capture/Compare 1 selection
        readonly CC1S   = new Field<CCMR1_Input, true>(2, 0)        
    }

    // capture/compare enable register
    static readonly CCER = new class CCER extends Register<CCER>
    {
        constructor() { super(0x40014420) }        

        // Capture/Compare 1 output Polarity
        readonly CC1NP = new Field<CCER, true>(1, 3)        

        // Capture/Compare 1 complementary output enable
        readonly CC1NE = new Field<CCER, true>(1, 2)        

        // Capture/Compare 1 output Polarity
        readonly CC1P  = new Field<CCER, true>(1, 1)        

        // Capture/Compare 1 output enable
        readonly CC1E  = new Field<CCER, true>(1, 0)        
    }

    // counter
    static readonly CNT = new class CNT extends Register<CNT>
    {
        constructor() { super(0x40014424) }        

        // counter value
        readonly CNT    = new Field<CNT, true>(16, 0)        

        // UIF Copy
        readonly UIFCPY = new Field<CNT, false>(1, 31)        
    }

    // prescaler
    static readonly PSC = new class PSC extends Register<PSC>
    {
        constructor() { super(0x40014428) }        

        // Prescaler value
        readonly PSC = new Field<PSC, true>(16, 0)        
    }

    // auto-reload register
    static readonly ARR = new class ARR extends Register<ARR>
    {
        constructor() { super(0x4001442c) }        

        // Auto-reload value
        readonly ARR = new Field<ARR, true>(16, 0)        
    }

    // repetition counter register
    static readonly RCR = new class RCR extends Register<RCR>
    {
        constructor() { super(0x40014430) }        

        // Repetition counter value
        readonly REP = new Field<RCR, true>(8, 0)        
    }

    // capture/compare register 1
    static readonly CCR1 = new class CCR1 extends Register<CCR1>
    {
        constructor() { super(0x40014434) }        

        // Capture/Compare 1 value
        readonly CCR1 = new Field<CCR1, true>(16, 0)        
    }

    // break and dead-time register
    static readonly BDTR = new class BDTR extends Register<BDTR>
    {
        constructor() { super(0x40014444) }        

        // Dead-time generator setup
        readonly DTG    = new Field<BDTR, true>(8, 0)        

        // Lock configuration
        readonly LOCK   = new Field<BDTR, true>(2, 8)        

        // Off-state selection for Idle mode
        readonly OSSI   = new Field<BDTR, true>(1, 10)        

        // Off-state selection for Run mode
        readonly OSSR   = new Field<BDTR, true>(1, 11)        

        // Break enable
        readonly BKE    = new Field<BDTR, true>(1, 12)        

        // Break polarity
        readonly BKP    = new Field<BDTR, true>(1, 13)        

        // Automatic output enable
        readonly AOE    = new Field<BDTR, true>(1, 14)        

        // Main output enable
        readonly MOE    = new Field<BDTR, true>(1, 15)        

        // Break filter
        readonly BKF    = new Field<BDTR, true>(4, 16)        

        // Break Disarm
        readonly BKDSRM = new Field<BDTR, true>(1, 26)        

        // Break Bidirectional
        readonly BKBID  = new Field<BDTR, true>(1, 28)        
    }

    // DMA control register
    static readonly DCR = new class DCR extends Register<DCR>
    {
        constructor() { super(0x40014448) }        

        // DMA burst length
        readonly DBL = new Field<DCR, true>(5, 8)        

        // DMA base address
        readonly DBA = new Field<DCR, true>(5, 0)        
    }

    // DMA address for full transfer
    static readonly DMAR = new class DMAR extends Register<DMAR>
    {
        constructor() { super(0x4001444c) }        

        // DMA register for burst accesses
        readonly DMAB = new Field<DMAR, true>(16, 0)        
    }

    // TIM17 option register 1
    static readonly AF1 = new class AF1 extends Register<AF1>
    {
        constructor() { super(0x40014460) }        

        // BRK BKIN input enable
        readonly BKINE    = new Field<AF1, true>(1, 0)        

        // BRK COMP1 enable
        readonly BKCMP1E  = new Field<AF1, true>(1, 1)        

        // BRK COMP2 enable
        readonly BKCMP2E  = new Field<AF1, true>(1, 2)        

        // BRK DFSDM_BREAK1 enable
        readonly BKDFBK1E = new Field<AF1, true>(1, 8)        

        // BRK BKIN input polarity
        readonly BKINP    = new Field<AF1, true>(1, 9)        

        // BRK COMP1 input polarity
        readonly BKCMP1P  = new Field<AF1, true>(1, 10)        

        // BRK COMP2 input polarit
        readonly BKCMP2P  = new Field<AF1, true>(1, 11)        
    }

    // input selection register
    static readonly TISEL = new class TISEL extends Register<TISEL>
    {
        constructor() { super(0x40014468) }        

        // selects input
        readonly TI1SEL = new Field<TISEL, true>(4, 0)        
    }
}

export class TIM17
{
    // control register 1
    static readonly CR1 = new class CR1 extends Register<CR1>
    {
        constructor() { super(0x40014800) }        

        // Counter enable
        readonly CEN      = new Field<CR1, true>(1, 0)        

        // Update disable
        readonly UDIS     = new Field<CR1, true>(1, 1)        

        // Update request source
        readonly URS      = new Field<CR1, true>(1, 2)        

        // One-pulse mode
        readonly OPM      = new Field<CR1, true>(1, 3)        

        // Auto-reload preload enable
        readonly ARPE     = new Field<CR1, true>(1, 7)        

        // Clock division
        readonly CKD      = new Field<CR1, true>(2, 8)        

        // UIF status bit remapping
        readonly UIFREMAP = new Field<CR1, true>(1, 11)        
    }

    // control register 2
    static readonly CR2 = new class CR2 extends Register<CR2>
    {
        constructor() { super(0x40014804) }        

        // Output Idle state 1
        readonly OIS1N = new Field<CR2, true>(1, 9)        

        // Output Idle state 1
        readonly OIS1  = new Field<CR2, true>(1, 8)        

        // Capture/compare DMA selection
        readonly CCDS  = new Field<CR2, true>(1, 3)        

        // Capture/compare control update selection
        readonly CCUS  = new Field<CR2, true>(1, 2)        

        // Capture/compare preloaded control
        readonly CCPC  = new Field<CR2, true>(1, 0)        
    }

    // DMA/Interrupt enable register
    static readonly DIER = new class DIER extends Register<DIER>
    {
        constructor() { super(0x4001480c) }        

        // COM DMA request enable
        readonly COMDE = new Field<DIER, true>(1, 13)        

        // Capture/Compare 1 DMA request enable
        readonly CC1DE = new Field<DIER, true>(1, 9)        

        // Update DMA request enable
        readonly UDE   = new Field<DIER, true>(1, 8)        

        // Break interrupt enable
        readonly BIE   = new Field<DIER, true>(1, 7)        

        // COM interrupt enable
        readonly COMIE = new Field<DIER, true>(1, 5)        

        // Capture/Compare 1 interrupt enable
        readonly CC1IE = new Field<DIER, true>(1, 1)        

        // Update interrupt enable
        readonly UIE   = new Field<DIER, true>(1, 0)        
    }

    // status register
    static readonly SR = new class SR extends Register<SR>
    {
        constructor() { super(0x40014810) }        

        // Capture/Compare 1 overcapture flag
        readonly CC1OF = new Field<SR, true>(1, 9)        

        // Break interrupt flag
        readonly BIF   = new Field<SR, true>(1, 7)        

        // COM interrupt flag
        readonly COMIF = new Field<SR, true>(1, 5)        

        // Capture/compare 1 interrupt flag
        readonly CC1IF = new Field<SR, true>(1, 1)        

        // Update interrupt flag
        readonly UIF   = new Field<SR, true>(1, 0)        
    }

    // event generation register
    static readonly EGR = new class EGR extends Register<EGR>
    {
        constructor() { super(0x40014814) }        

        // Break generation
        readonly BG   = new Field<EGR, true>(1, 7)        

        // Capture/Compare control update generation
        readonly COMG = new Field<EGR, true>(1, 5)        

        // Capture/compare 1 generation
        readonly CC1G = new Field<EGR, true>(1, 1)        

        // Update generation
        readonly UG   = new Field<EGR, true>(1, 0)        
    }

    // capture/compare mode register (output 
    // mode)
    static readonly CCMR1_Output = new class CCMR1_Output extends Register<CCMR1_Output>
    {
        constructor() { super(0x40014818) }        

        // Output Compare 1 mode
        readonly OC1M_2 = new Field<CCMR1_Output, true>(1, 16)        

        // Output Compare 1 mode
        readonly OC1M   = new Field<CCMR1_Output, true>(3, 4)        

        // Output Compare 1 preload enable
        readonly OC1PE  = new Field<CCMR1_Output, true>(1, 3)        

        // Output Compare 1 fast enable
        readonly OC1FE  = new Field<CCMR1_Output, true>(1, 2)        

        // Capture/Compare 1 selection
        readonly CC1S   = new Field<CCMR1_Output, true>(2, 0)        
    }

    // capture/compare mode register 1 (input 
    // mode)
    static readonly CCMR1_Input = new class CCMR1_Input extends Register<CCMR1_Input>
    {
        constructor() { super(0x40014818) }        

        // Input capture 1 filter
        readonly IC1F   = new Field<CCMR1_Input, true>(4, 4)        

        // Input capture 1 prescaler
        readonly IC1PSC = new Field<CCMR1_Input, true>(2, 2)        

        // Capture/Compare 1 selection
        readonly CC1S   = new Field<CCMR1_Input, true>(2, 0)        
    }

    // capture/compare enable register
    static readonly CCER = new class CCER extends Register<CCER>
    {
        constructor() { super(0x40014820) }        

        // Capture/Compare 1 output Polarity
        readonly CC1NP = new Field<CCER, true>(1, 3)        

        // Capture/Compare 1 complementary output enable
        readonly CC1NE = new Field<CCER, true>(1, 2)        

        // Capture/Compare 1 output Polarity
        readonly CC1P  = new Field<CCER, true>(1, 1)        

        // Capture/Compare 1 output enable
        readonly CC1E  = new Field<CCER, true>(1, 0)        
    }

    // counter
    static readonly CNT = new class CNT extends Register<CNT>
    {
        constructor() { super(0x40014824) }        

        // counter value
        readonly CNT    = new Field<CNT, true>(16, 0)        

        // UIF Copy
        readonly UIFCPY = new Field<CNT, false>(1, 31)        
    }

    // prescaler
    static readonly PSC = new class PSC extends Register<PSC>
    {
        constructor() { super(0x40014828) }        

        // Prescaler value
        readonly PSC = new Field<PSC, true>(16, 0)        
    }

    // auto-reload register
    static readonly ARR = new class ARR extends Register<ARR>
    {
        constructor() { super(0x4001482c) }        

        // Auto-reload value
        readonly ARR = new Field<ARR, true>(16, 0)        
    }

    // repetition counter register
    static readonly RCR = new class RCR extends Register<RCR>
    {
        constructor() { super(0x40014830) }        

        // Repetition counter value
        readonly REP = new Field<RCR, true>(8, 0)        
    }

    // capture/compare register 1
    static readonly CCR1 = new class CCR1 extends Register<CCR1>
    {
        constructor() { super(0x40014834) }        

        // Capture/Compare 1 value
        readonly CCR1 = new Field<CCR1, true>(16, 0)        
    }

    // break and dead-time register
    static readonly BDTR = new class BDTR extends Register<BDTR>
    {
        constructor() { super(0x40014844) }        

        // Dead-time generator setup
        readonly DTG    = new Field<BDTR, true>(8, 0)        

        // Lock configuration
        readonly LOCK   = new Field<BDTR, true>(2, 8)        

        // Off-state selection for Idle mode
        readonly OSSI   = new Field<BDTR, true>(1, 10)        

        // Off-state selection for Run mode
        readonly OSSR   = new Field<BDTR, true>(1, 11)        

        // Break enable
        readonly BKE    = new Field<BDTR, true>(1, 12)        

        // Break polarity
        readonly BKP    = new Field<BDTR, true>(1, 13)        

        // Automatic output enable
        readonly AOE    = new Field<BDTR, true>(1, 14)        

        // Main output enable
        readonly MOE    = new Field<BDTR, true>(1, 15)        

        // Break filter
        readonly BKF    = new Field<BDTR, true>(4, 16)        

        // Break Disarm
        readonly BKDSRM = new Field<BDTR, true>(1, 26)        

        // Break Bidirectional
        readonly BKBID  = new Field<BDTR, true>(1, 28)        
    }

    // DMA control register
    static readonly DCR = new class DCR extends Register<DCR>
    {
        constructor() { super(0x40014848) }        

        // DMA burst length
        readonly DBL = new Field<DCR, true>(5, 8)        

        // DMA base address
        readonly DBA = new Field<DCR, true>(5, 0)        
    }

    // DMA address for full transfer
    static readonly DMAR = new class DMAR extends Register<DMAR>
    {
        constructor() { super(0x4001484c) }        

        // DMA register for burst accesses
        readonly DMAB = new Field<DMAR, true>(16, 0)        
    }

    // TIM17 option register 1
    static readonly AF1 = new class AF1 extends Register<AF1>
    {
        constructor() { super(0x40014860) }        

        // BRK BKIN input enable
        readonly BKINE    = new Field<AF1, true>(1, 0)        

        // BRK COMP1 enable
        readonly BKCMP1E  = new Field<AF1, true>(1, 1)        

        // BRK COMP2 enable
        readonly BKCMP2E  = new Field<AF1, true>(1, 2)        

        // BRK DFSDM_BREAK1 enable
        readonly BKDFBK1E = new Field<AF1, true>(1, 8)        

        // BRK BKIN input polarity
        readonly BKINP    = new Field<AF1, true>(1, 9)        

        // BRK COMP1 input polarity
        readonly BKCMP1P  = new Field<AF1, true>(1, 10)        

        // BRK COMP2 input polarit
        readonly BKCMP2P  = new Field<AF1, true>(1, 11)        
    }

    // input selection register
    static readonly TISEL = new class TISEL extends Register<TISEL>
    {
        constructor() { super(0x40014868) }        

        // selects input
        readonly TI1SEL = new Field<TISEL, true>(4, 0)        
    }
}

export class USART1
{
    // Control register 1
    static readonly CR1 = new class CR1 extends Register<CR1>
    {
        constructor() { super(0x40013800) }        

        // RXFIFO Full interrupt enable
        readonly RXFFIE = new Field<CR1, true>(1, 31)        

        // TXFIFO empty interrupt enable
        readonly TXFEIE = new Field<CR1, true>(1, 30)        

        // FIFO mode enable
        readonly FIFOEN = new Field<CR1, true>(1, 29)        

        // Word length
        readonly M1     = new Field<CR1, true>(1, 28)        

        // End of Block interrupt enable
        readonly EOBIE  = new Field<CR1, true>(1, 27)        

        // Receiver timeout interrupt enable
        readonly RTOIE  = new Field<CR1, true>(1, 26)        

        // DEAT
        readonly DEAT   = new Field<CR1, true>(5, 21)        

        // DEDT
        readonly DEDT   = new Field<CR1, true>(5, 16)        

        // Oversampling mode
        readonly OVER8  = new Field<CR1, true>(1, 15)        

        // Character match interrupt enable
        readonly CMIE   = new Field<CR1, true>(1, 14)        

        // Mute mode enable
        readonly MME    = new Field<CR1, true>(1, 13)        

        // Word length
        readonly M0     = new Field<CR1, true>(1, 12)        

        // Receiver wakeup method
        readonly WAKE   = new Field<CR1, true>(1, 11)        

        // Parity control enable
        readonly PCE    = new Field<CR1, true>(1, 10)        

        // Parity selection
        readonly PS     = new Field<CR1, true>(1, 9)        

        // PE interrupt enable
        readonly PEIE   = new Field<CR1, true>(1, 8)        

        // interrupt enable
        readonly TXEIE  = new Field<CR1, true>(1, 7)        

        // Transmission complete interrupt enable
        readonly TCIE   = new Field<CR1, true>(1, 6)        

        // RXNE interrupt enable
        readonly RXNEIE = new Field<CR1, true>(1, 5)        

        // IDLE interrupt enable
        readonly IDLEIE = new Field<CR1, true>(1, 4)        

        // Transmitter enable
        readonly TE     = new Field<CR1, true>(1, 3)        

        // Receiver enable
        readonly RE     = new Field<CR1, true>(1, 2)        

        // USART enable in Stop mode
        readonly UESM   = new Field<CR1, true>(1, 1)        

        // USART enable
        readonly UE     = new Field<CR1, true>(1, 0)        
    }

    // Control register 2
    static readonly CR2 = new class CR2 extends Register<CR2>
    {
        constructor() { super(0x40013804) }        

        // Address of the USART node
        readonly ADD4_7   = new Field<CR2, true>(4, 28)        

        // Address of the USART node
        readonly ADD0_3   = new Field<CR2, true>(4, 24)        

        // Receiver timeout enable
        readonly RTOEN    = new Field<CR2, true>(1, 23)        

        // Auto baud rate mode
        readonly ABRMOD   = new Field<CR2, true>(2, 21)        

        // Auto baud rate enable
        readonly ABREN    = new Field<CR2, true>(1, 20)        

        // Most significant bit first
        readonly MSBFIRST = new Field<CR2, true>(1, 19)        

        // Binary data inversion
        readonly TAINV    = new Field<CR2, true>(1, 18)        

        // TX pin active level inversion
        readonly TXINV    = new Field<CR2, true>(1, 17)        

        // RX pin active level inversion
        readonly RXINV    = new Field<CR2, true>(1, 16)        

        // Swap TX/RX pins
        readonly SWAP     = new Field<CR2, true>(1, 15)        

        // LIN mode enable
        readonly LINEN    = new Field<CR2, true>(1, 14)        

        // STOP bits
        readonly STOP     = new Field<CR2, true>(2, 12)        

        // Clock enable
        readonly CLKEN    = new Field<CR2, true>(1, 11)        

        // Clock polarity
        readonly CPOL     = new Field<CR2, true>(1, 10)        

        // Clock phase
        readonly CPHA     = new Field<CR2, true>(1, 9)        

        // Last bit clock pulse
        readonly LBCL     = new Field<CR2, true>(1, 8)        

        // LIN break detection interrupt enable
        readonly LBDIE    = new Field<CR2, true>(1, 6)        

        // LIN break detection length
        readonly LBDL     = new Field<CR2, true>(1, 5)        

        // 7-bit Address Detection/4-bit Address 
        // Detection
        readonly ADDM7    = new Field<CR2, true>(1, 4)        

        // When the DSI_NSS bit is set, the NSS pin input 
        // will be ignored
        readonly DIS_NSS  = new Field<CR2, true>(1, 3)        

        // Synchronous Slave mode enable
        readonly SLVEN    = new Field<CR2, true>(1, 0)        
    }

    // Control register 3
    static readonly CR3 = new class CR3 extends Register<CR3>
    {
        constructor() { super(0x40013808) }        

        // TXFIFO threshold configuration
        readonly TXFTCFG = new Field<CR3, true>(3, 29)        

        // RXFIFO threshold interrupt enable
        readonly RXFTIE  = new Field<CR3, true>(1, 28)        

        // Receive FIFO threshold configuration
        readonly RXFTCFG = new Field<CR3, true>(3, 25)        

        // Tr Complete before guard time, interrupt 
        // enable
        readonly TCBGTIE = new Field<CR3, true>(1, 24)        

        // threshold interrupt enable
        readonly TXFTIE  = new Field<CR3, true>(1, 23)        

        // Wakeup from Stop mode interrupt enable
        readonly WUFIE   = new Field<CR3, true>(1, 22)        

        // Wakeup from Stop mode interrupt flag selection
        readonly WUS     = new Field<CR3, true>(2, 20)        

        // Smartcard auto-retry count
        readonly SCARCNT = new Field<CR3, true>(3, 17)        

        // Driver enable polarity selection
        readonly DEP     = new Field<CR3, true>(1, 15)        

        // Driver enable mode
        readonly DEM     = new Field<CR3, true>(1, 14)        

        // DMA Disable on Reception Error
        readonly DDRE    = new Field<CR3, true>(1, 13)        

        // Overrun Disable
        readonly OVRDIS  = new Field<CR3, true>(1, 12)        

        // One sample bit method enable
        readonly ONEBIT  = new Field<CR3, true>(1, 11)        

        // CTS interrupt enable
        readonly CTSIE   = new Field<CR3, true>(1, 10)        

        // CTS enable
        readonly CTSE    = new Field<CR3, true>(1, 9)        

        // RTS enable
        readonly RTSE    = new Field<CR3, true>(1, 8)        

        // DMA enable transmitter
        readonly DMAT    = new Field<CR3, true>(1, 7)        

        // DMA enable receiver
        readonly DMAR    = new Field<CR3, true>(1, 6)        

        // Smartcard mode enable
        readonly SCEN    = new Field<CR3, true>(1, 5)        

        // Smartcard NACK enable
        readonly NACK    = new Field<CR3, true>(1, 4)        

        // Half-duplex selection
        readonly HDSEL   = new Field<CR3, true>(1, 3)        

        // Ir low-power
        readonly IRLP    = new Field<CR3, true>(1, 2)        

        // Ir mode enable
        readonly IREN    = new Field<CR3, true>(1, 1)        

        // Error interrupt enable
        readonly EIE     = new Field<CR3, true>(1, 0)        
    }

    // Baud rate register
    static readonly BRR = new class BRR extends Register<BRR>
    {
        constructor() { super(0x4001380c) }        

        // BRR_4_15
        readonly BRR_4_15 = new Field<BRR, true>(12, 4)        

        // BRR_0_3
        readonly BRR_0_3  = new Field<BRR, true>(4, 0)        
    }

    // Guard time and prescaler register
    static readonly GTPR = new class GTPR extends Register<GTPR>
    {
        constructor() { super(0x40013810) }        

        // Guard time value
        readonly GT  = new Field<GTPR, true>(8, 8)        

        // Prescaler value
        readonly PSC = new Field<GTPR, true>(8, 0)        
    }

    // Receiver timeout register
    static readonly RTOR = new class RTOR extends Register<RTOR>
    {
        constructor() { super(0x40013814) }        

        // Block Length
        readonly BLEN = new Field<RTOR, true>(8, 24)        

        // Receiver timeout value
        readonly RTO  = new Field<RTOR, true>(24, 0)        
    }

    // Request register
    static readonly RQR = new class RQR extends Register<RQR>
    {
        constructor() { super(0x40013818) }        

        // Transmit data flush request
        readonly TXFRQ = new Field<RQR, true>(1, 4)        

        // Receive data flush request
        readonly RXFRQ = new Field<RQR, true>(1, 3)        

        // Mute mode request
        readonly MMRQ  = new Field<RQR, true>(1, 2)        

        // Send break request
        readonly SBKRQ = new Field<RQR, true>(1, 1)        

        // Auto baud rate request
        readonly ABRRQ = new Field<RQR, true>(1, 0)        
    }

    // Interrupt & status register
    static readonly ISR = new class ISR extends Register<ISR>
    {
        constructor() { super(0x4001381c) }        

        // TXFIFO threshold flag
        readonly TXFT  = new Field<ISR, false>(1, 27)        

        // RXFIFO threshold flag
        readonly RXFT  = new Field<ISR, false>(1, 26)        

        // Transmission complete before guard time flag
        readonly TCBGT = new Field<ISR, false>(1, 25)        

        // RXFIFO Full
        readonly RXFF  = new Field<ISR, false>(1, 24)        

        // TXFIFO Empty
        readonly TXFE  = new Field<ISR, false>(1, 23)        

        // REACK
        readonly REACK = new Field<ISR, false>(1, 22)        

        // TEACK
        readonly TEACK = new Field<ISR, false>(1, 21)        

        // WUF
        readonly WUF   = new Field<ISR, false>(1, 20)        

        // RWU
        readonly RWU   = new Field<ISR, false>(1, 19)        

        // SBKF
        readonly SBKF  = new Field<ISR, false>(1, 18)        

        // CMF
        readonly CMF   = new Field<ISR, false>(1, 17)        

        // BUSY
        readonly BUSY  = new Field<ISR, false>(1, 16)        

        // ABRF
        readonly ABRF  = new Field<ISR, false>(1, 15)        

        // ABRE
        readonly ABRE  = new Field<ISR, false>(1, 14)        

        // SPI slave underrun error flag
        readonly UDR   = new Field<ISR, false>(1, 13)        

        // EOBF
        readonly EOBF  = new Field<ISR, false>(1, 12)        

        // RTOF
        readonly RTOF  = new Field<ISR, false>(1, 11)        

        // CTS
        readonly CTS   = new Field<ISR, false>(1, 10)        

        // CTSIF
        readonly CTSIF = new Field<ISR, false>(1, 9)        

        // LBDF
        readonly LBDF  = new Field<ISR, false>(1, 8)        

        // TXE
        readonly TXE   = new Field<ISR, false>(1, 7)        

        // TC
        readonly TC    = new Field<ISR, false>(1, 6)        

        // RXNE
        readonly RXNE  = new Field<ISR, false>(1, 5)        

        // IDLE
        readonly IDLE  = new Field<ISR, false>(1, 4)        

        // ORE
        readonly ORE   = new Field<ISR, false>(1, 3)        

        // NF
        readonly NF    = new Field<ISR, false>(1, 2)        

        // FE
        readonly FE    = new Field<ISR, false>(1, 1)        

        // PE
        readonly PE    = new Field<ISR, false>(1, 0)        
    }

    // Interrupt flag clear register
    static readonly ICR = new class ICR extends Register<ICR>
    {
        constructor() { super(0x40013820) }        

        // Wakeup from Stop mode clear flag
        readonly WUCF    = new Field<ICR, true>(1, 20)        

        // Character match clear flag
        readonly CMCF    = new Field<ICR, true>(1, 17)        

        // SPI slave underrun clear flag
        readonly UDRCF   = new Field<ICR, true>(1, 13)        

        // End of block clear flag
        readonly EOBCF   = new Field<ICR, true>(1, 12)        

        // Receiver timeout clear flag
        readonly RTOCF   = new Field<ICR, true>(1, 11)        

        // CTS clear flag
        readonly CTSCF   = new Field<ICR, true>(1, 9)        

        // LIN break detection clear flag
        readonly LBDCF   = new Field<ICR, true>(1, 8)        

        // Transmission complete before Guard time clear 
        // flag
        readonly TCBGTCF = new Field<ICR, true>(1, 7)        

        // Transmission complete clear flag
        readonly TCCF    = new Field<ICR, true>(1, 6)        

        // TXFIFO empty clear flag
        readonly TXFECF  = new Field<ICR, true>(1, 5)        

        // Idle line detected clear flag
        readonly IDLECF  = new Field<ICR, true>(1, 4)        

        // Overrun error clear flag
        readonly ORECF   = new Field<ICR, true>(1, 3)        

        // Noise detected clear flag
        readonly NCF     = new Field<ICR, true>(1, 2)        

        // Framing error clear flag
        readonly FECF    = new Field<ICR, true>(1, 1)        

        // Parity error clear flag
        readonly PECF    = new Field<ICR, true>(1, 0)        
    }

    // Receive data register
    static readonly RDR = new class RDR extends Register<RDR>
    {
        constructor() { super(0x40013824) }        

        // Receive data value
        readonly RDR = new Field<RDR, false>(9, 0)        
    }

    // Transmit data register
    static readonly TDR = new class TDR extends Register<TDR>
    {
        constructor() { super(0x40013828) }        

        // Transmit data value
        readonly TDR = new Field<TDR, true>(9, 0)        
    }

    // Prescaler register
    static readonly PRESC = new class PRESC extends Register<PRESC>
    {
        constructor() { super(0x4001382c) }        

        // Clock prescaler
        readonly PRESCALER = new Field<PRESC, true>(4, 0)        
    }
}

export class USART2
{
    // Control register 1
    static readonly CR1 = new class CR1 extends Register<CR1>
    {
        constructor() { super(0x40004400) }        

        // RXFIFO Full interrupt enable
        readonly RXFFIE = new Field<CR1, true>(1, 31)        

        // TXFIFO empty interrupt enable
        readonly TXFEIE = new Field<CR1, true>(1, 30)        

        // FIFO mode enable
        readonly FIFOEN = new Field<CR1, true>(1, 29)        

        // Word length
        readonly M1     = new Field<CR1, true>(1, 28)        

        // End of Block interrupt enable
        readonly EOBIE  = new Field<CR1, true>(1, 27)        

        // Receiver timeout interrupt enable
        readonly RTOIE  = new Field<CR1, true>(1, 26)        

        // DEAT
        readonly DEAT   = new Field<CR1, true>(5, 21)        

        // DEDT
        readonly DEDT   = new Field<CR1, true>(5, 16)        

        // Oversampling mode
        readonly OVER8  = new Field<CR1, true>(1, 15)        

        // Character match interrupt enable
        readonly CMIE   = new Field<CR1, true>(1, 14)        

        // Mute mode enable
        readonly MME    = new Field<CR1, true>(1, 13)        

        // Word length
        readonly M0     = new Field<CR1, true>(1, 12)        

        // Receiver wakeup method
        readonly WAKE   = new Field<CR1, true>(1, 11)        

        // Parity control enable
        readonly PCE    = new Field<CR1, true>(1, 10)        

        // Parity selection
        readonly PS     = new Field<CR1, true>(1, 9)        

        // PE interrupt enable
        readonly PEIE   = new Field<CR1, true>(1, 8)        

        // interrupt enable
        readonly TXEIE  = new Field<CR1, true>(1, 7)        

        // Transmission complete interrupt enable
        readonly TCIE   = new Field<CR1, true>(1, 6)        

        // RXNE interrupt enable
        readonly RXNEIE = new Field<CR1, true>(1, 5)        

        // IDLE interrupt enable
        readonly IDLEIE = new Field<CR1, true>(1, 4)        

        // Transmitter enable
        readonly TE     = new Field<CR1, true>(1, 3)        

        // Receiver enable
        readonly RE     = new Field<CR1, true>(1, 2)        

        // USART enable in Stop mode
        readonly UESM   = new Field<CR1, true>(1, 1)        

        // USART enable
        readonly UE     = new Field<CR1, true>(1, 0)        
    }

    // Control register 2
    static readonly CR2 = new class CR2 extends Register<CR2>
    {
        constructor() { super(0x40004404) }        

        // Address of the USART node
        readonly ADD4_7   = new Field<CR2, true>(4, 28)        

        // Address of the USART node
        readonly ADD0_3   = new Field<CR2, true>(4, 24)        

        // Receiver timeout enable
        readonly RTOEN    = new Field<CR2, true>(1, 23)        

        // Auto baud rate mode
        readonly ABRMOD   = new Field<CR2, true>(2, 21)        

        // Auto baud rate enable
        readonly ABREN    = new Field<CR2, true>(1, 20)        

        // Most significant bit first
        readonly MSBFIRST = new Field<CR2, true>(1, 19)        

        // Binary data inversion
        readonly TAINV    = new Field<CR2, true>(1, 18)        

        // TX pin active level inversion
        readonly TXINV    = new Field<CR2, true>(1, 17)        

        // RX pin active level inversion
        readonly RXINV    = new Field<CR2, true>(1, 16)        

        // Swap TX/RX pins
        readonly SWAP     = new Field<CR2, true>(1, 15)        

        // LIN mode enable
        readonly LINEN    = new Field<CR2, true>(1, 14)        

        // STOP bits
        readonly STOP     = new Field<CR2, true>(2, 12)        

        // Clock enable
        readonly CLKEN    = new Field<CR2, true>(1, 11)        

        // Clock polarity
        readonly CPOL     = new Field<CR2, true>(1, 10)        

        // Clock phase
        readonly CPHA     = new Field<CR2, true>(1, 9)        

        // Last bit clock pulse
        readonly LBCL     = new Field<CR2, true>(1, 8)        

        // LIN break detection interrupt enable
        readonly LBDIE    = new Field<CR2, true>(1, 6)        

        // LIN break detection length
        readonly LBDL     = new Field<CR2, true>(1, 5)        

        // 7-bit Address Detection/4-bit Address 
        // Detection
        readonly ADDM7    = new Field<CR2, true>(1, 4)        

        // When the DSI_NSS bit is set, the NSS pin input 
        // will be ignored
        readonly DIS_NSS  = new Field<CR2, true>(1, 3)        

        // Synchronous Slave mode enable
        readonly SLVEN    = new Field<CR2, true>(1, 0)        
    }

    // Control register 3
    static readonly CR3 = new class CR3 extends Register<CR3>
    {
        constructor() { super(0x40004408) }        

        // TXFIFO threshold configuration
        readonly TXFTCFG = new Field<CR3, true>(3, 29)        

        // RXFIFO threshold interrupt enable
        readonly RXFTIE  = new Field<CR3, true>(1, 28)        

        // Receive FIFO threshold configuration
        readonly RXFTCFG = new Field<CR3, true>(3, 25)        

        // Tr Complete before guard time, interrupt 
        // enable
        readonly TCBGTIE = new Field<CR3, true>(1, 24)        

        // threshold interrupt enable
        readonly TXFTIE  = new Field<CR3, true>(1, 23)        

        // Wakeup from Stop mode interrupt enable
        readonly WUFIE   = new Field<CR3, true>(1, 22)        

        // Wakeup from Stop mode interrupt flag selection
        readonly WUS     = new Field<CR3, true>(2, 20)        

        // Smartcard auto-retry count
        readonly SCARCNT = new Field<CR3, true>(3, 17)        

        // Driver enable polarity selection
        readonly DEP     = new Field<CR3, true>(1, 15)        

        // Driver enable mode
        readonly DEM     = new Field<CR3, true>(1, 14)        

        // DMA Disable on Reception Error
        readonly DDRE    = new Field<CR3, true>(1, 13)        

        // Overrun Disable
        readonly OVRDIS  = new Field<CR3, true>(1, 12)        

        // One sample bit method enable
        readonly ONEBIT  = new Field<CR3, true>(1, 11)        

        // CTS interrupt enable
        readonly CTSIE   = new Field<CR3, true>(1, 10)        

        // CTS enable
        readonly CTSE    = new Field<CR3, true>(1, 9)        

        // RTS enable
        readonly RTSE    = new Field<CR3, true>(1, 8)        

        // DMA enable transmitter
        readonly DMAT    = new Field<CR3, true>(1, 7)        

        // DMA enable receiver
        readonly DMAR    = new Field<CR3, true>(1, 6)        

        // Smartcard mode enable
        readonly SCEN    = new Field<CR3, true>(1, 5)        

        // Smartcard NACK enable
        readonly NACK    = new Field<CR3, true>(1, 4)        

        // Half-duplex selection
        readonly HDSEL   = new Field<CR3, true>(1, 3)        

        // Ir low-power
        readonly IRLP    = new Field<CR3, true>(1, 2)        

        // Ir mode enable
        readonly IREN    = new Field<CR3, true>(1, 1)        

        // Error interrupt enable
        readonly EIE     = new Field<CR3, true>(1, 0)        
    }

    // Baud rate register
    static readonly BRR = new class BRR extends Register<BRR>
    {
        constructor() { super(0x4000440c) }        

        // BRR_4_15
        readonly BRR_4_15 = new Field<BRR, true>(12, 4)        

        // BRR_0_3
        readonly BRR_0_3  = new Field<BRR, true>(4, 0)        
    }

    // Guard time and prescaler register
    static readonly GTPR = new class GTPR extends Register<GTPR>
    {
        constructor() { super(0x40004410) }        

        // Guard time value
        readonly GT  = new Field<GTPR, true>(8, 8)        

        // Prescaler value
        readonly PSC = new Field<GTPR, true>(8, 0)        
    }

    // Receiver timeout register
    static readonly RTOR = new class RTOR extends Register<RTOR>
    {
        constructor() { super(0x40004414) }        

        // Block Length
        readonly BLEN = new Field<RTOR, true>(8, 24)        

        // Receiver timeout value
        readonly RTO  = new Field<RTOR, true>(24, 0)        
    }

    // Request register
    static readonly RQR = new class RQR extends Register<RQR>
    {
        constructor() { super(0x40004418) }        

        // Transmit data flush request
        readonly TXFRQ = new Field<RQR, true>(1, 4)        

        // Receive data flush request
        readonly RXFRQ = new Field<RQR, true>(1, 3)        

        // Mute mode request
        readonly MMRQ  = new Field<RQR, true>(1, 2)        

        // Send break request
        readonly SBKRQ = new Field<RQR, true>(1, 1)        

        // Auto baud rate request
        readonly ABRRQ = new Field<RQR, true>(1, 0)        
    }

    // Interrupt & status register
    static readonly ISR = new class ISR extends Register<ISR>
    {
        constructor() { super(0x4000441c) }        

        // TXFIFO threshold flag
        readonly TXFT  = new Field<ISR, false>(1, 27)        

        // RXFIFO threshold flag
        readonly RXFT  = new Field<ISR, false>(1, 26)        

        // Transmission complete before guard time flag
        readonly TCBGT = new Field<ISR, false>(1, 25)        

        // RXFIFO Full
        readonly RXFF  = new Field<ISR, false>(1, 24)        

        // TXFIFO Empty
        readonly TXFE  = new Field<ISR, false>(1, 23)        

        // REACK
        readonly REACK = new Field<ISR, false>(1, 22)        

        // TEACK
        readonly TEACK = new Field<ISR, false>(1, 21)        

        // WUF
        readonly WUF   = new Field<ISR, false>(1, 20)        

        // RWU
        readonly RWU   = new Field<ISR, false>(1, 19)        

        // SBKF
        readonly SBKF  = new Field<ISR, false>(1, 18)        

        // CMF
        readonly CMF   = new Field<ISR, false>(1, 17)        

        // BUSY
        readonly BUSY  = new Field<ISR, false>(1, 16)        

        // ABRF
        readonly ABRF  = new Field<ISR, false>(1, 15)        

        // ABRE
        readonly ABRE  = new Field<ISR, false>(1, 14)        

        // SPI slave underrun error flag
        readonly UDR   = new Field<ISR, false>(1, 13)        

        // EOBF
        readonly EOBF  = new Field<ISR, false>(1, 12)        

        // RTOF
        readonly RTOF  = new Field<ISR, false>(1, 11)        

        // CTS
        readonly CTS   = new Field<ISR, false>(1, 10)        

        // CTSIF
        readonly CTSIF = new Field<ISR, false>(1, 9)        

        // LBDF
        readonly LBDF  = new Field<ISR, false>(1, 8)        

        // TXE
        readonly TXE   = new Field<ISR, false>(1, 7)        

        // TC
        readonly TC    = new Field<ISR, false>(1, 6)        

        // RXNE
        readonly RXNE  = new Field<ISR, false>(1, 5)        

        // IDLE
        readonly IDLE  = new Field<ISR, false>(1, 4)        

        // ORE
        readonly ORE   = new Field<ISR, false>(1, 3)        

        // NF
        readonly NF    = new Field<ISR, false>(1, 2)        

        // FE
        readonly FE    = new Field<ISR, false>(1, 1)        

        // PE
        readonly PE    = new Field<ISR, false>(1, 0)        
    }

    // Interrupt flag clear register
    static readonly ICR = new class ICR extends Register<ICR>
    {
        constructor() { super(0x40004420) }        

        // Wakeup from Stop mode clear flag
        readonly WUCF    = new Field<ICR, true>(1, 20)        

        // Character match clear flag
        readonly CMCF    = new Field<ICR, true>(1, 17)        

        // SPI slave underrun clear flag
        readonly UDRCF   = new Field<ICR, true>(1, 13)        

        // End of block clear flag
        readonly EOBCF   = new Field<ICR, true>(1, 12)        

        // Receiver timeout clear flag
        readonly RTOCF   = new Field<ICR, true>(1, 11)        

        // CTS clear flag
        readonly CTSCF   = new Field<ICR, true>(1, 9)        

        // LIN break detection clear flag
        readonly LBDCF   = new Field<ICR, true>(1, 8)        

        // Transmission complete before Guard time clear 
        // flag
        readonly TCBGTCF = new Field<ICR, true>(1, 7)        

        // Transmission complete clear flag
        readonly TCCF    = new Field<ICR, true>(1, 6)        

        // TXFIFO empty clear flag
        readonly TXFECF  = new Field<ICR, true>(1, 5)        

        // Idle line detected clear flag
        readonly IDLECF  = new Field<ICR, true>(1, 4)        

        // Overrun error clear flag
        readonly ORECF   = new Field<ICR, true>(1, 3)        

        // Noise detected clear flag
        readonly NCF     = new Field<ICR, true>(1, 2)        

        // Framing error clear flag
        readonly FECF    = new Field<ICR, true>(1, 1)        

        // Parity error clear flag
        readonly PECF    = new Field<ICR, true>(1, 0)        
    }

    // Receive data register
    static readonly RDR = new class RDR extends Register<RDR>
    {
        constructor() { super(0x40004424) }        

        // Receive data value
        readonly RDR = new Field<RDR, false>(9, 0)        
    }

    // Transmit data register
    static readonly TDR = new class TDR extends Register<TDR>
    {
        constructor() { super(0x40004428) }        

        // Transmit data value
        readonly TDR = new Field<TDR, true>(9, 0)        
    }

    // Prescaler register
    static readonly PRESC = new class PRESC extends Register<PRESC>
    {
        constructor() { super(0x4000442c) }        

        // Clock prescaler
        readonly PRESCALER = new Field<PRESC, true>(4, 0)        
    }
}

export class SPI1
{
    // control register 1
    static readonly CR1 = new class CR1 extends Register<CR1>
    {
        constructor() { super(0x40013000) }        

        // Bidirectional data mode enable
        readonly BIDIMODE = new Field<CR1, true>(1, 15)        

        // Output enable in bidirectional mode
        readonly BIDIOE   = new Field<CR1, true>(1, 14)        

        // Hardware CRC calculation enable
        readonly CRCEN    = new Field<CR1, true>(1, 13)        

        // CRC transfer next
        readonly CRCNEXT  = new Field<CR1, true>(1, 12)        

        // Data frame format
        readonly DFF      = new Field<CR1, true>(1, 11)        

        // Receive only
        readonly RXONLY   = new Field<CR1, true>(1, 10)        

        // Software slave management
        readonly SSM      = new Field<CR1, true>(1, 9)        

        // Internal slave select
        readonly SSI      = new Field<CR1, true>(1, 8)        

        // Frame format
        readonly LSBFIRST = new Field<CR1, true>(1, 7)        

        // SPI enable
        readonly SPE      = new Field<CR1, true>(1, 6)        

        // Baud rate control
        readonly BR       = new Field<CR1, true>(3, 3)        

        // Master selection
        readonly MSTR     = new Field<CR1, true>(1, 2)        

        // Clock polarity
        readonly CPOL     = new Field<CR1, true>(1, 1)        

        // Clock phase
        readonly CPHA     = new Field<CR1, true>(1, 0)        
    }

    // control register 2
    static readonly CR2 = new class CR2 extends Register<CR2>
    {
        constructor() { super(0x40013004) }        

        // Rx buffer DMA enable
        readonly RXDMAEN = new Field<CR2, true>(1, 0)        

        // Tx buffer DMA enable
        readonly TXDMAEN = new Field<CR2, true>(1, 1)        

        // SS output enable
        readonly SSOE    = new Field<CR2, true>(1, 2)        

        // NSS pulse management
        readonly NSSP    = new Field<CR2, true>(1, 3)        

        // Frame format
        readonly FRF     = new Field<CR2, true>(1, 4)        

        // Error interrupt enable
        readonly ERRIE   = new Field<CR2, true>(1, 5)        

        // RX buffer not empty interrupt enable
        readonly RXNEIE  = new Field<CR2, true>(1, 6)        

        // Tx buffer empty interrupt enable
        readonly TXEIE   = new Field<CR2, true>(1, 7)        

        // Data size
        readonly DS      = new Field<CR2, true>(4, 8)        

        // FIFO reception threshold
        readonly FRXTH   = new Field<CR2, true>(1, 12)        

        // Last DMA transfer for reception
        readonly LDMA_RX = new Field<CR2, true>(1, 13)        

        // Last DMA transfer for transmission
        readonly LDMA_TX = new Field<CR2, true>(1, 14)        
    }

    // status register
    static readonly SR = new class SR extends Register<SR>
    {
        constructor() { super(0x40013008) }        

        // Receive buffer not empty
        readonly RXNE   = new Field<SR, false>(1, 0)        

        // Transmit buffer empty
        readonly TXE    = new Field<SR, false>(1, 1)        

        // Channel side
        readonly CHSIDE = new Field<SR, false>(1, 2)        

        // Underrun flag
        readonly UDR    = new Field<SR, false>(1, 3)        

        // CRC error flag
        readonly CRCERR = new Field<SR, true>(1, 4)        

        // Mode fault
        readonly MODF   = new Field<SR, false>(1, 5)        

        // Overrun flag
        readonly OVR    = new Field<SR, false>(1, 6)        

        // Busy flag
        readonly BSY    = new Field<SR, false>(1, 7)        

        // TI frame format error
        readonly TIFRFE = new Field<SR, false>(1, 8)        

        // FIFO reception level
        readonly FRLVL  = new Field<SR, false>(2, 9)        

        // FIFO transmission level
        readonly FTLVL  = new Field<SR, false>(2, 11)        
    }

    // data register
    static readonly DR = new class DR extends Register<DR>
    {
        constructor() { super(0x4001300c) }        

        // Data register
        readonly DR = new Field<DR, true>(16, 0)        
    }

    // CRC polynomial register
    static readonly CRCPR = new class CRCPR extends Register<CRCPR>
    {
        constructor() { super(0x40013010) }        

        // CRC polynomial register
        readonly CRCPOLY = new Field<CRCPR, true>(16, 0)        
    }

    // RX CRC register
    static readonly RXCRCR = new class RXCRCR extends Register<RXCRCR>
    {
        constructor() { super(0x40013014) }        

        // Rx CRC register
        readonly RxCRC = new Field<RXCRCR, false>(16, 0)        
    }

    // TX CRC register
    static readonly TXCRCR = new class TXCRCR extends Register<TXCRCR>
    {
        constructor() { super(0x40013018) }        

        // Tx CRC register
        readonly TxCRC = new Field<TXCRCR, false>(16, 0)        
    }

    // configuration register
    static readonly I2SCFGR = new class I2SCFGR extends Register<I2SCFGR>
    {
        constructor() { super(0x4001301c) }        

        // Channel length (number of bits per audio 
        // channel)
        readonly CHLEN   = new Field<I2SCFGR, true>(1, 0)        

        // Data length to be transferred
        readonly DATLEN  = new Field<I2SCFGR, true>(2, 1)        

        // Inactive state clock polarity
        readonly CKPOL   = new Field<I2SCFGR, true>(1, 3)        

        // standard selection
        readonly I2SSTD  = new Field<I2SCFGR, true>(2, 4)        

        // PCM frame synchronization
        readonly PCMSYNC = new Field<I2SCFGR, true>(1, 7)        

        // I2S configuration mode
        readonly I2SCFG  = new Field<I2SCFGR, true>(2, 8)        

        // I2S enable
        readonly SE2     = new Field<I2SCFGR, true>(1, 10)        

        // I2S mode selection
        readonly I2SMOD  = new Field<I2SCFGR, true>(1, 11)        
    }

    // prescaler register
    static readonly I2SPR = new class I2SPR extends Register<I2SPR>
    {
        constructor() { super(0x40013020) }        

        // linear prescaler
        readonly I2SDIV = new Field<I2SPR, true>(8, 0)        

        // Odd factor for the prescaler
        readonly ODD    = new Field<I2SPR, true>(1, 8)        

        // Master clock output enable
        readonly MCKOE  = new Field<I2SPR, true>(1, 9)        
    }
}

export class SPI2
{
    // control register 1
    static readonly CR1 = new class CR1 extends Register<CR1>
    {
        constructor() { super(0x40003800) }        

        // Bidirectional data mode enable
        readonly BIDIMODE = new Field<CR1, true>(1, 15)        

        // Output enable in bidirectional mode
        readonly BIDIOE   = new Field<CR1, true>(1, 14)        

        // Hardware CRC calculation enable
        readonly CRCEN    = new Field<CR1, true>(1, 13)        

        // CRC transfer next
        readonly CRCNEXT  = new Field<CR1, true>(1, 12)        

        // Data frame format
        readonly DFF      = new Field<CR1, true>(1, 11)        

        // Receive only
        readonly RXONLY   = new Field<CR1, true>(1, 10)        

        // Software slave management
        readonly SSM      = new Field<CR1, true>(1, 9)        

        // Internal slave select
        readonly SSI      = new Field<CR1, true>(1, 8)        

        // Frame format
        readonly LSBFIRST = new Field<CR1, true>(1, 7)        

        // SPI enable
        readonly SPE      = new Field<CR1, true>(1, 6)        

        // Baud rate control
        readonly BR       = new Field<CR1, true>(3, 3)        

        // Master selection
        readonly MSTR     = new Field<CR1, true>(1, 2)        

        // Clock polarity
        readonly CPOL     = new Field<CR1, true>(1, 1)        

        // Clock phase
        readonly CPHA     = new Field<CR1, true>(1, 0)        
    }

    // control register 2
    static readonly CR2 = new class CR2 extends Register<CR2>
    {
        constructor() { super(0x40003804) }        

        // Rx buffer DMA enable
        readonly RXDMAEN = new Field<CR2, true>(1, 0)        

        // Tx buffer DMA enable
        readonly TXDMAEN = new Field<CR2, true>(1, 1)        

        // SS output enable
        readonly SSOE    = new Field<CR2, true>(1, 2)        

        // NSS pulse management
        readonly NSSP    = new Field<CR2, true>(1, 3)        

        // Frame format
        readonly FRF     = new Field<CR2, true>(1, 4)        

        // Error interrupt enable
        readonly ERRIE   = new Field<CR2, true>(1, 5)        

        // RX buffer not empty interrupt enable
        readonly RXNEIE  = new Field<CR2, true>(1, 6)        

        // Tx buffer empty interrupt enable
        readonly TXEIE   = new Field<CR2, true>(1, 7)        

        // Data size
        readonly DS      = new Field<CR2, true>(4, 8)        

        // FIFO reception threshold
        readonly FRXTH   = new Field<CR2, true>(1, 12)        

        // Last DMA transfer for reception
        readonly LDMA_RX = new Field<CR2, true>(1, 13)        

        // Last DMA transfer for transmission
        readonly LDMA_TX = new Field<CR2, true>(1, 14)        
    }

    // status register
    static readonly SR = new class SR extends Register<SR>
    {
        constructor() { super(0x40003808) }        

        // Receive buffer not empty
        readonly RXNE   = new Field<SR, false>(1, 0)        

        // Transmit buffer empty
        readonly TXE    = new Field<SR, false>(1, 1)        

        // Channel side
        readonly CHSIDE = new Field<SR, false>(1, 2)        

        // Underrun flag
        readonly UDR    = new Field<SR, false>(1, 3)        

        // CRC error flag
        readonly CRCERR = new Field<SR, true>(1, 4)        

        // Mode fault
        readonly MODF   = new Field<SR, false>(1, 5)        

        // Overrun flag
        readonly OVR    = new Field<SR, false>(1, 6)        

        // Busy flag
        readonly BSY    = new Field<SR, false>(1, 7)        

        // TI frame format error
        readonly TIFRFE = new Field<SR, false>(1, 8)        

        // FIFO reception level
        readonly FRLVL  = new Field<SR, false>(2, 9)        

        // FIFO transmission level
        readonly FTLVL  = new Field<SR, false>(2, 11)        
    }

    // data register
    static readonly DR = new class DR extends Register<DR>
    {
        constructor() { super(0x4000380c) }        

        // Data register
        readonly DR = new Field<DR, true>(16, 0)        
    }

    // CRC polynomial register
    static readonly CRCPR = new class CRCPR extends Register<CRCPR>
    {
        constructor() { super(0x40003810) }        

        // CRC polynomial register
        readonly CRCPOLY = new Field<CRCPR, true>(16, 0)        
    }

    // RX CRC register
    static readonly RXCRCR = new class RXCRCR extends Register<RXCRCR>
    {
        constructor() { super(0x40003814) }        

        // Rx CRC register
        readonly RxCRC = new Field<RXCRCR, false>(16, 0)        
    }

    // TX CRC register
    static readonly TXCRCR = new class TXCRCR extends Register<TXCRCR>
    {
        constructor() { super(0x40003818) }        

        // Tx CRC register
        readonly TxCRC = new Field<TXCRCR, false>(16, 0)        
    }

    // configuration register
    static readonly I2SCFGR = new class I2SCFGR extends Register<I2SCFGR>
    {
        constructor() { super(0x4000381c) }        

        // Channel length (number of bits per audio 
        // channel)
        readonly CHLEN   = new Field<I2SCFGR, true>(1, 0)        

        // Data length to be transferred
        readonly DATLEN  = new Field<I2SCFGR, true>(2, 1)        

        // Inactive state clock polarity
        readonly CKPOL   = new Field<I2SCFGR, true>(1, 3)        

        // standard selection
        readonly I2SSTD  = new Field<I2SCFGR, true>(2, 4)        

        // PCM frame synchronization
        readonly PCMSYNC = new Field<I2SCFGR, true>(1, 7)        

        // I2S configuration mode
        readonly I2SCFG  = new Field<I2SCFGR, true>(2, 8)        

        // I2S enable
        readonly SE2     = new Field<I2SCFGR, true>(1, 10)        

        // I2S mode selection
        readonly I2SMOD  = new Field<I2SCFGR, true>(1, 11)        
    }

    // prescaler register
    static readonly I2SPR = new class I2SPR extends Register<I2SPR>
    {
        constructor() { super(0x40003820) }        

        // linear prescaler
        readonly I2SDIV = new Field<I2SPR, true>(8, 0)        

        // Odd factor for the prescaler
        readonly ODD    = new Field<I2SPR, true>(1, 8)        

        // Master clock output enable
        readonly MCKOE  = new Field<I2SPR, true>(1, 9)        
    }
}

export class TIM1
{
    // control register 1
    static readonly CR1 = new class CR1 extends Register<CR1>
    {
        constructor() { super(0x40012c00) }        

        // Counter enable
        readonly CEN      = new Field<CR1, true>(1, 0)        

        // One-pulse mode
        readonly OPM      = new Field<CR1, true>(1, 3)        

        // Update disable
        readonly UDIS     = new Field<CR1, true>(1, 1)        

        // Update request source
        readonly URS      = new Field<CR1, true>(1, 2)        

        // Direction
        readonly DIR      = new Field<CR1, true>(1, 4)        

        // Center-aligned mode selection
        readonly CMS      = new Field<CR1, true>(2, 5)        

        // Auto-reload preload enable
        readonly ARPE     = new Field<CR1, true>(1, 7)        

        // Clock division
        readonly CKD      = new Field<CR1, true>(2, 8)        

        // UIF status bit remapping
        readonly UIFREMAP = new Field<CR1, true>(1, 11)        
    }

    // control register 2
    static readonly CR2 = new class CR2 extends Register<CR2>
    {
        constructor() { super(0x40012c04) }        

        // Master mode selection 2
        readonly MMS2  = new Field<CR2, true>(4, 20)        

        // Output Idle state 6 (OC6 output)
        readonly OIS6  = new Field<CR2, true>(1, 18)        

        // Output Idle state 5 (OC5 output)
        readonly OIS5  = new Field<CR2, true>(1, 16)        

        // Output Idle state 4
        readonly OIS4  = new Field<CR2, true>(1, 14)        

        // Output Idle state 3
        readonly OIS3N = new Field<CR2, true>(1, 13)        

        // Output Idle state 3
        readonly OIS3  = new Field<CR2, true>(1, 12)        

        // Output Idle state 2
        readonly OIS2N = new Field<CR2, true>(1, 11)        

        // Output Idle state 2
        readonly OIS2  = new Field<CR2, true>(1, 10)        

        // Output Idle state 1
        readonly OIS1N = new Field<CR2, true>(1, 9)        

        // Output Idle state 1
        readonly OIS1  = new Field<CR2, true>(1, 8)        

        // TI1 selection
        readonly TI1S  = new Field<CR2, true>(1, 7)        

        // Master mode selection
        readonly MMS   = new Field<CR2, true>(3, 4)        

        // Capture/compare DMA selection
        readonly CCDS  = new Field<CR2, true>(1, 3)        

        // Capture/compare control update selection
        readonly CCUS  = new Field<CR2, true>(1, 2)        

        // Capture/compare preloaded control
        readonly CCPC  = new Field<CR2, true>(1, 0)        
    }

    // slave mode control register
    static readonly SMCR = new class SMCR extends Register<SMCR>
    {
        constructor() { super(0x40012c08) }        

        // Slave mode selection
        readonly SMS   = new Field<SMCR, true>(3, 0)        

        // OCREF clear selection
        readonly OCCS  = new Field<SMCR, true>(1, 3)        

        // Trigger selection
        readonly TS_4  = new Field<SMCR, true>(3, 4)        

        // Master/Slave mode
        readonly MSM   = new Field<SMCR, true>(1, 7)        

        // External trigger filter
        readonly ETF   = new Field<SMCR, true>(4, 8)        

        // External trigger prescaler
        readonly ETPS  = new Field<SMCR, true>(2, 12)        

        // External clock enable
        readonly ECE   = new Field<SMCR, true>(1, 14)        

        // External trigger polarity
        readonly ETP   = new Field<SMCR, true>(1, 15)        

        // Slave mode selection - bit 3
        readonly SMS_3 = new Field<SMCR, true>(1, 16)        

        // Trigger selection
        readonly TS    = new Field<SMCR, true>(2, 20)        
    }

    // DMA/Interrupt enable register
    static readonly DIER = new class DIER extends Register<DIER>
    {
        constructor() { super(0x40012c0c) }        

        // Update interrupt enable
        readonly UIE   = new Field<DIER, true>(1, 0)        

        // Capture/Compare 1 interrupt enable
        readonly CC1IE = new Field<DIER, true>(1, 1)        

        // Capture/Compare 2 interrupt enable
        readonly CC2IE = new Field<DIER, true>(1, 2)        

        // Capture/Compare 3 interrupt enable
        readonly CC3IE = new Field<DIER, true>(1, 3)        

        // Capture/Compare 4 interrupt enable
        readonly CC4IE = new Field<DIER, true>(1, 4)        

        // COM interrupt enable
        readonly COMIE = new Field<DIER, true>(1, 5)        

        // Trigger interrupt enable
        readonly TIE   = new Field<DIER, true>(1, 6)        

        // Break interrupt enable
        readonly BIE   = new Field<DIER, true>(1, 7)        

        // Update DMA request enable
        readonly UDE   = new Field<DIER, true>(1, 8)        

        // Capture/Compare 1 DMA request enable
        readonly CC1DE = new Field<DIER, true>(1, 9)        

        // Capture/Compare 2 DMA request enable
        readonly CC2DE = new Field<DIER, true>(1, 10)        

        // Capture/Compare 3 DMA request enable
        readonly CC3DE = new Field<DIER, true>(1, 11)        

        // Capture/Compare 4 DMA request enable
        readonly CC4DE = new Field<DIER, true>(1, 12)        

        // COM DMA request enable
        readonly COMDE = new Field<DIER, true>(1, 13)        

        // Trigger DMA request enable
        readonly TDE   = new Field<DIER, true>(1, 14)        
    }

    // status register
    static readonly SR = new class SR extends Register<SR>
    {
        constructor() { super(0x40012c10) }        

        // Update interrupt flag
        readonly UIF   = new Field<SR, true>(1, 0)        

        // Capture/compare 1 interrupt flag
        readonly CC1IF = new Field<SR, true>(1, 1)        

        // Capture/Compare 2 interrupt flag
        readonly CC2IF = new Field<SR, true>(1, 2)        

        // Capture/Compare 3 interrupt flag
        readonly CC3IF = new Field<SR, true>(1, 3)        

        // Capture/Compare 4 interrupt flag
        readonly CC4IF = new Field<SR, true>(1, 4)        

        // COM interrupt flag
        readonly COMIF = new Field<SR, true>(1, 5)        

        // Trigger interrupt flag
        readonly TIF   = new Field<SR, true>(1, 6)        

        // Break interrupt flag
        readonly BIF   = new Field<SR, true>(1, 7)        

        // Break 2 interrupt flag
        readonly B2IF  = new Field<SR, true>(1, 8)        

        // Capture/Compare 1 overcapture flag
        readonly CC1OF = new Field<SR, true>(1, 9)        

        // Capture/compare 2 overcapture flag
        readonly CC2OF = new Field<SR, true>(1, 10)        

        // Capture/Compare 3 overcapture flag
        readonly CC3OF = new Field<SR, true>(1, 11)        

        // Capture/Compare 4 overcapture flag
        readonly CC4OF = new Field<SR, true>(1, 12)        

        // System Break interrupt flag
        readonly SBIF  = new Field<SR, true>(1, 13)        

        // Compare 5 interrupt flag
        readonly CC5IF = new Field<SR, true>(1, 16)        

        // Compare 6 interrupt flag
        readonly CC6IF = new Field<SR, true>(1, 17)        
    }

    // event generation register
    static readonly EGR = new class EGR extends Register<EGR>
    {
        constructor() { super(0x40012c14) }        

        // Update generation
        readonly UG   = new Field<EGR, true>(1, 0)        

        // Capture/compare 1 generation
        readonly CC1G = new Field<EGR, true>(1, 1)        

        // Capture/compare 2 generation
        readonly CC2G = new Field<EGR, true>(1, 2)        

        // Capture/compare 3 generation
        readonly CC3G = new Field<EGR, true>(1, 3)        

        // Capture/compare 4 generation
        readonly CC4G = new Field<EGR, true>(1, 4)        

        // Capture/Compare control update generation
        readonly COMG = new Field<EGR, true>(1, 5)        

        // Trigger generation
        readonly TG   = new Field<EGR, true>(1, 6)        

        // Break generation
        readonly BG   = new Field<EGR, true>(1, 7)        

        // Break 2 generation
        readonly B2G  = new Field<EGR, true>(1, 8)        
    }

    // capture/compare mode register 1 (output 
    // mode)
    static readonly CCMR1_Output = new class CCMR1_Output extends Register<CCMR1_Output>
    {
        constructor() { super(0x40012c18) }        

        // Capture/Compare 1 selection
        readonly CC1S   = new Field<CCMR1_Output, true>(2, 0)        

        // Output Compare 1 fast enable
        readonly OC1FE  = new Field<CCMR1_Output, true>(1, 2)        

        // Output Compare 1 preload enable
        readonly OC1PE  = new Field<CCMR1_Output, true>(1, 3)        

        // Output Compare 1 mode
        readonly OC1M   = new Field<CCMR1_Output, true>(3, 4)        

        // Output Compare 1 clear enable
        readonly OC1CE  = new Field<CCMR1_Output, true>(1, 7)        

        // Capture/Compare 2 selection
        readonly CC2S   = new Field<CCMR1_Output, true>(2, 8)        

        // Output Compare 2 fast enable
        readonly OC2FE  = new Field<CCMR1_Output, true>(1, 10)        

        // Output Compare 2 preload enable
        readonly OC2PE  = new Field<CCMR1_Output, true>(1, 11)        

        // Output Compare 2 mode
        readonly OC2M   = new Field<CCMR1_Output, true>(3, 12)        

        // Output Compare 2 clear enable
        readonly OC2CE  = new Field<CCMR1_Output, true>(1, 15)        

        // Output Compare 1 mode - bit 3
        readonly OC1M_3 = new Field<CCMR1_Output, true>(1, 16)        

        // Output Compare 2 mode - bit 3
        readonly OC2M_3 = new Field<CCMR1_Output, true>(1, 24)        
    }

    // capture/compare mode register 1 (output 
    // mode)
    static readonly CCMR1_Input = new class CCMR1_Input extends Register<CCMR1_Input>
    {
        constructor() { super(0x40012c18) }        

        // Capture/Compare 1 selection
        readonly CC1S  = new Field<CCMR1_Input, true>(2, 0)        

        // Output Compare 1 fast enable
        readonly OC1FE = new Field<CCMR1_Input, true>(1, 2)        

        // Output Compare 1 preload enable
        readonly OC1PE = new Field<CCMR1_Input, true>(1, 3)        

        // Output Compare 1 mode
        readonly OC1M  = new Field<CCMR1_Input, true>(3, 4)        

        // Output Compare 1 clear enable
        readonly OC1CE = new Field<CCMR1_Input, true>(1, 7)        

        // Capture/Compare 2 selection
        readonly CC2S  = new Field<CCMR1_Input, true>(2, 8)        

        // Output Compare 2 fast enable
        readonly OC2FE = new Field<CCMR1_Input, true>(1, 10)        

        // Output Compare 2 preload enable
        readonly OC2PE = new Field<CCMR1_Input, true>(1, 11)        

        // Output Compare 2 mode
        readonly OC2M  = new Field<CCMR1_Input, true>(3, 12)        

        // Output Compare 2 clear enable
        readonly OC2CE = new Field<CCMR1_Input, true>(1, 15)        
    }

    // capture/compare mode register 2 (output 
    // mode)
    static readonly CCMR2_Output = new class CCMR2_Output extends Register<CCMR2_Output>
    {
        constructor() { super(0x40012c1c) }        

        // Capture/Compare 3 selection
        readonly CC3S   = new Field<CCMR2_Output, true>(2, 0)        

        // Output compare 3 fast enable
        readonly OC3FE  = new Field<CCMR2_Output, true>(1, 2)        

        // Output compare 3 preload enable
        readonly OC3PE  = new Field<CCMR2_Output, true>(1, 3)        

        // Output compare 3 mode
        readonly OC3M   = new Field<CCMR2_Output, true>(3, 4)        

        // Output compare 3 clear enable
        readonly OC3CE  = new Field<CCMR2_Output, true>(1, 7)        

        // Capture/Compare 4 selection
        readonly CC4S   = new Field<CCMR2_Output, true>(2, 8)        

        // Output compare 4 fast enable
        readonly OC4FE  = new Field<CCMR2_Output, true>(1, 10)        

        // Output compare 4 preload enable
        readonly OC4PE  = new Field<CCMR2_Output, true>(1, 11)        

        // Output compare 4 mode
        readonly OC4M   = new Field<CCMR2_Output, true>(3, 12)        

        // Output compare 4 clear enable
        readonly OC4CE  = new Field<CCMR2_Output, true>(1, 15)        

        // Output Compare 3 mode - bit 3
        readonly OC3M_3 = new Field<CCMR2_Output, true>(1, 16)        

        // Output Compare 4 mode - bit 3
        readonly OC4M_3 = new Field<CCMR2_Output, true>(1, 24)        
    }

    // capture/compare mode register 2 (output 
    // mode)
    static readonly CCMR2_Input = new class CCMR2_Input extends Register<CCMR2_Input>
    {
        constructor() { super(0x40012c1c) }        

        // Capture/Compare 3 selection
        readonly CC3S  = new Field<CCMR2_Input, true>(2, 0)        

        // Output compare 3 fast enable
        readonly OC3FE = new Field<CCMR2_Input, true>(1, 2)        

        // Output compare 3 preload enable
        readonly OC3PE = new Field<CCMR2_Input, true>(1, 3)        

        // Output compare 3 mode
        readonly OC3M  = new Field<CCMR2_Input, true>(3, 4)        

        // Output compare 3 clear enable
        readonly OC3CE = new Field<CCMR2_Input, true>(1, 7)        

        // Capture/Compare 4 selection
        readonly CC4S  = new Field<CCMR2_Input, true>(2, 8)        

        // Output compare 4 fast enable
        readonly OC4FE = new Field<CCMR2_Input, true>(1, 10)        

        // Output compare 4 preload enable
        readonly OC4PE = new Field<CCMR2_Input, true>(1, 11)        

        // Output compare 4 mode
        readonly OC4M  = new Field<CCMR2_Input, true>(3, 12)        

        // Output compare 4 clear enable
        readonly OC4CE = new Field<CCMR2_Input, true>(1, 15)        
    }

    // capture/compare enable register
    static readonly CCER = new class CCER extends Register<CCER>
    {
        constructor() { super(0x40012c20) }        

        // Capture/Compare 1 output enable
        readonly CC1E  = new Field<CCER, true>(1, 0)        

        // Capture/Compare 1 output Polarity
        readonly CC1P  = new Field<CCER, true>(1, 1)        

        // Capture/Compare 1 complementary output enable
        readonly CC1NE = new Field<CCER, true>(1, 2)        

        // Capture/Compare 1 output Polarity
        readonly CC1NP = new Field<CCER, true>(1, 3)        

        // Capture/Compare 2 output enable
        readonly CC2E  = new Field<CCER, true>(1, 4)        

        // Capture/Compare 2 output Polarity
        readonly CC2P  = new Field<CCER, true>(1, 5)        

        // Capture/Compare 2 complementary output enable
        readonly CC2NE = new Field<CCER, true>(1, 6)        

        // Capture/Compare 2 output Polarity
        readonly CC2NP = new Field<CCER, true>(1, 7)        

        // Capture/Compare 3 output enable
        readonly CC3E  = new Field<CCER, true>(1, 8)        

        // Capture/Compare 3 output Polarity
        readonly CC3P  = new Field<CCER, true>(1, 9)        

        // Capture/Compare 3 complementary output enable
        readonly CC3NE = new Field<CCER, true>(1, 10)        

        // Capture/Compare 3 output Polarity
        readonly CC3NP = new Field<CCER, true>(1, 11)        

        // Capture/Compare 4 output enable
        readonly CC4E  = new Field<CCER, true>(1, 12)        

        // Capture/Compare 3 output Polarity
        readonly CC4P  = new Field<CCER, true>(1, 13)        

        // Capture/Compare 4 complementary output polarity
        readonly CC4NP = new Field<CCER, true>(1, 15)        

        // Capture/Compare 5 output enable
        readonly CC5E  = new Field<CCER, true>(1, 16)        

        // Capture/Compare 5 output polarity
        readonly CC5P  = new Field<CCER, true>(1, 17)        

        // Capture/Compare 6 output enable
        readonly CC6E  = new Field<CCER, true>(1, 20)        

        // Capture/Compare 6 output polarity
        readonly CC6P  = new Field<CCER, true>(1, 21)        
    }

    // counter
    static readonly CNT = new class CNT extends Register<CNT>
    {
        constructor() { super(0x40012c24) }        

        // counter value
        readonly CNT    = new Field<CNT, true>(16, 0)        

        // UIF copy
        readonly UIFCPY = new Field<CNT, false>(1, 31)        
    }

    // prescaler
    static readonly PSC = new class PSC extends Register<PSC>
    {
        constructor() { super(0x40012c28) }        

        // Prescaler value
        readonly PSC = new Field<PSC, true>(16, 0)        
    }

    // auto-reload register
    static readonly ARR = new class ARR extends Register<ARR>
    {
        constructor() { super(0x40012c2c) }        

        // Auto-reload value
        readonly ARR = new Field<ARR, true>(16, 0)        
    }

    // repetition counter register
    static readonly RCR = new class RCR extends Register<RCR>
    {
        constructor() { super(0x40012c30) }        

        // Repetition counter value
        readonly REP = new Field<RCR, true>(16, 0)        
    }

    // capture/compare register 1
    static readonly CCR1 = new class CCR1 extends Register<CCR1>
    {
        constructor() { super(0x40012c34) }        

        // Capture/Compare 1 value
        readonly CCR1 = new Field<CCR1, true>(16, 0)        
    }

    // capture/compare register 2
    static readonly CCR2 = new class CCR2 extends Register<CCR2>
    {
        constructor() { super(0x40012c38) }        

        // Capture/Compare 2 value
        readonly CCR2 = new Field<CCR2, true>(16, 0)        
    }

    // capture/compare register 3
    static readonly CCR3 = new class CCR3 extends Register<CCR3>
    {
        constructor() { super(0x40012c3c) }        

        // Capture/Compare value
        readonly CCR3 = new Field<CCR3, true>(16, 0)        
    }

    // capture/compare register 4
    static readonly CCR4 = new class CCR4 extends Register<CCR4>
    {
        constructor() { super(0x40012c40) }        

        // Capture/Compare value
        readonly CCR4 = new Field<CCR4, true>(16, 0)        
    }

    // break and dead-time register
    static readonly BDTR = new class BDTR extends Register<BDTR>
    {
        constructor() { super(0x40012c44) }        

        // Dead-time generator setup
        readonly DTG     = new Field<BDTR, true>(8, 0)        

        // Lock configuration
        readonly LOCK    = new Field<BDTR, true>(2, 8)        

        // Off-state selection for Idle mode
        readonly OSSI    = new Field<BDTR, true>(1, 10)        

        // Off-state selection for Run mode
        readonly OSSR    = new Field<BDTR, true>(1, 11)        

        // Break enable
        readonly BKE     = new Field<BDTR, true>(1, 12)        

        // Break polarity
        readonly BKP     = new Field<BDTR, true>(1, 13)        

        // Automatic output enable
        readonly AOE     = new Field<BDTR, true>(1, 14)        

        // Main output enable
        readonly MOE     = new Field<BDTR, true>(1, 15)        

        // Break filter
        readonly BKF     = new Field<BDTR, true>(4, 16)        

        // Break 2 filter
        readonly BK2F    = new Field<BDTR, true>(4, 20)        

        // Break 2 enable
        readonly BK2E    = new Field<BDTR, true>(1, 24)        

        // Break 2 polarity
        readonly BK2P    = new Field<BDTR, true>(1, 25)        

        // Break Disarm
        readonly BKDSRM  = new Field<BDTR, true>(1, 26)        

        // Break2 Disarm
        readonly BK2DSRM = new Field<BDTR, true>(1, 27)        

        // Break Bidirectional
        readonly BKBID   = new Field<BDTR, true>(1, 28)        

        // Break2 bidirectional
        readonly BK2ID   = new Field<BDTR, true>(1, 29)        
    }

    // DMA control register
    static readonly DCR = new class DCR extends Register<DCR>
    {
        constructor() { super(0x40012c48) }        

        // DMA burst length
        readonly DBL = new Field<DCR, true>(5, 8)        

        // DMA base address
        readonly DBA = new Field<DCR, true>(5, 0)        
    }

    // DMA address for full transfer
    static readonly DMAR = new class DMAR extends Register<DMAR>
    {
        constructor() { super(0x40012c4c) }        

        // DMA register for burst accesses
        readonly DMAB = new Field<DMAR, true>(16, 0)        
    }

    // option register 1
    static readonly OR1 = new class OR1 extends Register<OR1>
    {
        constructor() { super(0x40012c50) }        

        // Ocref_clr source selection
        readonly OCREF_CLR = new Field<OR1, true>(1, 0)        
    }

    // capture/compare mode register 2 (output 
    // mode)
    static readonly CCMR3_Output = new class CCMR3_Output extends Register<CCMR3_Output>
    {
        constructor() { super(0x40012c54) }        

        // Output Compare 6 mode bit 3
        readonly OC6M_bit3 = new Field<CCMR3_Output, true>(1, 24)        

        // Output Compare 5 mode bit 3
        readonly OC5M_bit3 = new Field<CCMR3_Output, true>(1, 16)        

        // Output compare 6 clear enable
        readonly OC6CE     = new Field<CCMR3_Output, true>(1, 15)        

        // Output compare 6 mode
        readonly OC6M      = new Field<CCMR3_Output, true>(3, 12)        

        // Output compare 6 preload enable
        readonly OC6PE     = new Field<CCMR3_Output, true>(1, 11)        

        // Output compare 6 fast enable
        readonly OC6FE     = new Field<CCMR3_Output, true>(1, 10)        

        // Output compare 5 clear enable
        readonly OC5CE     = new Field<CCMR3_Output, true>(1, 7)        

        // Output compare 5 mode
        readonly OC5M      = new Field<CCMR3_Output, true>(3, 4)        

        // Output compare 5 preload enable
        readonly OC5PE     = new Field<CCMR3_Output, true>(1, 3)        

        // Output compare 5 fast enable
        readonly OC5FE     = new Field<CCMR3_Output, true>(1, 2)        
    }

    // capture/compare register 4
    static readonly CCR5 = new class CCR5 extends Register<CCR5>
    {
        constructor() { super(0x40012c58) }        

        // Capture/Compare value
        readonly CCR5  = new Field<CCR5, true>(16, 0)        

        // Group Channel 5 and Channel 1
        readonly GC5C1 = new Field<CCR5, true>(1, 29)        

        // Group Channel 5 and Channel 2
        readonly GC5C2 = new Field<CCR5, true>(1, 30)        

        // Group Channel 5 and Channel 3
        readonly GC5C3 = new Field<CCR5, true>(1, 31)        
    }

    // capture/compare register 4
    static readonly CCR6 = new class CCR6 extends Register<CCR6>
    {
        constructor() { super(0x40012c5c) }        

        // Capture/Compare value
        readonly CCR6 = new Field<CCR6, true>(16, 0)        
    }

    // DMA address for full transfer
    static readonly AF1 = new class AF1 extends Register<AF1>
    {
        constructor() { super(0x40012c60) }        

        // BRK BKIN input enable
        readonly BKINE   = new Field<AF1, true>(1, 0)        

        // BRK COMP1 enable
        readonly BKCMP1E = new Field<AF1, true>(1, 1)        

        // BRK COMP2 enable
        readonly BKCMP2E = new Field<AF1, true>(1, 2)        

        // BRK BKIN input polarity
        readonly BKINP   = new Field<AF1, true>(1, 9)        

        // BRK COMP1 input polarity
        readonly BKCMP1P = new Field<AF1, true>(1, 10)        

        // BRK COMP2 input polarity
        readonly BKCMP2P = new Field<AF1, true>(1, 11)        

        // ETR source selection
        readonly ETRSEL  = new Field<AF1, true>(3, 14)        
    }

    // DMA address for full transfer
    static readonly AF2 = new class AF2 extends Register<AF2>
    {
        constructor() { super(0x40012c64) }        

        // BRK2 BKIN input enable
        readonly BK2INE    = new Field<AF2, true>(1, 0)        

        // BRK2 COMP1 enable
        readonly BK2CMP1E  = new Field<AF2, true>(1, 1)        

        // BRK2 COMP2 enable
        readonly BK2CMP2E  = new Field<AF2, true>(1, 2)        

        // BRK2 DFSDM_BREAK0 enable
        readonly BK2DFBK0E = new Field<AF2, true>(1, 8)        

        // BRK2 BKIN input polarity
        readonly BK2INP    = new Field<AF2, true>(1, 9)        

        // BRK2 COMP1 input polarity
        readonly BK2CMP1P  = new Field<AF2, true>(1, 10)        

        // BRK2 COMP2 input polarity
        readonly BK2CMP2P  = new Field<AF2, true>(1, 11)        
    }

    // TIM1 timer input selection register
    static readonly TISEL = new class TISEL extends Register<TISEL>
    {
        constructor() { super(0x40012c68) }        

        // selects TI1[0] to TI1[15] input
        readonly TI1SEL3_0 = new Field<TISEL, true>(4, 0)        

        // selects TI2[0] to TI2[15] input
        readonly TI2SEL3_0 = new Field<TISEL, true>(4, 8)        

        // selects TI3[0] to TI3[15] input
        readonly TI3SEL3_0 = new Field<TISEL, true>(4, 16)        

        // selects TI4[0] to TI4[15] input
        readonly TI4SEL3_0 = new Field<TISEL, true>(4, 24)        
    }
}

export class SYSCFG
{
    // SYSCFG configuration register 1
    static readonly CFGR1 = new class CFGR1 extends Register<CFGR1>
    {
        constructor() { super(0x40010000) }        

        // I2C3_FMP
        readonly I2C3_FMP     = new Field<CFGR1, true>(1, 24)        

        // Fast Mode Plus (FM+) driving capability 
        // activation bits
        readonly I2C_PA10_FMP = new Field<CFGR1, true>(1, 23)        

        // Fast Mode Plus (FM+) driving capability 
        // activation bits
        readonly I2C_PA9_FMP  = new Field<CFGR1, true>(1, 22)        

        // FM+ driving capability activation for 
        // I2C2
        readonly I2C2_FMP     = new Field<CFGR1, true>(1, 21)        

        // FM+ driving capability activation for 
        // I2C1
        readonly I2C1_FMP     = new Field<CFGR1, true>(1, 20)        

        // I2C_PB9_FMP
        readonly I2C_PB9_FMP  = new Field<CFGR1, true>(1, 19)        

        // I2C_PB8_FMP
        readonly I2C_PB8_FMP  = new Field<CFGR1, true>(1, 18)        

        // I2C_PB7_FMP
        readonly I2C_PB7_FMP  = new Field<CFGR1, true>(1, 17)        

        // Fast Mode Plus (FM+) driving capability 
        // activation bits
        readonly I2C_PBx_FMP  = new Field<CFGR1, true>(1, 16)        

        // Strobe signal bit for UCPD2
        readonly UCPD2_STROBE = new Field<CFGR1, true>(1, 10)        

        // Strobe signal bit for UCPD1
        readonly UCPD1_STROBE = new Field<CFGR1, true>(1, 9)        

        // I/O analog switch voltage booster enable
        readonly BOOSTEN      = new Field<CFGR1, true>(1, 8)        

        // IR Modulation Envelope signal selection.
        readonly IR_MOD       = new Field<CFGR1, true>(2, 6)        

        // IR output polarity selection
        readonly IR_POL       = new Field<CFGR1, true>(1, 5)        

        // PA11 and PA12 remapping bit.
        readonly PA12_RMP     = new Field<CFGR1, true>(1, 4)        

        // PA11_RMP
        readonly PA11_RMP     = new Field<CFGR1, true>(1, 3)        

        // Memory mapping selection bits
        readonly MEM_MODE     = new Field<CFGR1, true>(2, 0)        
    }

    // SYSCFG configuration register 1
    static readonly CFGR2 = new class CFGR2 extends Register<CFGR2>
    {
        constructor() { super(0x40010018) }        

        // Cortex-M0+ LOCKUP bit enable bit
        readonly LOCKUP_LOCK      = new Field<CFGR2, true>(1, 0)        

        // SRAM parity lock bit
        readonly SRAM_PARITY_LOCK = new Field<CFGR2, true>(1, 1)        

        // ECC error lock bit
        readonly ECC_LOCK         = new Field<CFGR2, true>(1, 3)        

        // SRAM parity error flag
        readonly SRAM_PEF         = new Field<CFGR2, true>(1, 8)        
    }

    // interrupt line 0 status register
    static readonly ITLINE0 = new class ITLINE0 extends Register<ITLINE0>
    {
        constructor() { super(0x40010080) }        

        // Window watchdog interrupt pending flag
        readonly WWDG = new Field<ITLINE0, false>(1, 0)        
    }

    // interrupt line 2 status register
    static readonly ITLINE2 = new class ITLINE2 extends Register<ITLINE2>
    {
        constructor() { super(0x40010088) }        

        // TAMP
        readonly TAMP = new Field<ITLINE2, false>(1, 0)        

        // RTC
        readonly RTC  = new Field<ITLINE2, false>(1, 1)        
    }

    // interrupt line 3 status register
    static readonly ITLINE3 = new class ITLINE3 extends Register<ITLINE3>
    {
        constructor() { super(0x4001008c) }        

        // FLASH_ITF
        readonly FLASH_ITF = new Field<ITLINE3, false>(1, 0)        

        // FLASH_ECC
        readonly FLASH_ECC = new Field<ITLINE3, false>(1, 1)        
    }

    // interrupt line 4 status register
    static readonly ITLINE4 = new class ITLINE4 extends Register<ITLINE4>
    {
        constructor() { super(0x40010090) }        

        // RCC
        readonly RCC = new Field<ITLINE4, false>(1, 0)        
    }

    // interrupt line 5 status register
    static readonly ITLINE5 = new class ITLINE5 extends Register<ITLINE5>
    {
        constructor() { super(0x40010094) }        

        // EXTI0
        readonly EXTI0 = new Field<ITLINE5, false>(1, 0)        

        // EXTI1
        readonly EXTI1 = new Field<ITLINE5, false>(1, 1)        
    }

    // interrupt line 6 status register
    static readonly ITLINE6 = new class ITLINE6 extends Register<ITLINE6>
    {
        constructor() { super(0x40010098) }        

        // EXTI2
        readonly EXTI2 = new Field<ITLINE6, false>(1, 0)        

        // EXTI3
        readonly EXTI3 = new Field<ITLINE6, false>(1, 1)        
    }

    // interrupt line 7 status register
    static readonly ITLINE7 = new class ITLINE7 extends Register<ITLINE7>
    {
        constructor() { super(0x4001009c) }        

        // EXTI4
        readonly EXTI4  = new Field<ITLINE7, false>(1, 0)        

        // EXTI5
        readonly EXTI5  = new Field<ITLINE7, false>(1, 1)        

        // EXTI6
        readonly EXTI6  = new Field<ITLINE7, false>(1, 2)        

        // EXTI7
        readonly EXTI7  = new Field<ITLINE7, false>(1, 3)        

        // EXTI8
        readonly EXTI8  = new Field<ITLINE7, false>(1, 4)        

        // EXTI9
        readonly EXTI9  = new Field<ITLINE7, false>(1, 5)        

        // EXTI10
        readonly EXTI10 = new Field<ITLINE7, false>(1, 6)        

        // EXTI11
        readonly EXTI11 = new Field<ITLINE7, false>(1, 7)        

        // EXTI12
        readonly EXTI12 = new Field<ITLINE7, false>(1, 8)        

        // EXTI13
        readonly EXTI13 = new Field<ITLINE7, false>(1, 9)        

        // EXTI14
        readonly EXTI14 = new Field<ITLINE7, false>(1, 10)        

        // EXTI15
        readonly EXTI15 = new Field<ITLINE7, false>(1, 11)        
    }

    // interrupt line 8 status register
    static readonly ITLINE8 = new class ITLINE8 extends Register<ITLINE8>
    {
        constructor() { super(0x400100a0) }        

        // USB
        readonly USB = new Field<ITLINE8, false>(1, 2)        
    }

    // interrupt line 9 status register
    static readonly ITLINE9 = new class ITLINE9 extends Register<ITLINE9>
    {
        constructor() { super(0x400100a4) }        

        // DMA1_CH1
        readonly DMA1_CH1 = new Field<ITLINE9, false>(1, 0)        
    }

    // interrupt line 10 status register
    static readonly ITLINE10 = new class ITLINE10 extends Register<ITLINE10>
    {
        constructor() { super(0x400100a8) }        

        // DMA1_CH1
        readonly DMA1_CH2 = new Field<ITLINE10, false>(1, 0)        

        // DMA1_CH3
        readonly DMA1_CH3 = new Field<ITLINE10, false>(1, 1)        
    }

    // interrupt line 11 status register
    static readonly ITLINE11 = new class ITLINE11 extends Register<ITLINE11>
    {
        constructor() { super(0x400100ac) }        

        // DMAMUX
        readonly DMAMUX   = new Field<ITLINE11, false>(1, 0)        

        // DMA1_CH4
        readonly DMA1_CH4 = new Field<ITLINE11, false>(1, 1)        

        // DMA1_CH5
        readonly DMA1_CH5 = new Field<ITLINE11, false>(1, 2)        

        // DMA1_CH6
        readonly DMA1_CH6 = new Field<ITLINE11, false>(1, 3)        

        // DMA1_CH7
        readonly DMA1_CH7 = new Field<ITLINE11, false>(1, 4)        

        // DMA2_CH1
        readonly DMA2_CH1 = new Field<ITLINE11, false>(1, 5)        

        // DMA2_CH2
        readonly DMA2_CH2 = new Field<ITLINE11, false>(1, 6)        

        // DMA2_CH3
        readonly DMA2_CH3 = new Field<ITLINE11, false>(1, 7)        

        // DMA2_CH4
        readonly DMA2_CH4 = new Field<ITLINE11, false>(1, 8)        

        // DMA2_CH5
        readonly DMA2_CH5 = new Field<ITLINE11, false>(1, 9)        
    }

    // interrupt line 12 status register
    static readonly ITLINE12 = new class ITLINE12 extends Register<ITLINE12>
    {
        constructor() { super(0x400100b0) }        

        // ADC
        readonly ADC = new Field<ITLINE12, false>(1, 0)        
    }

    // interrupt line 13 status register
    static readonly ITLINE13 = new class ITLINE13 extends Register<ITLINE13>
    {
        constructor() { super(0x400100b4) }        

        // TIM1_CCU
        readonly TIM1_CCU = new Field<ITLINE13, false>(1, 0)        

        // TIM1_TRG
        readonly TIM1_TRG = new Field<ITLINE13, false>(1, 1)        

        // TIM1_UPD
        readonly TIM1_UPD = new Field<ITLINE13, false>(1, 2)        

        // TIM1_BRK
        readonly TIM1_BRK = new Field<ITLINE13, false>(1, 3)        
    }

    // interrupt line 14 status register
    static readonly ITLINE14 = new class ITLINE14 extends Register<ITLINE14>
    {
        constructor() { super(0x400100b8) }        

        // TIM1_CC
        readonly TIM1_CC = new Field<ITLINE14, false>(1, 0)        
    }

    // interrupt line 16 status register
    static readonly ITLINE16 = new class ITLINE16 extends Register<ITLINE16>
    {
        constructor() { super(0x400100c0) }        

        // TIM3
        readonly TIM3 = new Field<ITLINE16, false>(1, 0)        

        // TIM4
        readonly TIM4 = new Field<ITLINE16, false>(1, 1)        
    }

    // interrupt line 17 status register
    static readonly ITLINE17 = new class ITLINE17 extends Register<ITLINE17>
    {
        constructor() { super(0x400100c4) }        

        // TIM6
        readonly TIM6 = new Field<ITLINE17, false>(1, 0)        
    }

    // interrupt line 18 status register
    static readonly ITLINE18 = new class ITLINE18 extends Register<ITLINE18>
    {
        constructor() { super(0x400100c8) }        

        // TIM7
        readonly TIM7 = new Field<ITLINE18, false>(1, 0)        
    }

    // interrupt line 19 status register
    static readonly ITLINE19 = new class ITLINE19 extends Register<ITLINE19>
    {
        constructor() { super(0x400100cc) }        

        // TIM14
        readonly TIM14 = new Field<ITLINE19, false>(1, 0)        
    }

    // interrupt line 20 status register
    static readonly ITLINE20 = new class ITLINE20 extends Register<ITLINE20>
    {
        constructor() { super(0x400100d0) }        

        // TIM15
        readonly TIM15 = new Field<ITLINE20, false>(1, 0)        
    }

    // interrupt line 21 status register
    static readonly ITLINE21 = new class ITLINE21 extends Register<ITLINE21>
    {
        constructor() { super(0x400100d4) }        

        // TIM16
        readonly TIM16 = new Field<ITLINE21, false>(1, 0)        
    }

    // interrupt line 22 status register
    static readonly ITLINE22 = new class ITLINE22 extends Register<ITLINE22>
    {
        constructor() { super(0x400100d8) }        

        // TIM17
        readonly TIM17 = new Field<ITLINE22, false>(1, 0)        
    }

    // interrupt line 23 status register
    static readonly ITLINE23 = new class ITLINE23 extends Register<ITLINE23>
    {
        constructor() { super(0x400100dc) }        

        // I2C1
        readonly I2C1 = new Field<ITLINE23, false>(1, 0)        
    }

    // interrupt line 24 status register
    static readonly ITLINE24 = new class ITLINE24 extends Register<ITLINE24>
    {
        constructor() { super(0x400100e0) }        

        // I2C2
        readonly I2C2 = new Field<ITLINE24, false>(1, 0)        

        // I2C3
        readonly I2C3 = new Field<ITLINE24, false>(1, 1)        
    }

    // interrupt line 25 status register
    static readonly ITLINE25 = new class ITLINE25 extends Register<ITLINE25>
    {
        constructor() { super(0x400100e4) }        

        // SPI1
        readonly SPI1 = new Field<ITLINE25, false>(1, 0)        
    }

    // interrupt line 26 status register
    static readonly ITLINE26 = new class ITLINE26 extends Register<ITLINE26>
    {
        constructor() { super(0x400100e8) }        

        // SPI2
        readonly SPI2 = new Field<ITLINE26, false>(1, 0)        

        // SPI3
        readonly SPI3 = new Field<ITLINE26, false>(1, 14)        
    }

    // interrupt line 27 status register
    static readonly ITLINE27 = new class ITLINE27 extends Register<ITLINE27>
    {
        constructor() { super(0x400100ec) }        

        // USART1
        readonly USART1 = new Field<ITLINE27, false>(1, 0)        
    }

    // interrupt line 28 status register
    static readonly ITLINE28 = new class ITLINE28 extends Register<ITLINE28>
    {
        constructor() { super(0x400100f0) }        

        // USART2
        readonly USART2 = new Field<ITLINE28, false>(1, 0)        
    }

    // interrupt line 29 status register
    static readonly ITLINE29 = new class ITLINE29 extends Register<ITLINE29>
    {
        constructor() { super(0x400100f4) }        

        // USART3
        readonly USART3 = new Field<ITLINE29, false>(1, 0)        

        // USART4
        readonly USART4 = new Field<ITLINE29, false>(1, 1)        

        // USART5
        readonly USART5 = new Field<ITLINE29, false>(1, 3)        

        // USART6
        readonly USART6 = new Field<ITLINE29, false>(1, 4)        
    }
}

export class TAMP
{
    // TAMP control register 1
    static readonly TAMP_CR1 = new class TAMP_CR1 extends Register<TAMP_CR1>
    {
        constructor() { super(0x4000b000) }        

        // Tamper detection on TAMP_IN1 enable
        readonly TAMP1E  = new Field<TAMP_CR1, true>(1, 0)        

        // Tamper detection on TAMP_IN2 enable
        readonly TAMP2E  = new Field<TAMP_CR1, true>(1, 1)        

        // Tamper detection on TAMP_IN3 enable
        readonly TAMP3E  = new Field<TAMP_CR1, true>(1, 2)        

        // Internal tamper 3 enable: LSE monitoring
        readonly ITAMP3E = new Field<TAMP_CR1, true>(1, 18)        

        // Internal tamper 4 enable: HSE monitoring
        readonly ITAMP4E = new Field<TAMP_CR1, true>(1, 19)        

        // Internal tamper 5 enable: RTC calendar 
        // overflow
        readonly ITAMP5E = new Field<TAMP_CR1, true>(1, 20)        

        // Internal tamper 6 enable: ST manufacturer 
        // readout
        readonly ITAMP6E = new Field<TAMP_CR1, true>(1, 21)        
    }

    // TAMP control register 2
    static readonly TAMP_CR2 = new class TAMP_CR2 extends Register<TAMP_CR2>
    {
        constructor() { super(0x4000b004) }        

        // Tamper 1 no erase
        readonly TAMP1NOER = new Field<TAMP_CR2, true>(1, 0)        

        // Tamper 2 no erase
        readonly TAMP2NOER = new Field<TAMP_CR2, true>(1, 1)        

        // Tamper 3 no erase
        readonly TAMP3NOER = new Field<TAMP_CR2, true>(1, 2)        

        // Tamper 1 mask The tamper 1 interrupt 
        // must not be enabled when TAMP1MSK is 
        // set.
        readonly TAMP1MSK  = new Field<TAMP_CR2, true>(1, 16)        

        // Tamper 2 mask The tamper 2 interrupt 
        // must not be enabled when TAMP2MSK is 
        // set.
        readonly TAMP2MSK  = new Field<TAMP_CR2, true>(1, 17)        

        // Tamper 3 mask The tamper 3 interrupt 
        // must not be enabled when TAMP3MSK is 
        // set.
        readonly TAMP3MSK  = new Field<TAMP_CR2, true>(1, 18)        

        // Active level for tamper 1 input (active 
        // mode disabled) If TAMPFLT = 00 Tamper 1 
        // input rising edge and high level 
        // triggers a tamper detection event. If 
        // TAMPFLT = 00 Tamper 1 input falling edge 
        // and low level triggers a tamper 
        // detection event.
        readonly TAMP1TRG  = new Field<TAMP_CR2, true>(1, 24)        

        // Active level for tamper 2 input (active 
        // mode disabled) If TAMPFLT = 00 Tamper 2 
        // input rising edge and high level 
        // triggers a tamper detection event. If 
        // TAMPFLT = 00 Tamper 2 input falling edge 
        // and low level triggers a tamper 
        // detection event.
        readonly TAMP2TRG  = new Field<TAMP_CR2, true>(1, 25)        

        // Active level for tamper 3 input (active 
        // mode disabled) If TAMPFLT = 00 Tamper 3 
        // input rising edge and high level 
        // triggers a tamper detection event. If 
        // TAMPFLT = 00 Tamper 3 input falling edge 
        // and low level triggers a tamper 
        // detection event.
        readonly TAMP3TRG  = new Field<TAMP_CR2, true>(1, 26)        
    }

    // TAMP filter control register
    static readonly TAMP_FLTCR = new class TAMP_FLTCR extends Register<TAMP_FLTCR>
    {
        constructor() { super(0x4000b00c) }        

        // Tamper sampling frequency Determines the 
        // frequency at which each of the TAMP_INx 
        // inputs are sampled.
        readonly TAMPFREQ  = new Field<TAMP_FLTCR, true>(3, 0)        

        // TAMP_INx filter count These bits 
        // determines the number of consecutive 
        // samples at the specified level 
        // (TAMP*TRG) needed to activate a tamper 
        // event. TAMPFLT is valid for each of the 
        // TAMP_INx inputs.
        readonly TAMPFLT   = new Field<TAMP_FLTCR, true>(2, 3)        

        // TAMP_INx precharge duration These bit 
        // determines the duration of time during 
        // which the pull-up/is activated before 
        // each sample. TAMPPRCH is valid for each 
        // of the TAMP_INx inputs.
        readonly TAMPPRCH  = new Field<TAMP_FLTCR, true>(2, 5)        

        // TAMP_INx pull-up disable This bit 
        // determines if each of the TAMPx pins are 
        // precharged before each sample.
        readonly TAMPPUDIS = new Field<TAMP_FLTCR, true>(1, 7)        
    }

    // TAMP interrupt enable register
    static readonly TAMP_IER = new class TAMP_IER extends Register<TAMP_IER>
    {
        constructor() { super(0x4000b02c) }        

        // Tamper 1 interrupt enable
        readonly TAMP1IE  = new Field<TAMP_IER, true>(1, 0)        

        // Tamper 2 interrupt enable
        readonly TAMP2IE  = new Field<TAMP_IER, true>(1, 1)        

        // Tamper 3 interrupt enable
        readonly TAMP3IE  = new Field<TAMP_IER, true>(1, 2)        

        // Internal tamper 3 interrupt enable: LSE 
        // monitoring
        readonly ITAMP3IE = new Field<TAMP_IER, true>(1, 18)        

        // Internal tamper 4 interrupt enable: HSE 
        // monitoring
        readonly ITAMP4IE = new Field<TAMP_IER, true>(1, 19)        

        // Internal tamper 5 interrupt enable: RTC 
        // calendar overflow
        readonly ITAMP5IE = new Field<TAMP_IER, true>(1, 20)        

        // Internal tamper 6 interrupt enable: ST 
        // manufacturer readout
        readonly ITAMP6IE = new Field<TAMP_IER, true>(1, 21)        
    }

    // TAMP status register
    static readonly TAMP_SR = new class TAMP_SR extends Register<TAMP_SR>
    {
        constructor() { super(0x4000b030) }        

        // TAMP1 detection flag This flag is set by 
        // hardware when a tamper detection event is 
        // detected on the TAMP1 input.
        readonly TAMP1F  = new Field<TAMP_SR, false>(1, 0)        

        // TAMP2 detection flag This flag is set by 
        // hardware when a tamper detection event is 
        // detected on the TAMP2 input.
        readonly TAMP2F  = new Field<TAMP_SR, false>(1, 1)        

        // TAMP3 detection flag This flag is set by 
        // hardware when a tamper detection event is 
        // detected on the TAMP3 input.
        readonly TAMP3F  = new Field<TAMP_SR, false>(1, 2)        

        // LSE monitoring tamper detection flag This 
        // flag is set by hardware when a tamper 
        // detection event is detected on the 
        // internal tamper 3.
        readonly ITAMP3F = new Field<TAMP_SR, false>(1, 18)        

        // HSE monitoring tamper detection flag This 
        // flag is set by hardware when a tamper 
        // detection event is detected on the 
        // internal tamper 4.
        readonly ITAMP4F = new Field<TAMP_SR, false>(1, 19)        

        // RTC calendar overflow tamper detection 
        // flag This flag is set by hardware when a 
        // tamper detection event is detected on the 
        // internal tamper 5.
        readonly ITAMP5F = new Field<TAMP_SR, false>(1, 20)        

        // ST manufacturer readout tamper detection 
        // flag This flag is set by hardware when a 
        // tamper detection event is detected on the 
        // internal tamper 6.
        readonly ITAMP6F = new Field<TAMP_SR, false>(1, 21)        
    }

    // TAMP masked interrupt status register
    static readonly TAMP_MISR = new class TAMP_MISR extends Register<TAMP_MISR>
    {
        constructor() { super(0x4000b034) }        

        // TAMP1 interrupt masked flag This flag is 
        // set by hardware when the tamper 1 
        // interrupt is raised.
        readonly TAMP1MF  = new Field<TAMP_MISR, false>(1, 0)        

        // TAMP2 interrupt masked flag This flag is 
        // set by hardware when the tamper 2 
        // interrupt is raised.
        readonly TAMP2MF  = new Field<TAMP_MISR, false>(1, 1)        

        // TAMP3 interrupt masked flag This flag is 
        // set by hardware when the tamper 3 
        // interrupt is raised.
        readonly TAMP3MF  = new Field<TAMP_MISR, false>(1, 2)        

        // LSE monitoring tamper interrupt masked 
        // flag This flag is set by hardware when 
        // the internal tamper 3 interrupt is 
        // raised.
        readonly ITAMP3MF = new Field<TAMP_MISR, false>(1, 18)        

        // HSE monitoring tamper interrupt masked 
        // flag This flag is set by hardware when 
        // the internal tamper 4 interrupt is 
        // raised.
        readonly ITAMP4MF = new Field<TAMP_MISR, false>(1, 19)        

        // RTC calendar overflow tamper interrupt 
        // masked flag This flag is set by hardware 
        // when the internal tamper 5 interrupt is 
        // raised.
        readonly ITAMP5MF = new Field<TAMP_MISR, false>(1, 20)        

        // ST manufacturer readout tamper interrupt 
        // masked flag This flag is set by hardware 
        // when the internal tamper 6 interrupt is 
        // raised.
        readonly ITAMP6MF = new Field<TAMP_MISR, false>(1, 21)        
    }

    // TAMP status clear register
    static readonly TAMP_SCR = new class TAMP_SCR extends Register<TAMP_SCR>
    {
        constructor() { super(0x4000b03c) }        

        // Clear TAMP1 detection flag Writing 1 in 
        // this bit clears the TAMP1F bit in the 
        // TAMP_SR register.
        readonly CTAMP1F  = new Field<TAMP_SCR, true>(1, 0)        

        // Clear TAMP2 detection flag Writing 1 in 
        // this bit clears the TAMP2F bit in the 
        // TAMP_SR register.
        readonly CTAMP2F  = new Field<TAMP_SCR, true>(1, 1)        

        // Clear TAMP3 detection flag Writing 1 in 
        // this bit clears the TAMP3F bit in the 
        // TAMP_SR register.
        readonly CTAMP3F  = new Field<TAMP_SCR, true>(1, 2)        

        // Clear ITAMP3 detection flag Writing 1 in 
        // this bit clears the ITAMP3F bit in the 
        // TAMP_SR register.
        readonly CITAMP3F = new Field<TAMP_SCR, true>(1, 18)        

        // Clear ITAMP4 detection flag Writing 1 in 
        // this bit clears the ITAMP4F bit in the 
        // TAMP_SR register.
        readonly CITAMP4F = new Field<TAMP_SCR, true>(1, 19)        

        // Clear ITAMP5 detection flag Writing 1 in 
        // this bit clears the ITAMP5F bit in the 
        // TAMP_SR register.
        readonly CITAMP5F = new Field<TAMP_SCR, true>(1, 20)        

        // Clear ITAMP6 detection flag Writing 1 in 
        // this bit clears the ITAMP6F bit in the 
        // TAMP_SR register.
        readonly CITAMP6F = new Field<TAMP_SCR, true>(1, 21)        
    }

    // TAMP backup 0 register
    static readonly TAMP_BKP0R = new class TAMP_BKP0R extends Register<TAMP_BKP0R>
    {
        constructor() { super(0x4000b100) }        

        // The application can write or read data to 
        // and from these registers. They are 
        // powered-on by VBAT when VDD is switched 
        // off, so that they are not reset by System 
        // reset, and their contents remain valid when 
        // the device operates in low-power mode. In 
        // the default configuration this register is 
        // reset on a tamper detection event. It is 
        // forced to reset value as long as there is 
        // at least one internal or external tamper 
        // flag being set. This register is also reset 
        // when the readout protection (RDP) is 
        // disabled.
        readonly BKP = new Field<TAMP_BKP0R, true>(32, 0)        
    }

    // TAMP backup 1 register
    static readonly TAMP_BKP1R = new class TAMP_BKP1R extends Register<TAMP_BKP1R>
    {
        constructor() { super(0x4000b104) }        

        // The application can write or read data to 
        // and from these registers. They are 
        // powered-on by VBAT when VDD is switched 
        // off, so that they are not reset by System 
        // reset, and their contents remain valid when 
        // the device operates in low-power mode. In 
        // the default configuration this register is 
        // reset on a tamper detection event. It is 
        // forced to reset value as long as there is 
        // at least one internal or external tamper 
        // flag being set. This register is also reset 
        // when the readout protection (RDP) is 
        // disabled.
        readonly BKP = new Field<TAMP_BKP1R, true>(32, 0)        
    }

    // TAMP backup 2 register
    static readonly TAMP_BKP2R = new class TAMP_BKP2R extends Register<TAMP_BKP2R>
    {
        constructor() { super(0x4000b108) }        

        // The application can write or read data to 
        // and from these registers. They are 
        // powered-on by VBAT when VDD is switched 
        // off, so that they are not reset by System 
        // reset, and their contents remain valid when 
        // the device operates in low-power mode. In 
        // the default configuration this register is 
        // reset on a tamper detection event. It is 
        // forced to reset value as long as there is 
        // at least one internal or external tamper 
        // flag being set. This register is also reset 
        // when the readout protection (RDP) is 
        // disabled.
        readonly BKP = new Field<TAMP_BKP2R, true>(32, 0)        
    }

    // TAMP backup 3 register
    static readonly TAMP_BKP3R = new class TAMP_BKP3R extends Register<TAMP_BKP3R>
    {
        constructor() { super(0x4000b10c) }        

        // The application can write or read data to 
        // and from these registers. They are 
        // powered-on by VBAT when VDD is switched 
        // off, so that they are not reset by System 
        // reset, and their contents remain valid when 
        // the device operates in low-power mode. In 
        // the default configuration this register is 
        // reset on a tamper detection event. It is 
        // forced to reset value as long as there is 
        // at least one internal or external tamper 
        // flag being set. This register is also reset 
        // when the readout protection (RDP) is 
        // disabled.
        readonly BKP = new Field<TAMP_BKP3R, true>(32, 0)        
    }

    // TAMP backup 4 register
    static readonly TAMP_BKP4R = new class TAMP_BKP4R extends Register<TAMP_BKP4R>
    {
        constructor() { super(0x4000b110) }        

        // The application can write or read data to 
        // and from these registers. They are 
        // powered-on by VBAT when VDD is switched 
        // off, so that they are not reset by System 
        // reset, and their contents remain valid when 
        // the device operates in low-power mode. In 
        // the default configuration this register is 
        // reset on a tamper detection event. It is 
        // forced to reset value as long as there is 
        // at least one internal or external tamper 
        // flag being set. This register is also reset 
        // when the readout protection (RDP) is 
        // disabled.
        readonly BKP = new Field<TAMP_BKP4R, true>(32, 0)        
    }
}

export class I2C1
{
    // Control register 1
    static readonly CR1 = new class CR1 extends Register<CR1>
    {
        constructor() { super(0x40005400) }        

        // Peripheral enable
        readonly PE        = new Field<CR1, true>(1, 0)        

        // TX Interrupt enable
        readonly TXIE      = new Field<CR1, true>(1, 1)        

        // RX Interrupt enable
        readonly RXIE      = new Field<CR1, true>(1, 2)        

        // Address match interrupt enable (slave only)
        readonly ADDRIE    = new Field<CR1, true>(1, 3)        

        // Not acknowledge received interrupt enable
        readonly NACKIE    = new Field<CR1, true>(1, 4)        

        // STOP detection Interrupt enable
        readonly STOPIE    = new Field<CR1, true>(1, 5)        

        // Transfer Complete interrupt enable
        readonly TCIE      = new Field<CR1, true>(1, 6)        

        // Error interrupts enable
        readonly ERRIE     = new Field<CR1, true>(1, 7)        

        // Digital noise filter
        readonly DNF       = new Field<CR1, true>(4, 8)        

        // Analog noise filter OFF
        readonly ANFOFF    = new Field<CR1, true>(1, 12)        

        // DMA transmission requests enable
        readonly TXDMAEN   = new Field<CR1, true>(1, 14)        

        // DMA reception requests enable
        readonly RXDMAEN   = new Field<CR1, true>(1, 15)        

        // Slave byte control
        readonly SBC       = new Field<CR1, true>(1, 16)        

        // Clock stretching disable
        readonly NOSTRETCH = new Field<CR1, true>(1, 17)        

        // Wakeup from STOP enable
        readonly WUPEN     = new Field<CR1, true>(1, 18)        

        // General call enable
        readonly GCEN      = new Field<CR1, true>(1, 19)        

        // SMBus Host address enable
        readonly SMBHEN    = new Field<CR1, true>(1, 20)        

        // SMBus Device Default address enable
        readonly SMBDEN    = new Field<CR1, true>(1, 21)        

        // SMBUS alert enable
        readonly ALERTEN   = new Field<CR1, true>(1, 22)        

        // PEC enable
        readonly PECEN     = new Field<CR1, true>(1, 23)        
    }

    // Control register 2
    static readonly CR2 = new class CR2 extends Register<CR2>
    {
        constructor() { super(0x40005404) }        

        // Packet error checking byte
        readonly PECBYTE = new Field<CR2, true>(1, 26)        

        // Automatic end mode (master mode)
        readonly AUTOEND = new Field<CR2, true>(1, 25)        

        // NBYTES reload mode
        readonly RELOAD  = new Field<CR2, true>(1, 24)        

        // Number of bytes
        readonly NBYTES  = new Field<CR2, true>(8, 16)        

        // NACK generation (slave mode)
        readonly NACK    = new Field<CR2, true>(1, 15)        

        // Stop generation (master mode)
        readonly STOP    = new Field<CR2, true>(1, 14)        

        // Start generation
        readonly START   = new Field<CR2, true>(1, 13)        

        // 10-bit address header only read direction 
        // (master receiver mode)
        readonly HEAD10R = new Field<CR2, true>(1, 12)        

        // 10-bit addressing mode (master mode)
        readonly ADD10   = new Field<CR2, true>(1, 11)        

        // Transfer direction (master mode)
        readonly RD_WRN  = new Field<CR2, true>(1, 10)        

        // Slave address bit (master mode)
        readonly SADD    = new Field<CR2, true>(10, 0)        
    }

    // Own address register 1
    static readonly OAR1 = new class OAR1 extends Register<OAR1>
    {
        constructor() { super(0x40005408) }        

        // Interface address
        readonly OA1_0   = new Field<OAR1, true>(1, 0)        

        // Interface address
        readonly OA1_7_1 = new Field<OAR1, true>(7, 1)        

        // Interface address
        readonly OA1_8_9 = new Field<OAR1, true>(2, 8)        

        // Own Address 1 10-bit mode
        readonly OA1MODE = new Field<OAR1, true>(1, 10)        

        // Own Address 1 enable
        readonly OA1EN   = new Field<OAR1, true>(1, 15)        
    }

    // Own address register 2
    static readonly OAR2 = new class OAR2 extends Register<OAR2>
    {
        constructor() { super(0x4000540c) }        

        // Interface address
        readonly OA2    = new Field<OAR2, true>(7, 1)        

        // Own Address 2 masks
        readonly OA2MSK = new Field<OAR2, true>(3, 8)        

        // Own Address 2 enable
        readonly OA2EN  = new Field<OAR2, true>(1, 15)        
    }

    // Timing register
    static readonly TIMINGR = new class TIMINGR extends Register<TIMINGR>
    {
        constructor() { super(0x40005410) }        

        // SCL low period (master mode)
        readonly SCLL   = new Field<TIMINGR, true>(8, 0)        

        // SCL high period (master mode)
        readonly SCLH   = new Field<TIMINGR, true>(8, 8)        

        // Data hold time
        readonly SDADEL = new Field<TIMINGR, true>(4, 16)        

        // Data setup time
        readonly SCLDEL = new Field<TIMINGR, true>(4, 20)        

        // Timing prescaler
        readonly PRESC  = new Field<TIMINGR, true>(4, 28)        
    }

    // Status register 1
    static readonly TIMEOUTR = new class TIMEOUTR extends Register<TIMEOUTR>
    {
        constructor() { super(0x40005414) }        

        // Bus timeout A
        readonly TIMEOUTA = new Field<TIMEOUTR, true>(12, 0)        

        // Idle clock timeout detection
        readonly TIDLE    = new Field<TIMEOUTR, true>(1, 12)        

        // Clock timeout enable
        readonly TIMOUTEN = new Field<TIMEOUTR, true>(1, 15)        

        // Bus timeout B
        readonly TIMEOUTB = new Field<TIMEOUTR, true>(12, 16)        

        // Extended clock timeout enable
        readonly TEXTEN   = new Field<TIMEOUTR, true>(1, 31)        
    }

    // Interrupt and Status register
    static readonly ISR = new class ISR extends Register<ISR>
    {
        constructor() { super(0x40005418) }        

        // Address match code (Slave mode)
        readonly ADDCODE = new Field<ISR, false>(7, 17)        

        // Transfer direction (Slave mode)
        readonly DIR     = new Field<ISR, false>(1, 16)        

        // Bus busy
        readonly BUSY    = new Field<ISR, false>(1, 15)        

        // SMBus alert
        readonly ALERT   = new Field<ISR, false>(1, 13)        

        // Timeout or t_low detection flag
        readonly TIMEOUT = new Field<ISR, false>(1, 12)        

        // PEC Error in reception
        readonly PECERR  = new Field<ISR, false>(1, 11)        

        // Overrun/Underrun (slave mode)
        readonly OVR     = new Field<ISR, false>(1, 10)        

        // Arbitration lost
        readonly ARLO    = new Field<ISR, false>(1, 9)        

        // Bus error
        readonly BERR    = new Field<ISR, false>(1, 8)        

        // Transfer Complete Reload
        readonly TCR     = new Field<ISR, false>(1, 7)        

        // Transfer Complete (master mode)
        readonly TC      = new Field<ISR, false>(1, 6)        

        // Stop detection flag
        readonly STOPF   = new Field<ISR, false>(1, 5)        

        // Not acknowledge received flag
        readonly NACKF   = new Field<ISR, false>(1, 4)        

        // Address matched (slave mode)
        readonly ADDR    = new Field<ISR, false>(1, 3)        

        // Receive data register not empty (receivers)
        readonly RXNE    = new Field<ISR, false>(1, 2)        

        // Transmit interrupt status (transmitters)
        readonly TXIS    = new Field<ISR, true>(1, 1)        

        // Transmit data register empty (transmitters)
        readonly TXE     = new Field<ISR, true>(1, 0)        
    }

    // Interrupt clear register
    static readonly ICR = new class ICR extends Register<ICR>
    {
        constructor() { super(0x4000541c) }        

        // Alert flag clear
        readonly ALERTCF  = new Field<ICR, true>(1, 13)        

        // Timeout detection flag clear
        readonly TIMOUTCF = new Field<ICR, true>(1, 12)        

        // PEC Error flag clear
        readonly PECCF    = new Field<ICR, true>(1, 11)        

        // Overrun/Underrun flag clear
        readonly OVRCF    = new Field<ICR, true>(1, 10)        

        // Arbitration lost flag clear
        readonly ARLOCF   = new Field<ICR, true>(1, 9)        

        // Bus error flag clear
        readonly BERRCF   = new Field<ICR, true>(1, 8)        

        // Stop detection flag clear
        readonly STOPCF   = new Field<ICR, true>(1, 5)        

        // Not Acknowledge flag clear
        readonly NACKCF   = new Field<ICR, true>(1, 4)        

        // Address Matched flag clear
        readonly ADDRCF   = new Field<ICR, true>(1, 3)        
    }

    // PEC register
    static readonly PECR = new class PECR extends Register<PECR>
    {
        constructor() { super(0x40005420) }        

        // Packet error checking register
        readonly PEC = new Field<PECR, false>(8, 0)        
    }

    // Receive data register
    static readonly RXDR = new class RXDR extends Register<RXDR>
    {
        constructor() { super(0x40005424) }        

        // 8-bit receive data
        readonly RXDATA = new Field<RXDR, false>(8, 0)        
    }

    // Transmit data register
    static readonly TXDR = new class TXDR extends Register<TXDR>
    {
        constructor() { super(0x40005428) }        

        // 8-bit transmit data
        readonly TXDATA = new Field<TXDR, true>(8, 0)        
    }
}

export class I2C2
{
    // Control register 1
    static readonly CR1 = new class CR1 extends Register<CR1>
    {
        constructor() { super(0x40005800) }        

        // Peripheral enable
        readonly PE        = new Field<CR1, true>(1, 0)        

        // TX Interrupt enable
        readonly TXIE      = new Field<CR1, true>(1, 1)        

        // RX Interrupt enable
        readonly RXIE      = new Field<CR1, true>(1, 2)        

        // Address match interrupt enable (slave only)
        readonly ADDRIE    = new Field<CR1, true>(1, 3)        

        // Not acknowledge received interrupt enable
        readonly NACKIE    = new Field<CR1, true>(1, 4)        

        // STOP detection Interrupt enable
        readonly STOPIE    = new Field<CR1, true>(1, 5)        

        // Transfer Complete interrupt enable
        readonly TCIE      = new Field<CR1, true>(1, 6)        

        // Error interrupts enable
        readonly ERRIE     = new Field<CR1, true>(1, 7)        

        // Digital noise filter
        readonly DNF       = new Field<CR1, true>(4, 8)        

        // Analog noise filter OFF
        readonly ANFOFF    = new Field<CR1, true>(1, 12)        

        // DMA transmission requests enable
        readonly TXDMAEN   = new Field<CR1, true>(1, 14)        

        // DMA reception requests enable
        readonly RXDMAEN   = new Field<CR1, true>(1, 15)        

        // Slave byte control
        readonly SBC       = new Field<CR1, true>(1, 16)        

        // Clock stretching disable
        readonly NOSTRETCH = new Field<CR1, true>(1, 17)        

        // Wakeup from STOP enable
        readonly WUPEN     = new Field<CR1, true>(1, 18)        

        // General call enable
        readonly GCEN      = new Field<CR1, true>(1, 19)        

        // SMBus Host address enable
        readonly SMBHEN    = new Field<CR1, true>(1, 20)        

        // SMBus Device Default address enable
        readonly SMBDEN    = new Field<CR1, true>(1, 21)        

        // SMBUS alert enable
        readonly ALERTEN   = new Field<CR1, true>(1, 22)        

        // PEC enable
        readonly PECEN     = new Field<CR1, true>(1, 23)        
    }

    // Control register 2
    static readonly CR2 = new class CR2 extends Register<CR2>
    {
        constructor() { super(0x40005804) }        

        // Packet error checking byte
        readonly PECBYTE = new Field<CR2, true>(1, 26)        

        // Automatic end mode (master mode)
        readonly AUTOEND = new Field<CR2, true>(1, 25)        

        // NBYTES reload mode
        readonly RELOAD  = new Field<CR2, true>(1, 24)        

        // Number of bytes
        readonly NBYTES  = new Field<CR2, true>(8, 16)        

        // NACK generation (slave mode)
        readonly NACK    = new Field<CR2, true>(1, 15)        

        // Stop generation (master mode)
        readonly STOP    = new Field<CR2, true>(1, 14)        

        // Start generation
        readonly START   = new Field<CR2, true>(1, 13)        

        // 10-bit address header only read direction 
        // (master receiver mode)
        readonly HEAD10R = new Field<CR2, true>(1, 12)        

        // 10-bit addressing mode (master mode)
        readonly ADD10   = new Field<CR2, true>(1, 11)        

        // Transfer direction (master mode)
        readonly RD_WRN  = new Field<CR2, true>(1, 10)        

        // Slave address bit (master mode)
        readonly SADD    = new Field<CR2, true>(10, 0)        
    }

    // Own address register 1
    static readonly OAR1 = new class OAR1 extends Register<OAR1>
    {
        constructor() { super(0x40005808) }        

        // Interface address
        readonly OA1_0   = new Field<OAR1, true>(1, 0)        

        // Interface address
        readonly OA1_7_1 = new Field<OAR1, true>(7, 1)        

        // Interface address
        readonly OA1_8_9 = new Field<OAR1, true>(2, 8)        

        // Own Address 1 10-bit mode
        readonly OA1MODE = new Field<OAR1, true>(1, 10)        

        // Own Address 1 enable
        readonly OA1EN   = new Field<OAR1, true>(1, 15)        
    }

    // Own address register 2
    static readonly OAR2 = new class OAR2 extends Register<OAR2>
    {
        constructor() { super(0x4000580c) }        

        // Interface address
        readonly OA2    = new Field<OAR2, true>(7, 1)        

        // Own Address 2 masks
        readonly OA2MSK = new Field<OAR2, true>(3, 8)        

        // Own Address 2 enable
        readonly OA2EN  = new Field<OAR2, true>(1, 15)        
    }

    // Timing register
    static readonly TIMINGR = new class TIMINGR extends Register<TIMINGR>
    {
        constructor() { super(0x40005810) }        

        // SCL low period (master mode)
        readonly SCLL   = new Field<TIMINGR, true>(8, 0)        

        // SCL high period (master mode)
        readonly SCLH   = new Field<TIMINGR, true>(8, 8)        

        // Data hold time
        readonly SDADEL = new Field<TIMINGR, true>(4, 16)        

        // Data setup time
        readonly SCLDEL = new Field<TIMINGR, true>(4, 20)        

        // Timing prescaler
        readonly PRESC  = new Field<TIMINGR, true>(4, 28)        
    }

    // Status register 1
    static readonly TIMEOUTR = new class TIMEOUTR extends Register<TIMEOUTR>
    {
        constructor() { super(0x40005814) }        

        // Bus timeout A
        readonly TIMEOUTA = new Field<TIMEOUTR, true>(12, 0)        

        // Idle clock timeout detection
        readonly TIDLE    = new Field<TIMEOUTR, true>(1, 12)        

        // Clock timeout enable
        readonly TIMOUTEN = new Field<TIMEOUTR, true>(1, 15)        

        // Bus timeout B
        readonly TIMEOUTB = new Field<TIMEOUTR, true>(12, 16)        

        // Extended clock timeout enable
        readonly TEXTEN   = new Field<TIMEOUTR, true>(1, 31)        
    }

    // Interrupt and Status register
    static readonly ISR = new class ISR extends Register<ISR>
    {
        constructor() { super(0x40005818) }        

        // Address match code (Slave mode)
        readonly ADDCODE = new Field<ISR, false>(7, 17)        

        // Transfer direction (Slave mode)
        readonly DIR     = new Field<ISR, false>(1, 16)        

        // Bus busy
        readonly BUSY    = new Field<ISR, false>(1, 15)        

        // SMBus alert
        readonly ALERT   = new Field<ISR, false>(1, 13)        

        // Timeout or t_low detection flag
        readonly TIMEOUT = new Field<ISR, false>(1, 12)        

        // PEC Error in reception
        readonly PECERR  = new Field<ISR, false>(1, 11)        

        // Overrun/Underrun (slave mode)
        readonly OVR     = new Field<ISR, false>(1, 10)        

        // Arbitration lost
        readonly ARLO    = new Field<ISR, false>(1, 9)        

        // Bus error
        readonly BERR    = new Field<ISR, false>(1, 8)        

        // Transfer Complete Reload
        readonly TCR     = new Field<ISR, false>(1, 7)        

        // Transfer Complete (master mode)
        readonly TC      = new Field<ISR, false>(1, 6)        

        // Stop detection flag
        readonly STOPF   = new Field<ISR, false>(1, 5)        

        // Not acknowledge received flag
        readonly NACKF   = new Field<ISR, false>(1, 4)        

        // Address matched (slave mode)
        readonly ADDR    = new Field<ISR, false>(1, 3)        

        // Receive data register not empty (receivers)
        readonly RXNE    = new Field<ISR, false>(1, 2)        

        // Transmit interrupt status (transmitters)
        readonly TXIS    = new Field<ISR, true>(1, 1)        

        // Transmit data register empty (transmitters)
        readonly TXE     = new Field<ISR, true>(1, 0)        
    }

    // Interrupt clear register
    static readonly ICR = new class ICR extends Register<ICR>
    {
        constructor() { super(0x4000581c) }        

        // Alert flag clear
        readonly ALERTCF  = new Field<ICR, true>(1, 13)        

        // Timeout detection flag clear
        readonly TIMOUTCF = new Field<ICR, true>(1, 12)        

        // PEC Error flag clear
        readonly PECCF    = new Field<ICR, true>(1, 11)        

        // Overrun/Underrun flag clear
        readonly OVRCF    = new Field<ICR, true>(1, 10)        

        // Arbitration lost flag clear
        readonly ARLOCF   = new Field<ICR, true>(1, 9)        

        // Bus error flag clear
        readonly BERRCF   = new Field<ICR, true>(1, 8)        

        // Stop detection flag clear
        readonly STOPCF   = new Field<ICR, true>(1, 5)        

        // Not Acknowledge flag clear
        readonly NACKCF   = new Field<ICR, true>(1, 4)        

        // Address Matched flag clear
        readonly ADDRCF   = new Field<ICR, true>(1, 3)        
    }

    // PEC register
    static readonly PECR = new class PECR extends Register<PECR>
    {
        constructor() { super(0x40005820) }        

        // Packet error checking register
        readonly PEC = new Field<PECR, false>(8, 0)        
    }

    // Receive data register
    static readonly RXDR = new class RXDR extends Register<RXDR>
    {
        constructor() { super(0x40005824) }        

        // 8-bit receive data
        readonly RXDATA = new Field<RXDR, false>(8, 0)        
    }

    // Transmit data register
    static readonly TXDR = new class TXDR extends Register<TXDR>
    {
        constructor() { super(0x40005828) }        

        // 8-bit transmit data
        readonly TXDATA = new Field<TXDR, true>(8, 0)        
    }
}

export class RTC
{
    // RTC time register
    static readonly RTC_TR = new class RTC_TR extends Register<RTC_TR>
    {
        constructor() { super(0x40002800) }        

        // Second units in BCD format
        readonly SU  = new Field<RTC_TR, true>(4, 0)        

        // Second tens in BCD format
        readonly ST  = new Field<RTC_TR, true>(3, 4)        

        // Minute units in BCD format
        readonly MNU = new Field<RTC_TR, true>(4, 8)        

        // Minute tens in BCD format
        readonly MNT = new Field<RTC_TR, true>(3, 12)        

        // Hour units in BCD format
        readonly HU  = new Field<RTC_TR, true>(4, 16)        

        // Hour tens in BCD format
        readonly HT  = new Field<RTC_TR, true>(2, 20)        

        // AM/PM notation
        readonly PM  = new Field<RTC_TR, true>(1, 22)        
    }

    // RTC date register
    static readonly RTC_DR = new class RTC_DR extends Register<RTC_DR>
    {
        constructor() { super(0x40002804) }        

        // Date units in BCD format
        readonly DU  = new Field<RTC_DR, true>(4, 0)        

        // Date tens in BCD format
        readonly DT  = new Field<RTC_DR, true>(2, 4)        

        // Month units in BCD format
        readonly MU  = new Field<RTC_DR, true>(4, 8)        

        // Month tens in BCD format
        readonly MT  = new Field<RTC_DR, true>(1, 12)        

        // Week day units ...
        readonly WDU = new Field<RTC_DR, true>(3, 13)        

        // Year units in BCD format
        readonly YU  = new Field<RTC_DR, true>(4, 16)        

        // Year tens in BCD format
        readonly YT  = new Field<RTC_DR, true>(4, 20)        
    }

    // RTC sub second register
    static readonly RTC_SSR = new class RTC_SSR extends Register<RTC_SSR>
    {
        constructor() { super(0x40002808) }        

        // Sub second value SS[15:0] is the value in the 
        // synchronous prescaler counter. The fraction of 
        // a second is given by the formula below: Second 
        // fraction = (PREDIV_S - SS) / (PREDIV_S + 1) 
        // Note: SS can be larger than PREDIV_S only 
        // after a shift operation. In that case, the 
        // correct time/date is one second less than as 
        // indicated by RTC_TR/RTC_DR.
        readonly SS = new Field<RTC_SSR, false>(16, 0)        
    }

    // RTC initialization control and status 
    // register
    static readonly RTC_ICSR = new class RTC_ICSR extends Register<RTC_ICSR>
    {
        constructor() { super(0x4000280c) }        

        // Alarm A write flag This bit is set by 
        // hardware when alarm A values can be 
        // changed, after the ALRAE bit has been set 
        // to 0 in RTC_CR. It is cleared by hardware 
        // in initialization mode.
        readonly ALRAWF  = new Field<RTC_ICSR, false>(1, 0)        

        // Alarm B write flag This bit is set by 
        // hardware when alarm B values can be 
        // changed, after the ALRBE bit has been set 
        // to 0 in RTC_CR. It is cleared by hardware 
        // in initialization mode.
        readonly ALRBWF  = new Field<RTC_ICSR, false>(1, 1)        

        // Wakeup timer write flag This bit is set 
        // by hardware when WUT value can be 
        // changed, after the WUTE bit has been set 
        // to 0 in RTC_CR. It is cleared by hardware 
        // in initialization mode.
        readonly WUTWF   = new Field<RTC_ICSR, false>(1, 2)        

        // Shift operation pending This flag is set 
        // by hardware as soon as a shift operation 
        // is initiated by a write to the RTC_SHIFTR 
        // register. It is cleared by hardware when 
        // the corresponding shift operation has 
        // been executed. Writing to the SHPF bit 
        // has no effect.
        readonly SHPF    = new Field<RTC_ICSR, false>(1, 3)        

        // Initialization status flag This bit is 
        // set by hardware when the calendar year 
        // field is different from 0 (Backup domain 
        // reset state).
        readonly INITS   = new Field<RTC_ICSR, false>(1, 4)        

        // Registers synchronization flag This bit is 
        // set by hardware each time the calendar 
        // registers are copied into the shadow 
        // registers (RTC_SSR, RTC_TR and RTC_DR). 
        // This bit is cleared by hardware in 
        // initialization mode, while a shift 
        // operation is pending (SHPF = 1), or when 
        // in bypass shadow register mode (BYPSHAD = 
        // 1). This bit can also be cleared by 
        // software. It is cleared either by software 
        // or by hardware in initialization mode.
        readonly RSF     = new Field<RTC_ICSR, true>(1, 5)        

        // Initialization flag When this bit is set 
        // to 1, the RTC is in initialization state, 
        // and the time, date and prescaler 
        // registers can be updated.
        readonly INITF   = new Field<RTC_ICSR, false>(1, 6)        

        // Initialization mode
        readonly INIT    = new Field<RTC_ICSR, true>(1, 7)        

        // Recalibration pending Flag The RECALPF 
        // status flag is automatically set to 1 
        // when software writes to the RTC_CALR 
        // register, indicating that the RTC_CALR 
        // register is blocked. When the new 
        // calibration settings are taken into 
        // account, this bit returns to 0. Refer to 
        // .
        readonly RECALPF = new Field<RTC_ICSR, false>(1, 16)        
    }

    // RTC prescaler register
    static readonly RTC_PRER = new class RTC_PRER extends Register<RTC_PRER>
    {
        constructor() { super(0x40002810) }        

        // Synchronous prescaler factor This is the 
        // synchronous division factor: ck_spre 
        // frequency = ck_apre 
        // frequency/(PREDIV_S+1)
        readonly PREDIV_S = new Field<RTC_PRER, true>(15, 0)        

        // Asynchronous prescaler factor This is 
        // the asynchronous division factor: 
        // ck_apre frequency = RTCCLK 
        // frequency/(PREDIV_A+1)
        readonly PREDIV_A = new Field<RTC_PRER, true>(7, 16)        
    }

    // RTC wakeup timer register
    static readonly RTC_WUTR = new class RTC_WUTR extends Register<RTC_WUTR>
    {
        constructor() { super(0x40002814) }        

        // Wakeup auto-reload value bits When the wakeup 
        // timer is enabled (WUTE set to 1), the WUTF 
        // flag is set every (WUT[15:0]+1) ck_wut 
        // cycles. The ck_wut period is selected through 
        // WUCKSEL[2:0] bits of the RTC_CR register. 
        // When WUCKSEL[2] = 1, the wakeup timer becomes 
        // 17-bits and WUCKSEL[1] effectively becomes 
        // WUT[16] the most-significant bit to be 
        // reloaded into the timer. The first assertion 
        // of WUTF occurs between WUT and (WUT + 1) 
        // ck_wut cycles after WUTE is set. Setting 
        // WUT[15:0] to 0x0000 with WUCKSEL[2:0] = 011 
        // (RTCCLK/2) is forbidden.
        readonly WUT = new Field<RTC_WUTR, true>(16, 0)        
    }

    // control register
    static readonly RTC_CR = new class RTC_CR extends Register<RTC_CR>
    {
        constructor() { super(0x40002818) }        

        // ck_wut wakeup clock selection 10x: 
        // ck_spre (usually 1Hz) clock is selected 
        // 11x: ck_spre (usually 1Hz) clock is 
        // selected and 216is added to the WUT 
        // counter value
        readonly WUCKSEL       = new Field<RTC_CR, true>(3, 0)        

        // Timestamp event active edge TSE must be 
        // reset when TSEDGE is changed to avoid 
        // unwanted TSF setting.
        readonly TSEDGE        = new Field<RTC_CR, true>(1, 3)        

        // RTC_REFIN reference clock detection 
        // enable (50 or 60Hz) Note: PREDIV_S must 
        // be 0x00FF.
        readonly REFCKON       = new Field<RTC_CR, true>(1, 4)        

        // Bypass the shadow registers Note: If the 
        // frequency of the APB1 clock is less than 
        // seven times the frequency of RTCCLK, 
        // BYPSHAD must be set to 1.
        readonly BYPSHAD       = new Field<RTC_CR, true>(1, 5)        

        // Hour format
        readonly FMT           = new Field<RTC_CR, true>(1, 6)        

        // Alarm A enable
        readonly ALRAE         = new Field<RTC_CR, true>(1, 8)        

        // Alarm B enable
        readonly ALRBE         = new Field<RTC_CR, true>(1, 9)        

        // Wakeup timer enable Note: When the 
        // wakeup timer is disabled, wait for 
        // WUTWF=1 before enabling it again.
        readonly WUTE          = new Field<RTC_CR, true>(1, 10)        

        // timestamp enable
        readonly TSE           = new Field<RTC_CR, true>(1, 11)        

        // Alarm A interrupt enable
        readonly ALRAIE        = new Field<RTC_CR, true>(1, 12)        

        // Alarm B interrupt enable
        readonly ALRBIE        = new Field<RTC_CR, true>(1, 13)        

        // Wakeup timer interrupt enable
        readonly WUTIE         = new Field<RTC_CR, true>(1, 14)        

        // Timestamp interrupt enable
        readonly TSIE          = new Field<RTC_CR, true>(1, 15)        

        // Add 1 hour (summer time change) When 
        // this bit is set outside initialization 
        // mode, 1 hour is added to the calendar 
        // time. This bit is always read as 0.
        readonly ADD1H         = new Field<RTC_CR, true>(1, 16)        

        // Subtract 1 hour (winter time change) 
        // When this bit is set outside 
        // initialization mode, 1 hour is 
        // subtracted to the calendar time if the 
        // current hour is not 0. This bit is 
        // always read as 0. Setting this bit has 
        // no effect when current hour is 0.
        readonly SUB1H         = new Field<RTC_CR, true>(1, 17)        

        // Backup This bit can be written by the 
        // user to memorize whether the daylight 
        // saving time change has been performed or 
        // not.
        readonly BKP           = new Field<RTC_CR, true>(1, 18)        

        // Calibration output selection When COE = 
        // 1, this bit selects which signal is 
        // output on CALIB. These frequencies are 
        // valid for RTCCLK at 32.768kHz and 
        // prescalers at their default values 
        // (PREDIV_A = 127 and PREDIV_S = 255). 
        // Refer to .
        readonly COSEL         = new Field<RTC_CR, true>(1, 19)        

        // Output polarity This bit is used to 
        // configure the polarity of TAMPALRM 
        // output.
        readonly POL           = new Field<RTC_CR, true>(1, 20)        

        // Output selection These bits are used to 
        // select the flag to be routed to TAMPALRM 
        // output.
        readonly OSEL          = new Field<RTC_CR, true>(2, 21)        

        // Calibration output enable This bit 
        // enables the CALIB output
        readonly COE           = new Field<RTC_CR, true>(1, 23)        

        // timestamp on internal event enable
        readonly ITSE          = new Field<RTC_CR, true>(1, 24)        

        // Activate timestamp on tamper detection 
        // event TAMPTS is valid even if TSE = 0 in 
        // the RTC_CR register. Timestamp flag is 
        // set after the tamper flags, therefore if 
        // TAMPTS and TSIE are set, it is 
        // recommended to disable the tamper 
        // interrupts in order to avoid servicing 2 
        // interrupts.
        readonly TAMPTS        = new Field<RTC_CR, true>(1, 25)        

        // Tamper detection output enable on 
        // TAMPALRM
        readonly TAMPOE        = new Field<RTC_CR, true>(1, 26)        

        // TAMPALRM pull-up enable
        readonly TAMPALRM_PU   = new Field<RTC_CR, true>(1, 29)        

        // TAMPALRM output type
        readonly TAMPALRM_TYPE = new Field<RTC_CR, true>(1, 30)        

        // RTC_OUT2 output enable
        readonly OUT2EN        = new Field<RTC_CR, true>(1, 31)        
    }

    // write protection register
    static readonly RTC_WPR = new class RTC_WPR extends Register<RTC_WPR>
    {
        constructor() { super(0x40002824) }        

        // Write protection key This byte is written by 
        // software. Reading this byte always returns 
        // 0x00. Refer to  for a description of how to 
        // unlock RTC register write protection.
        readonly KEY = new Field<RTC_WPR, true>(8, 0)        
    }

    // RTC calibration register
    static readonly RTC_CALR = new class RTC_CALR extends Register<RTC_CALR>
    {
        constructor() { super(0x40002828) }        

        // Calibration minus The frequency of the 
        // calendar is reduced by masking CALM out of 
        // 220 RTCCLK pulses (32 seconds if the input 
        // frequency is 32768Hz). This decreases the 
        // frequency of the calendar with a resolution 
        // of 0.9537ppm. To increase the frequency of 
        // the calendar, this feature should be used 
        // in conjunction with CALP. See .
        readonly CALM   = new Field<RTC_CALR, true>(9, 0)        

        // Use a 16-second calibration cycle period 
        // When CALW16 is set to 1, the 16-second 
        // calibration cycle period is selected. This 
        // bit must not be set to 1 if CALW8 = 1. 
        // Note: CALM[0] is stuck at 0 when CALW16 = 
        // 1. Refer to calibration.
        readonly CALW16 = new Field<RTC_CALR, true>(1, 13)        

        // Use an 8-second calibration cycle period 
        // When CALW8 is set to 1, the 8-second 
        // calibration cycle period is selected. 
        // Note: CALM[1:0] are stuck at 00 when CALW8 
        // = 1. Refer to digital calibration.
        readonly CALW8  = new Field<RTC_CALR, true>(1, 14)        

        // Increase frequency of RTC by 488.5ppm This 
        // feature is intended to be used in 
        // conjunction with CALM, which lowers the 
        // frequency of the calendar with a fine 
        // resolution. if the input frequency is 
        // 32768Hz, the number of RTCCLK pulses added 
        // during a 32-second window is calculated as 
        // follows: (512 * CALP) - CALM. Refer to .
        readonly CALP   = new Field<RTC_CALR, true>(1, 15)        
    }

    // RTC shift control register
    static readonly RTC_SHIFTR = new class RTC_SHIFTR extends Register<RTC_SHIFTR>
    {
        constructor() { super(0x4000282c) }        

        // Subtract a fraction of a second These 
        // bits are write only and is always read as 
        // zero. Writing to this bit has no effect 
        // when a shift operation is pending (when 
        // SHPF = 1, in RTC_ICSR). The value which 
        // is written to SUBFS is added to the 
        // synchronous prescaler counter. Since this 
        // counter counts down, this operation 
        // effectively subtracts from (delays) the 
        // clock by: Delay (seconds) = SUBFS / 
        // (PREDIV_S + 1) A fraction of a second can 
        // effectively be added to the clock 
        // (advancing the clock) when the ADD1S 
        // function is used in conjunction with 
        // SUBFS, effectively advancing the clock 
        // by: Advance (seconds) = (1 - (SUBFS / 
        // (PREDIV_S + 1))). Note: Writing to SUBFS 
        // causes RSF to be cleared. Software can 
        // then wait until RSF = 1 to be sure that 
        // the shadow registers have been updated 
        // with the shifted time.
        readonly SUBFS = new Field<RTC_SHIFTR, true>(15, 0)        

        // Add one second This bit is write only and 
        // is always read as zero. Writing to this 
        // bit has no effect when a shift operation 
        // is pending (when SHPF = 1, in RTC_ICSR). 
        // This function is intended to be used with 
        // SUBFS (see description below) in order to 
        // effectively add a fraction of a second to 
        // the clock in an atomic operation.
        readonly ADD1S = new Field<RTC_SHIFTR, true>(1, 31)        
    }

    // RTC timestamp time register
    static readonly RTC_TSTR = new class RTC_TSTR extends Register<RTC_TSTR>
    {
        constructor() { super(0x40002830) }        

        // Second units in BCD format.
        readonly SU  = new Field<RTC_TSTR, false>(4, 0)        

        // Second tens in BCD format.
        readonly ST  = new Field<RTC_TSTR, false>(3, 4)        

        // Minute units in BCD format.
        readonly MNU = new Field<RTC_TSTR, false>(4, 8)        

        // Minute tens in BCD format.
        readonly MNT = new Field<RTC_TSTR, false>(3, 12)        

        // Hour units in BCD format.
        readonly HU  = new Field<RTC_TSTR, false>(4, 16)        

        // Hour tens in BCD format.
        readonly HT  = new Field<RTC_TSTR, false>(2, 20)        

        // AM/PM notation
        readonly PM  = new Field<RTC_TSTR, false>(1, 22)        
    }

    // RTC timestamp date register
    static readonly RTC_TSDR = new class RTC_TSDR extends Register<RTC_TSDR>
    {
        constructor() { super(0x40002834) }        

        // Date units in BCD format
        readonly DU  = new Field<RTC_TSDR, false>(4, 0)        

        // Date tens in BCD format
        readonly DT  = new Field<RTC_TSDR, false>(2, 4)        

        // Month units in BCD format
        readonly MU  = new Field<RTC_TSDR, false>(4, 8)        

        // Month tens in BCD format
        readonly MT  = new Field<RTC_TSDR, false>(1, 12)        

        // Week day units
        readonly WDU = new Field<RTC_TSDR, false>(3, 13)        
    }

    // RTC timestamp sub second register
    static readonly RTC_TSSSR = new class RTC_TSSSR extends Register<RTC_TSSSR>
    {
        constructor() { super(0x40002838) }        

        // Sub second value SS[15:0] is the value of 
        // the synchronous prescaler counter when the 
        // timestamp event occurred.
        readonly SS = new Field<RTC_TSSSR, false>(16, 0)        
    }

    // RTC alarm A register
    static readonly RTC_ALRMAR = new class RTC_ALRMAR extends Register<RTC_ALRMAR>
    {
        constructor() { super(0x40002840) }        

        // Second units in BCD format.
        readonly SU    = new Field<RTC_ALRMAR, true>(4, 0)        

        // Second tens in BCD format.
        readonly ST    = new Field<RTC_ALRMAR, true>(3, 4)        

        // Alarm A seconds mask
        readonly MSK1  = new Field<RTC_ALRMAR, true>(1, 7)        

        // Minute units in BCD format
        readonly MNU   = new Field<RTC_ALRMAR, true>(4, 8)        

        // Minute tens in BCD format
        readonly MNT   = new Field<RTC_ALRMAR, true>(3, 12)        

        // Alarm A minutes mask
        readonly MSK2  = new Field<RTC_ALRMAR, true>(1, 15)        

        // Hour units in BCD format
        readonly HU    = new Field<RTC_ALRMAR, true>(4, 16)        

        // Hour tens in BCD format
        readonly HT    = new Field<RTC_ALRMAR, true>(2, 20)        

        // AM/PM notation
        readonly PM    = new Field<RTC_ALRMAR, true>(1, 22)        

        // Alarm A hours mask
        readonly MSK3  = new Field<RTC_ALRMAR, true>(1, 23)        

        // Date units or day in BCD format
        readonly DU    = new Field<RTC_ALRMAR, true>(4, 24)        

        // Date tens in BCD format
        readonly DT    = new Field<RTC_ALRMAR, true>(2, 28)        

        // Week day selection
        readonly WDSEL = new Field<RTC_ALRMAR, true>(1, 30)        

        // Alarm A date mask
        readonly MSK4  = new Field<RTC_ALRMAR, true>(1, 31)        
    }

    // RTC alarm A sub second register
    static readonly RTC_ALRMASSR = new class RTC_ALRMASSR extends Register<RTC_ALRMASSR>
    {
        constructor() { super(0x40002844) }        

        // Sub seconds value This value is compared 
        // with the contents of the synchronous 
        // prescaler counter to determine if alarm 
        // A is to be activated. Only bits 0 up 
        // MASKSS-1 are compared.
        readonly SS     = new Field<RTC_ALRMASSR, true>(15, 0)        

        // Mask the most-significant bits starting 
        // at this bit 2:	SS[14:2] are don't care 
        // in alarm A comparison. Only SS[1:0] are 
        // compared. 3:	SS[14:3] are don't care in 
        // alarm A comparison. Only SS[2:0] are 
        // compared. ... 12:	SS[14:12] are don't 
        // care in alarm A comparison. SS[11:0] are 
        // compared. 13:	SS[14:13] are don't care 
        // in alarm A comparison. SS[12:0] are 
        // compared. 14:	SS[14] is don't care in 
        // alarm A comparison. SS[13:0] are 
        // compared. 15:	All 15 SS bits are 
        // compared and must match to activate 
        // alarm. The overflow bits of the 
        // synchronous counter (bits 15) is never 
        // compared. This bit can be different from 
        // 0 only after a shift operation. Note: 
        // The overflow bits of the synchronous 
        // counter (bits 15) is never compared. 
        // This bit can be different from 0 only 
        // after a shift operation.
        readonly MASKSS = new Field<RTC_ALRMASSR, true>(4, 24)        
    }

    // RTC alarm B register
    static readonly RTC_ALRMBR = new class RTC_ALRMBR extends Register<RTC_ALRMBR>
    {
        constructor() { super(0x40002848) }        

        // Second units in BCD format
        readonly SU    = new Field<RTC_ALRMBR, true>(4, 0)        

        // Second tens in BCD format
        readonly ST    = new Field<RTC_ALRMBR, true>(3, 4)        

        // Alarm B seconds mask
        readonly MSK1  = new Field<RTC_ALRMBR, true>(1, 7)        

        // Minute units in BCD format
        readonly MNU   = new Field<RTC_ALRMBR, true>(4, 8)        

        // Minute tens in BCD format
        readonly MNT   = new Field<RTC_ALRMBR, true>(3, 12)        

        // Alarm B minutes mask
        readonly MSK2  = new Field<RTC_ALRMBR, true>(1, 15)        

        // Hour units in BCD format
        readonly HU    = new Field<RTC_ALRMBR, true>(4, 16)        

        // Hour tens in BCD format
        readonly HT    = new Field<RTC_ALRMBR, true>(2, 20)        

        // AM/PM notation
        readonly PM    = new Field<RTC_ALRMBR, true>(1, 22)        

        // Alarm B hours mask
        readonly MSK3  = new Field<RTC_ALRMBR, true>(1, 23)        

        // Date units or day in BCD format
        readonly DU    = new Field<RTC_ALRMBR, true>(4, 24)        

        // Date tens in BCD format
        readonly DT    = new Field<RTC_ALRMBR, true>(2, 28)        

        // Week day selection
        readonly WDSEL = new Field<RTC_ALRMBR, true>(1, 30)        

        // Alarm B date mask
        readonly MSK4  = new Field<RTC_ALRMBR, true>(1, 31)        
    }

    // RTC alarm B sub second register
    static readonly RTC_ALRMBSSR = new class RTC_ALRMBSSR extends Register<RTC_ALRMBSSR>
    {
        constructor() { super(0x4000284c) }        

        // Sub seconds value This value is compared 
        // with the contents of the synchronous 
        // prescaler counter to determine if alarm 
        // B is to be activated. Only bits 0 up to 
        // MASKSS-1 are compared.
        readonly SS     = new Field<RTC_ALRMBSSR, true>(15, 0)        

        // Mask the most-significant bits starting 
        // at this bit ... The overflow bits of the 
        // synchronous counter (bits 15) is never 
        // compared. This bit can be different from 
        // 0 only after a shift operation.
        readonly MASKSS = new Field<RTC_ALRMBSSR, true>(4, 24)        
    }

    // RTC status register
    static readonly RTC_SR = new class RTC_SR extends Register<RTC_SR>
    {
        constructor() { super(0x40002850) }        

        // Alarm A flag This flag is set by hardware 
        // when the time/date registers (RTC_TR and 
        // RTC_DR) match the alarm A register 
        // (RTC_ALRMAR).
        readonly ALRAF = new Field<RTC_SR, false>(1, 0)        

        // Alarm B flag This flag is set by hardware 
        // when the time/date registers (RTC_TR and 
        // RTC_DR) match the alarm B register 
        // (RTC_ALRMBR).
        readonly ALRBF = new Field<RTC_SR, false>(1, 1)        

        // Wakeup timer flag This flag is set by 
        // hardware when the wakeup auto-reload counter 
        // reaches 0. This flag must be cleared by 
        // software at least 1.5 RTCCLK periods before 
        // WUTF is set to 1 again.
        readonly WUTF  = new Field<RTC_SR, false>(1, 2)        

        // Timestamp flag This flag is set by hardware 
        // when a timestamp event occurs. If ITSF flag 
        // is set, TSF must be cleared together with 
        // ITSF.
        readonly TSF   = new Field<RTC_SR, false>(1, 3)        

        // Timestamp overflow flag This flag is set by 
        // hardware when a timestamp event occurs while 
        // TSF is already set. It is recommended to 
        // check and then clear TSOVF only after 
        // clearing the TSF bit. Otherwise, an overflow 
        // might not be noticed if a timestamp event 
        // occurs immediately before the TSF bit is 
        // cleared.
        readonly TSOVF = new Field<RTC_SR, false>(1, 4)        

        // Internal timestamp flag This flag is set by 
        // hardware when a timestamp on the internal 
        // event occurs.
        readonly ITSF  = new Field<RTC_SR, false>(1, 5)        
    }

    // RTC masked interrupt status register
    static readonly RTC_MISR = new class RTC_MISR extends Register<RTC_MISR>
    {
        constructor() { super(0x40002854) }        

        // Alarm A masked flag This flag is set by 
        // hardware when the alarm A interrupt 
        // occurs.
        readonly ALRAMF = new Field<RTC_MISR, false>(1, 0)        

        // Alarm B masked flag This flag is set by 
        // hardware when the alarm B interrupt 
        // occurs.
        readonly ALRBMF = new Field<RTC_MISR, false>(1, 1)        

        // Wakeup timer masked flag This flag is set 
        // by hardware when the wakeup timer 
        // interrupt occurs. This flag must be 
        // cleared by software at least 1.5 RTCCLK 
        // periods before WUTF is set to 1 again.
        readonly WUTMF  = new Field<RTC_MISR, false>(1, 2)        

        // Timestamp masked flag This flag is set by 
        // hardware when a timestamp interrupt 
        // occurs. If ITSF flag is set, TSF must be 
        // cleared together with ITSF.
        readonly TSMF   = new Field<RTC_MISR, false>(1, 3)        

        // Timestamp overflow masked flag This flag 
        // is set by hardware when a timestamp 
        // interrupt occurs while TSMF is already 
        // set. It is recommended to check and then 
        // clear TSOVF only after clearing the TSF 
        // bit. Otherwise, an overflow might not be 
        // noticed if a timestamp event occurs 
        // immediately before the TSF bit is cleared.
        readonly TSOVMF = new Field<RTC_MISR, false>(1, 4)        

        // Internal timestamp masked flag This flag 
        // is set by hardware when a timestamp on the 
        // internal event occurs and 
        // timestampinterrupt is raised.
        readonly ITSMF  = new Field<RTC_MISR, false>(1, 5)        
    }

    // RTC status clear register
    static readonly RTC_SCR = new class RTC_SCR extends Register<RTC_SCR>
    {
        constructor() { super(0x4000285c) }        

        // Clear alarm A flag Writing 1 in this bit 
        // clears the ALRAF bit in the RTC_SR register.
        readonly CALRAF = new Field<RTC_SCR, true>(1, 0)        

        // Clear alarm B flag Writing 1 in this bit 
        // clears the ALRBF bit in the RTC_SR register.
        readonly CALRBF = new Field<RTC_SCR, true>(1, 1)        

        // Clear wakeup timer flag Writing 1 in this 
        // bit clears the WUTF bit in the RTC_SR 
        // register.
        readonly CWUTF  = new Field<RTC_SCR, true>(1, 2)        

        // Clear timestamp flag Writing 1 in this bit 
        // clears the TSOVF bit in the RTC_SR register. 
        // If ITSF flag is set, TSF must be cleared 
        // together with ITSF by setting CRSF and 
        // CITSF.
        readonly CTSF   = new Field<RTC_SCR, true>(1, 3)        

        // Clear timestamp overflow flag Writing 1 in 
        // this bit clears the TSOVF bit in the RTC_SR 
        // register. It is recommended to check and 
        // then clear TSOVF only after clearing the TSF 
        // bit. Otherwise, an overflow might not be 
        // noticed if a timestamp event occurs 
        // immediately before the TSF bit is cleared.
        readonly CTSOVF = new Field<RTC_SCR, true>(1, 4)        

        // Clear internal timestamp flag Writing 1 in 
        // this bit clears the ITSF bit in the RTC_SR 
        // register.
        readonly CITSF  = new Field<RTC_SCR, true>(1, 5)        
    }
}

export class TIM14
{
    // control register 1
    static readonly CR1 = new class CR1 extends Register<CR1>
    {
        constructor() { super(0x40002000) }        

        // UIF status bit remapping
        readonly UIFREMAP = new Field<CR1, true>(1, 11)        

        // Clock division
        readonly CKD      = new Field<CR1, true>(2, 8)        

        // Auto-reload preload enable
        readonly ARPE     = new Field<CR1, true>(1, 7)        

        // One-pulse mode
        readonly OPM      = new Field<CR1, true>(1, 3)        

        // Update request source
        readonly URS      = new Field<CR1, true>(1, 2)        

        // Update disable
        readonly UDIS     = new Field<CR1, true>(1, 1)        

        // Counter enable
        readonly CEN      = new Field<CR1, true>(1, 0)        
    }

    // DMA/Interrupt enable register
    static readonly DIER = new class DIER extends Register<DIER>
    {
        constructor() { super(0x4000200c) }        

        // Capture/Compare 1 interrupt enable
        readonly CC1IE = new Field<DIER, true>(1, 1)        

        // Update interrupt enable
        readonly UIE   = new Field<DIER, true>(1, 0)        
    }

    // status register
    static readonly SR = new class SR extends Register<SR>
    {
        constructor() { super(0x40002010) }        

        // Capture/Compare 1 overcapture flag
        readonly CC1OF = new Field<SR, true>(1, 9)        

        // Capture/compare 1 interrupt flag
        readonly CC1IF = new Field<SR, true>(1, 1)        

        // Update interrupt flag
        readonly UIF   = new Field<SR, true>(1, 0)        
    }

    // event generation register
    static readonly EGR = new class EGR extends Register<EGR>
    {
        constructor() { super(0x40002014) }        

        // Capture/compare 1 generation
        readonly CC1G = new Field<EGR, true>(1, 1)        

        // Update generation
        readonly UG   = new Field<EGR, true>(1, 0)        
    }

    // capture/compare mode register 1 (output 
    // mode)
    static readonly CCMR1_Output = new class CCMR1_Output extends Register<CCMR1_Output>
    {
        constructor() { super(0x40002018) }        

        // CC1S
        readonly CC1S   = new Field<CCMR1_Output, true>(2, 0)        

        // OC1FE
        readonly OC1FE  = new Field<CCMR1_Output, true>(1, 2)        

        // OC1PE
        readonly OC1PE  = new Field<CCMR1_Output, true>(1, 3)        

        // OC1M
        readonly OC1M   = new Field<CCMR1_Output, true>(3, 4)        

        // OC1CE
        readonly OC1CE  = new Field<CCMR1_Output, true>(1, 7)        

        // Output Compare 1 mode - bit 3
        readonly OC1M_3 = new Field<CCMR1_Output, true>(1, 16)        
    }

    // capture/compare mode register 1 (input 
    // mode)
    static readonly CCMR1_Input = new class CCMR1_Input extends Register<CCMR1_Input>
    {
        constructor() { super(0x40002018) }        

        // Input capture 1 filter
        readonly IC1F  = new Field<CCMR1_Input, true>(4, 4)        

        // Input capture 1 prescaler
        readonly ICPCS = new Field<CCMR1_Input, true>(2, 2)        

        // Capture/Compare 1 selection
        readonly CC1S  = new Field<CCMR1_Input, true>(2, 0)        
    }

    // capture/compare enable register
    static readonly CCER = new class CCER extends Register<CCER>
    {
        constructor() { super(0x40002020) }        

        // Capture/Compare 1 output Polarity
        readonly CC1NP = new Field<CCER, true>(1, 3)        

        // Capture/Compare 1 output Polarity
        readonly CC1P  = new Field<CCER, true>(1, 1)        

        // Capture/Compare 1 output enable
        readonly CC1E  = new Field<CCER, true>(1, 0)        
    }

    // counter
    static readonly CNT = new class CNT extends Register<CNT>
    {
        constructor() { super(0x40002024) }        

        // low counter value
        readonly CNT    = new Field<CNT, true>(16, 0)        

        // UIF Copy
        readonly UIFCPY = new Field<CNT, true>(1, 31)        
    }

    // prescaler
    static readonly PSC = new class PSC extends Register<PSC>
    {
        constructor() { super(0x40002028) }        

        // Prescaler value
        readonly PSC = new Field<PSC, true>(16, 0)        
    }

    // auto-reload register
    static readonly ARR = new class ARR extends Register<ARR>
    {
        constructor() { super(0x4000202c) }        

        // Low Auto-reload value
        readonly ARR = new Field<ARR, true>(16, 0)        
    }

    // capture/compare register 1
    static readonly CCR1 = new class CCR1 extends Register<CCR1>
    {
        constructor() { super(0x40002034) }        

        // Low Capture/Compare 1 value
        readonly CCR1 = new Field<CCR1, true>(16, 0)        
    }

    // TIM timer input selection register
    static readonly TISEL = new class TISEL extends Register<TISEL>
    {
        constructor() { super(0x40002068) }        

        // TI1[0] to TI1[15] input selection
        readonly TISEL = new Field<TISEL, true>(4, 0)        
    }
}

export class TIM2
{
    // control register 1
    static readonly CR1 = new class CR1 extends Register<CR1>
    {
        constructor() { super(0x40000000) }        

        // UIF status bit remapping
        readonly UIFREMAP = new Field<CR1, true>(1, 11)        

        // Clock division
        readonly CKD      = new Field<CR1, true>(2, 8)        

        // Auto-reload preload enable
        readonly ARPE     = new Field<CR1, true>(1, 7)        

        // Center-aligned mode selection
        readonly CMS      = new Field<CR1, true>(2, 5)        

        // Direction
        readonly DIR      = new Field<CR1, true>(1, 4)        

        // One-pulse mode
        readonly OPM      = new Field<CR1, true>(1, 3)        

        // Update request source
        readonly URS      = new Field<CR1, true>(1, 2)        

        // Update disable
        readonly UDIS     = new Field<CR1, true>(1, 1)        

        // Counter enable
        readonly CEN      = new Field<CR1, true>(1, 0)        
    }

    // control register 2
    static readonly CR2 = new class CR2 extends Register<CR2>
    {
        constructor() { super(0x40000004) }        

        // TI1 selection
        readonly TI1S = new Field<CR2, true>(1, 7)        

        // Master mode selection
        readonly MMS  = new Field<CR2, true>(3, 4)        

        // Capture/compare DMA selection
        readonly CCDS = new Field<CR2, true>(1, 3)        
    }

    // slave mode control register
    static readonly SMCR = new class SMCR extends Register<SMCR>
    {
        constructor() { super(0x40000008) }        

        // Trigger selection
        readonly TS_4_3 = new Field<SMCR, true>(2, 20)        

        // Slave mode selection - bit 3
        readonly SMS_3  = new Field<SMCR, true>(1, 16)        

        // External trigger polarity
        readonly ETP    = new Field<SMCR, true>(1, 15)        

        // External clock enable
        readonly ECE    = new Field<SMCR, true>(1, 14)        

        // External trigger prescaler
        readonly ETPS   = new Field<SMCR, true>(2, 12)        

        // External trigger filter
        readonly ETF    = new Field<SMCR, true>(4, 8)        

        // Master/Slave mode
        readonly MSM    = new Field<SMCR, true>(1, 7)        

        // Trigger selection
        readonly TS     = new Field<SMCR, true>(3, 4)        

        // OCREF clear selection
        readonly OCCS   = new Field<SMCR, true>(1, 3)        

        // Slave mode selection
        readonly SMS    = new Field<SMCR, true>(3, 0)        
    }

    // DMA/Interrupt enable register
    static readonly DIER = new class DIER extends Register<DIER>
    {
        constructor() { super(0x4000000c) }        

        // Trigger DMA request enable
        readonly TDE   = new Field<DIER, true>(1, 14)        

        // Capture/Compare 4 DMA request enable
        readonly CC4DE = new Field<DIER, true>(1, 12)        

        // Capture/Compare 3 DMA request enable
        readonly CC3DE = new Field<DIER, true>(1, 11)        

        // Capture/Compare 2 DMA request enable
        readonly CC2DE = new Field<DIER, true>(1, 10)        

        // Capture/Compare 1 DMA request enable
        readonly CC1DE = new Field<DIER, true>(1, 9)        

        // Update DMA request enable
        readonly UDE   = new Field<DIER, true>(1, 8)        

        // Trigger interrupt enable
        readonly TIE   = new Field<DIER, true>(1, 6)        

        // Capture/Compare 4 interrupt enable
        readonly CC4IE = new Field<DIER, true>(1, 4)        

        // Capture/Compare 3 interrupt enable
        readonly CC3IE = new Field<DIER, true>(1, 3)        

        // Capture/Compare 2 interrupt enable
        readonly CC2IE = new Field<DIER, true>(1, 2)        

        // Capture/Compare 1 interrupt enable
        readonly CC1IE = new Field<DIER, true>(1, 1)        

        // Update interrupt enable
        readonly UIE   = new Field<DIER, true>(1, 0)        
    }

    // status register
    static readonly SR = new class SR extends Register<SR>
    {
        constructor() { super(0x40000010) }        

        // Capture/Compare 4 overcapture flag
        readonly CC4OF = new Field<SR, true>(1, 12)        

        // Capture/Compare 3 overcapture flag
        readonly CC3OF = new Field<SR, true>(1, 11)        

        // Capture/compare 2 overcapture flag
        readonly CC2OF = new Field<SR, true>(1, 10)        

        // Capture/Compare 1 overcapture flag
        readonly CC1OF = new Field<SR, true>(1, 9)        

        // Trigger interrupt flag
        readonly TIF   = new Field<SR, true>(1, 6)        

        // Capture/Compare 4 interrupt flag
        readonly CC4IF = new Field<SR, true>(1, 4)        

        // Capture/Compare 3 interrupt flag
        readonly CC3IF = new Field<SR, true>(1, 3)        

        // Capture/Compare 2 interrupt flag
        readonly CC2IF = new Field<SR, true>(1, 2)        

        // Capture/compare 1 interrupt flag
        readonly CC1IF = new Field<SR, true>(1, 1)        

        // Update interrupt flag
        readonly UIF   = new Field<SR, true>(1, 0)        
    }

    // event generation register
    static readonly EGR = new class EGR extends Register<EGR>
    {
        constructor() { super(0x40000014) }        

        // Trigger generation
        readonly TG   = new Field<EGR, true>(1, 6)        

        // Capture/compare 4 generation
        readonly CC4G = new Field<EGR, true>(1, 4)        

        // Capture/compare 3 generation
        readonly CC3G = new Field<EGR, true>(1, 3)        

        // Capture/compare 2 generation
        readonly CC2G = new Field<EGR, true>(1, 2)        

        // Capture/compare 1 generation
        readonly CC1G = new Field<EGR, true>(1, 1)        

        // Update generation
        readonly UG   = new Field<EGR, true>(1, 0)        
    }

    // capture/compare mode register 1 (output 
    // mode)
    static readonly CCMR1_Output = new class CCMR1_Output extends Register<CCMR1_Output>
    {
        constructor() { super(0x40000018) }        

        // Output Compare 2 mode - bit 3
        readonly OC2M_3 = new Field<CCMR1_Output, true>(1, 24)        

        // Output Compare 1 mode - bit 3
        readonly OC1M_3 = new Field<CCMR1_Output, true>(1, 16)        

        // Output compare 2 clear enable
        readonly OC2CE  = new Field<CCMR1_Output, true>(1, 15)        

        // Output compare 2 mode
        readonly OC2M   = new Field<CCMR1_Output, true>(3, 12)        

        // Output compare 2 preload enable
        readonly OC2PE  = new Field<CCMR1_Output, true>(1, 11)        

        // Output compare 2 fast enable
        readonly OC2FE  = new Field<CCMR1_Output, true>(1, 10)        

        // Capture/Compare 2 selection
        readonly CC2S   = new Field<CCMR1_Output, true>(2, 8)        

        // Output compare 1 clear enable
        readonly OC1CE  = new Field<CCMR1_Output, true>(1, 7)        

        // Output compare 1 mode
        readonly OC1M   = new Field<CCMR1_Output, true>(3, 4)        

        // Output compare 1 preload enable
        readonly OC1PE  = new Field<CCMR1_Output, true>(1, 3)        

        // Output compare 1 fast enable
        readonly OC1FE  = new Field<CCMR1_Output, true>(1, 2)        

        // Capture/Compare 1 selection
        readonly CC1S   = new Field<CCMR1_Output, true>(2, 0)        
    }

    // capture/compare mode register 1 (input 
    // mode)
    static readonly CCMR1_Input = new class CCMR1_Input extends Register<CCMR1_Input>
    {
        constructor() { super(0x40000018) }        

        // Input capture 2 filter
        readonly IC2F   = new Field<CCMR1_Input, true>(4, 12)        

        // Input capture 2 prescaler
        readonly IC2PSC = new Field<CCMR1_Input, true>(2, 10)        

        // Capture/compare 2 selection
        readonly CC2S   = new Field<CCMR1_Input, true>(2, 8)        

        // Input capture 1 filter
        readonly IC1F   = new Field<CCMR1_Input, true>(4, 4)        

        // Input capture 1 prescaler
        readonly IC1PSC = new Field<CCMR1_Input, true>(2, 2)        

        // Capture/Compare 1 selection
        readonly CC1S   = new Field<CCMR1_Input, true>(2, 0)        
    }

    // capture/compare mode register 2 (output 
    // mode)
    static readonly CCMR2_Output = new class CCMR2_Output extends Register<CCMR2_Output>
    {
        constructor() { super(0x4000001c) }        

        // Output Compare 4 mode - bit 3
        readonly OC4M_3 = new Field<CCMR2_Output, true>(1, 24)        

        // Output Compare 3 mode - bit 3
        readonly OC3M_3 = new Field<CCMR2_Output, true>(1, 16)        

        // Output compare 4 clear enable
        readonly OC4CE  = new Field<CCMR2_Output, true>(1, 15)        

        // Output compare 4 mode
        readonly OC4M   = new Field<CCMR2_Output, true>(3, 12)        

        // Output compare 4 preload enable
        readonly OC4PE  = new Field<CCMR2_Output, true>(1, 11)        

        // Output compare 4 fast enable
        readonly OC4FE  = new Field<CCMR2_Output, true>(1, 10)        

        // Capture/Compare 4 selection
        readonly CC4S   = new Field<CCMR2_Output, true>(2, 8)        

        // Output compare 3 clear enable
        readonly OC3CE  = new Field<CCMR2_Output, true>(1, 7)        

        // Output compare 3 mode
        readonly OC3M   = new Field<CCMR2_Output, true>(3, 4)        

        // Output compare 3 preload enable
        readonly OC3PE  = new Field<CCMR2_Output, true>(1, 3)        

        // Output compare 3 fast enable
        readonly OC3FE  = new Field<CCMR2_Output, true>(1, 2)        

        // Capture/Compare 3 selection
        readonly CC3S   = new Field<CCMR2_Output, true>(2, 0)        
    }

    // capture/compare mode register 2 (input 
    // mode)
    static readonly CCMR2_Input = new class CCMR2_Input extends Register<CCMR2_Input>
    {
        constructor() { super(0x4000001c) }        

        // Input capture 4 filter
        readonly IC4F   = new Field<CCMR2_Input, true>(4, 12)        

        // Input capture 4 prescaler
        readonly IC4PSC = new Field<CCMR2_Input, true>(2, 10)        

        // Capture/Compare 4 selection
        readonly CC4S   = new Field<CCMR2_Input, true>(2, 8)        

        // Input capture 3 filter
        readonly IC3F   = new Field<CCMR2_Input, true>(4, 4)        

        // Input capture 3 prescaler
        readonly IC3PSC = new Field<CCMR2_Input, true>(2, 2)        

        // Capture/Compare 3 selection
        readonly CC3S   = new Field<CCMR2_Input, true>(2, 0)        
    }

    // capture/compare enable register
    static readonly CCER = new class CCER extends Register<CCER>
    {
        constructor() { super(0x40000020) }        

        // Capture/Compare 4 output Polarity
        readonly CC4NP = new Field<CCER, true>(1, 15)        

        // Capture/Compare 3 output Polarity
        readonly CC4P  = new Field<CCER, true>(1, 13)        

        // Capture/Compare 4 output enable
        readonly CC4E  = new Field<CCER, true>(1, 12)        

        // Capture/Compare 3 output Polarity
        readonly CC3NP = new Field<CCER, true>(1, 11)        

        // Capture/Compare 3 output Polarity
        readonly CC3P  = new Field<CCER, true>(1, 9)        

        // Capture/Compare 3 output enable
        readonly CC3E  = new Field<CCER, true>(1, 8)        

        // Capture/Compare 2 output Polarity
        readonly CC2NP = new Field<CCER, true>(1, 7)        

        // Capture/Compare 2 output Polarity
        readonly CC2P  = new Field<CCER, true>(1, 5)        

        // Capture/Compare 2 output enable
        readonly CC2E  = new Field<CCER, true>(1, 4)        

        // Capture/Compare 1 output Polarity
        readonly CC1NP = new Field<CCER, true>(1, 3)        

        // Capture/Compare 1 output Polarity
        readonly CC1P  = new Field<CCER, true>(1, 1)        

        // Capture/Compare 1 output enable
        readonly CC1E  = new Field<CCER, true>(1, 0)        
    }

    // counter
    static readonly CNT = new class CNT extends Register<CNT>
    {
        constructor() { super(0x40000024) }        

        // High counter value (TIM2 only)
        readonly CNT_H = new Field<CNT, true>(16, 16)        

        // Low counter value
        readonly CNT_L = new Field<CNT, true>(16, 0)        
    }

    // prescaler
    static readonly PSC = new class PSC extends Register<PSC>
    {
        constructor() { super(0x40000028) }        

        // Prescaler value
        readonly PSC = new Field<PSC, true>(16, 0)        
    }

    // auto-reload register
    static readonly ARR = new class ARR extends Register<ARR>
    {
        constructor() { super(0x4000002c) }        

        // High Auto-reload value (TIM2 only)
        readonly ARR_H = new Field<ARR, true>(16, 16)        

        // Low Auto-reload value
        readonly ARR_L = new Field<ARR, true>(16, 0)        
    }

    // capture/compare register 1
    static readonly CCR1 = new class CCR1 extends Register<CCR1>
    {
        constructor() { super(0x40000034) }        

        // High Capture/Compare 1 value (TIM2 only)
        readonly CCR1_H = new Field<CCR1, true>(16, 16)        

        // Low Capture/Compare 1 value
        readonly CCR1_L = new Field<CCR1, true>(16, 0)        
    }

    // capture/compare register 2
    static readonly CCR2 = new class CCR2 extends Register<CCR2>
    {
        constructor() { super(0x40000038) }        

        // High Capture/Compare 2 value (TIM2 only)
        readonly CCR2_H = new Field<CCR2, true>(16, 16)        

        // Low Capture/Compare 2 value
        readonly CCR2_L = new Field<CCR2, true>(16, 0)        
    }

    // capture/compare register 3
    static readonly CCR3 = new class CCR3 extends Register<CCR3>
    {
        constructor() { super(0x4000003c) }        

        // High Capture/Compare value (TIM2 only)
        readonly CCR3_H = new Field<CCR3, true>(16, 16)        

        // Low Capture/Compare value
        readonly CCR3_L = new Field<CCR3, true>(16, 0)        
    }

    // capture/compare register 4
    static readonly CCR4 = new class CCR4 extends Register<CCR4>
    {
        constructor() { super(0x40000040) }        

        // High Capture/Compare value (TIM2 only)
        readonly CCR4_H = new Field<CCR4, true>(16, 16)        

        // Low Capture/Compare value
        readonly CCR4_L = new Field<CCR4, true>(16, 0)        
    }

    // DMA control register
    static readonly DCR = new class DCR extends Register<DCR>
    {
        constructor() { super(0x40000048) }        

        // DMA burst length
        readonly DBL = new Field<DCR, true>(5, 8)        

        // DMA base address
        readonly DBA = new Field<DCR, true>(5, 0)        
    }

    // DMA address for full transfer
    static readonly DMAR = new class DMAR extends Register<DMAR>
    {
        constructor() { super(0x4000004c) }        

        // DMA register for burst accesses
        readonly DMAB = new Field<DMAR, true>(16, 0)        
    }

    // TIM option register
    static readonly OR1 = new class OR1 extends Register<OR1>
    {
        constructor() { super(0x40000050) }        

        // IOCREF_CLR
        readonly IOCREF_CLR = new Field<OR1, true>(1, 0)        
    }

    // TIM alternate function option register 1
    static readonly AF1 = new class AF1 extends Register<AF1>
    {
        constructor() { super(0x40000060) }        

        // External trigger source selection
        readonly ETRSEL = new Field<AF1, true>(4, 14)        
    }

    // TIM alternate function option register 1
    static readonly TISEL = new class TISEL extends Register<TISEL>
    {
        constructor() { super(0x40000068) }        

        // TI1SEL
        readonly TI1SEL = new Field<TISEL, true>(4, 0)        

        // TI2SEL
        readonly TI2SEL = new Field<TISEL, true>(4, 8)        
    }
}

export class TIM3
{
    // control register 1
    static readonly CR1 = new class CR1 extends Register<CR1>
    {
        constructor() { super(0x40000400) }        

        // UIF status bit remapping
        readonly UIFREMAP = new Field<CR1, true>(1, 11)        

        // Clock division
        readonly CKD      = new Field<CR1, true>(2, 8)        

        // Auto-reload preload enable
        readonly ARPE     = new Field<CR1, true>(1, 7)        

        // Center-aligned mode selection
        readonly CMS      = new Field<CR1, true>(2, 5)        

        // Direction
        readonly DIR      = new Field<CR1, true>(1, 4)        

        // One-pulse mode
        readonly OPM      = new Field<CR1, true>(1, 3)        

        // Update request source
        readonly URS      = new Field<CR1, true>(1, 2)        

        // Update disable
        readonly UDIS     = new Field<CR1, true>(1, 1)        

        // Counter enable
        readonly CEN      = new Field<CR1, true>(1, 0)        
    }

    // control register 2
    static readonly CR2 = new class CR2 extends Register<CR2>
    {
        constructor() { super(0x40000404) }        

        // TI1 selection
        readonly TI1S = new Field<CR2, true>(1, 7)        

        // Master mode selection
        readonly MMS  = new Field<CR2, true>(3, 4)        

        // Capture/compare DMA selection
        readonly CCDS = new Field<CR2, true>(1, 3)        
    }

    // slave mode control register
    static readonly SMCR = new class SMCR extends Register<SMCR>
    {
        constructor() { super(0x40000408) }        

        // Trigger selection
        readonly TS_4_3 = new Field<SMCR, true>(2, 20)        

        // Slave mode selection - bit 3
        readonly SMS_3  = new Field<SMCR, true>(1, 16)        

        // External trigger polarity
        readonly ETP    = new Field<SMCR, true>(1, 15)        

        // External clock enable
        readonly ECE    = new Field<SMCR, true>(1, 14)        

        // External trigger prescaler
        readonly ETPS   = new Field<SMCR, true>(2, 12)        

        // External trigger filter
        readonly ETF    = new Field<SMCR, true>(4, 8)        

        // Master/Slave mode
        readonly MSM    = new Field<SMCR, true>(1, 7)        

        // Trigger selection
        readonly TS     = new Field<SMCR, true>(3, 4)        

        // OCREF clear selection
        readonly OCCS   = new Field<SMCR, true>(1, 3)        

        // Slave mode selection
        readonly SMS    = new Field<SMCR, true>(3, 0)        
    }

    // DMA/Interrupt enable register
    static readonly DIER = new class DIER extends Register<DIER>
    {
        constructor() { super(0x4000040c) }        

        // Trigger DMA request enable
        readonly TDE   = new Field<DIER, true>(1, 14)        

        // Capture/Compare 4 DMA request enable
        readonly CC4DE = new Field<DIER, true>(1, 12)        

        // Capture/Compare 3 DMA request enable
        readonly CC3DE = new Field<DIER, true>(1, 11)        

        // Capture/Compare 2 DMA request enable
        readonly CC2DE = new Field<DIER, true>(1, 10)        

        // Capture/Compare 1 DMA request enable
        readonly CC1DE = new Field<DIER, true>(1, 9)        

        // Update DMA request enable
        readonly UDE   = new Field<DIER, true>(1, 8)        

        // Trigger interrupt enable
        readonly TIE   = new Field<DIER, true>(1, 6)        

        // Capture/Compare 4 interrupt enable
        readonly CC4IE = new Field<DIER, true>(1, 4)        

        // Capture/Compare 3 interrupt enable
        readonly CC3IE = new Field<DIER, true>(1, 3)        

        // Capture/Compare 2 interrupt enable
        readonly CC2IE = new Field<DIER, true>(1, 2)        

        // Capture/Compare 1 interrupt enable
        readonly CC1IE = new Field<DIER, true>(1, 1)        

        // Update interrupt enable
        readonly UIE   = new Field<DIER, true>(1, 0)        
    }

    // status register
    static readonly SR = new class SR extends Register<SR>
    {
        constructor() { super(0x40000410) }        

        // Capture/Compare 4 overcapture flag
        readonly CC4OF = new Field<SR, true>(1, 12)        

        // Capture/Compare 3 overcapture flag
        readonly CC3OF = new Field<SR, true>(1, 11)        

        // Capture/compare 2 overcapture flag
        readonly CC2OF = new Field<SR, true>(1, 10)        

        // Capture/Compare 1 overcapture flag
        readonly CC1OF = new Field<SR, true>(1, 9)        

        // Trigger interrupt flag
        readonly TIF   = new Field<SR, true>(1, 6)        

        // Capture/Compare 4 interrupt flag
        readonly CC4IF = new Field<SR, true>(1, 4)        

        // Capture/Compare 3 interrupt flag
        readonly CC3IF = new Field<SR, true>(1, 3)        

        // Capture/Compare 2 interrupt flag
        readonly CC2IF = new Field<SR, true>(1, 2)        

        // Capture/compare 1 interrupt flag
        readonly CC1IF = new Field<SR, true>(1, 1)        

        // Update interrupt flag
        readonly UIF   = new Field<SR, true>(1, 0)        
    }

    // event generation register
    static readonly EGR = new class EGR extends Register<EGR>
    {
        constructor() { super(0x40000414) }        

        // Trigger generation
        readonly TG   = new Field<EGR, true>(1, 6)        

        // Capture/compare 4 generation
        readonly CC4G = new Field<EGR, true>(1, 4)        

        // Capture/compare 3 generation
        readonly CC3G = new Field<EGR, true>(1, 3)        

        // Capture/compare 2 generation
        readonly CC2G = new Field<EGR, true>(1, 2)        

        // Capture/compare 1 generation
        readonly CC1G = new Field<EGR, true>(1, 1)        

        // Update generation
        readonly UG   = new Field<EGR, true>(1, 0)        
    }

    // capture/compare mode register 1 (output 
    // mode)
    static readonly CCMR1_Output = new class CCMR1_Output extends Register<CCMR1_Output>
    {
        constructor() { super(0x40000418) }        

        // Output Compare 2 mode - bit 3
        readonly OC2M_3 = new Field<CCMR1_Output, true>(1, 24)        

        // Output Compare 1 mode - bit 3
        readonly OC1M_3 = new Field<CCMR1_Output, true>(1, 16)        

        // Output compare 2 clear enable
        readonly OC2CE  = new Field<CCMR1_Output, true>(1, 15)        

        // Output compare 2 mode
        readonly OC2M   = new Field<CCMR1_Output, true>(3, 12)        

        // Output compare 2 preload enable
        readonly OC2PE  = new Field<CCMR1_Output, true>(1, 11)        

        // Output compare 2 fast enable
        readonly OC2FE  = new Field<CCMR1_Output, true>(1, 10)        

        // Capture/Compare 2 selection
        readonly CC2S   = new Field<CCMR1_Output, true>(2, 8)        

        // Output compare 1 clear enable
        readonly OC1CE  = new Field<CCMR1_Output, true>(1, 7)        

        // Output compare 1 mode
        readonly OC1M   = new Field<CCMR1_Output, true>(3, 4)        

        // Output compare 1 preload enable
        readonly OC1PE  = new Field<CCMR1_Output, true>(1, 3)        

        // Output compare 1 fast enable
        readonly OC1FE  = new Field<CCMR1_Output, true>(1, 2)        

        // Capture/Compare 1 selection
        readonly CC1S   = new Field<CCMR1_Output, true>(2, 0)        
    }

    // capture/compare mode register 1 (input 
    // mode)
    static readonly CCMR1_Input = new class CCMR1_Input extends Register<CCMR1_Input>
    {
        constructor() { super(0x40000418) }        

        // Input capture 2 filter
        readonly IC2F   = new Field<CCMR1_Input, true>(4, 12)        

        // Input capture 2 prescaler
        readonly IC2PSC = new Field<CCMR1_Input, true>(2, 10)        

        // Capture/compare 2 selection
        readonly CC2S   = new Field<CCMR1_Input, true>(2, 8)        

        // Input capture 1 filter
        readonly IC1F   = new Field<CCMR1_Input, true>(4, 4)        

        // Input capture 1 prescaler
        readonly IC1PSC = new Field<CCMR1_Input, true>(2, 2)        

        // Capture/Compare 1 selection
        readonly CC1S   = new Field<CCMR1_Input, true>(2, 0)        
    }

    // capture/compare mode register 2 (output 
    // mode)
    static readonly CCMR2_Output = new class CCMR2_Output extends Register<CCMR2_Output>
    {
        constructor() { super(0x4000041c) }        

        // Output Compare 4 mode - bit 3
        readonly OC4M_3 = new Field<CCMR2_Output, true>(1, 24)        

        // Output Compare 3 mode - bit 3
        readonly OC3M_3 = new Field<CCMR2_Output, true>(1, 16)        

        // Output compare 4 clear enable
        readonly OC4CE  = new Field<CCMR2_Output, true>(1, 15)        

        // Output compare 4 mode
        readonly OC4M   = new Field<CCMR2_Output, true>(3, 12)        

        // Output compare 4 preload enable
        readonly OC4PE  = new Field<CCMR2_Output, true>(1, 11)        

        // Output compare 4 fast enable
        readonly OC4FE  = new Field<CCMR2_Output, true>(1, 10)        

        // Capture/Compare 4 selection
        readonly CC4S   = new Field<CCMR2_Output, true>(2, 8)        

        // Output compare 3 clear enable
        readonly OC3CE  = new Field<CCMR2_Output, true>(1, 7)        

        // Output compare 3 mode
        readonly OC3M   = new Field<CCMR2_Output, true>(3, 4)        

        // Output compare 3 preload enable
        readonly OC3PE  = new Field<CCMR2_Output, true>(1, 3)        

        // Output compare 3 fast enable
        readonly OC3FE  = new Field<CCMR2_Output, true>(1, 2)        

        // Capture/Compare 3 selection
        readonly CC3S   = new Field<CCMR2_Output, true>(2, 0)        
    }

    // capture/compare mode register 2 (input 
    // mode)
    static readonly CCMR2_Input = new class CCMR2_Input extends Register<CCMR2_Input>
    {
        constructor() { super(0x4000041c) }        

        // Input capture 4 filter
        readonly IC4F   = new Field<CCMR2_Input, true>(4, 12)        

        // Input capture 4 prescaler
        readonly IC4PSC = new Field<CCMR2_Input, true>(2, 10)        

        // Capture/Compare 4 selection
        readonly CC4S   = new Field<CCMR2_Input, true>(2, 8)        

        // Input capture 3 filter
        readonly IC3F   = new Field<CCMR2_Input, true>(4, 4)        

        // Input capture 3 prescaler
        readonly IC3PSC = new Field<CCMR2_Input, true>(2, 2)        

        // Capture/Compare 3 selection
        readonly CC3S   = new Field<CCMR2_Input, true>(2, 0)        
    }

    // capture/compare enable register
    static readonly CCER = new class CCER extends Register<CCER>
    {
        constructor() { super(0x40000420) }        

        // Capture/Compare 4 output Polarity
        readonly CC4NP = new Field<CCER, true>(1, 15)        

        // Capture/Compare 3 output Polarity
        readonly CC4P  = new Field<CCER, true>(1, 13)        

        // Capture/Compare 4 output enable
        readonly CC4E  = new Field<CCER, true>(1, 12)        

        // Capture/Compare 3 output Polarity
        readonly CC3NP = new Field<CCER, true>(1, 11)        

        // Capture/Compare 3 output Polarity
        readonly CC3P  = new Field<CCER, true>(1, 9)        

        // Capture/Compare 3 output enable
        readonly CC3E  = new Field<CCER, true>(1, 8)        

        // Capture/Compare 2 output Polarity
        readonly CC2NP = new Field<CCER, true>(1, 7)        

        // Capture/Compare 2 output Polarity
        readonly CC2P  = new Field<CCER, true>(1, 5)        

        // Capture/Compare 2 output enable
        readonly CC2E  = new Field<CCER, true>(1, 4)        

        // Capture/Compare 1 output Polarity
        readonly CC1NP = new Field<CCER, true>(1, 3)        

        // Capture/Compare 1 output Polarity
        readonly CC1P  = new Field<CCER, true>(1, 1)        

        // Capture/Compare 1 output enable
        readonly CC1E  = new Field<CCER, true>(1, 0)        
    }

    // counter
    static readonly CNT = new class CNT extends Register<CNT>
    {
        constructor() { super(0x40000424) }        

        // High counter value (TIM2 only)
        readonly CNT_H = new Field<CNT, true>(16, 16)        

        // Low counter value
        readonly CNT_L = new Field<CNT, true>(16, 0)        
    }

    // prescaler
    static readonly PSC = new class PSC extends Register<PSC>
    {
        constructor() { super(0x40000428) }        

        // Prescaler value
        readonly PSC = new Field<PSC, true>(16, 0)        
    }

    // auto-reload register
    static readonly ARR = new class ARR extends Register<ARR>
    {
        constructor() { super(0x4000042c) }        

        // High Auto-reload value (TIM2 only)
        readonly ARR_H = new Field<ARR, true>(16, 16)        

        // Low Auto-reload value
        readonly ARR_L = new Field<ARR, true>(16, 0)        
    }

    // capture/compare register 1
    static readonly CCR1 = new class CCR1 extends Register<CCR1>
    {
        constructor() { super(0x40000434) }        

        // High Capture/Compare 1 value (TIM2 only)
        readonly CCR1_H = new Field<CCR1, true>(16, 16)        

        // Low Capture/Compare 1 value
        readonly CCR1_L = new Field<CCR1, true>(16, 0)        
    }

    // capture/compare register 2
    static readonly CCR2 = new class CCR2 extends Register<CCR2>
    {
        constructor() { super(0x40000438) }        

        // High Capture/Compare 2 value (TIM2 only)
        readonly CCR2_H = new Field<CCR2, true>(16, 16)        

        // Low Capture/Compare 2 value
        readonly CCR2_L = new Field<CCR2, true>(16, 0)        
    }

    // capture/compare register 3
    static readonly CCR3 = new class CCR3 extends Register<CCR3>
    {
        constructor() { super(0x4000043c) }        

        // High Capture/Compare value (TIM2 only)
        readonly CCR3_H = new Field<CCR3, true>(16, 16)        

        // Low Capture/Compare value
        readonly CCR3_L = new Field<CCR3, true>(16, 0)        
    }

    // capture/compare register 4
    static readonly CCR4 = new class CCR4 extends Register<CCR4>
    {
        constructor() { super(0x40000440) }        

        // High Capture/Compare value (TIM2 only)
        readonly CCR4_H = new Field<CCR4, true>(16, 16)        

        // Low Capture/Compare value
        readonly CCR4_L = new Field<CCR4, true>(16, 0)        
    }

    // DMA control register
    static readonly DCR = new class DCR extends Register<DCR>
    {
        constructor() { super(0x40000448) }        

        // DMA burst length
        readonly DBL = new Field<DCR, true>(5, 8)        

        // DMA base address
        readonly DBA = new Field<DCR, true>(5, 0)        
    }

    // DMA address for full transfer
    static readonly DMAR = new class DMAR extends Register<DMAR>
    {
        constructor() { super(0x4000044c) }        

        // DMA register for burst accesses
        readonly DMAB = new Field<DMAR, true>(16, 0)        
    }

    // TIM option register
    static readonly OR1 = new class OR1 extends Register<OR1>
    {
        constructor() { super(0x40000450) }        

        // IOCREF_CLR
        readonly IOCREF_CLR = new Field<OR1, true>(1, 0)        
    }

    // TIM alternate function option register 1
    static readonly AF1 = new class AF1 extends Register<AF1>
    {
        constructor() { super(0x40000460) }        

        // External trigger source selection
        readonly ETRSEL = new Field<AF1, true>(4, 14)        
    }

    // TIM alternate function option register 1
    static readonly TISEL = new class TISEL extends Register<TISEL>
    {
        constructor() { super(0x40000468) }        

        // TI1SEL
        readonly TI1SEL = new Field<TISEL, true>(4, 0)        

        // TI2SEL
        readonly TI2SEL = new Field<TISEL, true>(4, 8)        
    }
}

export class VREFBUF
{
    // VREFBUF control and status register
    static readonly CSR = new class CSR extends Register<CSR>
    {
        constructor() { super(0x40010030) }        

        // Voltage reference buffer mode enable This bit is 
        // used to enable the voltage reference buffer mode.
        readonly ENVR = new Field<CSR, true>(1, 0)        

        // High impedance mode This bit controls the analog 
        // switch to connect or not the VREF+ pin. Refer to 
        // Table196: VREF buffer modes for the mode 
        // descriptions depending on ENVR bit configuration.
        readonly HIZ  = new Field<CSR, true>(1, 1)        

        // Voltage reference buffer ready
        readonly VRR  = new Field<CSR, false>(1, 3)        

        // Voltage reference scale These bits select the 
        // value generated by the voltage reference buffer. 
        // Other: Reserved
        readonly VRS  = new Field<CSR, true>(3, 4)        
    }

    // VREFBUF calibration control register
    static readonly CCR = new class CCR extends Register<CCR>
    {
        constructor() { super(0x40010034) }        

        // Trimming code These bits are automatically 
        // initialized after reset with the trimming value 
        // stored in the Flash memory during the production 
        // test. Writing into these bits allows to tune the 
        // internal reference buffer voltage.
        readonly TRIM = new Field<CCR, true>(6, 0)        
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
