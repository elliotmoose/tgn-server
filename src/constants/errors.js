// class APIError extends Error {
//     constructor(status, code, message) {
//         super();
//         this.status = status;
//         this.code = code;
//         this.message= message;
//     }
// }
// class InternalServerError extends APIError {
//     constructor() {
//         super(500, 'ERROR_INTERNAL_SERVER', 'An internal server error has occured')
//     }
// }
export class APIError extends Error {
    constructor(code, message, status) {
        super(message);
        this.status = status;
        this.code = code;
        this.message= message;
    }

    toJSON() {
        return {
            status: this.status,
            code: this.code,
            message: this.message
        }
    }
}

// export const ERROR_INTERNAL_SERVER = function() {
//     return new APIError('ERROR_INTERNAL_SERVER', 'An internal server error has occured', 500);
// }

// exports.ERROR_MISSING_PARAM = {
//     status: 400,    
//     code: 'ERROR_MISSING_PARAM',
//     message: 'One or more of the required parameters are missing'
// } 

// exports.ERROR_INVALID_PARAM = (param)=>{
//     return {
//         status: 400,    
//         code: 'ERROR_INVALID_PARAM',
//         message: `Invalid ${param}`
//     };
// }

// exports.ERROR_USERNAME_TAKEN = {
//     status: 409,    
//     code: 'ERROR_USERNAME_TAKEN',
//     message: 'This username is already in use.'
// }

// exports.ERROR_ORG_HANDLE_TAKEN = {
//     status: 409,    
//     code: 'ERROR_ORG_HANDLE_TAKEN',
//     message: 'This handle is already in use.'
// }

// exports.ERROR_EMAIL_TAKEN = {
//     status: 409,    
//     code: 'ERROR_EMAIL_TAKEN',
//     message: 'This email is already in use.'
// }

// exports.ERROR_LOGIN_FAILED = {
//     status: 401,    
//     code: 'ERROR_LOGIN_FAILED',
//     message: 'Your username or password is incorrect'
// }

// exports.ERROR_MISSING_TOKEN = {
//     status: 401,    
//     code: 'ERROR_MISSING_TOKEN',
//     message: 'No access token provided'
// }

// exports.ERROR_INVALID_TOKEN = {
//     status: 401,    
//     code: 'ERROR_INVALID_TOKEN',
//     message: 'The token given is invalid'
// }

// exports.ERROR_TOKEN_EXPIRED = {
//     status: 401,    
//     code: 'ERROR_TOKEN_EXPIRED',
//     message: 'The token has expired. Please login again'
// }

// exports.ERROR_NOT_AUTHORISED = {
//     status: 401,
//     code: 'ERROR_NOT_AUTHORISED',
//     message: 'You are not authorised to access this document'
// }

// exports.ERROR_USER_NOT_FOUND = {
//     status: 404,    
//     code: 'ERROR_USER_NOT_FOUND',
//     message: 'User does not exist'
// }

// exports.ERROR_CANNOT_FOLLOW_SELF = {
//     status: 403,    
//     code: 'ERROR_CANNOT_FOLLOW_SELF',
//     message: 'You cannot follow yourself'
// }

// exports.ERROR_CANNOT_UNFOLLOW_SELF = {
//     status: 403,    
//     code: 'ERROR_CANNOT_UNFOLLOW_SELF',
//     message: 'You cannot unfollow yourself'
// }

// exports.ERROR_ALREADY_FOLLOWING_USER = {
//     status: 409,    
//     code: 'ERROR_ALREADY_FOLLOWING_USER',
//     message: 'You are already following this user'
// }

// exports.ERROR_NOT_FOLLOWING_USER = {
//     status: 403,    
//     code: 'ERROR_NOT_FOLLOWING_USER',
//     message: 'You are not following this user'
// }

// exports.ERROR_ALREADY_JOINED_ORG = {
//     status: 409,    
//     code: 'ERROR_ALREADY_JOINED_ORG',
//     message: 'You have already joined this organisation'
// }

// exports.ERROR_NOT_ORG_MEMBER = {
//     status: 401,    
//     code: 'ERROR_NOT_ORG_MEMBER',
//     message: 'You cannot perform this action as you are not a member of this organisation'
// }

// exports.ERROR_ORG_NOT_FOUND = {
//     status: 404,    
//     code: 'ERROR_ORG_NOT_FOUND',
//     message: 'Organisation does not exist'
// }


// exports.ERROR_POST_NOT_FOUND = {
//     status: 404,    
//     code: 'ERROR_POST_NOT_FOUND',
//     message: 'The requested post does not exist'
// }

