import ExpressionParser from "./expression";

import * as common from "./common";
import * as token from "./token";

import * as tokenizr from "tokenizr";
import { Binary, Constant, Expression } from "../program/expression";
import { evaluteOperator } from "../program/binaryOperator";

class IsEater extends common.ParserBase<void> {
    take(t: tokenizr.Token): common.Parser {
        switch (t.type) {
            case token.Type.Is: return this.out();
            default: throw new Error(`Unexpected token '${t.text}' expected '='`, { cause: t });
        }
    }
}

abstract class DefinitionParserBase extends common.ParserBase<void> {
    readonly prefix: string;

    constructor(scope: common.Scope, out: (b: void) => common.Parser, prefix: string = "") {
        super(scope, out);
        this.prefix = prefix
    }
}

class BoxParser extends DefinitionParserBase {
    take(t: tokenizr.Token): common.Parser {
        switch (t.type) {
            case token.Type.Cbox: return this.out()
            default: return new DefinitionParser(this.scope, () => this, this.prefix).take(t);
        }
    }
}

class MaybeBoxParser extends DefinitionParserBase {
    take(t: tokenizr.Token): common.Parser {
        switch (t.type) {
            case token.Type.Obox: return new BoxParser(this.scope, this.out, this.prefix)
            default: return this.out().take(t);
        }
    }
}

function evaluate(e: Expression): number
{
    if(e instanceof Constant) {
        return e.value
    }
    else if(e instanceof common.TentativeVariable) {
        const fetched = e.scope.fetchForRead(e.t.value);
        if(fetched instanceof Constant)
        {
            return fetched.value
        }

        throw new Error(`Undefined name ${e.t.value}`);
    }
    else if(e instanceof Binary)
    {
        return evaluteOperator(e.operator, evaluate(e.left), evaluate(e.right))
    }
    else {
        throw new Error(`Not a constant expression ;) definitions can only reference other definitions`);
    }
}

export default class DefinitionParser extends DefinitionParserBase {
    take(t: tokenizr.Token): common.Parser {
        switch (t.type) {
            case token.Type.Identifier:
                const name = this.prefix ? `${this.prefix}.${t.value}` : t.value
                return new IsEater(this.scope, () => {
                    return new ExpressionParser(this.scope, (e: Expression) => {
                        if(!this.scope.addConstant(name, evaluate(e)))
                        {
                            throw new Error(`Name '${name} already defined'`, { cause: t });
                        }

                        return new MaybeBoxParser(this.scope, this.out, name);
                    })
                });
            default:
                throw new Error(`Unexpected token '${t.text}' identifier expected`, { cause: t });
        }
    }
}