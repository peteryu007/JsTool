#!/usr/bin/env node

var dom = require('xmldom').DOMParser;
var fs = require('fs');
var path=require('path');
var lib=require("./lib/ProjectFileAnalyzer.js");
var util=require("./lib/pathEx.js");

let argv = require('yargs')

.option('filename', {
    alias : 'f',
    demand: true,
    describe: 'cs.proj fileName',
    type: 'string'
  })
  .option('binPath', {
    alias : 'b',
    demand: true,
    describe: 'reference dll path',
    type: 'string'
  })
  .usage('把vs的csproj 改成 bat文件用单csc.exe 编译')
  .example("cs2bat -f \"D:\\Project_All\\Gits\\v10_Branch\\V10.4.2\\WebService\\Web\\Penseesoft.WebService.Web.csproj\" -b d:\\bin\\")
.argv;


class ToBatOption
{
    constructor(outputCs = true)
    {
        this.outputCs = outputCs;
    }
}

let filename=argv.filename;
let binPath = argv.binPath;

let option =new ToBatOption(true);

if(filename ===undefined)
    console.error("input csproj file name");
else 
{    
    Main(filename,binPath,option);
}

function Main(fileName,binPath,options){

    let xml = fs.readFileSync(fileName, 'utf8');
    let xmlDoc = new dom().parseFromString(xml);
    let analyzer = new lib.ProjectFileAnalyzer(xmlDoc);

    let dllFileNames = analyzer.getDllFiles();
    let csFiles = null;
    if(options.outputCs)
    {
        csFiles =  analyzer.getCSFiles();
    }
    let assemblyName = analyzer.getAssemblyName();

    let batName = util.reExtName(fileName,"bat");
    
    let csFileNameString =        
        csFiles
            .join("^\\r\\n")
    //console.log(batName);
    fs.open(`${batName}`,"w",function(err, fd) {
        if (err) {
            return console.error(err);
        }
        //写Header语句
        fs.writeSync(fd,
`@echo off
set csc=%windir%\\\\Microsoft.NET\\\\Framework\\\\v4.0.30319\\\\csc.exe
set bin=${binPath}

%csc%  /target:library 
/out:${assemblyName}.dll ^
${csFileNameString}
`
            );

        //加载cs
        if (csFiles !=null)
        {
            csFiles
                .map(x=>`${x} ^\\r\\n`)
                .forEach(x=>fs.writeSync(fd,x));
        }

        fs.writeSync(fd,"/r:");

        //编译dll
        dllFileNames
            .map(x=>`%bin%${path.basename(x)},^\\r\\n`)
            .forEach(x=>{fs.writeSync(fd,x)});

        fs.writeSync(fd," /nologo  \\r\\n");    
        fs.writeSync(fd,"pause");
        fs.close(fd,()=>{});
        
    });
}



