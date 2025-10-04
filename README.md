# MCU Debug Access Library

A lightweight, embeddable library providing low-level debug access to microcontrollers.
It is designed not as a standalone debugger, but as a **component** that can be integrated into larger applications — such as automated testing frameworks, production tools or custom developer utilities.

Most MCU debugging tools are built with human developers in mind — typically exposing command-line utilities or GUIs.
This library is built differently:

- **Embed in larger systems**: Ideal for automated test benches, CI/CD validation pipelines, and production-line programming.
- **Minimal dependencies**: Lightweight core that can be embedded in environments with strict resource or integration constraints.
- **Composable**: Can serve as the foundation for higher-level abstractions like firmware updaters, board farm managers, or automated regression testers.

## Use-cases

- Automated Production Programming: Factory test fixtures for flashing and verifying firmware
- Regression Testing: Execution control and state inspection as part of hardware-in-the-loop tests
- Custom Developer Tools: higher-level scripting or monitoring utilities for specific task

---

## Features

- Target identification: Uses the Coresight ROM tables and the IDCODE for double checking target model identity
- CPU Execution Control: Halt, run, single-step, and reset the target MCU
- Core Register Access: Read and write general-purpose and special registers
- System Memory Access: Read and write arbitrary memory regions (including memory mapped peripherals)
- Flash Programming: Erase and program MCU flash

## Goals

- Simple API that can be used directly in higher level applications.
- Minimal dependency on external infrastructure 
- Easily extendable support for custom, purpose build debug probes and their transport.
