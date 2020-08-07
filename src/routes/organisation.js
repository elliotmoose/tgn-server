const express = require('express');
const userController = require('../controllers/userController');
const { respond, checkRequiredFields, assertRequiredParams } = require('../helpers/apiHelper');
const { ERROR_USER_NOT_FOUND, ERROR_ORG_NOT_FOUND, ERROR_INTERNAL_SERVER, ERROR_NOT_AUTHORISED } = require('../constants/errors');
const { setAndRequireUser } = require('../middleware/auth');
const organisationController = require('../controllers/organisationController');
const router = express.Router();


/**
 * Join org by updating user organisationId
 */
router.post('/:orgId/userJoin', setAndRequireUser, async (req, res)=>{
    let orgId = req.params.orgId;    
    let userId = req.user._id;    

    try {          
        //org exists
        let org = await organisationController.getOrganisationById(orgId);
        if(!org)
        {
            throw ERROR_ORG_NOT_FOUND;
        }
        
        //TODO: check if org is private or public, to see if it requires a pending approval process

        //user exists and update
        let userData = await userController.update(userId, {
            organisationId: orgId
        })     
        
        if(!userData)
        {
            throw ERROR_INTERNAL_SERVER;
        }
    } catch (error) {
        respond(res, {}, error);
    }
});

router.get('/:orgId', async (req, res) => {
    try {
        let org = await organisationController.getOrganisationById(orgId);
        if(!org)
        {
            throw ERROR_ORG_NOT_FOUND;
        }
        respond(res, org);
    } catch (error) {
        respond(res, {}, error);
    }
});

module.exports = router;