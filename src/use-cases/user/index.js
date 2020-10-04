import makeCreateUser from "./create-user";
import { userDb } from "../../data-access";

let createUser = makeCreateUser({ userDb });

const userUseCases = Object.freeze({
    createUser
});

export default userUseCases;
export { createUser };


// export interface UserDb {
//     findById(id: string) : Promise<import("../../entities/user").User>
//     insert(user: import("../../entities/user").User) : Promise<import("../../entities/user").User>
// }

// export interface UserUseCaseDependencies {
//     userDb: UserDb
// }

