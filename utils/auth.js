const crypto = require('crypto')

exports.hashedPassword = (password)=>{
    const hash = crypto.createHash('sha256');
    const hpassword = hash.update(password).digest('base64');
    return hpassword
}

exports.authToken = ()=>{
    let token = crypto.randomBytes(16).toString('base64');
    return token;
}