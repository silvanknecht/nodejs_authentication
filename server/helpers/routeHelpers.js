const Joi = require('joi');
const debugRouteHelpers = require('debug')('auth:routeHelpers');

module.exports = {
    // function to validate ...
    validateBody: (schema) => {
        return (req, res, next) => {
            const result = Joi.validate(req.body, schema);
            if (result.error) {
                debugRouteHelpers('body validation failed');
                return res.status(400).json(result.error);
            }

            // add value field if it doesn't exist
            if (!req.value) {
                req.value = {};
            }
            req.value.body = result.value;
            next();
        };
    },

    //TODO: Add Password requirements
    schemas: {
        authSchemaLocal: Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().required()
        }),
        oAuthSchema: Joi.object().keys({
            id: Joi.string().required()
        })

    }


};