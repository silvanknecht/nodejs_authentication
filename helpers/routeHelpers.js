const Joi = require('joi');

module.exports = {
    // function to validate ...
    validateBody: (schema) => {
        return (req, res, next) => {
            const result = Joi.validate(req.body, schema);
            if (result.error) {
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
        authSchema: Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().required()
        })
    }
};