import ExpressionParser from "./expression";

import * as common from "./common";
import * as token from "./token";

import * as tokenizr from "tokenizr";
import { Assignment, Block, Branch, Jump, JumpKind, Loop, Statement, Store } from "../program/statement";
import { Expression, Variable } from "../program/expression";
import { LoadStoreWidth } from "../program/common";
import Procedure from "../program/procedure";

class BlockParser extends common.ParserBase<Block> {
    readonly stmts: Statement[] = [];

    constructor(scope: common.Scope, out: (b: Block) => common.Parser) {
        super(new common.Scope(scope), out);
    }

    take(t: tokenizr.Token): common.Parser {
        switch (t.type) {
            case token.Type.Cbrace:
                return this.out(new Block(...this.stmts));

            default:
                return new StatementParser(this.scope, s => {
                    this.stmts.push(s);
                    return this;
                }).take(t);
        }
    }
}

class MaybeOtherwiseParser extends common.ParserBase<Statement | undefined> {
    take(t: tokenizr.Token): common.Parser {
        switch (t.type) {
            case token.Type.Else: return new StatementParser(this.scope, s => this.out(s));
            default: return this.out(undefined).take(t);
        }
    }
}

let n = 0;

class MoveParser extends common.ParserBase<(lhs: Expression, rhs: Expression) => Statement> {
    take(t: tokenizr.Token): common.Parser {
        switch (t.type) {
            case token.Type.Store: return this.out((lhs, rhs) => new Store(LoadStoreWidth.U4, common.bindVariables(lhs), common.bindVariables(rhs)));

            case token.Type.Assignment: return this.out((lhs, rhs) => {
                if (lhs instanceof common.TentativeVariable) {
                    const boundRhs = common.bindVariables(rhs);
                    const boundLhs = lhs.scope.fetchForWrite(lhs.t.value);
                    (boundLhs as Variable & { n: number; }).n = n++;
                    return new Assignment(boundLhs, boundRhs);
                }

                throw new Error(`Unexpected token '${t.text}' assignments must target a variable`, { cause: t });
            });

            default: throw new Error(`Unexpected token '${t.text}' assigment or store operation expected `, { cause: t });
        }
    }
}

class SemicolonEater extends common.ParserBase<void> {
    take(t: tokenizr.Token): common.Parser {
        switch (t.type) {
            case token.Type.Semicolon: return this;
            default: return this.out().take(t);
        }
    }
}

class StatementParser extends common.ParserBase<Statement> {
    take(t: tokenizr.Token): common.Parser {
        switch (t.type) {
            case token.Type.Obrace:
                return new BlockParser(this.scope, b => this.out(b));

            case token.Type.If:
                return new ExpressionParser(this.scope, condition => {
                    return new StatementParser(this.scope, then => {
                        return new MaybeOtherwiseParser(this.scope, otherwise => {
                            return this.out(new Branch(common.bindVariables(condition), then, otherwise));
                        });
                    });
                });

            case token.Type.Loop:
                return new ExpressionParser(this.scope, condition => {
                    return new StatementParser(this.scope, body => {
                        return this.out(new Loop(common.bindVariables(condition), body));
                    });
                });

            case token.Type.Break:
                return this.out(new Jump(JumpKind.Break));

            case token.Type.Continue:
                return this.out(new Jump(JumpKind.Continue));

            case token.Type.Oparen:
            case token.Type.Identifier:
            case token.Type.Literal:
            case token.Type.Operator:
                return new ExpressionParser(this.scope, lhs => {
                    return new MoveParser(this.scope, builder => {
                        return new ExpressionParser(this.scope, rhs => {
                            return new SemicolonEater(this.scope, () => {
                                return this.out(builder(lhs, rhs));
                            });
                        });
                    });
                }).take(t);

            default:
                throw new Error(`Unexpected token '${t.text}' statement expected`, { cause: t });
        }
    }
}

class ArgumentListParser extends common.ParserBase<string[]> {
    readonly identifiers: string[] = [];

    take(t: tokenizr.Token): common.Parser {
        switch (t.type) {
            case token.Type.Identifier:
                this.identifiers.push(t.value);
                return this;
            default:
                return this.out(this.identifiers).take(t);
        }
    }
}

class MaybeRetvalListParser extends common.ParserBase<string[]> {
    take(t: tokenizr.Token): common.Parser {
        switch (t.type) {
            case token.Type.Colon:
                return new ArgumentListParser(this.scope, names => this.out(names));
            default:
                return this.out([]).take(t);
        }
    }
}

class ProcedureBodyParser extends common.ParserBase<Block> {
    take(t: tokenizr.Token): common.Parser {
        switch (t.type) {
            case token.Type.Obrace:
                return new BlockParser(this.scope, (b: Block) => this.out(b));
            default:
                throw new Error(`Unexpected token '${t.text}' expected '{'`, { cause: t });
        }
    }
}

export default class ProcedureParser extends common.ParserBase<[string, Procedure]> {
    take(t: tokenizr.Token): common.Parser {
        switch (t.type) {
            case token.Type.Identifier:
                const name = t.value;
                return new ArgumentListParser(this.scope,
                    argNames => {
                        const args = argNames.map(n => this.scope.fetchForWrite(n));
                        return new MaybeRetvalListParser(this.scope,
                            retvalNames => {
                                const retvals = retvalNames.map(n => this.scope.fetchForWrite(n));
                                return new ProcedureBodyParser(this.scope,
                                    body => this.out([name, new Procedure(args, retvals, body)])
                                );
                            }
                        );
                    }
                );

            default:
                throw new Error("Parse error: identifier expected", { cause: t });
        }
    }
}
