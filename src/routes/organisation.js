const express = require('express');
const userController = require('../controllers/userController');
const { respond, checkRequiredFields, assertRequiredParams } = require('../helpers/apiHelper');
const { ERROR_USER_NOT_FOUND, ERROR_ORG_NOT_FOUND, ERROR_INTERNAL_SERVER, ERROR_NOT_AUTHORISED, ERROR_ALREADY_JOINED_ORG, ERROR_NOT_ORG_MEMBER } = require('../constants/errors');
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

        //check if user already joined
        let userData = await userController.getUserByIdOrHandle(userId);
        let isMember = (userData.organisationIds.findIndex((id, index) => id.equals(orgData._id)) != -1);

        if(isMember)
        {
            throw ERROR_ALREADY_JOINED_ORG;
        }
        
        //user exists and update
        let newUserData = await userController.update(userId, {
            $push: {
                organisationIds: orgData._id
            }
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

router.post('/:orgIdOrHandle/userLeave', setAndRequireUser, async (req, res)=>{
    let orgIdOrHandle = req.params.orgIdOrHandle;    
    let userId = req.user._id;    

    try {          
        let orgData = await organisationController.getOrganisationByIdOrHandle(orgIdOrHandle);
        if(!orgData)
        {
            throw ERROR_ORG_NOT_FOUND;
        }        

        //check if user already joined
        let userData = await userController.getUserByIdOrHandle(userId);
        let isMember = (userData.organisationIds.findIndex((id) => id.equals(orgData._id)) != -1);

        if(!isMember)
        {
            throw ERROR_NOT_ORG_MEMBER;
        }

        //user exists and update
        let newUserData = await userController.update(userId, {
            $pull: {
                organisationIds: orgData._id
            }
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
        let orgData = await organisationController.getOrganisationByIdOrHandle(orgIdOrHandle);
        respond(res, orgData);       
    } catch (error) {
        respond(res, {}, error);
    }
});

router.get('/:orgIdOrHandle/members', setAndRequireUser, async (req, res) => {
    let orgIdOrHandle = req.params.orgIdOrHandle;
    try {        
        //TODO: check if org is private
        //TODO: if private, check if user is member        
        let orgData = await organisationController.getOrgMembers(orgIdOrHandle);
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