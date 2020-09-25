import { APIError } from '../constants/Errors';

export interface Ids {
    isValidId: (id: any) => Boolean,
    makeId: () => string
}

export interface Errors {
    INVALID_PARAM(param : string) : APIError,
    MALFORMED_DATA(param : string) : APIError,
}

export interface Validation {
    isValidHandle: (handle: string) => Boolean,
    isValidEmail: (email: string) => Boolean,
    isValidPassword: (password: string) => Boolean,
}