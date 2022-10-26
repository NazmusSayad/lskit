import * as types from './types.js';
declare class GetFiles {
    #private;
    sync(targetDir: string, config: types.Config): string[];
    async(targetDir: string, config: types.Config): Promise<string[]>;
}
declare const _default: GetFiles;
export default _default;
