// Copyright (c) 2023 Combat Jongerenmarketing en -communicatie B.V.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of
// this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to
// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
// the Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
// IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

import { Scope } from "./Scope";

export class Token<T> {
    constructor(public readonly name: string) {}
}

export class Injector {
    private static services: Map<Token<any>, { implementation:new (...args: any[]) => any, scope?: Scope, instance?: any }> = new Map();
    private static dependencies: Map<Function, Token<any>[]> = new Map();

    public static register<T>(token: Token<T>, implementation: new (...args: any[]) => T, scope?: Scope) {
        this.services.set(token, { implementation, scope });
    }

    public static registerDependency(target: Function, token: Token<any>, parameterIndex: number) {
        if (!this.dependencies.has(target)) {
            this.dependencies.set(target, []);
        }

        const tokens = this.dependencies.get(target);
        tokens![parameterIndex] = token;
    }

    public static resolve<T>(token: Token<T>): T {
        const service = this.services.get(token);

        if (!service) {
            throw new Error(`No provider for token ${token.name}!`);
        }

        if (service.scope === Scope.Singleton && service.instance) {
            return service.instance;
        }

        const tokens = this.dependencies.get(service.implementation) || [];
        const args = tokens.map(t => this.resolve(t));

        const resolved = new service.implementation(...args);

        if (service.scope === Scope.Singleton) {
            service.instance = resolved;
        }

        return resolved;
    }
}