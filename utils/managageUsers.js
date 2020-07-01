const fs = require('fs')
const path = require('path')
const jsonFile = require('jsonfile')
const {
    logger
} = require('./logger');

exports.Users = class {
    constructor() {
        try {
            fs.mkdirSync(path.join(__dirname, "../", "Patients"));
            fs.writeFileSync(path.join(__dirname, "../", "Patients", 'patientList.json'), '[]', () => {
                console.log('File successfully created');
            });
        } catch (e) {
            // console.log(e)
            console.log('Patient root aleady exists');
        }

        console.log('Created an instance of a user')

    }

    createFile(patient, patientList) {

        //Create patients directory

        fs.writeFile(path.join(__dirname, "../", "Patients", 'patientList.json'), JSON.stringify(patientList), () => {
            console.log('Successfully updated the patientlist')
        })

        try {
            fs.mkdirSync(path.join(__dirname, "../", "Patients", `${patient.email}`));
        } catch (e) {
            console.log('Folder already exists');
        }

        fs.writeFile(path.join(__dirname, "../", "Patients", `${patient.email}`, 'details.json'), JSON.stringify(patient), () => {
            console.log('Created the details files')
        })


        fs.writeFile(path.join(__dirname, "../", "Patients", `${patient.email}`, 'logs.txt'), '\nYou Created you account at ' + logger(), () => {
            console.log('Create the logs File')
        })

        console.log('About to send the pipes');
        console.log(patient.profile)
        const readStream = fs.createReadStream(patient.profile);
        const writeStream = fs.createWriteStream(path.join(__dirname, "../", "Patients", `${patient.email}`, `${patient.name}`))

        readStream.pipe(writeStream);

    }

    updateFiles(fileName, patient) {
        if (patient) {
            console.log('########################################');
            console.log(patient);
            console.log('########################################');

            fs.appendFileSync(path.join(__dirname, '../', 'Patients', `${fileName}`, 'logs.txt'), "\nYou Edited your profile  " + logger(), () => {
                console.log('logger updated successfully');

            });

            jsonFile.writeFileSync(path.join(__dirname, "../", "Patients", `${patient.email}`, 'details.json'), patient, () => {
                console.log('Updated the details files')
            })


            if (patient.size) {
                console.log('About to Update patient profile picture');

                console.log(patient.profile)
                const readStream = fs.createReadStream(patient.profile);
                console.log('The error is coming from here');
                console.log(path.join(__dirname, "../", "Patients", `${fileName}`, `${patient.name}`))
                const writeStream = fs.createWriteStream(path.join(__dirname, "../", "Patients", `${fileName}`, `${patient.name}`))

                readStream.pipe(writeStream);
            }


        } else {

            fs.appendFile(path.join(__dirname, '../', 'Patients', `${fileName}`, 'logs.txt'), "\nYou Logged in at " + logger(), () => {
                console.log('logger updated successfully');
            });
        }
    }

    getUser(patientMail, password, newDetails) {
        let data = fs.readFileSync(path.join(__dirname, "../", "Patients", 'patientList.json'), 'utf-8')
        let users = JSON.parse(data);
        let User = undefined;
        let userFile = '';
        console.log('**********************')
        // console.log(users)
        console.log('**********************')
        console.log('______________________')
        console.log(patientMail)
        let existing = false

        for (let i = 0; i < users.length; i++) {
            let user = users[i];

            if (user.email === patientMail) {
                // console.log('****************** user exists ************88')
                existing = true;

                if (password && password === user.password) {
                    existing = true
                    User = user
                } else
                    existing = false

                break;
            }
        }


        if (patientMail && password && existing || newDetails) {
            userFile = User.email;
            console.log('User before editing');
            console.log(User);

            if (newDetails) {
                User = this.getUserDetails(userFile);
                console.log('updating data')
                console.log(newDetails);
                for (let [key, value] of Object.entries(newDetails)) {
                    console.log(+value);
                    if (value) {
                        User[key] = value
                        console.log(key + "   Updated to   " + value);
                    }
                }
                console.log('User after editing')
                console.log(User);

                this.updateFiles(userFile, User)

                return {
                    User
                }
            }

            this.updateFiles(userFile)

            return {
                User,
                existing
            }
        } else {
            this.updateFiles(userFile)
            return {
                users,
                existing
            }
        }

    }
    getUserDetails(patientMail) {
        return jsonFile.readFileSync(path.join(__dirname, "../", "Patients", `${patientMail}`, 'details.json'))
    }

    UpdateUserDetails() {

    }

    addPatients(newUser) {
        let {
            users,
            existing
        } = this.getUser(newUser.email);
        newUser.id = users.length + 1;
        users.push({
            email: newUser.email,
            password: newUser.password
        });
        this.createFile(newUser, users)
        console.log('adding patients');
        return existing;
    }

    getLogs(patientMail, password) {

    }
}