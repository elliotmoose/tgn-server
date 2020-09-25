export default function makeGetUser ({ findUser }) {
    return async function login(httpReq) {
        const userId = httpReq.paramUser;
        const newUser = await findUser(userId);
        return newUser;
    }
}