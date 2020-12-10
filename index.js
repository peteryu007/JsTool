const split = require("./splitFile.js");


let argv = require('yargs')

.option('filename', {
    alias : 'f',
    demand: true,
    describe: '被切割的大日志文件',
    type: 'string'
  })
  .option('maxSize', {
    alias : 'm',
    default: 50,
    describe: '分割文件大小(MB)',
    type: 'number'
  })
  .option('destPath', {
    alias : 'd',
    default: '',
    describe: '目标路径',
    type: 'string'
  })
  .usage('切割大文本文件成一群小的文本文件')
  .example("node index.js -f=D:\\big.txt -m=30 -d=d:\\")
.argv;

split.splitFile(argv.filename,argv.destPath,argv.maxSize);