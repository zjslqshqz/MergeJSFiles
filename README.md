# MergeJSFiles

一个简单的合并 js 文件工具，本工具根据输入路径，扫描路径下的所有js文件，简单压缩,根据最大字节，并合成一个或多个目标文件，并根据目标内容计算哈希值并重命名。

## 配置说明

查看 `MJSFOptions.template.json` 配置模版,共分三个部分：
1. `options` 配置项，包括：
   1. `directoryToScan` 扫描目录
   2. `output` 输出目录
      1. `prefix` 输出文件的前缀
      2. `suffix` 输出文件的后缀
      3. `writeBootFile` 是否写入引导文件
      4. `bootFileAddress` 引导文件地址
      5. `scriptTagSrcPrefixDir` js 标签的 src 属性前缀
   3. `maxFileSize` 单个文件最大字节
2. `globOptions` glob 配置项，
3. `minifyOptions` minify 配置项