import validation from '../users.validators';

export default async function userValidation(req, res, next) {
    const payload = {
        First_name: req.body.First_name,
        Last_name: req.body.Last_name,
        Username: req.body.Username,
        Password: req.body.Password, // PASSWORD at least 8 character long
        Phone_number: req.body.Phone_number,
        email: req.body.email,
        Is_active: req.body.Is_active,
        Is_admin: req.body.Is_admin
    };
    const { error } = validation.validate(payload);
    if (error) {
        res.status(404);
        return res.json(
          error.message
        );
    } else {
        next();
    }
}

