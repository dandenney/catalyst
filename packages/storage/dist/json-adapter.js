"use strict";
/**
 * JSON file storage adapter implementation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonStorageAdapter = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
class JsonStorageAdapter {
    constructor(options) {
        this.dataDir = options.dataDir;
    }
    getFilePath(slug) {
        return (0, path_1.join)(this.dataDir, `${slug}.json`);
    }
    async getPage(slug) {
        try {
            const filePath = this.getFilePath(slug);
            const data = await fs_1.promises.readFile(filePath, 'utf-8');
            return JSON.parse(data);
        }
        catch (error) {
            if (error.code === 'ENOENT') {
                return null;
            }
            throw error;
        }
    }
    async savePage(page) {
        // Ensure data directory exists
        await fs_1.promises.mkdir(this.dataDir, { recursive: true });
        const filePath = this.getFilePath(page.slug);
        await fs_1.promises.writeFile(filePath, JSON.stringify(page, null, 2), 'utf-8');
    }
    async listPages() {
        try {
            const files = await fs_1.promises.readdir(this.dataDir);
            const jsonFiles = files.filter(f => f.endsWith('.json'));
            const pages = await Promise.all(jsonFiles.map(async (file) => {
                const data = await fs_1.promises.readFile((0, path_1.join)(this.dataDir, file), 'utf-8');
                return JSON.parse(data);
            }));
            return pages;
        }
        catch (error) {
            if (error.code === 'ENOENT') {
                return [];
            }
            throw error;
        }
    }
}
exports.JsonStorageAdapter = JsonStorageAdapter;
