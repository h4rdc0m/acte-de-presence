import { Handler } from "../src/server/request";
import { TrieTree } from "../src/server/trie-tree";
import { beforeEach, describe, expect, test } from 'bun:test';

describe("TrieTree", () => {
  let trieTree: TrieTree;

  beforeEach(() => {
    trieTree = new TrieTree();
  });

  test("should insert a path and retrieve it correctly", () => {
    const path = "/users/:id";
    const handler = () => {};
    trieTree.insert(path, handler);

    const result = trieTree.get("/users/123");
    expect(result.node).toBeDefined();
    expect(result.node?.getHandlers()).toContain(handler);
    expect(result.routeParams).toEqual({ id: "123" });
  });

  test("should insert multiple paths and retrieve them correctly", () => {
    const path1 = "/users/:id";
    const handler1 = () => {};
    trieTree.insert(path1, handler1);

    const path2 = "/users/:id/posts/:postId";
    const handler2 = () => {};
    trieTree.insert(path2, handler2);

    const result1 = trieTree.get("/users/123");
    expect(result1.node).toBeDefined();
    expect(result1.node?.getHandlers()).toContain(handler1);
    expect(result1.routeParams).toEqual({ id: "123" });

    const result2 = trieTree.get("/users/123/posts/456");
    expect(result2.node).toBeDefined();
    expect(result2.node?.getHandlers()).toContain(handler2);
    expect(result2.routeParams).toEqual({ id: "123", postId: "456" });
  });

  test("should handle wildcard path correctly", () => {
    const path = "*";
    const handler: Handler = function wildcardHandler() {};
    trieTree.insert(path, handler);

    const result = trieTree.get("/any/random/path");
    expect(result.node).toBeDefined();
    
    // Assuming getHandlers() returns an array of Handler functions
    const handlers = result.node?.getHandlers();
    expect(handlers).toBeDefined();
    expect(handlers).toContain(handler);
  });

  test("should return null for non-existing path", () => {
    const path = "/non-existing";
    const result = trieTree.get(path);
    expect(result.node).toBeNull();
    expect(result.routeParams).toEqual({});
  });
});