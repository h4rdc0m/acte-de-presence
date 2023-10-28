import "reflect-metadata";

import { Token } from "..";
import { Inject } from "../src/decorators/Inject";
import { describe, expect, test } from 'bun:test';

describe("Inject decorator", () => {
  
  test("should add metadata for constructor injection", () => {
    class TestClass {
      constructor(public dependency: any) {}
    }

    const token = Token.for<TestClass>('testToken');
    const parameterIndex = 0;

    Inject(token)(TestClass.prototype, undefined, parameterIndex);

    const metadata = Reflect.getOwnMetadata("custom:inject", TestClass.prototype);

    expect(metadata).toEqual([token]);
  });
});