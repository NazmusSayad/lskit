var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _GetFiles_instances, _GetFiles_worker;
import fs from 'fs';
import path from 'path';
import * as types from './types.js';
class GetFiles {
    constructor() {
        _GetFiles_instances.add(this);
    }
    sync(targetDir, config) {
        const output = [];
        const read = (rootDir) => {
            const files = fs.readdirSync(rootDir);
            files.forEach((content) => {
                const stats = fs.lstatSync(path.join(rootDir, content));
                const newDir = __classPrivateFieldGet(this, _GetFiles_instances, "m", _GetFiles_worker).call(this, {
                    targetDir,
                    config,
                    read,
                    output,
                    rootDir,
                    content,
                    stats,
                });
                newDir && read(newDir);
            });
        };
        read(targetDir);
        return output;
    }
    async(targetDir, config) {
        return __awaiter(this, void 0, void 0, function* () {
            const output = [];
            const read = (rootDir) => __awaiter(this, void 0, void 0, function* () {
                const files = yield fs.promises.readdir(rootDir);
                for (let content of files) {
                    const stats = yield fs.promises.lstat(path.join(rootDir, content));
                    const newDir = __classPrivateFieldGet(this, _GetFiles_instances, "m", _GetFiles_worker).call(this, {
                        targetDir,
                        config,
                        read,
                        output,
                        rootDir,
                        content,
                        stats,
                    });
                    newDir && (yield read(newDir));
                }
            });
            yield read(targetDir);
            return output;
        });
    }
}
_GetFiles_instances = new WeakSet(), _GetFiles_worker = function _GetFiles_worker({ targetDir, config, output, rootDir, content, stats, }) {
    config = Object.assign(Object.assign({}, types.configDefault), config);
    if (stats.isDirectory()) {
        if (config.excludeFolder.includes(content))
            return;
        return path.join(rootDir, content);
    }
    const fullPath = path.join(rootDir, content);
    const relativePath = path.relative(targetDir, fullPath);
    let filePath = config.relative ? relativePath : fullPath;
    if (stats.size > config.maxSize || stats.size < config.minSize)
        return;
    if (config.filter instanceof RegExp && !config.filter.test(filePath))
        return;
    if (config.filter instanceof Function &&
        !config.filter(path.parse(fullPath), relativePath, fullPath)) {
        return;
    }
    if (config.separator) {
        filePath = filePath.replace(/\/|\\/gim, config.separator);
    }
    output.push(config.prefix + filePath + config.suffix);
};
export default new GetFiles();
