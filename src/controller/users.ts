export default async function addUser(req, res, next){
    try{
       // write code to validate 
       console.log(req.body);
       res.status(200).send("user added!");
    }catch(err){
        console.log(err);
    }
};