import { AcpResponse } from "./response";
import { TrieTree } from './trie-tree';

/**
 * Represents a handler function for processing requests.
 * @template T - The type of the response returned by the handler.
 * @param req - The AcpRequest object representing the incoming request.
 * @param res - The AcpResponse object representing the outgoing response.
 * @param next - Optional callback function to pass control to the next handler.
 * @param err - Optional error object passed to the handler.
 * @returns A void or a Promise that resolves to the response of type T.
 */
export type Handler<T = any> = ( 
    req: AcpRequest,
    res: AcpResponse,
    next?: (err?: Error) => {},
    err?: Error
) => void | Promise<T>;

/**
 * Represents a middleware function.
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next function to be called.
 */
export type MiddlewareFunc = (
    req: Request,
    res: AcpResponse,
    next: (err?: Error) => {}
) => void;

/**
 * Represents the HTTP methods supported by the server.
 */
export enum MethodType {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    PATCH = "PATCH",
    DELETE = "DELETE",
    OPTIONS = "OPTIONS",
    HEAD = "HEAD",
};

/**
 * Represents a request handler function.
 * @param path - The path for which the handler is registered.
 * @param handlers - The list of handlers to be executed for the given path.
 */
export type RequestHandler = (path: string, ...handlers: Handler[]) => void;

/**
 * Represents a middleware function that can be used in the server.
 */
export type Middleware = {
    path: string;
    handler: MiddlewareFunc;
};

/**
 * Represents the available request methods.
 */
export interface RequestMethod {
    get: RequestHandler;
    post: RequestHandler;
    put: RequestHandler;
    patch: RequestHandler;
    delete: RequestHandler;
    options: RequestHandler;
    head: RequestHandler;
}

/**
 * Represents an ACP (Acte de Présence) request.
 */
export interface AcpRequest {
    /**
     * The HTTP method of the request.
     */
    method: MethodType;

    /**
     * The request object.
     */
    requst: Request;

    /**
     * The path of the request.
     */
    path: string;

    /**
     * The headers of the request.
     */
    headers?: { [key: string]: string | number };

    /**
     * The path parameters of the request.
     */
    params?: { [key: string]: string | number };

    /**
     * The query parameters of the request.
     */
    query?: { [key: string]: string | number };

    /**
     * The body of the request.
     */
    body?: { [key: string]: string | number } | string | undefined;

    /**
     * The blob of the request.
     */
    blob?: Blob | undefined;

    /**
     * The original URL of the request.
     */
    originalUrl: string;
}

/**
 * Represents the options for SSL configuration.
 */
export interface SSLOptions {
    keyFile: string;
    certFile: string;
    password?: string;
    caFile?: string;
    dhParamsFile?: string;

    /**
     * This sets 'OPENSSL_RELEASE_BUFFERS' to 1.
     * It reduces the memory usage of OpenSSL by freeing up memory buffers
     * @default false
     */
    lowMemoryUsage?: boolean;
}

/**
 * Represents a mapper for handling different HTTP request methods.
 */
export interface RequestMapper {
    get?: TrieTree;
    post?: TrieTree;
    put?: TrieTree;
    patch?: TrieTree;
    delete?: TrieTree;
    options?: TrieTree;
    head?: TrieTree;
}

/**
 * Represents a tuple containing a path and a handler function for a request.
 */
export interface RequestTuple {
    path: string;
    handler: Handler;
}

/**
 * Represents a mapping of HTTP methods to an array of RequestTuple.
 */
export interface RouteREquestMapper {
    get?: RequestTuple[];
    post?: RequestTuple[];
    put?: RequestTuple[];
    patch?: RequestTuple[];
    delete?: RequestTuple[];
    options?: RequestTuple[];
    head?: RequestTuple[];
}

/**
 * Represents a function that maps a request method, path, and handler.
 *
 * @param method - The request method.
 * @param path - The request path.
 * @param handler - The request handler.
 */
export type RequestMapFunc = (method: MethodType, path: string, handler: Handler) => void;