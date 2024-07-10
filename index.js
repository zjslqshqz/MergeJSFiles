const fs = require('fs');
const path = require('path');
const glob = require('glob');
const { minify } = require('terser');
const crypto = require('crypto');

module.exports = () => {

    const dir = ['VC', 'NewVersion', 'PC', 'Public', 'Common', 'JS', 'Directive'];
    const directoryToScan = path.join(...dir);
    const phpFilePath = path.join(...dir,'index.min.php');
    const outputDir = directoryToScan;
    const maxFileSize = 100 * 1024;
    const outputName = 'Directive';
    const outputStaff = 'min.js';

    const pattern = '**/*.js';
    const options = {
        cwd: directoryToScan,
        ignore: '**/*.min.js',
        nodir: true,
    };

    const minifyOptions = {
        compress: true,
        mangle: false,
        output: {
            comments: false,
            ascii_only: true,
        },
    }

    const files = glob.sync(pattern, options);
    if (files.length === 0){
        console.log('未找到 JavaScript 文件.');
        process.exit(1);
    }else {
        console.log(`共匹配到 ${files.length} 个 JavaScript 文件.`);
    }
    let currentOutput = '';
    let partIndex = 0;
    let currentSize = 0;

    if (!fs.existsSync(outputDir)) {
        console.log('已创建输出目录.')
        fs.mkdirSync(outputDir);
    }
    if (!fs.existsSync(phpFilePath)) {
        console.log('已创建 PHP 引导文件.')
        fs.writeFileSync(phpFilePath, '', { flag: 'wx' });
    }

    /**
     * 创建一个SHA256散列字符串
     *
     * 该函数使用crypto模块的createHash方法生成一个SHA256散列对象，并更新散列值
     * 以反映提供的内容。最后，它返回散列的前8个十六进制字符。
     *
     * @param {string} content - 需要进行散列处理的字符串内容
     * @returns {string} - 返回长度为8的SHA256散列字符串的前缀
     */
    const createHash = (content) => {
        // 创建一个SHA256散列对象
        const hash = crypto.createHash('sha256');
        // 更新散列对象的内容
        hash.update(content);
        // 返回散列值的前8个十六进制字符
        return hash.digest('hex').slice(0, 8);
    };


    const outputFilePaths = [];

    const generateScriptTag = (filePath) => {
        return `<script src="${filePath}"></script>`;
    };

    const getRelativeOutputFilePath = (filePath) => {
        return '/'+path.relative('../His/VC', filePath);
    };

    /**
     * 将当前的输出内容写入文件。
     * 该函数首先根据当前输出内容生成一个哈希值，以此来确保文件名的唯一性。然后，它将内容写入到指定的输出目录中，
     * 文件名由输出名、哈希值和输出格式组成。在写入文件后，函数会打印出文件成功写入的消息，并将文件路径添加到
     * 输出文件路径数组中，以便后续处理。
     */
    const writeFile = () => {
        // 根据当前输出内容生成哈希值，用于文件名的唯一性标识
        const hash = createHash(currentOutput);

        // 构建输出文件的完整路径，包括文件名和扩展名
        const outputFilePath = `${outputDir}/${outputName}-${hash}.${outputStaff}`;

        // 将当前输出内容写入到文件系统中指定的路径
        fs.writeFileSync(outputFilePath, currentOutput);

        // 打印出文件成功写入的消息，包括文件的完整路径
        console.log(`压缩文件： ${outputFilePath} 已写入.`);

        // 将输出文件的相对路径添加到数组中，供后续使用
        outputFilePaths.push(getRelativeOutputFilePath(outputFilePath));
    }


    (async () => {
        for (const file of files) {
            console.log('正在处理文件：',file);
            const filePath = path.join(directoryToScan, file);
            const content = fs.readFileSync(filePath, 'utf8');

            try {
                const result = await minify(content, minifyOptions);

                const resultSize = Buffer.byteLength(result.code, 'utf8');
                if (currentSize + resultSize > maxFileSize) {
                    writeFile(currentOutput)
                    partIndex++;
                    currentOutput = result.code + '\n'; // Start a new file
                    currentSize = resultSize;
                } else {
                    currentOutput += result.code + '\n';
                    currentSize += resultSize;
                }
            } catch (error) {
                console.error(`处理文件 ${filePath} 发生错误，文件地址：`, error);
            }
        }

        // Write remaining content
        currentOutput && writeFile(currentOutput);

        const scriptTags = outputFilePaths.map(filePath => generateScriptTag(filePath)).join('\n');
        fs.writeFileSync(phpFilePath, scriptTags);
        console.log(`PHP 引导文件 ${phpFilePath} 已更新。`);
    })();

}