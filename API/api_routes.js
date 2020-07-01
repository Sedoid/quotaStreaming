const router = require('express').Router()
const fs = require('fs');
const path = require('path');

router.get('/video',(req,res) =>{
    console.log('Response');

    const videoStream = fs.createReadStream(path.join(__dirname , '../','public','videos','Lilly.mp4'));
   
    videoStream.on('data',()=>{
        videoStream.pipe(res)
    })
    // console.log(videoStream)
    
    
    // res.send({message: 'hello From the server '});
})

module.exports = router