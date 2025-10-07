import { Device } from "usb";
import { Log } from "../log";
import { Probe } from "./probe";

export const probeDrivers: {
    name: string, 
    ids: {vid: number, pid: number}[]
    build: (log: Log, dev: Device) => Probe
}[] = []