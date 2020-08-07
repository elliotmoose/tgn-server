const { respond, checkRequiredFields } = require('../helpers/apiHelper');
const crypto = require('../helpers/crypto');
const userController = require('../controllers/userController');
const { ERROR_INVALID_TOKEN, ERROR_MISSING_TOKEN, ERROR_NOT_AUTHORISED } = require('../constants/errors');

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
    
        let user = await userController.getUserByIdOrHandle(userId);
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

exports.authRole = (role) => {
    return (req, res, next) => {
        if(!req.user)
        {
            respond(res, {}, ERROR_NOT_AUTHORISED);
        }
        
        if(req.user.role != role)
        {
            respond(res, {message: 'Does not have role permission'}, ERROR_NOT_AUTHORISED);            
        }
        
        next();
    }
}