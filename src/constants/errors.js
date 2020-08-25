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

exports.ERROR_INTERNAL_SERVER = {
    status: 500,
    code: 'ERROR_INTERNAL_SERVER',
    message: 'An internal server error has occured'
},

exports.ERROR_MISSING_PARAM = {
    status: 400,    
    code: 'ERROR_MISSING_PARAM',
    message: 'One or more of the required parameters are missing'
} 

exports.ERROR_INVALID_PARAM = (param)=>{
    return {
        status: 400,    
        code: 'ERROR_INVALID_PARAM',
        message: `Invalid ${param}`
    };
}

exports.ERROR_USERNAME_TAKEN = {
    status: 409,    
    code: 'ERROR_USERNAME_TAKEN',
    message: 'This username is already in use.'
}

exports.ERROR_ORG_HANDLE_TAKEN = {
    status: 409,    
    code: 'ERROR_ORG_HANDLE_TAKEN',
    message: 'This handle is already in use.'
}

exports.ERROR_EMAIL_TAKEN = {
    status: 409,    
    code: 'ERROR_EMAIL_TAKEN',
    message: 'This email is already in use.'
}

exports.ERROR_LOGIN_FAILED = {
    status: 401,    
    code: 'ERROR_LOGIN_FAILED',
    message: 'Your username or password is incorrect'
}

exports.ERROR_MISSING_TOKEN = {
    status: 401,    
    code: 'ERROR_MISSING_TOKEN',
    message: 'No access token provided'
}

exports.ERROR_INVALID_TOKEN = {
    status: 401,    
    code: 'ERROR_INVALID_TOKEN',
    message: 'The token given is invalid'
}

exports.ERROR_TOKEN_EXPIRED = {
    status: 401,    
    code: 'ERROR_TOKEN_EXPIRED',
    message: 'The token has expired. Please login again'
}

exports.ERROR_NOT_AUTHORISED = {
    status: 401,
    code: 'ERROR_NOT_AUTHORISED',
    message: 'You are not authorised to access this document'
}

exports.ERROR_USER_NOT_FOUND = {
    status: 404,    
    code: 'ERROR_USER_NOT_FOUND',
    message: 'User does not exist'
}

exports.ERROR_CANNOT_FOLLOW_SELF = {
    status: 403,    
    code: 'ERROR_CANNOT_FOLLOW_SELF',
    message: 'You cannot follow yourself'
}

exports.ERROR_CANNOT_UNFOLLOW_SELF = {
    status: 403,    
    code: 'ERROR_CANNOT_UNFOLLOW_SELF',
    message: 'You cannot unfollow yourself'
}

exports.ERROR_ALREADY_FOLLOWING_USER = {
    status: 409,    
    code: 'ERROR_ALREADY_FOLLOWING_USER',
    message: 'You are already following this user'
}

exports.ERROR_NOT_FOLLOWING_USER = {
    status: 403,    
    code: 'ERROR_NOT_FOLLOWING_USER',
    message: 'You are not following this user'
}

exports.ERROR_ALREADY_JOINED_ORG = {
    status: 409,    
    code: 'ERROR_ALREADY_JOINED_ORG',
    message: 'You have already joined this organisation'
}

exports.ERROR_NOT_ORG_MEMBER = {
    status: 401,    
    code: 'ERROR_NOT_ORG_MEMBER',
    message: 'You cannot perform this action as you are not a member of this organisation'
}

exports.ERROR_ORG_NOT_FOUND = {
    status: 404,    
    code: 'ERROR_ORG_NOT_FOUND',
    message: 'Organisation does not exist'
}


exports.ERROR_POST_NOT_FOUND = {
    status: 404,    
    code: 'ERROR_POST_NOT_FOUND',
    message: 'The requested post does not exist'
}

exports.ERROR_REACTION_EXISTS = {
    status: 409,    
    code: 'ERROR_ALREADY_REACTED_TO_POST',
    message: 'You have already given this reaction to this post'
}


exports.ERROR_REACTION_NOT_FOUND = {
    status: 404,    
    code: 'ERROR_REACTION_NOT_FOUND',
    message: 'Reaction not found'
}