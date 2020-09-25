import { Id } from './../../helpers/Ids';
import { APIError } from './../../constants/Errors';
import { Types } from 'mongoose';

export interface Ids {
    isValidId: (id: string | Id) => Boolean,
    makeId: () => Id,
}

export interface Errors {
    INVALID_PARAM(param : string) : APIError,
    MALFORMED_DATA(param : string) : APIError,
}

export interface Validation {
    isValidHandle: (handle: string) => Boolean,
    isValidEmail: (email: string) => Boolean,
    isValidPassword: (password: string) => Boolean,
    isNonEmpty: (value: any) => Boolean
}