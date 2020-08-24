const { respond, checkRequiredFields } = require('../helpers/apiHelper');
const crypto = require('../helpers/crypto');
const userController = require('../controllers/userController');
const { ERROR_INVALID_TOKEN, ERROR_MISSING_TOKEN, ERROR_NOT_AUTHORISED } = require('../constants/errors');

// Middleware
exports.isOwner = (resourceType) => {
    return (req, res, next) => {        
        switch (resourceType) {
            case 'user':                                                
                if(!userController.compareEqualUserIds(req.user._id, req.params.user._id)) {
                    respond(res, {}, ERROR_NOT_AUTHORISED);
                    return;
                }
                break;
            
            case 'post':
                
                break;
        
            default:
                break;
        }
    
        next();
    }
}

exports.authRole = (role) => {
    return (req, res, next) => {
        if(!req.user)
        {
            respond(res, {}, ERROR_NOT_AUTHORISED);
            return;
        }
        
        if(req.user.role != role)
        {
            respond(res, {message: 'Does not have role permission'}, ERROR_NOT_AUTHORISED);            
            return;
        }
        
        next();
    }
}