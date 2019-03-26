
var xpath = require('xpath');
var dom = require('xmldom').DOMParser;
var fs = require('fs');
var path=require('path');

/**
 * 分析cs的csproj文件（xml格式）
*/
class ProjectFileAnalyzer
{
    /**
     * 
     * @param {DOMParser} xmlDoc 
     */

    constructor(xmlDoc) {
        this._xmlDoc = xmlDoc; 
        this._selectRoot 
                = xpath.useNamespaces({"u":"http://schemas.microsoft.com/developer/msbuild/2003"});
        
    }
    /**
     * 获得引用dll的文件名
     * @param {string} nodeType 节点名
     */
    GetDllFiles(nodeType = "HintPath"){
        let referenceNodes = this._selectRoot(`//u:${nodeType}`,this._xmlDoc);
        
        let resultList =  
            referenceNodes.map(node=>node.firstChild.data);      
        
        return resultList;
    }
    /**
     * 获得cs的文件名
     * @param {string} nodeType 节点名
     */
    GetCSFiles(nodeType = "Compile"){   

        let referenceNodes =  this._selectRoot(`//u:${nodeType}`,this._xmlDoc);

        let resultList = referenceNodes
            .filter(node=>node.childNodes.length==0)
            .map(node=>node.getAttribute("Include"));  

        return resultList;
    }

      /**
     * 获得编译成dll的名字
     * @param {string} nodeType 节点名
     */
    GetAssemblyName(nodeType = "AssemblyName")
    {
        let referenceNode = this._selectRoot(`//u:${nodeType}`,this._xmlDoc);    
        return referenceNode[0].firstChild.data;
    }
}

function Main(fileName,binDir)
{

    let xml = fs.readFileSync(fileName, 'utf8');
    let xmlDoc = new dom().parseFromString(xml);
    let analyzer = new ProjectFileAnalyzer(xmlDoc);

    let dllFileNames = analyzer.GetDllFiles();
    let csFiles =  analyzer.GetCSFiles();
    let assemblyName = analyzer.GetAssemblyName();

    let dirName = path.dirname(fileName);
    let batName = reExtName(fileName,"bat");
    //console.log(batName);
    fs.open(`${batName}`,"w",function(err, fd) {
        if (err) {
            return console.error(err);
        }
        fs.writeSync(fd,
`@echo off
set csc=%windir%\\Microsoft.NET\\Framework\\v4.0.30319\\csc.exe
set bin=${binDir}

%csc% /out:`
            );
            fs.writeSync(fd,assemblyName);
            fs.writeSync(fd,".dll");   
            fs.writeSync(fd," ^\r\n"); 

        csFiles
            .map(x=>`${x} ^\r\n`)
            .forEach(x=>fs.writeSync(fd,x));
        
        fs.writeSync(fd,"/r:");

        dllFileNames
            .map(x=>`%bin%${path.basename(x)},^\r\n`)
            .forEach(x=>{fs.writeSync(fd,x)});

        fs.writeSync(fd," /target:library /nologo  \r\n");    
        fs.writeSync(fd,"pause");
        fs.close(fd,()=>{});
        
    });
}

/**
 * 修改文件扩展名（不是真改文件，只是处理字符串)
 * @param {string} fileName 原文件名
 * @param {string} newExtName 修改文件扩展名
 * 返回修改后的文件名
 */
function reExtName  (fileName,newExtName)
{
    var parsed = path.parse(fileName);
    return `${parsed.dir}\\${parsed.name}.${newExtName}`;
}



let filename=process.argv[2];
let binDir = process.argv[3];x

if(filename ===undefined)
    console.error("input csproj file name");
else 
{
    
    Main(filename,binDir);
}