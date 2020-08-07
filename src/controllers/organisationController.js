const mongoose = require('mongoose');
const { assertRequiredParams, assertParamTypeObjectId } = require('../helpers/apiHelper');
const { validateHandle } = require('../helpers/userHelper');
const { ERROR_USERNAME_TAKEN, ERROR_EMAIL_TAKEN, ERROR_LOGIN_FAILED, ERROR_ORG_HANDLE_TAKEN, ERROR_ORG_NOT_FOUND } = require('../constants/errors');
const { search } = require('../server');

const Organisation = mongoose.model('organisation');
const User = mongoose.model('user');

const organisationController = {
    organisationHandleTaken: async (handle) => {
        assertRequiredParams({handle});
        let org = await Organisation.findOne({handle});
        if(org)
        {
            return true;
        }

        return false;
    },
    getOrganisationById: async (organisationId) => {
        assertRequiredParams({organisationId});
        assertParamTypeObjectId(organisationId);
        let organisation = await Organisation.findById(organisationId);
        return organisation;
    },    
    getOrganisationByHandle: async (handle) => {
        assertRequiredParams({handle});
        let organisationDoc = await Organisation.findOne({handle});
        
        if(!organisationDoc)
        {
            throw ERROR_ORG_NOT_FOUND;
        }

        return organisationDoc.toJSON();
    },    
    getOrganisationByIdOrHandle: async (orgIdOrHandle) => {
        assertRequiredParams({orgIdOrHandle});
        
        let organisationDoc = null;
        if (mongoose.Types.ObjectId.isValid(orgIdOrHandle))
        {
            organisationDoc = await Organisation.findOne({$or: [
                { handle: orgIdOrHandle },
                { _id: orgIdOrHandle }
            ]});
        }
        else 
        {
            organisationDoc = await Organisation.findOne({ handle: orgIdOrHandle });
        }

        if(!organisationDoc)
        {
            throw ERROR_ORG_NOT_FOUND;
        }

        return organisationDoc.toJSON();
    },
    createOrganisation: async (orgData) => {
        let { handle, name, address, contact, description, website} = orgData;
        assertRequiredParams({name, contact, handle});
        validateHandle(handle);

        let usernameTaken = await User.findOne({username: handle});
        let orgHandleTaken = await Organisation.findOne({handle});
        if(usernameTaken || orgHandleTaken)   
        {
            throw ERROR_ORG_HANDLE_TAKEN;
        }

        let newOrg = new Organisation({handle, name, address, contact, description, website});
        let newOrgDoc = await newOrg.save();
        return newOrgDoc;
    }
}

module.exports = organisationController;