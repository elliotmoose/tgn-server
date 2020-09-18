export default function buildMakeOrganisation ({}) {
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