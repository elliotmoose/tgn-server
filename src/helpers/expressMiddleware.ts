import { APIError } from '../constants/errors';
import * as Errors from '../constants/Errors';

function respond(data: any, error: any = undefined, res) {
    let body = {
        data,
        error
    }

    let status = 200;
    if (error) {
        //force to fit format
        let isExternal = error && error.status && error.message && error.code && error.toJSON;
        let errorFinal;
        if (!isExternal) {
            console.log(error.stack)
            errorFinal = { ...Errors.INTERNAL_SERVER().toJSON(), err: `${error}` };
        }
        else {
            errorFinal = error.toJSON();
        }

        body.error = errorFinal;
        status = errorFinal.status;
    }

    res.status(status).send(body);
}

export function makeExpressMiddleware(middlewareMethod) {
    return async (req, res, next) => {
        try {
            const responseData = await middlewareMethod(req, next);
            respond(responseData, {}, res);
        } catch (error) {
            respond({}, error, res);
        }
    }
}