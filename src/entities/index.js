import buildMakeOrganisation from "./organisation";
import buildMakePost from "./post";
import buildMakeUser from "./user";

export const makeUser = buildMakeUser({});
export const makeOrganisation = buildMakeOrganisation({});
export const makePost = buildMakePost({});

export default { makeUser, makeOrganisation, makePost };

