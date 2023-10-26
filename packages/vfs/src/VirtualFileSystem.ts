import { DirectoryContents, FileContents, FileMetadata } from "./FileSystemTypes";
import { IVfsDriver } from "./IVfsDriver";
import { IVirtualFileSystem } from "./IVirtualFileSystem";

/**
 * Implementation of a virtual file system.
 */
export class VirtualFileSystem implements IVirtualFileSystem {
    private drivers: Map<string, IVfsDriver> = new Map();

    /**
     * Registers a virtual file system driver.
     * @param driver The driver to register
     * @param name The name of the driver
     */
    public registerDriver(driver: IVfsDriver, name: string): void {
        this.drivers.set(name, driver);
    }

    /**
     * Reads a file asynchronously and returns the result.
     * @param path The path of the file to read
     * @returns A promise that resolves to the file contents
     */
    public async readFile(path: string): Promise<FileContents> {
        const { driver, filePath } = this.getDriverAndPath(path);
        const result = await driver.readFile(filePath);
        if (result.error) {     
            throw result.error;
        }
        return result.data || '';
    }

    /**
     * Writes a file asynchronously and returns the result.
     * @param path The path of the file to write
     * @param contents The contents to write to the file
     * @returns A promise that resolves to the file metadata
     */
    public async writeFile(path: string, contents: FileContents): Promise<FileMetadata> {
        const { driver, filePath } = this.getDriverAndPath(path);
        const result = await driver.writeFile(filePath, contents);
        if (result.error) {
            throw result.error;
        }
        return result.data!;
    }

    /**
     * Copies a file asynchronously and returns the result.
     * @param sourcePath The path of the file to copy
     * @param destinationPath The path of the destination file
     * @returns A promise that resolves to the file metadata
     */
    public async copyFile(sourcePath: string, destinationPath: string): Promise<FileMetadata> {
        const contents = await this.readFile(sourcePath);
        return await this.writeFile(destinationPath, contents);
    }

    /**
     * Deletes a file asynchronously and returns the result.
     * @param path The path of the file to delete
     * @returns A promise that resolves to the file metadata
     */
    public async deleteFile(path: string): Promise<void> {
        const { driver, filePath } = this.getDriverAndPath(path);
        const result = await driver.deleteFile(filePath);
        if (result.error) {
            throw result.error;
        }
        return result.data!;
    }

    /**
     * Creates a directory asynchronously and returns the result.
     * @param path The path of the directory to create
     * @returns A promise that resolves when the directory is created
     */
    public async createDirectory(path: string): Promise<void> {
        const { driver, filePath } = this.getDriverAndPath(path);
        const result = await driver.createDirectory(filePath);
        if (result.error) {
            throw result.error;
        }
    }

    /**
     * Deletes a directory asynchronously and returns the result.
     * @param path The path of the directory to delete
     * @returns A promise that resolves when the directory is deleted
     */
    public async deleteDirectory(path: string): Promise<void> {
        const { driver, filePath } = this.getDriverAndPath(path);
        const result = await driver.deleteDirectory(filePath);
        if (result.error) {
            throw result.error;
        }
    }

    /**
     * Lists a directory asynchronously and returns the result.
     * @param path The path of the directory to list
     * @returns A promise that resolves to the directory contents
     */
    public async listDirectory(path: string): Promise<DirectoryContents> {
        const { driver, filePath } = this.getDriverAndPath(path);
        const result = await driver.listDirectory(filePath);
        if (result.error) {
            throw result.error;
        }
        return result.data!;
    }

    /**
     * Sets permissions on files or directories asynchronously and returns the result.
     * @param path The path of the file or directory to set permissions on
     * @param permissions The permissions to set on the file or directory
     * @returns A promise that resolves when the permissions are set
     */
    public async setPermissions(path: string, permissions: number): Promise<void> {
        const { driver, filePath } = this.getDriverAndPath(path);
        const result = await driver.setPermissions(filePath, permissions);
        if (result.error) {
            throw result.error;
        }
    }

    /**
     * Gets permissions on files or directories asynchronously and returns the result.
     * @param path The path of the file or directory to get permissions for
     * @returns A promise that resolves to the permissions of the file or directory
     */
    public async getPermissions(path: string): Promise<number> {
        const { driver, filePath } = this.getDriverAndPath(path);
        const result = await driver.getPermissions(filePath);
        if (result.error) {
            throw result.error;
        }
        return result.data!;
    }

    /**
     * Gets the driver and path for a given path.
     * @param path The path to get the driver and path for
     * @returns An object containing the driver and path
     */
    private getDriverAndPath(path: string): { driver: IVfsDriver, filePath: string } {
        const [driverName, filePath] = path.split(':');
        const driver = this.drivers.get(driverName) || this.drivers.get('default');
        if (!driver) {
            throw new Error(`No driver found for ${path}`);
        }
        return { driver, filePath };
    }
}