import Procedure from "../program/procedure";
import ProcedureParser from "./procedure";
import DefinitionParser from "./definition";

import * as token from "./token";
import * as common from "./common";
import * as tokenizr from "tokenizr";

class IncludeParser extends common.ParserBase<void>
{
    readonly rootParser: RootParser

    constructor(rootParser: RootParser, out: (_: void) => common.Parser) {
        super(rootParser.globals, out);
        this.rootParser = rootParser
    }

    take(t: tokenizr.Token): common.Parser
    {
        switch(t.type)
        {
            case token.Type.Identifier: 
                const name = t.value
                process(this.rootParser.include(name), name, this.rootParser)
                return this.out()
            default: throw new Error(`Unexpected token '${t.text}' name expected`, { cause: t });
        }
    }
}

class RootParser implements common.Parser
{
    readonly include: (name: string) => string
    readonly procedures = new Map<string, Procedure>()
    readonly globals = new common.Scope();

    constructor(include: (name: string) => string) {
        this.include = include
    }

    take(t: tokenizr.Token): common.Parser 
    {
        switch(t.type)
        {
            case "EOF": return this;
            case token.Type.Procedure:
                return new ProcedureParser(new common.Scope(this.globals), ([name, proc]: [string, Procedure]) => {
                    this.procedures.set(name, proc)
                    return this;
                })

            case token.Type.Definition:
                return new DefinitionParser(this.globals, () => this)

            case token.Type.Include:
                return new IncludeParser(this, () => this)

            default: throw new Error("Parse error: keyword procedure or definition expected", {cause: t})
        }
    }
}

function process(src: string, name: string, rootParser: RootParser): { [k: string]: Procedure; }
{
    try
    {
        const p = token.tokenize(src).reduce<common.Parser>((p, t) => p.take(t), rootParser)

        if(p instanceof RootParser)
        {
            return Object.fromEntries([...p.procedures.entries()])
        }
    }
    catch(e)
    {
        if(e instanceof Error && e.cause instanceof tokenizr.Token)
        {
            e.message = `${name}:${e.cause.line}:${e.cause.column}: ${e.message}`
        }

        throw e
    }
        
    throw new Error(`${name}:Unexpected end of input`);
}

export default function parse(
    src: string, 
    name: string = "<source>",
    include: (name: string) => string = (name) => { throw new Error("Can't include 🤦‍♂️") }
): {[key: string] : Procedure}
{
    const rootParser = new RootParser(include);
    return process(src, name, rootParser)
}