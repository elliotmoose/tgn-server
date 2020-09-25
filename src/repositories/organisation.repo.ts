import mongoose from "mongoose";

interface Dependencies {
    OrganisationModel: mongoose.Model<mongoose.Document, {}>
}

export default function makeOrganisationRepo({ OrganisationModel } : Dependencies) {
    return Object.freeze({
        findById,
        find,
        exists
    })

    async function findById(userId, select) {
        let query = OrganisationModel.findById(userId);

        if(select) {
            query = query.select(select.join(' '));
        }

        let orgDoc = await query;

        if(!orgDoc) {
            return null;
        }

        const { _id: id, ...otherOrgData } = orgDoc.toJSON();

        let output = {
            id,
            ...otherOrgData
        }

        return output;
    }
    
    async function find(match, select) {
        let query = OrganisationModel.findOne(match);

        if(select) {
            query = query.select(select.join(' '));
        }

        let orgDoc = await query;

        if(!orgDoc) {
            return null;
        }

        const { _id: id,...otherOrgData } = orgDoc.toJSON();
        
        let output = {
            id,
            ...otherOrgData
        }

        return output;
    }

    async function exists(match) {
        let exists = await OrganisationModel.exists(match);
        return exists;
    }
}