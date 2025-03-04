import Joi from 'joi';
import { MAX_URLS } from '../constants';

export const baseValidation = {
  body: Joi.object({
    username: Joi.string().required().messages({
      'string.base': `Username should be a type of text`,
      'any.required': `Username is a required field`,
    }),
    password: Joi.string().required().messages({
      'string.base': `Password should be a type of text`,
      'any.required': `Password is a required field`,
    }),
  }),
};

export const createScrapingUrlsValidation = {
  body: Joi.object({
    url: Joi.array()
      .items(
        Joi.string().required().messages({
          'string.base': `Each URL should be a type of text`,
          // 'string.uri': `Each URL should be a valid URI`,
          'any.required': `Each URL is a required field`,
        }),
      )
      .max(MAX_URLS)
      .required()
      .messages({
        'array.base': `URLs should be an array`,
        'any.required': `URLs is a required field`,
      }),
  }),
};

export const searchMediaValidation = {
  query: Joi.object({
    type: Joi.string().valid('images', 'videos', 'url').messages({
      'string.base': `Type should be a type of text`,
      'any.only': `Type should be either 'image' or 'video'`,
    }),
    searchText: Joi.string().allow('').optional().messages({
      'string.base': `Search text should be a type of text`,
    }),
    page: Joi.number().optional().messages({
      'number.base': `Page should be a type of number`,
    }),
    limit: Joi.number().optional().messages({
      'number.base': `Limit should be a type of number`,
    }),
  }),
};

export const getMediaByIdValidation = {
  params: Joi.object({
    id: Joi.number().messages({
      'number.base': `Id should be a type of number`,
    }),
  }),
};
