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

import * as fs from 'fs';
import * as path from 'path';

import { DirectoryContents, DirectoryMetadata, FileContents, FileMetadata, IVfsDriverResult, IVfsDriver } from "@acte-de-presence/vfs";

export class LocalVfsDriver implements IVfsDriver {
    

    constructor(
        private readonly rootFolder: string,
    ) {
    }

    private getAbsolutePath(filePath: string): string {
        return path.join(this.rootFolder, filePath);
    }

    async readFile(filePath: string): Promise<IVfsDriverResult<FileContents>> {
        const absolutePath = this.getAbsolutePath(filePath);
        try {
            const contents = await fs.promises.readFile(absolutePath, 'utf8');
            return { data: contents };
        } catch (error) {
            return { error: error as Error };
        }
    }

    async writeFile(filePath: string, contents: FileContents): Promise<IVfsDriverResult<FileMetadata>> {
        const absolutePath = this.getAbsolutePath(filePath);
        try {
            await fs.promises.writeFile(absolutePath, contents, 'utf8');
            const stats = await fs.promises.stat(absolutePath);
            return { data: { path: filePath, size: stats.size, createdAt: stats.ctime, modifiedAt: stats.mtime } };
        } catch (error) {
            return { error: error as Error };
        }
    }

    async deleteFile(filePath: string): Promise<IVfsDriverResult<void>> {
        const absolutePath = this.getAbsolutePath(filePath);
        try {
            const stats = await fs.promises.stat(absolutePath);
            await fs.promises.unlink(absolutePath);
            return {};
        } catch (error) {
            return { error: error as Error };
        }
    }

    async listDirectory(directoryPath: string): Promise<IVfsDriverResult<DirectoryContents>> {
        const absolutePath = this.getAbsolutePath(directoryPath);
        try {
            const entries = await fs.promises.readdir(absolutePath, { withFileTypes: true });
            const contents: DirectoryContents = {
                files: [],
                directories: [],
                isEmpty: true,
            };
            for (const entry of entries) {
                if (contents.isEmpty) {
                    contents.isEmpty = false;
                }

                const entryPath = path.join(directoryPath, entry.name);
                if (entry.isFile()) {
                    const stats = await fs.promises.stat(this.getAbsolutePath(entryPath));
                    contents.files.push({ path: entryPath, size: stats.size, createdAt: new Date(stats.ctime), modifiedAt: new Date(stats.mtime) });
                } else if (entry.isDirectory()) {
                    const stats = await fs.promises.stat(this.getAbsolutePath(entryPath));
                    contents.directories.push({ path: entryPath, createdAt: stats.ctime, updatedAt: stats.mtime, permissions: stats.mode });
                }
            }
            return { data: contents };
        } catch (error) {
            return { error: error as Error };
        }
    }

    async createDirectory(directoryPath: string): Promise<IVfsDriverResult<DirectoryMetadata>> {
        const absolutePath = this.getAbsolutePath(directoryPath);
        try {
            await fs.promises.mkdir(absolutePath, { recursive: true });
            const stats = await fs.promises.stat(absolutePath);
            return { data: { path: directoryPath, createdAt: stats.ctime, updatedAt: stats.mtime, permissions: stats.mode } };
        } catch (error) {
            return { error: error as Error };
        }
    }

    async deleteDirectory(directoryPath: string): Promise<IVfsDriverResult<void>> {
        const absolutePath = this.getAbsolutePath(directoryPath);
        try {
            const stats = await fs.promises.stat(absolutePath);
            await fs.promises.rmdir(absolutePath, { recursive: true });
            return {};
        } catch (error) {
            return { error: error as Error };
        }
    }

    async setPermissions(filePath: string, permissions: number): Promise<IVfsDriverResult<void>> {
        const absolutePath = this.getAbsolutePath(filePath);
        try {
            await fs.promises.chmod(absolutePath, permissions);
            return { data: undefined };
        } catch (error) {
            return { error: error as Error };
        }
    }

    async getPermissions(filePath: string): Promise<IVfsDriverResult<number>> {
        const absolutePath = this.getAbsolutePath(filePath);
        try {
            const stats = await fs.promises.stat(absolutePath);
            return { data: stats.mode & parseInt('777', 8)};
        } catch (error) {
            return { error: error as Error };
        }
    }
    
}