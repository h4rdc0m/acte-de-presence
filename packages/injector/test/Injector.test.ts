import "reflect-metadata";

import { Inject, Injector, Scope, Token } from "../src";
import { beforeEach, describe, expect, it } from 'bun:test';

describe("Injector", () => {
  let injector: Injector;

  beforeEach(() => {
    injector = new Injector();
    injector.clear();
  });


  describe("register", () => {
    it("should register a dependency", () => {
      class TestClass {}
      const token = Token.for<TestClass>("TestClass");
      
      injector.register<TestClass>(token, TestClass, Scope.Singleton);

      const instance = injector.resolve(token);
      expect(instance).toBeInstanceOf(TestClass);
    });

    it("should throw an error if the token is already registered", () => {
      class TestClass {}
      const token = new Token<TestClass>("TestClass");
      injector.register(token, TestClass);

      expect(() => injector.register(token, TestClass)).toThrow(
        `Token '${token.name}' is already registered.`
      );
    });
  });


  describe("resolve", () => {
    it("should resolve a dependency", () => {
      class TestClass {}
      const token = new Token<TestClass>("TestClass");
      injector.register(token, TestClass);

      const instance = injector.resolve(token);
      expect(instance).toBeInstanceOf(TestClass);
    });

    it("should throw an error if the dependency cannot be resolved", () => {
      class TestClass {}
      const token = new Token<TestClass>("TestClass");

      expect(() => injector.resolve(token)).toThrow(
        `No binding found for token: '${token.name}'.\nTokens available: `
      );
    });

    it("should resolve a dependency with dependencies", () => {
      class TestClass1 {}
      class TestClass2 {}
      class TestClass3 {
        constructor(
          @Inject() public testClass1: TestClass1,
          @Inject() public testClass2: TestClass2
        ) {}
      }

      const token1 = new Token<TestClass1>("TestClass1");
      const token2 = new Token<TestClass2>("TestClass2");
      const token3 = new Token<TestClass3>("TestClass3");

      injector.register(token1, TestClass1);
      injector.register(token2, TestClass2);
      injector.register(token3, TestClass3);

      const instance = injector.resolve(token3);
      expect(instance).toBeInstanceOf(TestClass3);
      expect(instance.testClass1).toBeInstanceOf(TestClass1);
      expect(instance.testClass2).toBeInstanceOf(TestClass2);
    });

    it("should resolve a singleton dependency", () => {
      class TestClass {}
      const token = new Token<TestClass>("TestClass");
      injector.register(token, TestClass, Scope.Singleton);

      const instance1 = injector.resolve(token);
      const instance2 = injector.resolve(token);
      expect(instance1).toBe(instance2);
    });

    it("should resolve a transient dependency", () => {
      class TestClass {}
      const token = new Token<TestClass>("TestClass");
      injector.register(token, TestClass, Scope.Transient);

      const instance1 = injector.resolve(token);
      const instance2 = injector.resolve(token);
      expect(instance1).not.toBe(instance2);
    });
  });

  describe("registerDependency", () => {
    it("should register a dependency for a class", () => {
      class TestClass1 {}
      class TestClass2 {
        constructor(@Inject() public testClass1: TestClass1) {}
      }

      const token1 = new Token<TestClass1>("TestClass1");
      const token2 = new Token<TestClass2>("TestClass2");

      injector.register(token1, TestClass1);
      injector.register(token2, TestClass2);

      const instance = injector.resolve(token2);
      expect(instance).toBeInstanceOf(TestClass2);
      expect(instance.testClass1).toBeInstanceOf(TestClass1);
    });
  });

  describe("clear", () => {
    it("should clear all registered dependencies and instances", () => {
      class TestClass {}
      const token = new Token<TestClass>("TestClass");
      injector.register(token, TestClass);

      injector.clear();

      expect(() => injector.resolve(token)).toThrow(
        `No binding found for token: '${token.toString()}'.\nTokens available: `
      );
    });
  });
});