# MergeJSFiles

[![npm](https://img.shields.io/node/v-lts/mergejsfiles)](https://www.npmjs.com/package/mergejsfiles)
[![npm](https://img.shields.io/npm/v/mergejsfiles)](https://www.npmjs.com/package/mergejsfiles)
[![npm](https://img.shields.io/npm/dw/mergejsfiles)](https://www.npmjs.com/package/mergejsfiles)

一个简单的合并 js 文件工具，本工具根据输入路径，扫描路径下的所有js文件，简单压缩,根据最大字节，并合成一个或多个目标文件，并根据目标内容计算哈希值并重命名。

## 配置说明

查看 `MJSFOptions.template.json` 配置模版,共分三个部分：
1. `options` 配置项，包括：
   ```json5
   {
      "options": {
         "output": { // 输出相关配置
            "dir": ["example","dist"], // 输出目录
            "prefix": "main", // 合并文件前缀
            "suffix": "min.js", // 后缀
            "writeBootFile": true, // 是否写入引导文件 比如 php
            "bootFileAddress": ["example","dist","index.php"], // 引导文件地址
            "scriptTagSrcPrefixDir": ["/","example"] // js src 地址前缀
         },
         "maxFileSize": 102400 // 合并文件最小字节
      }
   }
   ```
2. `globOptions` glob 配置项，
   ```json5
   {
      "globOptions": {
         "pattern": ["js/**/*.js",["ext","**","*.js"]], // 支持数组地址，通过 node path 库自动拼接
         "options": {
            "cwd": ["example"], // 工作目录，默认脚本执行当前目录
            "ignore": "", // 忽略文件
            "nodir": true
         }
      }
   }
   ```
3. `minifyOptions` minify 配置项