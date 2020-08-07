const express = require('express');
const userController = require('../controllers/userController');
const { respond, checkRequiredFields, assertRequiredParams } = require('../helpers/apiHelper');
const { ERROR_USER_NOT_FOUND, ERROR_ORG_NOT_FOUND, ERROR_INTERNAL_SERVER, ERROR_NOT_AUTHORISED } = require('../constants/errors');
const { setAndRequireUser } = require('../middleware/auth');
const organisationController = require('../controllers/organisationController');
const router = express.Router();
const mongoose = require('mongoose');

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
 * Get user data by id or by handl
 */
router.get('/:userIdOrHandle', setAndRequireUser, async (req, res)=>{
    let userIdOrHandle = req.params.userIdOrHandle;    
    
    try {        
        if(mongoose.Types.ObjectId.isValid(userIdOrHandle))
        {
            let userData = await userController.getUserById(userIdOrHandle);
            if(userData) {
                respond(res, {...userData, password: undefined});
                return;
            }            
        }
        
        let userData = await userController.getUserByHandle(userIdOrHandle);
        
        if(userData) {
            respond(res, {...userData, password: undefined});
            return;
        }            

        throw ERROR_USER_NOT_FOUND;             
    } catch (error) {
        respond(res, {}, error);
    }
});

module.exports = router;