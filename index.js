
import  outFile  from "./outFile.mjs";



let _jsonFilename=process.argv[2];
let _outFileName = _jsonFilename + ".sql";

outFile(_jsonFilename,_outFileName,'./template.sql');