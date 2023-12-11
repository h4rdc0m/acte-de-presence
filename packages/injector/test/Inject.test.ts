import "reflect-metadata";

import { Token } from "..";
import { Inject } from "../src/decorators/Inject";
import { describe, expect, test } from 'bun:test';

describe("Inject decorator", () => {
  
  test("should add metadata for constructor injection", () => {
    const token = Token.for<TestClass>('testToken');
    class TestClass {
      constructor(@Inject(token) public dependency: any) {}
    }

    const metadata = Reflect.getOwnMetadata("custom:inject", TestClass);

    console.log(metadata);
    expect(metadata).toEqual([{token: token, isOptional: false}]);
  });

  test("should add metadata for optional constructor injection", () => {
    const token = Token.for<TestClass>('testToken');
    class TestClass {
      constructor(@Inject(token, {isOptional: true}) public dependency: any) {}
    }

    const metadata = Reflect.getOwnMetadata("custom:inject", TestClass);

    console.log(metadata);
    expect(metadata).toEqual([{token: token, isOptional: true}]);
  });
});