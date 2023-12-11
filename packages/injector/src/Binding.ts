import { Scope } from "./Scope";
import { Token } from "./Token";

/**
 * Represents a binding between a token and a class.
 * @template T The type of the class.
 * @template P The type of the constructor arguments.
 */
export class Binding<T, P = any[]> {
    instance: T | null = null;
    constructorArgs: Token<any>[] = [];

    constructor(public token: Token<T>, public cls: new (...args: any[]) => T, public scope: Scope, public params?: P) { }
}
