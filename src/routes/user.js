const express = require('express');
const userController = require('../controllers/userController');
const { respond, checkRequiredFields, throwError } = require('../helpers/apiHelper');
const { ERROR_USER_NOT_FOUND } = require('../constants/errors');
const { setAndRequireUser } = require('../middleware/auth');
const router = express.Router();


router.get('/', (req,res)=>{

});

router.post('/create', async (req, res)=>{
    try {        
        let newUser = await userController.createUser(req.body);      
        respond(res, newUser);  
    } catch (error) {
        respond(res, {}, error);
    }
});

router.post('/login', async (req, res)=>{
    try {
        let userData = await userController.login(req.body);        
        respond(res, userData);  
    } catch (error) {
        respond(res, {}, error);
    }
});

/**
 * Get user data
 */
router.post('/:userId', setAndRequireUser, async (req, res)=>{
    let userId = req.params.userId;    

    try {
        let userData = await userController.getUserById(userId);
        if(userData) {
            respond(res, userData);
        }
        else {
            throwError(ERROR_USER_NOT_FOUND);
        }        
    } catch (error) {
        respond(res, {}, error);
    }
});

module.exports = router;