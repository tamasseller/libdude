import Tokenizr from "tokenizr";

export const enum Type {
    Oparen = "oparen",
    Cparen = "cparen",
    Obrace = "obrace",
    Cbrace = "cbrace",
    Obox = "obox",
    Cbox = "cbox",
    Literal = "literal",
    Identifier = "identifier",
    Operator = "operator",
    Assignment = "assignment",
    Store = "store",
    If = "if",
    Else = "else",
    Loop = "loop",
    Break = "break",
    Continue = "continue",
    Colon = "colon",
    Include = "include",
    Semicolon = "semicolon",
    Procedure = "procedure",
    Definition = "definition",
    Is = "is",
}

export function tokenize(src: string)
{
    let lexer = new Tokenizr()
        .rule(/\(/, (ctx) => ctx.accept(Type.Oparen))
        .rule(/\)/, (ctx) => ctx.accept(Type.Cparen))
        .rule(/\{/, (ctx) => ctx.accept(Type.Obrace))
        .rule(/\}/, (ctx) => ctx.accept(Type.Cbrace))
        .rule(/\[/, (ctx) => ctx.accept(Type.Obox))
        .rule(/\]/, (ctx) => ctx.accept(Type.Cbox))
        .rule(/if/, (ctx) => ctx.accept(Type.If))
        .rule(/else/, (ctx) => ctx.accept(Type.Else))
        .rule(/loop/, (ctx) => ctx.accept(Type.Loop))
        .rule(/break/, (ctx) => ctx.accept(Type.Break))
        .rule(/include/, (ctx) => ctx.accept(Type.Include))
        .rule(/continue/, (ctx) => ctx.accept(Type.Continue))
        .rule(/procedure/, (ctx) => ctx.accept(Type.Procedure))
        .rule(/definition/, (ctx) => ctx.accept(Type.Definition))
        .rule(/0b([0-1][_0-1]*)/, (ctx, match) => ctx.accept(Type.Literal, parseInt(match[1].replaceAll('_', ''), 2)))
        .rule(/0x([a-fA-F0-9][_a-fA-F0-9]*)/, (ctx, match) => ctx.accept(Type.Literal, parseInt(match[1].replaceAll('_', ''), 16)))
        .rule(/[0-9][_0-9]*/, (ctx, match) => ctx.accept(Type.Literal, parseInt(match[0].replaceAll('_', ''))))
        .rule(/[a-zA-Z_\.][a-zA-Z0-9_\.]*/, (ctx) => ctx.accept(Type.Identifier))
        .rule(/=/, (ctx) => ctx.accept(Type.Is))
        .rule(/<-/, (ctx) => ctx.accept(Type.Store))
        .rule(/:=/, (ctx) => ctx.accept(Type.Assignment))
        .rule(/(\$|<<|>>|==|!=|<|>|<=|>=|&&|\|\||\+|-|\*|&|\||\^)/, (ctx) => ctx.accept(Type.Operator))
        .rule(/:/, (ctx) => ctx.accept(Type.Colon))
        .rule(/;/, (ctx) => ctx.accept(Type.Semicolon))
        .rule(/\/\/[^\r\n]*\r?\n/, (ctx) => ctx.ignore())
        .rule(/[ \t\r\n]+/, (ctx) => ctx.ignore())

    try
    {
        return lexer.input(src).tokens();
    }
    catch (e)
    {
        throw new Error(`Tokenization error at ${e.line}:${e.column}`)
    }
}