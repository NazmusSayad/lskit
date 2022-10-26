export interface Config {
    excludeFolder: string[];
    filter: RegExp | Function | false;
    maxSize: number;
    minSize: number;
    relative: boolean;
    separator: string | false;
    prefix: string;
    suffix: string;
}
export declare const configDefault: Config;
export interface Worker {
    config: Config;
    output: string[];
    targetDir: string;
    rootDir: string;
    content: string;
    stats: {} | any;
    read: Function;
}
