import { DirectoryContents, FileContents, FileMetadata, IVfsDriver, IVirtualFileSystem } from "@acte-de-presence/vfs";
import { mock } from 'bun:test';
import { Injectable, Scope, Token } from "@acte-de-presence/injector";


@Injectable(Token.for<IVirtualFileSystem>('IVirtualFileSystem'), Scope.Singleton)
class MockVFS implements IVirtualFileSystem {
    registerDriver = mock((driver: IVfsDriver, name: string) => void {});

    readFile = mock(async (path: string): Promise<FileContents> => {
        if (path === 'non-existent-file.txt') {
            throw new Error('File not found');
        }
        return Promise.resolve('Hello, world!');
    });

    writeFile = mock(async (path: string, contents: FileContents): Promise<FileMetadata> => {
        if (path === 'non-existent-file.txt') {
            throw new Error('File not found');
        }
        return Promise.resolve({
            path,
            size: 0,
            createdAt: new Date(),
            modifiedAt: new Date()
        });
    });

    copyFile = mock(async (sourcePath: string, destinationPath: string): Promise<FileMetadata> => {
        throw new Error("Method not implemented.");
    });

    deleteFile = mock(async (path: string): Promise<void> => {
        throw new Error("Method not implemented.");
    });

    createDirectory = mock(async (path: string): Promise<void> => {
        throw new Error("Method not implemented.");
    });

    deleteDirectory = mock(async (path: string): Promise<void> => {
        throw new Error("Method not implemented.");
    });

    listDirectory = mock(async (path: string): Promise<DirectoryContents> => {
        throw new Error("Method not implemented.");
    });

    setPermissions = mock(async (path: string, permissions: number): Promise<void> => {
        throw new Error("Method not implemented.");
    });

    getPermissions = mock(async (path: string): Promise<number> => {
        throw new Error("Method not implemented.");
    });
}
