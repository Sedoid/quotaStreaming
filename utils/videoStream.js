const fs = require("fs");
const path = require("path");
let size = 0;
let start = 0;
let end = 0;
let range = undefined;
let quota  = undefined;
let file = undefined; 
let chunksize = end - start + 1;


const stream = (limit = 2000000) =>{
    
    console.log('Current Limit: '+ limit )
   
    const file = fs.statSync(path.join(__dirname, "../", "public", "videos", "Lilly.mp4"));
       
    const videoStream = fs.createReadStream(path.join(__dirname,'../','public','videos',"Lilly.mp4"),{start,end: limit});



return videoStream    
}

module.exports = stream;