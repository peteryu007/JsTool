const fs = require("fs");
const path=require('path');
const { string } = require("yargs");

function generateBigFile (fileName,maxSize=1024){
    let destFile = fs.openSync(fileName,'w');
    let charArray = new Array(1024);
    for(let i=0;i<charArray.length;i++)
    {
        charArray[i] ='';
    }
    let line  = charArray.join('-');

    for(let i=0;i<1024*maxSize;i++){
        fs.writeSync(destFile,i.toString()); 
        fs.writeSync(destFile,' '); 
       fs.writeSync(destFile,line);
       fs.writeSync(destFile,'\n');
    }

    
}
    
generateBigFile("d:\\big.txt");