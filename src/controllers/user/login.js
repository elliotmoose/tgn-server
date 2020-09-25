export default function makeLogin ({ loginUser }) {
    return async function login(httpReq) {
        const loginCredentials = httpReq.body;
        const newUser = await loginUser(loginCredentials);
        return newUser;
    }
}