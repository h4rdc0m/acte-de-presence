import { AcpResponse } from "../src/server/response";
import { beforeEach, describe, expect, test } from 'bun:test';

describe("AcpResponse", () => {
  let response: AcpResponse;

  beforeEach(() => {
    response = new AcpResponse();
  });

  test("should set the status code", () => {
    const code = 204;
    response.status(code).send();
    expect(response.getResponse().status).toBe(code);
  });

  test("should set the status text", () => {
    const text = "OK";
    response.status(204).statusText(text).send();
    expect(response.getResponse().statusText).toBe(text);
  });

  test("should set the response body as JSON", () => {
    const body = { message: "Hello, World!" };
    response.json(body);
    expect(response.getResponse().json()).resolves.toEqual(body);
  });

  test("should send the specified body as the response", () => {
    const body = "Hello, World!";
    response.send(body);
    expect(response.getResponse().text()).resolves.toBe(body);
  });

  test("should set a header key-value pair in the response", () => {
    const key = "Content-Type";
    const value = "application/json";
    response.setHeader(key, value);
    expect(response.getHeaders().get(key)).toBe(value);
  });

  test("should throw an error if the key or value is not defined", () => {
    expect(() => response.setHeader("", "value")).toThrow("Header key or value is not defined");
    expect(() => response.setHeader("key", "")).toThrow("Header key or value is not defined");
  });

  test("should set the headers for the response", () => {
    const headers = { "Content-Type": "application/json" };
    response.headers(headers);
    expect(response.getHeaders().get("Content-Type")).toBe("application/json");
  });

  test("should check if the response is ready", () => {
    expect(response.isReady()).toBe(true);
  });

  test("should be able to set options for the response", () => {
    const options = { status: 200, statusText: "OK" };
    response.option(options).send();
    expect(response.getResponse().status).toBe(options.status);
    expect(response.getResponse().statusText).toBe(options.statusText);
  });
});