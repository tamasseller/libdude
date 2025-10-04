import { assert } from "console";
import { Block, Loop, Statement } from "./program/statement";
import { Constant, Expression } from "./program/expression";

export class Register<R extends Register<R>> {
    constructor(readonly address: number) {
        this.address = address;
    }

    set(...data: ([Expression | number]) | (FieldData<R, true>[])): Statement {
        const [v, ...rest] = data;
        if (v instanceof Expression || typeof v === "number") {
            assert(rest.length === 0)
            return new Constant(this.address).store(v);
        }

        else {
            const { value } = this.consolidate([v, ...(rest as FieldData<R, true>[])]);
            return new Constant(this.address).store(value);
        }
    }

    get(field?: Field<R, boolean>): Expression {
        const loaded = new Constant(this.address).load();

        if (field === undefined) {
            return loaded;
        }

        else {
            const masked = loaded.bitand(field.mask);
            return masked.shr(field.offset);
        }
    }

    private consolidate(data: FieldData<R, boolean>[]) {
        return {
            mask: data.map(d => d.mask).reduce((m, n) => m | n, 0),
            value: data.map(d => d.value).reduce((u, v) => u.bitor(v))
        };
    }

    update(...data: FieldData<R, true>[]): Statement {
        const { mask, value } = this.consolidate(data);

        if (mask === 0xffffffff) {
            return this.set(value);
        }

        else {
            const old = new Constant(this.address).load();
            const masked = old.bitand(~mask);
            const replaced = masked.bitor(value);

            return new Constant(this.address).store(value);
        }
    }

    wait(...data: FieldData<R, boolean>[]): Statement {
        const { mask, value } = this.consolidate(data);

        const loaded = new Constant(this.address).load();
        const masked = loaded.bitand(mask);
        const checked = masked.ne(value);

        return new Loop(checked, new Block());
    }
}

interface FieldData<R extends Register<R>, writable extends boolean> {
    readonly mask: number;
    readonly value: Expression;
}

export class Field<R extends Register<R>, writable extends boolean> 
{
    readonly mask: number;

    constructor(width: number, readonly offset: number) {
        this.mask = (((1 << width) - 1) << offset) >>> 0;
    }

    is(value: Expression | number | boolean): FieldData<R, writable> 
    {
        return {
            mask: this.mask,
            value: typeof value === "boolean" 
                ? new Constant(value ? ((1 << this.offset) >>> 0) : 0)
                : typeof value === "number" 
                    ? new Constant((value << this.offset) >>> 0)
                    : value.shl(this.offset)
        };
    }
}
