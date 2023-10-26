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

import { DirectoryMetadata, DirectoryContents, FileContents, FileMetadata } from ".";

/**
 * Interface for a virtual file system driver.
 */
export interface IVfsDriver {
    /**
     * Reads a file asynchronously and returns the result.
     * If specific driver is not specified, the default driver is used.
     * @param path Can be in the form of `driver:path` or `path`
     * @returns A promise that resolves to an `IVfsDriverResult` containing the file contents
     */
    readFile(path: string): Promise<IVfsDriverResult<FileContents>>;

    /**
     * Writes a file asynchronously and returns the result.
     * If specific driver is not specified, the default driver is used.
     * @param path Can be in the form of `driver:path` or `path`
     * @param contents The contents to write to the file
     * @returns A promise that resolves to an `IVfsDriverResult` containing the file metadata
     */
    writeFile(path: string, contents: FileContents): Promise<IVfsDriverResult<FileMetadata>>;

    /**
     * Deletes a file asynchronously and returns the result.
     * If specific driver is not specified, the default driver is used.
     * @param path Can be in the form of `driver:path` or `path`
     * @returns A promise that resolves to an `IVfsDriverResult` containing the file metadata
     */
    deleteFile(path: string): Promise<IVfsDriverResult<void>>;

    /**
     * Lists the contents of a directory asynchronously and returns the result.
     * If specific driver is not specified, the default driver is used.
     * @param path Can be in the form of `driver:path` or `path`
     * @returns A promise that resolves to an `IVfsDriverResult` containing the directory contents
     */
    listDirectory(path: string): Promise<IVfsDriverResult<DirectoryContents>>;
    
    /**
     * Creates a directory asynchronously and returns the result.
     * If specific driver is not specified, the default driver is used.
     * @param path Can be in the form of `driver:path` or `path`
     * @returns A promise that resolves to an `IVfsDriverResult` containing the directory metadata
     */
    createDirectory(path: string): Promise<IVfsDriverResult<DirectoryMetadata>>;

    /**
     * Deletes a directory asynchronously and returns the result.
     * If specific driver is not specified, the default driver is used.
     * @param path Can be in the form of `driver:path` or `path`
     * @returns A promise that resolves to an `IVfsDriverResult` containing the directory metadata
     */
    deleteDirectory(path: string): Promise<IVfsDriverResult<void>>;
    
    
    /**
     * Sets permissions on files or directories asynchronously and returns the result.
     * If specific driver is not specified, the default driver is used.
     * @param path Can be in the form of `driver:path` or `path`
     * @param permissions The permissions to set on the file or directory
     * @returns A promise that resolves to an `IVfsDriverResult` containing the result of setting the permissions
     */
    setPermissions(path: string, permissions: number): Promise<IVfsDriverResult<void>>;

    /**
     * Gets permissions on files or directories asynchronously and returns the result.
     * If specific driver is not specified, the default driver is used.
     * @param path Can be in the form of `driver:path` or `path`
     * @returns A promise that resolves to an `IVfsDriverResult` containing the permissions of the file or directory
     */
    getPermissions(path: string): Promise<IVfsDriverResult<number>>;
}

/**
 * Interface for the result of a virtual file system driver operation.
 * @typeparam T The type of data returned by the operation
 */
export interface IVfsDriverResult<T> {
    /**
     * The data returned by the operation.
     */
    data?: T;

    /**
     * The error, if any, that occurred during the operation.
     */
    error?: Error;
}