// exports.ERROR_REACTION_EXISTS = {
//     status: 409,    
//     code: 'ERROR_ALREADY_REACTED_TO_POST',
//     message: 'You have already given this reaction to this post'
// }


// exports.ERROR_REACTION_NOT_FOUND = {
//     status: 404,    
//     code: 'ERROR_REACTION_NOT_FOUND',
//     message: 'Reaction not found'
// }

// for(let error of Object.values(exports)) {
//     console.log(`export const ${error.code} = function() {
//     return new APIError('${error.code}', '${error.message}', ${error.status});
// }\n\n`);
// }


export const ERROR_INTERNAL_SERVER = function() {
    return new APIError('ERROR_INTERNAL_SERVER', 'An internal server error has occured', 500);
}

export const ERROR_MISSING_PARAM = function() {
    return new APIError('ERROR_MISSING_PARAM', 'One or more of the required parameters are missing', 400);
}

export const ERROR_USERNAME_TAKEN = function() {
    return new APIError('ERROR_USERNAME_TAKEN', 'This username is already in use.', 409);
}


export const ERROR_ORG_HANDLE_TAKEN = function() {
    return new APIError('ERROR_ORG_HANDLE_TAKEN', 'This handle is already in use.', 409);
}


export const ERROR_EMAIL_TAKEN = function() {
    return new APIError('ERROR_EMAIL_TAKEN', 'This email is already in use.', 409);
}


export const ERROR_LOGIN_FAILED = function() {
    return new APIError('ERROR_LOGIN_FAILED', 'Your username or password is incorrect', 401);
}


export const ERROR_MISSING_TOKEN = function() {
    return new APIError('ERROR_MISSING_TOKEN', 'No access token provided', 401);
}


export const ERROR_INVALID_TOKEN = function() {
    return new APIError('ERROR_INVALID_TOKEN', 'The token given is invalid', 401);
}


export const ERROR_TOKEN_EXPIRED = function() {
    return new APIError('ERROR_TOKEN_EXPIRED', 'The token has expired. Please login again', 401);
}


export const ERROR_NOT_AUTHORISED = function() {
    return new APIError('ERROR_NOT_AUTHORISED', 'You are not authorised to access this document', 401);
}


export const ERROR_USER_NOT_FOUND = function() {
    return new APIError('ERROR_USER_NOT_FOUND', 'User does not exist', 404);
}


export const ERROR_CANNOT_FOLLOW_SELF = function() {
    return new APIError('ERROR_CANNOT_FOLLOW_SELF', 'You cannot follow yourself', 403);
}


export const ERROR_CANNOT_UNFOLLOW_SELF = function() {
    return new APIError('ERROR_CANNOT_UNFOLLOW_SELF', 'You cannot unfollow yourself', 403);
}


export const ERROR_ALREADY_FOLLOWING_USER = function() {
    return new APIError('ERROR_ALREADY_FOLLOWING_USER', 'You are already following this user', 409);
}


export const ERROR_NOT_FOLLOWING_USER = function() {
    return new APIError('ERROR_NOT_FOLLOWING_USER', 'You are not following this user', 403);
}


export const ERROR_ALREADY_JOINED_ORG = function() {
    return new APIError('ERROR_ALREADY_JOINED_ORG', 'You have already joined this organisation', 409);
}


export const ERROR_NOT_ORG_MEMBER = function() {
    return new APIError('ERROR_NOT_ORG_MEMBER', 'You cannot perform this action as you are not a member of this organisation', 401);
}


export const ERROR_ORG_NOT_FOUND = function() {
    return new APIError('ERROR_ORG_NOT_FOUND', 'Organisation does not exist', 404);
}


export const ERROR_POST_NOT_FOUND = function() {
    return new APIError('ERROR_POST_NOT_FOUND', 'The requested post does not exist', 404);
}


export const ERROR_REACTION_EXISTS = function() {
    return new APIError('ERROR_REACTION_EXISTS', 'You have already given this reaction to this post', 409);
}

export const ERROR_INVALID_PARAM = function(param) {
    return new APIError('ERROR_INVALID_PARAM', `Invalid ${param}`, 400);
}

export const ERROR_ALREADY_REACTED_TO_POST = function() {
    return new APIError('ERROR_ALREADY_REACTED_TO_POST', 'You have already given this reaction to this post', 409);
}


export const ERROR_REACTION_NOT_FOUND = function() {
    return new APIError('ERROR_REACTION_NOT_FOUND', 'Reaction not found', 404);
}