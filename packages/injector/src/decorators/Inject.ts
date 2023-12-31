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

import { Token } from "../Token";
import { getDefaultTokenForClass } from "../getDefaultTokenForClass";

type InjectConfig = {
    isOptional?: boolean;
}

/**
 * The Inject decorator is used to specify a dependency injection token for a class property.
 * @param token The token used to identify the dependency.
 * @returns A decorator function.
 */
export function Inject(token?: Token<any>, config?: InjectConfig) {
    return function (target: any, propertyKey: string | symbol | undefined, parameterIndex: number) {
        if (propertyKey === undefined) {
            const paramTypes = Reflect.getMetadata('design:paramtypes', target);
            if (!paramTypes) {
                throw new Error("Parameter types metadata not found.");
            }

            const existingInjectedParameters: Array<{token: Token<any>, isOptional: boolean}> = Reflect.getOwnMetadata('custom:inject', target) || [];
            const injectionToken = token || getDefaultTokenForClass(paramTypes[parameterIndex]);

            existingInjectedParameters.splice(parameterIndex, 0, {
                token: injectionToken,
                isOptional: config?.isOptional || false,
            });

            Reflect.defineMetadata('custom:inject', existingInjectedParameters, target);
        }
    };
}

    