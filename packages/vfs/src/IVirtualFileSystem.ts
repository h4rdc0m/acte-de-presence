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

/**
 * Interface for a virtual file system.
 */
export interface IVirtualFileSystem {
    /**
     * Registers a virtual file system driver.
     * @param driver The driver to register
     * @param name The name of the driver
     */
    registerDriver(driver: IVfsDriver, name: string): void;

    /**
     * Reads a file asynchronously and returns the result.
     * @param path The path of the file to read
     * @returns A promise that resolves to the file contents
     */
    readFile(path: string): Promise<FileContents>;

    /**
     * Writes a file asynchronously and returns the result.
     * @param path The path of the file to write
     * @param contents The contents to write to the file
     * @returns A promise that resolves to the file metadata
     */
    writeFile(path: string, contents: FileContents): Promise<FileMetadata>;

    /**
     * Copies a file asynchronously and returns the result.
     * @param sourcePath The path of the file to copy
     * @param destinationPath The path of the destination file
     * @returns A promise that resolves to the file metadata
     */
    copyFile(sourcePath: string, destinationPath: string): Promise<FileMetadata>;

    /**
     * Deletes a file asynchronously and returns the result.
     * @param path The path of the file to delete
     * @returns A promise that resolves to the file metadata
     */
    deleteFile(path: string): Promise<FileMetadata>;

    /**
     * Creates a directory asynchronously and returns the result.
     * @param path The path of the directory to create
     * @returns A promise that resolves when the directory is created
     */
    createDirectory(path: string): Promise<void>;

    /**
     * Deletes a directory asynchronously and returns the result.
     * @param path The path of the directory to delete
     * @returns A promise that resolves when the directory is deleted
     */
    deleteDirectory(path: string): Promise<void>;

    /**
     * Lists a directory asynchronously and returns the result.
     * @param path The path of the directory to list
     * @returns A promise that resolves to the directory contents
     */
    listDirectory(path: string): Promise<DirectorySpec>;

    /**
     * Sets permissions on files or directories asynchronously and returns the result.
     * @param path The path of the file or directory to set permissions on
     * @param permissions The permissions to set on the file or directory
     * @returns A promise that resolves when the permissions are set
     */
    setPermissions(path: string, permissions: number): Promise<void>;

    /**
     * Gets permissions on files or directories asynchronously and returns the result.
     * @param path The path of the file or directory to get permissions for
     * @returns A promise that resolves to the permissions of the file or directory
     */
    getPermissions(path: string): Promise<number>;
}