import fs from 'fs';
import moment from 'moment';
//中文库
import iconv from 'iconv-lite';
import ejs from 'ejs';


export default  function outFile (jsonFilename,outFileName,templateFile){

    let data = fs.readFileSync(jsonFilename, 'utf8');

    if ( fs.existsSync(outFileName))
        fs.unlinkSync(outFileName);
    let outFile = fs.openSync(outFileName, 'ax');

    //fs.writeFileSync("d:/out.sql",JSON.stringify({name:1}))
    //json转
    let objs = eval(data)
      

    const sqlFormat = fs.readFileSync(templateFile, 'utf8');
    
    const complieTemplate = ejs.compile(sqlFormat);

    for(let item of objs){
        
        let sql = complieTemplate(
            {
                item:item,
                ctime : moment.unix(item.c_time).format('YYYY-MM-DD HH:mm:ss')
            });
        fs.appendFileSync(outFile,iconv.encode(sql,"gbk"));
     }

     fs.closeSync(outFile);
 }