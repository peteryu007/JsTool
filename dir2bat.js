#!/usr/bin/env node

const fs = require('fs');
const path=require('path');
let util=require("./lib/pathEx.js");


let argv = require('yargs')

.option('filename', {
    alias : 'f',
    demand: true,
    describe: '生成的文件名，不要含.dll',
    type: 'string'
  })
  .option('binPath', {
    alias : 'b',
    demand: true,
    describe: '引用dll文件所在路径',
    type: 'string'
  })
  .option('csFilePath', {
    alias : 'c',
    demand: true,
    describe: 'cs文件所在路径',
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

if(argv.filename ===undefined)
    console.error("input csproj file name");
else 
{    
    let option= new ToBatOption();

    Main(argv.filename,argv.csFilePath,argv.binPath,option);
}


function Main(fileName,csFilePath,binPath,options){


    if(!(csFilePath.endsWith("\\")||csFilePath.endsWith("/")))
        csFilePath += "\\"
    if(!(binPath.endsWith("\\")||binPath.endsWith("/")))
        binPath += "\\"

    let batName = util.reExtName(fileName,"bat");
    let outFileName = util.reExtName(fileName,"dll");
    let onlyOutFileName = util.fileNameOnly(outFileName);

    
    let csFiles = fs.readdirSync(csFilePath);
    let csFileNameString = 
            csFiles
            .filter(x=>x.endsWith(".cs"))
            .map(x=>`%cs%${x} `)
            .join("^\r\n")

     
    let dllFileNames = fs.readdirSync(binPath);
    let dllFileNameString = 
        dllFileNames
         .filter(x=>x.endsWith(".dll"))
         .filter(x=>x!=onlyOutFileName) // dll引用排除自己
         .map(x=>`${path.basename(x)}`)
         .join(',^\r\n')
         

    //console.log(batName);
    fs.open(`${batName}`,"w",function(err, fd) {
        if (err) {
            return console.error(err);
        }
        //写Header语句
        fs.writeSync(fd,
`@echo off
set csc=%windir%\\Microsoft.NET\\Framework\\v4.0.30319\\csc.exe
set cs=${csFilePath}

%csc%  /target:library  ^
/lib:${binPath} ^
/out:${outFileName} ^
${csFileNameString} ^
/r:${dllFileNameString} ^
/nologo 

pause
`
            );

   
        fs.close(fd,()=>{});
        
    });
}

