import { Token } from "../src/Token";
import { describe, expect, test } from 'bun:test';

describe("Token", () => {
  describe("constructor", () => {
    test("should create a new Token instance with the given name", () => {
      const token = new Token<string>("test");
      expect(token.name).toBe("test");
    });
  });

  describe("from", () => {
    test("should create a new Token instance from the given class", () => {
      class TestClass {}
      const token = Token.from(TestClass);
      expect(token.name).toBe("TestClass");
    });
  });

  describe("for", () => {
    test("should create a new Token instance with the given name", () => {
      const token = Token.for<string>("test");
      expect(token.name).toBe("test");
    });
  });
});