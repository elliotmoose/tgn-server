import { Ids, Errors, Validation } from './entity.depend.interfaces';

interface Dependencies {
    Ids: Ids,
    Errors: Errors,
    Validation: Validation
}

export default function buildMakeOrganisation({ Ids, Errors, Validation } : Dependencies) {
    return function makeOrganisation({
        id,
        handle,
        name, 
        email,
        isPublic,
        members,        
        address,
        contact,
        description, 
        website,
        createdAt
    }) {

        if (!handle) {
            throw new Error("Organisation must have a handle");
        }

        return Object.freeze({
            id,
            handle, 
            name, 
            email,
            isPublic,
            members,        
            address,
            contact,
            description, 
            website,
            createdAt
        });
    }
}