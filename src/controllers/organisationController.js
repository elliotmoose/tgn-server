const mongoose = require('mongoose');
const { assertRequiredParams, assertParamTypeObjectId } = require('../helpers/apiHelper');
const { validateUsername, validateEmail, validatePassword } = require('../helpers/userHelper');
const { ERROR_USERNAME_TAKEN, ERROR_EMAIL_TAKEN, ERROR_LOGIN_FAILED } = require('../constants/errors');

const Organisation = mongoose.model('organisation');

const organisationController = {
    getOrganisationById: async (organisationId) => {
        assertRequiredParams({organisationId});
        assertParamTypeObjectId(organisationId);
        let organisation = await Organisation.findById(organisationId);
        return organisation;
    },    
    createOrganisation: async (orgData) => {
        let { handle, name, address, contact, description, website} = orgData;
        assertRequiredParams({name, contact, handle});
        let newOrg = new Organisation({handle, name, address, contact, description, website});
        let newOrgDoc = await newOrg.save();
        return newOrgDoc;
    }
}

module.exports = organisationController;