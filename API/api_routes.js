const router = require("express").Router();
const express = require('express')
const fs = require("fs");
const path = require("path");
const stream = require('../utils/videoStream');
let size = 5675;
let start = 0;
let end = 2000000;
let range = undefined;
let quota  = undefined;

let chunksize = end - start + 1;


let videoStream = stream()

router.use(express.urlencoded({
    extended: false
}))
router.use(express.json());


router.get("/video", (req, res) => {

    if(quota){
        console.log('The kwota');
        console.log(req.headers.range)
        console.log(quota)
        console.log('Yeah lets make this happen');
    }
    else{


    let head = {
        "Content-Range": "bytes " + start + "-" + end + "/" + size,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "video/mp4",
    };

    res.writeHead(200, head);


    videoStream.on("open", function () {
        console.log("Piping the things");
        videoStream.pipe(res);
        console.log("After the pipe");
    });

    videoStream.on("error", () => {
        console.log("Some sort of error occued , we're closing");
        videoStream.close();
    });
}

})

.post('/video',(req, res)=>{
    
    console.log(req.body.quota)
    quota = +req.body.quota;
    quota*= 1e6;
    console.log(quota)

    videoStream = stream(quota)
    console.log('Filled the stream with a post quota')

    let head = {
        "Content-Range": "bytes " + start + "-" + end + "/" + size,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "video/mp4",
    };

    res.writeHead(200, head);

    videoStream.on("open", function () {
        console.log("Posting the things");
        videoStream.pipe(res);
    });

    videoStream.on("error", () => {
        console.log("Some sort of error occued , we're closing");
        videoStream.close();
    })
    // res.render('home',{controls:"controls"})

})


module.exports = router;    