const yargs = require('yargs');
const {readFileSync,existsSync} = require("fs");
const args = process.argv.slice(2);

if (args.length === 0) {
    console.error('请指定配置文件路径。');
    process.exit(1);
}