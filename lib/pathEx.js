

var path=require('path');   
/**
 * 修改文件扩展名（不是真改文件，只是处理字符串)
 * @param {string} fileName 原文件名
 * @param {string} newExtName 修改文件扩展名
 * 返回修改后的文件名
 */
exports.reExtName = function (fileName,newExtName)
{
    if (!newExtName.startsWith("."))
        newExtName = "." + newExtName
    var parsed = path.parse(fileName);
    return `${parsed.dir}\\${parsed.name}${newExtName}`;
}

exports.fileNameOnly = function (fileName)
{
    var parsed = path.parse(fileName);
    return `${parsed.name}${parsed.ext}`;
}
