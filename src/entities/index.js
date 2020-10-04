import buildMakeOrganisation from "./organisation";
import buildMakePost from "./post";
import buildMakeReaction from "./reaction";
import buildMakeUser from "./user";

import Ids from "../helpers/Ids";

export const makeUser = buildMakeUser({ Ids });
export const makeOrganisation = buildMakeOrganisation({ Ids });
export const makePost = buildMakePost({ Ids });
export const makeReaction = buildMakeReaction({ Ids });

export default { makeUser, makeOrganisation, makePost };


// export interface EntityDependancies {
//     Ids? : import("../helpers/Ids").IdsHelper,
//     SomeOther? : import("../helpers/Ids").IdsHelper,
// }
