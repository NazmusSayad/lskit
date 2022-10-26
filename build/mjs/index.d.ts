import * as types from './types.js';
declare class GetFiles {
    #private;
    constructor({ fs: fsObj, path: pathObj }: {
        fs: {};
        path: {};
    });
    sync(targetDir: string, config: types.Config): string[];
    async(targetDir: string, config: types.Config): Promise<string[]>;
}
export default GetFiles;
