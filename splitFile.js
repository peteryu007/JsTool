
const fs = require("fs");
const path = require("path");


/**
 * 切割大文件,用于日志文件实在太大了，notepad打不开(客户服务器只有notepad)
 * 
 * @param {需要被切割大文件名} fileName 
 * @param {生成文件目标路径，默认和fileName同路径} destFilePath 
 * @param {切割文件大小，单位MB} maxSize 
 */

function splitFile(fileName,destFilePath='',maxSize=50){
    
        const upperLimit = 1024*1024*maxSize;//50M
        console.log(upperLimit);
        let sourcePathParsed =  path.parse(fileName);
        let adjustDestFilePath = destFilePath==''?sourcePathParsed.dir:destFilePath;
        let destFileNamePrefix = `${adjustDestFilePath}\\${sourcePathParsed.name}.`;
        let destFileNameExt = sourcePathParsed.ext;


        let destFileNo = 0;
        let destFileName = '';
        let destFile = null;
        let totalSize = 0;


        // 创建可读流
        var readerStream = fs.createReadStream(fileName);

        // 设置编码为 utf8。
        readerStream.setEncoding('UTF8');
        let startDate = new Date();

        console.log(`startTime ${startDate}`);
        let chunkLength = upperLimit;
        // 处理流事件 --> data, end, and error
        readerStream.on('data', function(chunk) {
            
            chunkLength +=chunk.length;

            if (chunkLength>upperLimit)
            {
                chunkLength = 0;
                destFileNo ++;
                if (destFile)
                    fs.close(destFile,()=>{});

                destFileName = destFileNamePrefix + destFileNo.toString()+ destFileNameExt;
                destFile = fs.openSync(destFileName,'w');
                console.log(`新建文件${destFileName},pos ${totalSize}`);
            }
            
            totalSize += chunk.length;
            fs.writeSync(destFile,chunk);
        });

        readerStream.on('end',function(){
            fs.closeSync(destFile);
        let endDate = new Date();
        console.log(`finish Time ${endDate}`);
        console.log(`程序执行完毕,用时${(endDate-startDate)/1000}s,文件字节${totalSize}`);
        
        
        });

        readerStream.on('error', function(err){
        console.log(err.stack);
        });
}

exports.splitFile = splitFile;