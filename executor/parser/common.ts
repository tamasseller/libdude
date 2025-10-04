import assert from "assert";
import { Token } from "tokenizr";
import { Binary, Constant, Expression, Load, Variable } from "../program/expression";

export interface Parser {
    take(t: Token): Parser;
}

export class Scope {
    readonly parent?: Scope;
    readonly names = new Map<string, Variable | Constant>();

    constructor(parent?: Scope) {
        this.parent = parent;
    }

    fetchForRead(name: string): Variable | Constant | undefined {
        const own = this.names.get(name);
        if (own !== undefined) {
            return own;
        }
        else if (this.parent !== undefined) {
            return this.parent.fetchForRead(name);
        }
    }

    fetchForWrite(name: string): Variable {
        const own = this.fetchForRead(name);
        if (own !== undefined) {
            assert(own instanceof Variable)
            return own;
        }

        const ret = new Variable();
        this.names.set(name, ret);
        return ret;
    }

    addConstant(name: string, value: number): boolean {
        if(this.names.has(name))
        {
            return false
        }

        this.names.set(name, new Constant(value))
        return true
    }
}

export abstract class ParserBase<T> implements Parser {
    readonly out: (b: T) => Parser;
    readonly scope: Scope;

    constructor(scope: Scope, out: (b: T) => Parser) {
        this.out = out;
        this.scope = scope;
    }

    abstract take(t: Token): Parser;
}

export class TentativeVariable extends Expression {
    scope: Scope;
    t: Token;

    constructor(scope: Scope, t: Token) {
        super();
        this.scope = scope;
        this.t = t;
    }

    get referencedVars(): Variable[] {
        throw new Error("Method not implemented.");
    }
}

export function bindVariables(e: Expression, ctx: {prev?:string} = {}): Expression 
{
    if (e instanceof TentativeVariable) {
        let name: string = e.t.value
        
        if(name[0] === ".")
        {
            if(ctx.prev === undefined)
            {
                throw new Error(`No context for '${name}'`, {cause: e.t})
            }

            name = `${ctx.prev}${e.t.value}` 
        }

        const ret = e.scope.fetchForRead(name);

        if (ret === undefined) {
            throw new Error(`Variable '${name}' not available`, { cause: e.t });
        }

        if(name.includes("."))
        {
            ctx.prev = name
        }

        return ret;        
    }
    else if (e instanceof Load) {
        return new Load(e.width, bindVariables(e.address, ctx));
    }
    else if (e instanceof Binary) {
        return new Binary(e.operator, bindVariables(e.left, ctx), bindVariables(e.right, ctx));
    }

    else {
        assert(e instanceof Constant);
        return e;
    }
}
