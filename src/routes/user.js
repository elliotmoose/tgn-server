const express = require('express');
const userController = require('../controllers/userController');
const { respond, checkRequiredFields, assertRequiredParams } = require('../helpers/apiHelper');
const { ERROR_USER_NOT_FOUND, ERROR_ORG_NOT_FOUND, ERROR_INTERNAL_SERVER, ERROR_NOT_AUTHORISED } = require('../constants/errors');
const { setAndRequireUser } = require('../middleware/auth');
const organisationController = require('../controllers/organisationController');
const router = express.Router();


router.get('/', (req,res)=>{

});

router.post('/create', async (req, res)=>{
    try {        
        let newUser = await userController.createUser(req.body);      
        respond(res, {...newUser, password: undefined});  
    } catch (error) {
        respond(res, {}, error);
    }
});

router.post('/login', async (req, res)=>{
    try {
        let loginData = await userController.login(req.body);        
        let resData = {
            user: {...loginData.user, password: undefined},
            token: loginData.token
        };
        respond(res, resData);  
    } catch (error) {
        respond(res, {}, error);
    }
});

/**
 * Get user data
 */
router.get('/:userId', setAndRequireUser, async (req, res)=>{
    let userId = req.params.userId;    
    
    try {
        let userData = await userController.getUserById(userId);
        
        if(userData) {
            respond(res, {...userData, password: undefined});
        }
        else {
            throw ERROR_USER_NOT_FOUND;
        }        
    } catch (error) {
        respond(res, {}, error);
    }
});

module.exports = router;