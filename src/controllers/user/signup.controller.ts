export default function makeSignUp ({ createUser }) {
    return async function signUp(httpReq) {
        const userData = httpReq.body;
        const newUser = await createUser(userData);
        return newUser;
    }
}