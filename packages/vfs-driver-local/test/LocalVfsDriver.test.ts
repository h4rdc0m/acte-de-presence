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
import "reflect-metadata"

import { IVfsDriver } from "@acte-de-presence/vfs";
import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import * as fs from 'fs';
import * as path from 'path';
import '../src/LocalVfsDriver';
import { Injector, Scope, Token } from "@acte-de-presence/injector";
import { LocalVfsDriver } from "../src/LocalVfsDriver";

const rootFolder = path.join(import.meta.dir, 'test-folder');
// const LocalVfsDriverToken = Token.for<LocalVfsDriver>('LocalVfsDriver');
// Injector.register(LocalVfsDriverToken, LocalVfsDriver, Scope.Singleton, [rootFolder]);
const driver: IVfsDriver = new LocalVfsDriver(rootFolder);
describe('LocalVfsDriver', () => {
    beforeAll(async () => {
        await fs.promises.mkdir(rootFolder, { recursive: true });
    });

    afterAll(async () => {
        await fs.promises.rm(rootFolder, { recursive: true });
    });

    describe('readFile', () => {
        test('should read a file', async () => {
            const filePath = 'test-file.txt';
            const fileContents = 'Hello, world!';
            await fs.promises.writeFile(path.join(rootFolder, filePath), fileContents, 'utf8');
            const result = await driver.readFile(filePath);
            expect(result.data).toEqual(fileContents);
        });

        test('should return an error if the file does not exist', async () => {
            const filePath = 'non-existent-file.txt';
            const result = await driver.readFile(filePath);
            expect(result.error).toBeDefined();
        });
    });

    describe('writeFile', () => {
        test('should write a file', async () => {
            const filePath = 'test-file.txt';
            const fileContents = 'Hello, world!';
            const result = await driver.writeFile(filePath, fileContents);
            expect(result.data?.path).toEqual(filePath);
            expect(result.data?.size).toBeDefined();
            expect(result.data?.createdAt).toBeDefined();
            expect(result.data?.modifiedAt).toBeDefined();
            const readContents = await fs.promises.readFile(path.join(rootFolder, filePath), 'utf8');
            expect(readContents).toEqual(fileContents);
        });

        test('should return an error if the file cannot be written', async () => {
            const filePath = 'test-folder/test-file.txt';
            const fileContents = 'Hello, world!';
            const result = await driver.writeFile(filePath, fileContents);
            expect(result.error).toBeDefined();
        });
    });

    describe('deleteFile', () => {
        test('should delete a file', async () => {
            const filePath = 'test-file.txt';
            await fs.promises.writeFile(path.join(rootFolder, filePath), 'Hello, world!', 'utf8');
            const result = await driver.deleteFile(filePath);
            expect(result).toEqual({});
            const exists = await fs.promises.access(path.join(rootFolder, filePath), fs.constants.F_OK)
                .then(() => true)
                .catch(() => false);
            expect(exists).toBe(false);
        });

        test('should return an error if the file does not exist', async () => {
            const filePath = 'non-existent-file.txt';
            const result = await driver.deleteFile(filePath);
            expect(result.error).toBeDefined();
        });
    });

    describe('listDirectory', () => {
        test('should list the contents of a directory', async () => {
            const directoryPath = 'test-folder';
            const filePath = 'test-folder/test-file.txt';
            const fileContents = 'Hello, world!';
            await fs.promises.mkdir(path.join(rootFolder, directoryPath), { recursive: true });
            await fs.promises.mkdir(path.join(rootFolder, directoryPath, directoryPath), { recursive: true });
            await fs.promises.writeFile(path.join(rootFolder, filePath), fileContents, 'utf8');
            const result = await driver.listDirectory(directoryPath);
            expect(result.data?.isEmpty).toBe(false);
            expect(result.data?.files.map(f => f.path)).toContain(filePath);
            expect(result.data?.directories.map(d => d.path)).toContain(path.join(directoryPath,directoryPath));
        });

        test('should return an error if the directory does not exist', async () => {
            const directoryPath = 'non-existent-directory';
            const result = await driver.listDirectory(directoryPath);
            expect(result.error).toBeDefined();
        });
    });

    describe('createDirectory', () => {
        test('should create a directory', async () => {
            const directoryPath = 'test-folder/new-directory';
            const result = await driver.createDirectory(directoryPath);
            expect(result.data?.path).toEqual(directoryPath);
            expect(result.data?.createdAt).toBeDefined();
            expect(result.data?.updatedAt).toBeDefined();
            expect(result.data?.permissions).toBeDefined();
            const exists = await fs.promises.access(path.join(rootFolder, directoryPath), fs.constants.F_OK)
                .then(() => true)
                .catch(() => false);
            expect(exists).toBe(true);
        });

        test('should return an error if the directory cannot be created', async () => {
            const directoryPath = 'test-folder/test-file.txt/new-directory';
            const result = await driver.createDirectory(directoryPath);
            expect(result.error).toBeDefined();
        });
    });

    describe('deleteDirectory', () => {
        test('should delete a directory', async () => {
            const directoryPath = 'test-folder/new-directory';
            await fs.promises.mkdir(path.join(rootFolder, directoryPath), { recursive: true });
            const result = await driver.deleteDirectory(directoryPath);
            expect(result).toEqual({});
            const exists = await fs.promises.access(path.join(rootFolder, directoryPath), fs.constants.F_OK)
                .then(() => true)
                .catch(() => false);
            expect(exists).toBe(false);
        });

        test('should return an error if the directory does not exist', async () => {
            const directoryPath = 'non-existent-directory';
            const result = await driver.deleteDirectory(directoryPath);
            expect(result.error).toBeDefined();
        });
    });

    describe('setPermissions', () => {
        test('should set the permissions of a file', async () => {
            const filePath = 'test-file.txt';
            await fs.promises.writeFile(path.join(rootFolder, filePath), 'Hello, world!', 'utf8');
            const result = await driver.setPermissions(filePath, 0o666);
            expect(result.data).toBeUndefined();
            const stats = await fs.promises.stat(path.join(rootFolder, filePath));
            expect(stats.mode & parseInt('777',8)).toBe(0o666);
        });

        test('should return an error if the file does not exist', async () => {
            const filePath = 'non-existent-file.txt';
            const result = await driver.setPermissions(filePath, 0o666);
            expect(result.error).toBeDefined();
        });
    });

    describe('getPermissions', () => {
        test('should get the permissions of a file', async () => {
            const filePath = 'test-file.txt';
            await fs.promises.writeFile(path.join(rootFolder, filePath), 'Hello, world!', { encoding: 'utf8' });
            await fs.promises.chmod(path.join(rootFolder, filePath), 0o666);
            const result = await driver.getPermissions(filePath);
            expect(result.data).toBe(0o666);
        });

        test('should return an error if the file does not exist', async () => {
            const filePath = 'non-existent-file.txt';
            const result = await driver.getPermissions(filePath);
            expect(result.error).toBeDefined();
        });
    });
});

