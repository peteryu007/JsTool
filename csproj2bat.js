
var dom = require('xmldom').DOMParser;
var fs = require('fs');
var path=require('path');
var lib=require("./lib/ProjectFileAnalyzer.mjs");
var util=require("./lib/pathEx.mjs");



function Main(fileName,binDir,options){

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
    //console.log(batName);
    fs.open(`${batName}`,"w",function(err, fd) {
        if (err) {
            return console.error(err);
        }
        fs.writeSync(fd,
`@echo off
set csc=%windir%\\Microsoft.NET\\Framework\\v4.0.30319\\csc.exe
set bin=${binDir}

%csc%  /target:library 
/out:`
            );
            fs.writeSync(fd,assemblyName);
            fs.writeSync(fd,".dll");   
            fs.writeSync(fd," ^\r\n"); 

        if (csFiles !=null)
        {
            csFiles
                .map(x=>`${x} ^\r\n`)
                .forEach(x=>fs.writeSync(fd,x));
        }

        fs.writeSync(fd,"/r:");

        dllFileNames
            .map(x=>`%bin%${path.basename(x)},^\r\n`)
            .forEach(x=>{fs.writeSync(fd,x)});

        fs.writeSync(fd," /nologo  \r\n");    
        fs.writeSync(fd,"pause");
        fs.close(fd,()=>{});
        
    });
}

class ToBatOption
{
    constructor(outputCs = true)
    {
        this.outputCs = outputCs;
    }
}

let filename=process.argv[2];
let binDir = process.argv[3];

let option =new ToBatOption(true);

if(filename ===undefined)
    console.error("input csproj file name");
else 
{    
    Main(filename,binDir,option);
}


