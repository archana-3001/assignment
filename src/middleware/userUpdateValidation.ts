import {userUpdateValidation} from '../users.validators';

export default async function userupdateValidation(req, res, next) {
    if(req.body.Username!=null){
        res.status(404);
        return res.json({
          message: "username cannot be updated"
        });
    }else{
        console.log("put request",req.body);
    const payload = {
        First_name: req.body.First_name,
        Last_name: req.body.Last_name,
        Password: req.body.Password, // PASSWORD at least 8 character long
        Phone_number: req.body.Phone_number,
        email: req.body.email,
        Is_active: req.body.Is_active,
        Is_admin: req.body.Is_admin
    };
    const { error } = userUpdateValidation.validate(payload);
    if (error) {
        res.status(404);
        return res.json(
          {
            message: "user update validation failed ",
            error: error
          }
        );
    } else {
        next();
    }
    }
}

