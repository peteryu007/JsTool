

var path=require('path');

process.argv.forEach(function(val, index, array) {
    console.log(index + ': ' + val);
  });


  let parsedPath = path.parse("c:\\a\\b\c\\aa.txt");

