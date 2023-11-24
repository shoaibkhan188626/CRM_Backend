const joi = require("joi");
const schema = joi.object({
  client: joi.alternatives().try(joi.string(), joi.object()).required(),
  number: joi.number().required(),
  year: joi.number().required(),
  status: joi.string().required(),
  note: joi.string().allow(""),
  expiredDate: joi.date().required,
  items: joi
    .array()
    .items(
      joi
        .object({
          _id: joi.string().allow("").optional(),
          itemName: joi.string().required(),
          description: joi.string().allow(""),
          quantity: joi.number().required(),
          price: joi.number().required(),
          total: joi.number().required(),
        })
        .required()
    )
    .required(),
  taxRate: joi.alternatives().try(joi.number(), joi.string()).required(),
});

module.exports = schema;
