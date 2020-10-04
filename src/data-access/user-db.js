/**
 * 
 * @param {import(".").DataAccessDependancies} dependancies
 */
export default function makeUserDb({ UserModel }) {
    return Object.freeze({
        findById,
        insert,
    })

    async function findById(userId) {
        let userDoc = await UserModel.findById(userId);
        const { _id: id, password, ...otherUserData } = userDoc.toJSON();
        return { _id: id, ...otherUserData };
    }

    async function insert(userData) {
        let newUser = new UserModel(userData);
        let newUserDoc = await newUser.save();
        const { _id: id, password, ...otherUserData } = newUserDoc.toJSON();
        return { _id: id, ...otherUserData };
    }
}



// export interface UserDb {
//     findById(id: string) : import("../entities/user").User
//     insert(user: import("../entities/user").User) : import("../entities/user").User
// }