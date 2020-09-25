import { APIError } from './../constants/errors';
import * as Errors from './../constants/Errors';


export function makeExpressCallback(controllerMethod) {
    return async (req, res) => {

        function respond(data: any, error: any = undefined) {
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

        try {
            const responseData = await controllerMethod(req);
            respond(responseData);
        } catch (error) {
            respond({}, error);
        }
    }
}