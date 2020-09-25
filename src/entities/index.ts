//dependencies
import Ids from "./helpers/Ids";
import * as Errors from "../constants/Errors";
import Validation from "./helpers/Validation"
//entities
import buildMakeOrganisation from "./organisation";
import buildMakePost from "./post";
import buildMakeReaction from "./reaction";
import buildMakeUser from "./user";

//init entity maker functions
export const makeUser = buildMakeUser({Ids, Errors, Validation});
export const makeOrganisation = buildMakeOrganisation({Ids, Errors, Validation});
export const makePost = buildMakePost({Ids, Errors});
export const makeReaction = buildMakeReaction({Ids, Errors});

//expose entities
export default { makeUser, makeOrganisation, makePost, makeReaction };
