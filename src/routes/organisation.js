const express = require('express');
const userController = require('../controllers/userController');
const { respond, checkRequiredFields, assertRequiredParams } = require('../helpers/apiHelper');
const { ERROR_USER_NOT_FOUND, ERROR_ORG_NOT_FOUND, ERROR_INTERNAL_SERVER, ERROR_NOT_AUTHORISED } = require('../constants/errors');
const { setAndRequireUser } = require('../middleware/auth');
const organisationController = require('../controllers/organisationController');
const router = express.Router();
const mongoose = require('mongoose');

/**
 * Join org by updating user organisationId
 */
router.post('/:orgIdOrHandle/userJoin', setAndRequireUser, async (req, res)=>{
    let orgIdOrHandle = req.params.orgIdOrHandle;    
    let userId = req.user._id;    

    try {          
        let orgData = await organisationController.getOrganisationByIdOrHandle(orgIdOrHandle);
        if(!orgData)
        {
            throw ERROR_ORG_NOT_FOUND;
        }        

        //TODO: check if org is private or public, to see if it requires a pending approval process

        //user exists and update
        let newUserData = await userController.update(userId, {
            organisationId: orgData._id
        })     
        
        if(!newUserData)
        {
            throw ERROR_INTERNAL_SERVER;
        }

        respond(res, newUserData);
    } catch (error) {
        respond(res, {}, error);
    }
});

router.get('/:orgIdOrHandle', async (req, res) => {
    let orgIdOrHandle = req.params.orgIdOrHandle;
    try {
        // if(mongoose.Types.ObjectId.isValid(orgIdOrHandle))
        // {
        //     let orgData = await organisationController.getOrganisationById(orgIdOrHandle);
        //     if(orgData) {
        //         respond(res, orgData);
        //         return;
        //     }            
        // }
        
        let orgData = await organisationController.getOrganisationByIdOrHandle(orgIdOrHandle);
        respond(res, orgData);       
    } catch (error) {
        respond(res, {}, error);
    }
});

/**
 * Create a new organisation
 */
router.post('/create', async (req, res) => {
    
    try {
        let org = await organisationController.createOrganisation(req.body);        
        respond(res, org);        
    } catch (error) {
        respond(res, {}, error);
    }
});

module.exports = router;