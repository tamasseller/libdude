import * as common from "./common";
import * as token from "./token";

import * as tokenizr from "tokenizr";
import assert from "assert";
import { Binary, Constant, Expression, Load } from "../program/expression";
import { LoadStoreWidth } from "../program/common";
import { BinaryOperator } from "../program/binaryOperator";

class CparenEater extends common.ParserBase<void> {
    take(t: tokenizr.Token): common.Parser {
        switch (t.type) {
            case token.Type.Cparen: return this.out();
            default: throw new Error(`Unexpected token '${t.text}' expected ')'`, { cause: t });
        }
    }
}

class ValueParser extends common.ParserBase<Expression> {
    take(t: tokenizr.Token): common.Parser {
        switch (t.type) {
            case token.Type.Literal: return this.out(new Constant(t.value));
            case token.Type.Identifier: return this.out(new common.TentativeVariable(this.scope, t));
            case token.Type.Oparen:
                return new ExpressionParser(this.scope, e => new CparenEater(this.scope, () => this.out(e)
                )
                );

            case token.Type.Operator:
                if (t.value == "$") {
                    return new ValueParser(this.scope, e => this.out(new Load(LoadStoreWidth.U4, e)));
                }
            // NO BREAK;
            default: throw new Error(`Unexpected token '${t.text}'`, { cause: t });
        }
    }
}

class MaybeOperatorParser extends common.ParserBase<BinaryOperator | undefined> {
    take(t: tokenizr.Token): common.Parser {
        switch (t.type) {
            case token.Type.Operator:
                switch (t.value) {
                    case "<<": return this.out(BinaryOperator.Shl);
                    case ">>": return this.out(BinaryOperator.Shr);
                    case "&&": return this.out(BinaryOperator.LogAnd);
                    case "||": return this.out(BinaryOperator.LogOr);
                    case "==": return this.out(BinaryOperator.Eq);
                    case "!=": return this.out(BinaryOperator.Ne);
                    case "<=": return this.out(BinaryOperator.Le);
                    case ">=": return this.out(BinaryOperator.Ge);
                    case "<": return this.out(BinaryOperator.Lt);
                    case ">": return this.out(BinaryOperator.Gt);
                    case "+": return this.out(BinaryOperator.Add);
                    case "-": return this.out(BinaryOperator.Sub);
                    case "*": return this.out(BinaryOperator.Mul);
                    case "&": return this.out(BinaryOperator.BitAnd);
                    case "|": return this.out(BinaryOperator.BitOr);
                    case "^": return this.out(BinaryOperator.BitXor);
                    default: throw new Error(`Unexpected token '${t.text}' binary operator expected`, { cause: t });
                }

            default:
                return this.out(undefined).take(t);
        }
    }
}

const precedenceClasses = [
    [BinaryOperator.Mul],
    [BinaryOperator.Add, BinaryOperator.Sub],
    [BinaryOperator.Shl, BinaryOperator.Shr],
    [BinaryOperator.Lt, BinaryOperator.Le],
    [BinaryOperator.Gt, BinaryOperator.Ge],
    [BinaryOperator.Eq, BinaryOperator.Ne],
    [BinaryOperator.BitAnd],
    [BinaryOperator.BitXor],
    [BinaryOperator.BitOr],
    [BinaryOperator.LogAnd],
    [BinaryOperator.LogOr]
];

export default class ExpressionParser extends common.ParserBase<Expression> {
    readonly values: Expression[] = [];
    readonly ops: BinaryOperator[] = [];

    take(t: tokenizr.Token): common.Parser {
        return new ValueParser(this.scope, v => {
            this.values.push(v);
            return new MaybeOperatorParser(this.scope, op => {
                if (op === undefined) {
                    assert(this.values.length == this.ops.length + 1);

                    for (const pc of precedenceClasses) {
                        for (let i = 0; i < this.ops.length;) {
                            if (pc.includes(this.ops[i])) {
                                const op = this.ops[i];
                                const lhs = this.values[i];
                                const rhs = this.values[i + 1];
                                this.ops.splice(i, 1);
                                this.values.splice(i, 1);
                                this.values[i] = new Binary(op, lhs, rhs);
                            }

                            else {
                                i += 1;
                            }
                        }
                    }

                    assert(this.ops.length == 0);
                    assert(this.values.length == 1);
                    return this.out(this.values[0]);
                }

                this.ops.push(op);
                return this;
            });
        }).take(t);
    }
}
