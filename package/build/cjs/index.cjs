"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _GetFiles_instances, _GetFiles_worker;
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const types = __importStar(require("./types.cjs"));
class GetFiles {
    constructor() {
        _GetFiles_instances.add(this);
    }
    sync(targetDir, config) {
        const output = [];
        const read = (rootDir) => {
            const files = fs_1.default.readdirSync(rootDir);
            files.forEach((content) => {
                const stats = fs_1.default.lstatSync(path_1.default.join(rootDir, content));
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
                const files = yield fs_1.default.promises.readdir(rootDir);
                for (let content of files) {
                    const stats = yield fs_1.default.promises.lstat(path_1.default.join(rootDir, content));
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
        return path_1.default.join(rootDir, content);
    }
    const fullPath = path_1.default.join(rootDir, content);
    const relativePath = path_1.default.relative(targetDir, fullPath);
    let filePath = config.relative ? relativePath : fullPath;
    if (stats.size > config.maxSize || stats.size < config.minSize)
        return;
    if (config.filter instanceof RegExp && !config.filter.test(filePath))
        return;
    if (config.filter instanceof Function &&
        !config.filter(path_1.default.parse(fullPath), relativePath, fullPath)) {
        return;
    }
    if (config.separator) {
        filePath = filePath.replace(/\/|\\/gim, config.separator);
    }
    output.push(config.prefix + filePath + config.suffix);
};
exports.default = new GetFiles();
