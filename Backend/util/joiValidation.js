import Joi from "joi";

const userValidationSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .max(30)
    .trim()
    .required(),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),

  password: Joi.string()
    .min(6)
    .required(),
});

const messageValidationSchema = Joi.object({
  userMessage: Joi.string()
    .max(500)
    .required(),
});

const titleValidationSchema = Joi.object({
  title: Joi.string()
    .max(20)
    .required(),
});

// Middleware
export const validateUser = (req, res, next) => {
  const { error } = userValidationSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      message: "Validation error",
      details: error.details.map((err) => err.message),
    });
  }

  next();
};
export const validateMessage = (req, res, next) => {
  const { error } = messageValidationSchema.validate(req.body, { abortEarly: false });  
  if (error) {
    return res.status(400).json({
      message: "Validation error",
      details: error.details.map((err) => err.message),
    });
  }

  next();
};
export const validateTitle = (req, res, next) => {
  const { error } = titleValidationSchema.validate(req.body, { abortEarly: false });  
  if (error) {
    return res.status(400).json({
      message: "Validation error",
      details: error.details.map((err) => err.message),
    });
  }

  next();
};