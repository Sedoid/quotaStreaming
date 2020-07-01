const express = require('express')
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser')
const formidable = require('formidable');
const jsonfile = require('jsonfile');
const {
    Users
} = require('./utils/managageUsers');
const patient = new Users;
const Register = require('./routes/register');
const Login = require('./routes/login');
const EditProfile = require('./routes/editProfile');
const Api = require('./API/api_routes');
const fs = require('fs')
let onlineUsers = {}
const path = require('path')
const {
    hashedPassword,
    authToken
} = require('./utils/auth');

// Creating the online user cookie files

jsonfile.writeFile(path.join(__dirname, 'onlineUsers.json'), onlineUsers, )
    .then(res => {
        console.log('Write complete')
    })
    .catch(error => console.error(error))

const app = express();

app.use(express.urlencoded({
    extended: false
}))
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
    console.log('Checking cookies');
    let token = req.cookies['authtoken'];
    console.log('The token: ' + token);
    onlineUsers = jsonfile.readFileSync(path.join(__dirname, 'onlineUsers.json'))
    console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$')
    console.log('Online Users: ' + onlineUsers);
    console.log(onlineUsers[token])
    console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$')
    req.user = onlineUsers[token];

    next();
})

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.render('index');
})

app.get('/home', (req, res) => {
    if (req.user) {
        res.render('home', {
            login: true,
            register: true,
            profile: true
        });
    } else
        res.render('login', {
            message: 'Login to continue',
            messageClass: 'alert-warning',
        })

})


app.use('/', Register);
app.use('/', Login);
app.use('/', EditProfile)
app.use('/api',Api);


app.get('/patientDetails', (req, res) => {
    console.log('reguesting the user details')
    console.log(req.user)
    let token = req.cookies['authtoken'];
    console.log('The token: ' + token);
    console.log(onlineUsers)
    onlineUsers = jsonfile.readFileSync(path.join(__dirname, 'onlineUsers.json'))
    console.log(onlineUsers)
    if (req.user) {
        console.log('+++++++++++++++++++++++++++++++++')
        console.log(req.user)
        console.log('+++++++++++++++++++++++++++++++++')
        let user = patient.getUserDetails(req.user.email)
        res.render('patientDetails', {
            firstName: user.firstName,
            lastName: user.lastName,
            age: user.age,
            email: user.email,
            gender: user.gender,
            name: user.name,
            register: true,
            login: true,
            home: true,
        })
    } else {
        res.render('login', {
            message: 'Login to continue',
            messageClass: 'alert-warning',
        })
    }
})

app.post('/patientDetails', (req, res) => {

    if (req.user) {

        console.log('Updating patient profile information');

        const form = formidable({
            multiples: true
        })

        form.parse(req, (err, fields, files) => {
            console.log(fields);
            console.log(files);

            let userDetails = {
                firstName: fields.firstName,
                lastName: fields.lastName,
                age: fields.age,
                gender: fields.gender,
                password: hashedPassword(fields.password)

            }

            if (files.upload.size) {
                userDetails.profile = `${files.upload.path}`;
                userDetails.name = `${files.upload.name}`;
                userDetails.size = files.upload.size;
            } else
                userDetails.size = 0;

            if (req.user.password === hashedPassword(fields.confirmPassword)) {
                // patient.updateFiles(req.user.email,userDetails)
                console.log('Able to Edit your User Proflie');
                let user = patient.getUser(req.user.email, req.user.password, userDetails).User;
                res.render('patientDetails', {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    age: user.age,
                    email: user.email,
                    gender: user.gender,
                    name: user.name,
                    register: true,
                    login: true,
                    home: true,
                    message: 'Profile Updated Successfully',
                    messageClass: 'alert-success',
                })

            } else {
                console.log('Unable to Edit your User Profile');

                let user = patient.getUserDetails(req.user.email);
                res.render('patientDetails', {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    age: user.age,
                    email: user.email,
                    gender: user.gender,
                    name: user.name,
                    register: true,
                    login: true,
                    home: true,
                    message: 'Passwords Did not match',
                    messageClass: 'alert-warning',
                })
            }
        })

    } else {
        res.render('login', {
            message: 'Login to continue',
            messageClass: 'alert-warning',
        })
    }
})



app.listen(3000, () => {
    console.log('Server is running on port 3000');
})