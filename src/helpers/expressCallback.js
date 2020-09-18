const { ERROR_INTERNAL_SERVER } = require("../constants/errors");

export function makeExpressCallback (controllerMethod) {
    return (req, res) => {      
        
        function respond (data, error=undefined) {
            let body = {
                data,
                error
            }
    
            let status = 200;
            if(error)
            {
                //force to fit format
                let isExternal = error && error.status && error.message && error.code && error.toJSON;
                let errorFinal;
                if(!isExternal)
                {
                    console.log(error.stack);
                    errorFinal = {...ERROR_INTERNAL_SERVER().toJSON(), err: `${error.toJSON()}`};
                }
                else {
                    errorFinal = error.toJSON();
                }
                
                body.error = errorFinal;
                status = errorFinal.status;
            }
    
            res.status(status).send(body);
        }
      
      controllerMethod(req)
      .then(responseData => respond(responseData))
      .catch(error => respond({}, error))
    }
  }