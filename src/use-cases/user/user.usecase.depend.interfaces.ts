import { Id } from './../../helpers/Ids';
import { User } from '../../domain/entities/user.entity';

export interface UserRepository {
    findById: (id: string, select?: Array<string> | undefined) => Promise<User>,
    find: (match: Object, select?: Array<string> | undefined) => Promise<User>,
    insert: (userData: User) => Promise<User>,
    exists: (match : Object) => Promise<Boolean>,
}

export interface OrganisationRepo {
    exists: (match : Object) => Promise<Boolean>,
}

import { APIError } from './../../constants/Errors';
import { Types } from 'mongoose';

export interface Ids {
    isValidId: (id: string | Types.ObjectId) => Boolean,
    makeId: () => Id,
}

export interface Errors {
    INVALID_PARAM(param : string) : APIError,
    MALFORMED_DATA(param : string) : APIError,
    LOGIN_FAILED() : APIError,
    USERNAME_TAKEN() : APIError,
    EMAIL_TAKEN() : APIError,
    USER_NOT_FOUND() : APIError,
}

export interface Validation {
    isValidHandle: (handle: string) => Boolean,
    isValidEmail: (email: string) => Boolean,
    isValidPassword: (password: string) => Boolean,
}

export interface Crypto {
    generateSalt: (saltLength: number) => string,
    hashPassword: (password: string, salt: string) => string,
    verifyPassword: (password: string, hash: string, salt: string) => Boolean
}