const mongoose = require('mongoose');
const { assertRequiredParams, assertParamTypeObjectId } = require('../helpers/apiHelper');
const { validateHandle, sanitizedUserData } = require('../helpers/userHelper');
const {ERROR_ORG_HANDLE_TAKEN, ERROR_ORG_NOT_FOUND} = require('../constants/errors');
const { search } = require('../server');

const Organisation = mongoose.model('organisation');
const User = mongoose.model('user');

const organisationController = {
    async organisationHandleTaken (handle) {
        assertRequiredParams({handle});
        let org = await Organisation.findOne({handle});
        if(org)
        {
            return true;
        }

        return false;
    },
    async getOrganisationByIdOrHandle (orgIdOrHandle) {
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
            throw ERROR_ORG_NOT_FOUND();
        }

        return organisationDoc.toJSON();
    },
    async createOrganisation (orgData) {
        let { handle, name, address, contact, description, website, public} = orgData;
        assertRequiredParams({name, contact, handle});
        validateHandle(handle);

        let usernameTaken = await User.findOne({username: handle});
        let orgHandleTaken = await Organisation.findOne({handle});
        if(usernameTaken || orgHandleTaken)   
        {
            throw ERROR_ORG_HANDLE_TAKEN();
        }

        let newOrg = new Organisation({handle, name, address, contact, description, website, public});
        let newOrgDoc = await newOrg.save();
        return newOrgDoc.toJSON();
    },
    async getOrgMembers (orgIdOrHandle) {
        assertRequiredParams(orgIdOrHandle);        
        let orgData = await this.getOrganisationByIdOrHandle(orgIdOrHandle);
        let users = await User.find({ organisationIds: mongoose.Types.ObjectId(orgData._id)});
        return users.map((user)=>sanitizedUserData(user.toJSON()));
    },
    async filterPublicOrgs (organisationIds) {        
        return await Organisation.find({_id: {$in: organisationIds}, public: true}).select('_id');
    }
}

module.exports = organisationController;