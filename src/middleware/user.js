const { respond, checkRequiredFields } = require('../helpers/apiHelper');
const crypto = require('../helpers/crypto');
const userController = require('../controllers/userController');
const { ERROR_INVALID_TOKEN, ERROR_MISSING_TOKEN, ERROR_NOT_AUTHORISED, ERROR_USER_NOT_FOUND } = require('../constants/errors');

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
        if (user) {
            req.user = user;
            next();
        }
        else {
            throw ERROR_INVALID_TOKEN;
        }
    } catch (error) {
        respond(res, {}, error);
    }
}

//finds user from param :userIdOrHandle and injects into params
exports.resolveUserParam = async (req, res, next) => {
    try {
        let userIdOrHandle = req.params.userIdOrHandle;
        let userData = await userController.getUserByIdOrHandle(userIdOrHandle);
        if (!userData) {
            throw ERROR_USER_NOT_FOUND;
        }

        req.params.user = userData;
        next();
    } catch (error) {
        respond(res, {}, error);
    }
}