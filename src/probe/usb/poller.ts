import assert from 'assert';
import * as usb from 'usb'

class UsbPollReq
{
    readonly data;
    readonly urb: usb.Transfer
    private cancelReq: (() => void) | undefined

    constructor(ep: usb.InEndpoint, size: number, readonly callback: (buffer: Buffer) => void)
    {
        this.data = Buffer.alloc(size);
        this.urb = ep.makeTransfer(0, (error: usb.LibUSBException | undefined, buffer: Buffer, actual: number) => 
        {
            if(this.cancelReq !== undefined)
            {
                if(error !== undefined)
                {
                    assert(error.errno === usb.usb.LIBUSB_TRANSFER_CANCELLED)
                    this.cancelReq();
                    this.cancelReq = undefined
                }
            }
            else
            {
                if(error === undefined)
                {
                    assert(buffer === this.data);
                    this.callback(buffer.subarray(0, actual))
                }
                else
                {
                    console.log(error);
                }

                this.start();
            }
        })
    }

    start()
    {
        assert(this.cancelReq === undefined)
        this.urb.submit(this.data);
    }

    cancel()
    {
        const ret = new Promise<void>(r => this.cancelReq = r);

        if(this.urb.cancel())
        {
            return ret
        }
        else
        {
            this.cancelReq = undefined
            Promise.resolve()
        }
    }
}

export class UsbPoller
{
    readonly reqs: UsbPollReq[];

    constructor(ep: usb.InEndpoint, size: number, count: number, callback: (buffer: Buffer) => void)
    {
        this.reqs = [...new Array(count).keys()].map<UsbPollReq>(() => new UsbPollReq(ep, size, callback));
    }

    start(): void 
    {
        this.reqs.forEach(r => r.start());
    }

    async stop(): Promise<void>
    {
        await Promise.all(this.reqs.map(r => r.cancel()));
    }
}