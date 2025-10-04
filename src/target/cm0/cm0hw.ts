import { Register, Field } from "../../executor/register";

export const DFSR = new class DFSR extends Register<DFSR> {
    constructor() { super(0xE000ED30); }
    readonly HALTED = new Field<DFSR, false>(1, 0);
    readonly BKPT = new Field<DFSR, false>(1, 1);
    readonly DWTTRAP = new Field<DFSR, false>(1, 2);
    readonly VCATCH = new Field<DFSR, false>(1, 3);
    readonly EXTERNAL = new Field<DFSR, false>(1, 4);
};

export const DHCSR = new class DHCSR extends Register<DHCSR> {
    constructor() { super(0xE000EDF0); }

    readonly C_DEBUGEN = new Field<DHCSR, true>(1, 0);
    readonly C_HALT = new Field<DHCSR, true>(1, 1);
    readonly C_STEP = new Field<DHCSR, true>(1, 2);
    readonly C_MASKINTS = new Field<DHCSR, true>(1, 3);
    readonly C_SNAPSTALL = new Field<DHCSR, true>(1, 5);
    readonly S_REGRDY = new Field<DHCSR, false>(1, 16);
    readonly S_HALT = new Field<DHCSR, false>(1, 17);
    readonly S_SLEEP = new Field<DHCSR, false>(1, 18);
    readonly S_LOCKUP = new Field<DHCSR, false>(1, 19);
    readonly S_RETIRE_ST = new Field<DHCSR, false>(1, 24);
    readonly S_RESET_ST = new Field<DHCSR, false>(1, 25);
    readonly DBGKEY = new Field<DHCSR, true>(16, 16);

    readonly DBGKEY_VALUE = 0xA05F;
};

export const DCRSR = new class DCRSR extends Register<DCRSR> {
    constructor() { super(0xE000EDF4); }
    readonly REGWnR = new Field<DCRSR, true>(1, 16);
    readonly REGSEL = new Field<DCRSR, true>(5, 0);
};

export const DCRDR = new class DCRDR extends Register<DCRDR> {
    constructor() { super(0xE000EDF8); }
};

export const DEMCR = new class DEMCR extends Register<DEMCR> {
    constructor() { super(0xE000EDFC); }
    readonly CORERESET = new Field<DEMCR, true>(1, 0);
    readonly HARDERR = new Field<DEMCR, true>(1, 10);
    readonly DWTENA = new Field<DEMCR, true>(1, 24);
};

export const AIRCR = new class AIRCR extends Register<AIRCR> {
    constructor() { super(0xE000ED0C); }
    readonly VECTRESET     = new Field<AIRCR, true>(1, 0);
    readonly VECTCLRACTIVE = new Field<AIRCR, true>(1, 1);
    readonly SYSRESETREQ   = new Field<AIRCR, true>(1, 2);
    readonly VECTKEY       = new Field<AIRCR, true>(16, 16);
    readonly VECTKEY_VALUE = 0x05FA;
};