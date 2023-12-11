import { Handler } from "./request";

export class TrieTree {
    private root: Node = new Node();

    get(path: string): TrieLeaf {
        const paths = path.split("/").filter(p => p.length > 0);
        const node = this.root;
        const params = {};
        let resultNode = this.dig(node, paths, params);

        if (!resultNode) {
            // Check for a wildcard node if no exact match is found
            resultNode = this.checkWildcardNode();
        }

        return {
            routeParams: params,
            node: resultNode,
        };
    }


    insert(path: string, value: Handler) {
        // if (path === "*") {
        //     path = "/";  // Representing wildcard with a specific node, adjust as needed
        // }

        const paths = path.split("/").filter(p => p.length > 0);
        let node = this.root;
        for (const currentPath of paths) {
            if (!node.children[currentPath]) {
                node.children[currentPath] = new Node(currentPath);
            }
            node = node.children[currentPath];
        }

        node.addHandler(value);  // Add handler to the final node
    }


    private dig(node: Node, paths: string[], params: { [key: string]: string }): Node | null {
        if (paths.length === 0) return node;

        const segment = paths.shift()!;
        let child = node.children[segment];

        if (!child) {
            child = node.children[Object.keys(node.children).find(key => key.startsWith(":"))!];

            if (!child) {
                // Fallback to wildcard if no other match is found
                child = node.children["*"];
            }
        }

        if (child) {
            if (child.path.startsWith(":")) {
                params[child.path.substring(1)] = segment;
            }
            return this.dig(child, paths, params);
        }

        return null;
    }

    private checkWildcardNode(): Node | null {
        // Assuming wildcard paths are stored with a specific key, like "*" or "/"
        // Adjust the key according to how you've handled wildcards in `insert`
        const wildcardKey = "*";  // or "/" if that's what you used in `insert`
        
        // Check if the root node has a wildcard child and return it
        return this.root.children[wildcardKey] || null;
    }
}

export interface TrieLeaf {
    node: Node | null;
    routeParams: { [key: string]: string };
}

class Node {
    private _children: { [path: string]: Node } = {};
    private handlers: Handler[] = [];

    constructor(private _path: string = "") { }

    get path() { return this._path }
    get children() { return this._children }

    addHandler(handler: Handler) {
        this.handlers.push(handler);
    }

    getHandlers(): Handler[] {
        return this.handlers;
    }
}
