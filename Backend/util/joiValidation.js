import Joi from "joi";
import { GROQ_FREE_MODELS } from "../ai/models.js";

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
    .allow("")
    .max(4000)
    .optional(),
  model: Joi.string()
    .trim()
    .valid(...GROQ_FREE_MODELS)
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
  const payload = {
    userMessage: req.body?.userMessage || "",
    model: req.body?.model,
  };

  const { error } = messageValidationSchema.validate(payload, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      message: "Validation error",
      details: error.details.map((err) => err.message),
    });
  }

  const hasText = payload.userMessage.trim().length > 0;
  const hasImage = Boolean(req.file);

  // Accept text-only, image-only, or mixed input.
  if (!hasText && !hasImage) {
    return res.status(400).json({
      message: "Validation error",
      details: ["Please provide message text or an image."],
    });
  }

  req.body.userMessage = payload.userMessage;
  req.body.model = payload.model;

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