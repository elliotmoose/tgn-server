import makeSignUp from "./signup";

//use cases
import { createUser } from "../../use-cases/user";

export const signup = makeSignUp({ createUser });