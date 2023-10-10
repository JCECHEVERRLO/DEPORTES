
const validation =(shema  ) => {
    let joiValidation =(req,res, next ) => {
    let {error} =shema.validate (req.body ) ; 
    console.log (error );

    if (error ){
        let {details}=error ;
        res.status(666 ).json ( {error: details});
} else { 
    next();
}
} ;

return joiValidation;
 }     ;
 module.exports =validation;