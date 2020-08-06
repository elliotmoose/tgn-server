const { respond, checkRequiredFields, throwError } = require('../helpers/apiHelper');
const crypto = require('../helpers/crypto');
const userController = require('../controllers/userController');
const { ERROR_INVALID_TOKEN, ERROR_MISSING_TOKEN } = require('../constants/errors');

// Middleware
exports.setAndRequireUser = async (req, res, next) => {
    try {
        let authorization = req.headers.authorization || null;
        if (!authorization) {
            throw ERROR_MISSING_TOKEN;
        }
        if (!(typeof authorization === 'string')) {
            throw ERROR_INVALID_TOKEN;
        }
    
        //Bearer <jwt>
        let encryptedJwt = authorization.split(' ')[1];
        // let decodeJwt
        let { userId } = crypto.decodeJsonWebToken(encryptedJwt);
    
        let user = await userController.getUserById(userId);
        if(user)        
        {
            req.user = user;
            next();
        }
        else 
        {
            throw ERROR_INVALID_TOKEN;
        }        
    } catch (error) {
        respond(res, {}, error);
    }
}

exports.authLoggedInUser = (req, res, next) => {
    // if(!req.user)
    // {
    //     respond(res, {}, )
    // }
}