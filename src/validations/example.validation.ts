import joi from 'joi';

const createUpdateValidations = {
  body: joi.object().keys({
    firstName: joi.string().required().label('firstName value'),
    lastName: joi.string().required().label('lastName value'),
    email: joi.string().email().required().label('email value'),
    phoneNumber: joi.string().length(10).regex(/^[0-9]+$/)
      .required()
      .label('phoneNumber value'),
  }),
};

const paramValidation = {
  create: createUpdateValidations,
  update: createUpdateValidations,
};

export default paramValidation;
