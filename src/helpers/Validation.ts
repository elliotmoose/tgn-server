const helpers : Validation = {
    isValidEmail(email: string) : Boolean {
        if(!email) {
            return false;
        }
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    },
    isValidHandle(handle: string) : Boolean {
        if(!handle) {
            return false;
        }

        const re = /^([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){6,28}(?:[A-Za-z0-9_]))?)$/;
        return re.test(handle);
    },
    isValidPassword(password: string) : Boolean {
        //TODO: validation for password
        if(!password) {
            return false;
        }

        const re = /.{5,}/;
        return re.test(password);
    },
    isNonEmpty(value: string) : Boolean {
        return value !== undefined && value !== null && value !== '';
    },

}

export default helpers;

export interface Validation {
    isValidHandle: (handle: string) => Boolean,
    isValidEmail: (email: string) => Boolean,
    isValidPassword: (password: string) => Boolean,
    isNonEmpty(value: string) : Boolean
}
