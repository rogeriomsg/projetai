const Services = require("../../SERVICES")


const validateDeviceId = async (req, res) => {
    if(req.method !== 'POST' ) return;
    //console.log(req.body);
    const {body} = req ;
    if(body.deviceId === undefined)
    {
        res.status(Services.HTTPStatus.MANDATORY_FIELDS_NOT_PROVIDED_OR_INVALID);
        throw new Error("The field 'devideId' is required.");
    }
    if(body.desviceId <= 0)
    {
        res.status(Services.HTTPStatus.MANDATORY_FIELDS_NOT_PROVIDED_OR_INVALID);
        throw new Error("The field 'deviceId' must have a number greater than 0");
    }       
 };

 

 // Middleware de valida��o geral
const Validate = async (req, res, next) => {
    try {
      // Executa todas as valida��es em paralelo
      await Promise.all([
        Services.Authentication.IsAuthenticated(req,res),
        validateDeviceId(req,res),
        //adicionar aqui mais func�es de valida��o conforme necess�rio
      ]);
      next(); // Continua para o controlador se todas as valida��es passarem
    } catch (error) {
      res.json({ message: error.message }); // Retorna o erro de valida��o
    }
};

module.exports = { 
    Validate ,
};