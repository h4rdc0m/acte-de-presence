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

/**
 * The `Injector` class provides a simple dependency injection container.
 * It allows you to register services and their dependencies, and then resolve them
 * at runtime. The `Injector` uses TypeScript's metadata reflection API to automatically
 * resolve dependencies based on their types.
 *
 * @remarks
 * This file defines the `Injector` class and related interfaces and enums.
 *
 * @packageDocumentation
 */

import { Scope } from "./Scope";
import { Token } from "./Token";
import { getDefaultTokenForClass } from "./decorators/getDefaultTokenForClass";

/**
 * The Injector class provides a dependency injection container for managing object dependencies.
 */
export class Injector {
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
    /**
     * The `Injector` class provides a simple dependency injection container.
     * It allows you to register services and their dependencies, and then resolve them
     * at runtime. The `Injector` uses TypeScript's metadata reflection API to automatically
     * resolve dependencies based on their types.
     *
     * @remarks
     * This file defines the `Injector` class and related interfaces and enums.
     *
     * @packageDocumentation
     */


    private readonly bindings: Map<string, Binding<any>> = new Map();

    public constructor() { }


    public register<T>(token: Token<T>, clazz: new (...args: any[]) => T, scope: Scope = Scope.Transient): void {
        token = token || getDefaultTokenForClass(clazz);
        console.log(`Registering token '${token.name}' with scope '${scope}'.`);
        if (this.bindings.has(token.toString())) {
            throw new Error(`Token '${token.name}' is already registered.`);
        }
        this.bindings.set(token.toString(), new Binding(token, clazz, scope));
    }

    public resolve<T>(token: Token<T>): T {
        const binding = this.bindings.get(token.toString());
        if (!binding) {
            const availableTokens = [...this.bindings.keys()].map(t => t).join(', ');
            throw new Error(`No binding found for token: '${token.toString()}'.\nTokens available: ${availableTokens}`);
        }

        // Look up the dependencies from metadata
        const argsTokens: Token<any>[] = Reflect.getMetadata('custom:inject', binding.cls) || [];
        const args = argsTokens.map(argToken => this.resolve(argToken));

        if (binding.scope === Scope.Singleton && binding.instance) {
            return binding.instance;
        }

        const instance = new binding.cls(...args);



        if (binding.scope === Scope.Singleton) {
            binding.instance = instance;
        }

        return instance;
    }

    public registerDependency(targetCls: any, dependencyToken: Token<any>, index: number): void {
        const binding = [...this.bindings.values()].find(b => b.cls === targetCls);
        if (!binding) {
            throw new Error(`No binding found for class: ${targetCls.name}.`);
        }
        binding.constructorArgs[index] = dependencyToken;
    }

    public clear(): void {
        this.bindings.clear();
    }
}


class Binding<T> {
    instance: T | null = null;
    constructorArgs: Token<any>[] = [];

    constructor(public token: Token<T>, public cls: new (...args: any[]) => T, public scope: Scope) { }
}



