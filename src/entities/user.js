export default function buildMakeUser ({}) {
    return function makeUser({
        username, 
        name,
        email,
        isPublic,
        password,
        id,
        organisations,
        following,
        followers
    }) {
        if (!username) {
            throw new Error("User must have a username");
        }

        return Object.freeze({
            username, 
            name,
            email,
            isPublic,
            password,
            id,
            organisations,
            following,
            followers         
        });
    }
}