#!/usr/bin/env node
const path = require("path");
const yargs = require('yargs');
const {readFileSync,existsSync} = require("fs");
const args = process.argv.slice(2);
const MJSF = require(path.join('..','index'));

if (args.length === 0) {
    console.error('请指定配置文件路径。');
    process.exit(1);
}

const argv = yargs.option('mjsf', {
    alias: 'mjsf',
    type: 'string',
    description: '配置文件路径',
}).argv;

const mjsfOptionsPath = path.normalize(argv.mjsf);

if (!existsSync(mjsfOptionsPath)){
    console.error('mjsfOptionsPath 配置文件:',mjsfOptionsPath,'不存在')
    process.exit(1);
}

MJSF(JSON.parse(readFileSync(mjsfOptionsPath).toString()));