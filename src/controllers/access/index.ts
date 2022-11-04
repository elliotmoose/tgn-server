import { isFollowingUser } from './../../use-cases/user';
import * as Errors from './../../constants/Errors';
import Ids from "../../helpers/ids";
import makeAccess from "./access.middleware";

const access = makeAccess({ Ids, Errors, isFollowingUser });
export default access;
