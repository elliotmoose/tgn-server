const helpers = {
    isValidEmail(email: string) : Boolean {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    },
    isValidHandle(handle: string) : Boolean {
        const re = /^([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,28}(?:[A-Za-z0-9_]))?)$/;
        return re.test(handle);
    },
    isValidPassword(password: string) : Boolean {
        //TODO: validation for password
        const re = /.+/;
        return re.test(password);
    },
    isNonEmpty(value: string) : Boolean {
        return value !== undefined && value !== null && value !== '';
    },

}

export default helpers;