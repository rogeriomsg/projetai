const Services = require("../../SERVICES")

function printf(format, ...args) {
    return format.replace(/%s/g, () => args.shift());
}

const validateName = async (req, res) => {
    if(req.method !== 'POST' ) return;
    console.log("validateName  "+req.body); 
    const campo = "name";   
    const {body} = req ;
    if(body[campo] === undefined)
    {
        res.status(Services.HTTPStatus.MANDATORY_FIELDS_NOT_PROVIDED.code);
        throw new Error(printf(Services.HTTPStatus.MANDATORY_FIELDS_NOT_PROVIDED.message,campo));
    }
    if(body[campo].trim() === "")
    {
        res.status(Services.HTTPStatus.EMPTY_MANDATORY_FIELDS.code);
        throw new Error(printf(Services.HTTPStatus.EMPTY_MANDATORY_FIELDS.message,campo));
    }     
 };

const validateDeviceId = async (req, res) => {
    if(req.method !== 'POST' ) return;
    console.log("validateDeviceId  "+req.body);
    const campo = "deviceId";   
    const {body} = req ;    
    if(body[campo] === undefined)
    {
        res.status(Services.HTTPStatus.MANDATORY_FIELDS_NOT_PROVIDED.code);
        throw new Error(printf(Services.HTTPStatus.MANDATORY_FIELDS_NOT_PROVIDED.message,campo));
    }
    if(body[campo] <= 0 || body[campo] !== Number(body[campo]))
    {
        res.status(Services.HTTPStatus.INVALID_MANDATORY_FIELDS.code);
        throw new Error(printf(Services.HTTPStatus.INVALID_MANDATORY_FIELDS.message,campo));
    }       
 };
//Middleware de valida��o geral
const Validate = async (req, res, next) => {
    try 
    {
      // Executa todas as valida��es em paralelo
      await Promise.all([
        Services.Authentication.IsAuthenticated(req,res),
        validateName(req,res),
        validateDeviceId(req,res),
        //adicionar aqui mais func�es de valida��o conforme necess�rio
      ]);
      next(); // Continua para o controlador se todas as valida��es passarem
    } 
    catch (error) 
    {
      res.json({ message: error.message }); // Retorna o erro de valida��o
    }
};




module.exports = { 
    Validate,
};




