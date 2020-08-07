const mongoose = require('mongoose');
const { assertRequiredParams, assertParamTypeObjectId } = require('../helpers/apiHelper');
const { validateHandle } = require('../helpers/userHelper');
const { ERROR_USERNAME_TAKEN, ERROR_EMAIL_TAKEN, ERROR_LOGIN_FAILED, ERROR_ORG_HANDLE_TAKEN } = require('../constants/errors');

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