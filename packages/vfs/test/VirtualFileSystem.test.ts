import { expect, test, describe, beforeEach, mock } from "bun:test";
import { DirectoryContents, DirectoryMetadata, FileContents, FileMetadata, IVfsDriver, IVfsDriverResult, VirtualFileSystem } from "../src";

const date = new Date();

const readFileFn = mock((filePath: string): Promise<IVfsDriverResult<FileContents>> => {
    if (filePath === '/path/to/notexists') {
        return Promise.reject({ error: Error('test') });
    }
    return Promise.resolve({ data: 'test' })
});
const writeFileFn = mock((filePath: string): Promise<IVfsDriverResult<FileMetadata>> => {
    if (filePath === '/path/to/notexists') {
        return Promise.reject({ error: Error('test') });
    }
    return Promise.resolve({ data: { path: filePath, size: 1, createdAt: date, modifiedAt: date, } })
});
const deleteFileFn = mock((filePath: string): Promise<IVfsDriverResult<void>> => Promise.resolve({}));
const listDirectoryFn = mock((directoryPath: string): Promise<IVfsDriverResult<DirectoryContents>> => Promise.resolve({ data: { files: [], directories: [], isEmpty: true } }));
const createDirectoryFn = mock((directoryPath: string): Promise<IVfsDriverResult<DirectoryMetadata>> => Promise.resolve({ data: { path: directoryPath, createdAt: date, updatedAt: date, permissions: 1 } }));
const deleteDirectoryFn = mock((directoryPath: string): Promise<IVfsDriverResult<void>> => Promise.resolve({}));
const setPermissionsFn = mock((path: string, permissions: number): Promise<IVfsDriverResult<void>> => Promise.resolve({}));
const getPermissinsFn = mock((path: string): Promise<IVfsDriverResult<number>> => Promise.resolve({ data: 1 }));

const testDriver: IVfsDriver = {
    readFile: readFileFn,
    writeFile: writeFileFn,
    deleteFile: deleteFileFn,
    listDirectory: listDirectoryFn,
    createDirectory: createDirectoryFn,
    deleteDirectory: deleteDirectoryFn,
    setPermissions: setPermissionsFn,
    getPermissions: getPermissinsFn,
};




describe('VirtualFileSystem', () => {
    let vfs: VirtualFileSystem;

    beforeEach(() => {
        vfs = new VirtualFileSystem();
    });

    describe('registerDriver', () => {
        test('should register a driver', () => {
            vfs.registerDriver(testDriver, 'test');
            expect(vfs['drivers'].get('test')).toBe(testDriver);
        });
    });

    describe('readFile', () => {
        test('should read a file', async () => {
            vfs.registerDriver(testDriver, 'test');
            const result = await vfs.readFile('test:/path/to/file');
            expect(result).toBe('test');
            expect(testDriver.readFile).toHaveBeenCalled();
        });

        test('should throw an error if the driver returns an error', async () => {
            vfs.registerDriver(testDriver, 'test');
            await expect(vfs.readFile('test:/path/to/notexists')).rejects.toEqual({ error: Error('test') });
        });

        
        test('should throw an error if the driver is not found', async () => {
            expect(vfs.readFile('test:/path/to/file')).rejects.toEqual(Error('No driver found for test:/path/to/file'));
            // await expect(vfs.readFile('test:/path/to/file')).rejects.toEqual({error: Error('No driver found for test:/path/to/file')});
        });
    });

    describe('writeFile', () => {
        test('should write a file', async () => {

            vfs.registerDriver(testDriver, 'test');
            const result = await vfs.writeFile('test:/path/to/file', 'test');
            expect(result).toEqual({
                path: '/path/to/file',
                size: 1,
                createdAt: date,
                modifiedAt: date,
            });
            expect(testDriver.writeFile).toHaveBeenCalled();
        });

        test('should throw an error if the driver returns an error', async () => {
            vfs.registerDriver(testDriver, 'test');
            await expect(vfs.writeFile('test:/path/to/notexists', 'test')).rejects.toEqual({ error: Error('test') });
        });
    });

    describe('copyFile', () => {
        test('should copy a file', async () => {
            vfs.registerDriver(testDriver, 'test');
            const result = await vfs.copyFile('test:/path/to/source', 'test:/path/to/destination');
            expect(result).toEqual({
                path: '/path/to/destination',
                size: 1,
                createdAt: date,
                modifiedAt: date,
            });
            expect(testDriver.readFile).toHaveBeenCalled();
            expect(testDriver.writeFile).toHaveBeenCalled();
        });
    });

    describe('deleteFile', () => {
        test('should delete a file', async () => {
            vfs.registerDriver(testDriver, 'test');
            const result = await vfs.deleteFile('test:/path/to/file');
            expect(result).resolves;
            expect(testDriver.deleteFile).toHaveBeenCalled();
        });
    });

    describe('createDirectory', () => {
        test('should create a directory', async () => {
            vfs.registerDriver(testDriver, 'test');
            await vfs.createDirectory('test:/path/to/directory');
            expect(testDriver.createDirectory).toHaveBeenCalled();
        });
    });

    describe('deleteDirectory', () => {
        test('should delete a directory', async () => {
            vfs.registerDriver(testDriver, 'test');
            await vfs.deleteDirectory('test:/path/to/directory');
            expect(testDriver.deleteDirectory).toHaveBeenCalled();
        });
    });

    describe('listDirectory', () => {
        test('should list a directory', async () => {
            vfs.registerDriver(testDriver, 'test');
            const result = await vfs.listDirectory('test:/path/to/directory');
            expect(result).toEqual({
                files: [],
                directories: [],
                isEmpty: true,
            });
            expect(testDriver.listDirectory).toHaveBeenCalled();
        });
    });

    describe('setPermissions', () => {
        test('should set permissions on a file or directory', async () => {
            vfs.registerDriver(testDriver, 'test');
            await vfs.setPermissions('test:/path/to/file', 1);
            expect(testDriver.setPermissions).toHaveBeenCalled();
        });
    });

    describe('getPermissions', () => {
        test('should get permissions on a file or directory', async () => {
            vfs.registerDriver(testDriver, 'test');
            const result = await vfs.getPermissions('test:/path/to/file');
            expect(result).toBe(1);
            expect(testDriver.getPermissions).toHaveBeenCalled();
        });
    });
});
