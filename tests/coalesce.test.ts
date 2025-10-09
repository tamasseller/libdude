import assert from "assert";
import test from "node:test";
import { coalesce } from "../src/core/coalesce";

class A { constructor(readonly x: number) {} }
class B { constructor(readonly y: string) {} }
 
test("coalesceSane", () => assert.deepStrictEqual(
    [...coalesce(
        [
            new A(1), 
            new A(2), 
            new B("a"), 
            new B("b")
        ], 
        A, (is) => [new A(is.reduce((a, b) => a + b.x, 0))]
    )], [
        new A(3), 
        new B("a"), 
        new B("b")
    ]
))
 
test("coalesceAtEnd", () => assert.deepStrictEqual(
    [...coalesce(
        [
            new B("a"), 
            new B("b"), 
            new A(1), 
            new A(2),
        ], 
        A, (is) => [new A(is.reduce((a, b) => a + b.x, 0))]
    )], [
        new B("a"), 
        new B("b"),
        new A(3)
    ]
))

test("dontCoalesce", () => assert.deepStrictEqual(
    [...coalesce(
        [
            new A(1), 
            new B("a"), 
            new B("b"), 
            new A(2),
        ], 
        A, (is) => [new A(is.reduce((a, b) => a + b.x, 0))]
    )], [
        new A(1),
        new B("a"), 
        new B("b"),
        new A(2)
    ]
))

test("coalesceAll", () => assert.deepStrictEqual(
    [...coalesce(
        [
            new A(1), 
            new A(2),
            new A(3),
        ], 
        A, (is) => [new A(is.reduce((a, b) => a + b.x, 0))]
    )], [
        new A(6),
    ]
))

test("noCoalesceAtAll", () => assert.deepStrictEqual(
    [...coalesce(
        [
            new B("a"), 
            new B("b"),
            new B("c"),
        ], 
        A, (is) => [new A(is.reduce((a, b) => a + b.x, 0))]
    )], [
        new B("a"), 
        new B("b"),
        new B("c"),
    ]
))

test("coalesceSome", () => assert.deepStrictEqual(
    [...coalesce(
        [
            new B("a"), 
            new A(1), 
            new B("b"),
            new B("c"),
            new A(2),
            new A(3),
        ], 
        A, (is) => [new A(is.reduce((a, b) => a + b.x, 0))]
    )], [
        new B("a"), 
        new A(1), 
        new B("b"),
        new B("c"),
        new A(5),
    ]
))

test("coalesceSome2", () => assert.deepStrictEqual(
    [...coalesce(
        [
            new A(1), 
            new A(2),
            new B("a"), 
            new A(3),
            new B("b"),
            new B("c"),
        ], 
        A, (is) => [new A(is.reduce((a, b) => a + b.x, 0))]
    )], [
        new A(3),
        new B("a"), 
        new A(3), 
        new B("b"),
        new B("c"),
    ]
))