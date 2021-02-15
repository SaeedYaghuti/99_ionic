const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];// 'Authentication': 'Barear sljdflasdjf'
        const tokenDecode = jwt.verify(token, 'secrete-must-be-long');
        req.userData = {
            email: tokenDecode.email,
            author: tokenDecode.userId
        }
        req.isAuth = true;
        console.log(`@Middleware checkAuth() Successfull :))) userData.email: ${req.userData.email}, userData.author: ${req.userData.author} `);
        next();
    } catch (error) {
        console.log('@Middleware checkAuth() FAILED ):');
        req.isAuth = false;
        return next();
    }
}