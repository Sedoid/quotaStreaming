const express = require('express');
const {hashedPassword,authToken} = require('../utils/auth');
const formidable = require('formidable');
const router = express.Router();;
const {Users} = require('../utils/managageUsers');
const patient = new Users;


router.get('/register',(req,res) =>{
    res.render('register',{
        register: true,
        login: false
    });
})
.post('/register',(req,res) =>{
    // res.send(req.body)
    const form = formidable({multiples: true})

    form.parse(req,(err,fields,files)=>{
        let user  = {
            firstName: fields.firstName,
            lastName: fields.lastName,
            age: fields.age,
            gender: fields.gender,
            email: fields.email,
            password: fields.password,
            profile : `${files.upload.path}`,
            name: files.upload.name,
            pass:fields.password,
        }
      

        if(user.password === fields.confirmPassword)
        { 
          
          // has user password
              user.password = hashedPassword(user.password);
              console.log(patient.getUser(user).existing)
      
              if(!patient.addPatients(user))
                    // create user folder
                    // store everything           
                  res.render('login',{
                      message: 'Account Successfully Created,Login to Continue',
                      messageClass: 'alert-success'
                  });
              
      
      
              else
                  res.render("register",{   
                      message: "Email already exists",
                      messageClass: "alert-danger"
                  })          
        }
        else{
            res.render("register",{
                message: "Password did not match",
                messageClass: "alert-danger"
            })
        }
        
    });
})

module.exports = router;