//dependencies
import Ids from "../../helpers/ids";
import * as Errors from "../../constants/Errors";
import Validation from "../../helpers/validation"

//entities
import buildMakeOrganisation from "./organisation.entity";
import buildMakePost from "./post.entity";
import buildMakeReaction from "./reaction.entity";
import buildMakeUser from "./user.entity";

//initialise entity makers
export const makeUser = buildMakeUser({Ids, Errors, Validation});
export const makeOrganisation = buildMakeOrganisation({Ids, Errors, Validation});
export const makePost = buildMakePost({Ids, Errors});
export const makeReaction = buildMakeReaction({Ids, Errors});

//expose entities
export default { makeUser, makeOrganisation, makePost, makeReaction };
