
const fs = require('fs');
const path=require('path');


let binDir = "D:/backup/projects/ctysoft2/sysv1/CTYSoft.SYS.Web/Wt";
let dllFileNames = fs.readdirSync(binDir);


let destFile = fs.openSync("d:/bb.txt","w");
fs.ftruncateSync(destFile,0);

    dllFileNames
  //   .filter(x=>x.endsWith(".aspx"))
    // .filter(x=>x!=onlyOutFileName) // dll引用排除自己
    // .map(x=>`${path.basename(x)}`)
     .forEach(x=>{
         fs.appendFileSync(destFile,`

----------------------------FileName:${x}----------------------------------
`);
        let fileName = `${binDir}/${x}`;
         let xml = fs.readFileSync(fileName, 'utf8');
         fs.appendFileSync(destFile,xml);
     });
  fs.closeSync(destFile);