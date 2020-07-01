const express = require('express');
const jsonfile = require('jsonfile'); 
const router = express.Router();
const {hashedPassword,authToken} = require('../utils/auth');
const formidable = require('formidable');
const {Users} = require('../utils/managageUsers');
const patient = new Users;
const path = require('path');
let onlineUsers = {}

router.get('/login',(req,res) =>{
    res.render('login',{
        login: true,
        register: false
    });
})
.post('/login',(req,res) =>{
    
    let {email,password} = req.body
    password = hashedPassword(password);
    // console.log(patient.getUser(email, password).existing)
    if(patient.getUser(email,password).existing){

        let token = authToken();

        //Store the online user cookies
        onlineUsers[token] = {email, password};
        jsonfile.writeFile(path.join(__dirname,'../','onlineUsers.json'), onlineUsers)
        .then(res => {
            console.log('update complete')
        })
        .catch(error => console.error(error))

        console.log('########################################')
        console.log(onlineUsers);
        console.log('########################################')

        res.cookie('authtoken',token);
        // res.json(patient.getUser(email,password).User)
        // let user = patient.getUser(email,password).User
        // res.render('patientDetails',{
        //     firstName:user.firstName,
        //     lastName: user.lastName,
        //     age: user.age,
        //     gender: user.gender,
        //     name: user.name,
        //     register: true,
        //     login: true
        // })
        res.render('home',{profile: true,login:true,register:true,home:true});

    }else
        res.render('login',{
            message: 'Invalid email or password',
            messageClass: 'alert-danger',
        })              
})


module.exports = router