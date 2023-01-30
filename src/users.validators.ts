import Joi from "joi";
import { ValidationErrorFunction } from "joi";

const validation=Joi.object({
    First_name: Joi.string().required(),
    Last_name : Joi.string().required(),
    Username : Joi.string().alphanum().min(3).max(25).trim(true).required(),
    Password : Joi.string().min(8).trim(true).required(),
    Phone_number: Joi.string().length(10).pattern(/[6-9]{1}[0-9]{9}/).required(),
    email : Joi.string().email().trim(true).required(),
    Is_active : Joi.boolean().required(),
    Is_admin : Joi.boolean().required(),

})

export default validation;