
import  outFile2  from "./outFile.mjs";


let jsonDir="./json/";
let _jsonFilename=`${jsonDir}龙双兵_4月份.json` ;
let _outFileName = _jsonFilename + ".sql";

outFile2(_jsonFilename,_outFileName,'./template.sql');