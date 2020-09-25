import express from 'express';
const userController = require('../controllers/userController');
const { respond, checkRequiredFields, assertRequiredParams } = require('../helpers/apiHelper');
import * as Errors from "../constants/Errors";
const { setAndRequireUser } = require('../middleware/user');
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
            throw Errors.ORG_NOT_FOUND();
        }        

        //TODO: check if org is private or public, to see if it requires a pending approval process

        //check if user already joined
        let userData = await userController.getUserByIdOrHandle(userId);
        let isMember = (userData.organisationIds.findIndex((id, index) => id.equals(orgData._id)) != -1);

        if(isMember)
        {
            throw Errors.ALREADY_JOINED_ORG();
        }
        
        //user exists and update
        let newUserData = await userController.update(userId, {
            $push: {
                organisationIds: orgData._id
            }
        })
        
        //TODO: update organisation members     
        
        if(!newUserData)
        {
            throw Errors.INTERNAL_SERVER();
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
            throw Errors.ORG_NOT_FOUND();
        }        

        //check if user already joined
        let userData = await userController.getUserByIdOrHandle(userId);
        let isMember = (userData.organisationIds.findIndex((id) => id.equals(orgData._id)) != -1);
        if(!isMember)
        {
            throw Errors.NOT_ORG_MEMBER();
        }

        //user exists and update
        let newUserData = await userController.update(userId, {
            $pull: {
                organisationIds: orgData._id
            }
        })     
        
        if(!newUserData)
        {
            throw Errors.INTERNAL_SERVER();
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

router.get('/:orgIdOrHandle/members', setAndRequireUser,  async (req, res) => {
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
router.post('/', async (req, res) => {
    
    try {
        // let user = await userController.createUser({

        // });
        let org = await organisationController.createOrganisation(req.body);        
        respond(res, org);        
    } catch (error) {        
        respond(res, {}, error);
    }
});

module.exports = router;