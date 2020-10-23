import mongoose from "mongoose";

interface Dependencies {
    OrganisationModel: mongoose.Model<mongoose.Document, {}>
}

export default function makeOrganisationRepo({ OrganisationModel } : Dependencies) {
    return Object.freeze({
        findById,
        find,
        exists,
        clearAll
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

    async function clearAll() {
        await OrganisationModel.remove({});
    }
}

export interface OrganisationRepository {
    exists: (match : Object) => Promise<Boolean>,
    clearAll: ()=>void
}