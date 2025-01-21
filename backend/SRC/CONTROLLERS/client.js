const Models = require('../MODELS');
const Services = require("../SERVICES")

exports.search = async (req, res) => {
    //console.log(req.query)
    const {name = '', id, cpf, identity, client_code, email, is_active} = req.query ;
    console.log(name, id, cpf, identity, client_code, is_active);
    const filtros = {} ;
    filtros.name = { $regex: name , $options: 'i' }; // 'i' para case-insensitive = name ;
    if(id) filtros._id = id ;
    if(cpf) filtros.cpf = cpf ;// 'i' para case-insensitive = status ;
    if(identity) filtros.identity = identity ;
    if(client_code) filtros.client_code = client_code ;
    if(email) filtros.email = email ;
    if(is_active) filtros.is_active = is_active ;

    await Models.Client.find(filtros).then(data => { 
        if(data.length === 0)
            res.status(Services.HTTPStatus.DATABASE_RETURNED_AN_EMPTY_ARRAY.code).json({ message: Services.HTTPStatus.DATABASE_RETURNED_AN_EMPTY_ARRAY.message});        
        else
            res.status(Services.HTTPStatus.SUCCESS.code).json(data);          
    }).catch( err => {
        res.status(Services.HTTPStatus.INTERNAL_SERVER_ERROR.code).json({ message: err.message});
    });       
};

exports.getById = async (req, res) => {
    const {id} = req.params ;

    console.log(id)

    await Models.Client.findById(id).then(data => {              
        res.status(Services.HTTPStatus.SUCCESS.code).json(data);             
    }).catch( err => {
        res.status(Services.HTTPStatus.DATABASE_RECORD_NOT_FOUND.code).json({ message: Services.HTTPStatus.DATABASE_RECORD_NOT_FOUND.message});
    });
};

exports.create = async (req, res) => {
    console.log(req.body);
    /*
    {
        "name": "Jo�o da Silva",
        "cpf": "123.456.789-00",
        "identity": "MG1234567",
        "client_code": 1001,
        "email": "joao.silva@example.com",
        "phone": "+55 31 98765-4321",
        "consumerUnit": [
            {
            "code": 1,
            "name": "Casa Principal",
            "description": "Unidade consumidora residencial",
            "address": {
                "street": "Rua das Flores",
                "number": 123,
                "city": "Belo Horizonte",
                "state": "MG",
                "zip": 30140000
            },
            "geolocation": {
                "lat": -19.9245,
                "lng": -43.9352
            },
            "percentage": 50,
            "is_generating": true
            },
            {
            "code": 2,
            "name": "Escrit�rio",
            "description": "Unidade consumidora comercial",
            "address": {
                "street": "Avenida Paulista",
                "number": 1000,
                "city": "S�o Paulo",
                "state": "SP",
                "zip": 13100000
            },
            "geolocation": {
                "lat": -23.5614,
                "lng": -46.6564
            },
            "percentage": 30,
            "is_generating": false
            }
        ],
        "is_active": true
    }
    */
    
     const client = new Models.Client({
        name: req.body.name,                   // Nome do cliente
        cpf: req.body.cpf,                     // CPF (opcional)
        identity: req.body.identity,           // Identidade (opcional)
        client_code: req.body.client_code,     // C�digo do cliente (obrigat�rio)
        email: req.body.email,                 // Email (opcional)
        phone: req.body.phone,                 // Telefone (opcional)
        consumerUnit: req.body.consumerUnit,   // consumerUnit deve ser um array de objetos
        is_active: req.body.is_active || true  // Ativo por padr�o
      });

    await Models.Client.create(client).then(data => {      
        res.status(Services.HTTPStatus.RECORD_CREATED_SUCCESSFULLY.code).json({ message: Services.HTTPStatus.RECORD_CREATED_SUCCESSFULLY.message,});   
    }).catch(err => {
        res.status(Services.HTTPStatus.INTERNAL_SERVER_ERROR.code ).json({message: err.message });
    }); 
 };

exports.delete = async (req, res) => {
    const {id} = req.params ;
    console.log(id);

    await Models.Client.findByIdAndDelete(id).then(data => {      
        res.status(Services.HTTPStatus.RECORD_DELETED_SUCCESSFULLY.code).json({message: Services.HTTPStatus.RECORD_DELETED_SUCCESSFULLY.message });   
    }).catch(err => {
        res.status(Services.HTTPStatus.DATABASE_RECORD_NOT_FOUND.code).json({message: Services.HTTPStatus.DATABASE_RECORD_NOT_FOUND.message });
    }); 
};

exports.update = async (req, res) => {
    const {id} = req.params ;
    /*
     {
        "name": "Jo�o da Silva",
        "cpf": "123.456.789-00",
        "identity": "MG1234567",
        "client_code": 1001,
        "email": "joao.silva@example.com",
        "phone": "+55 31 98765-4321",
        "consumerUnit": [
            {
            "code": 1,
            "name": "Casa Principal",
            "description": "Unidade consumidora residencial",
            "address": {
                "street": "Rua das Flores",
                "number": 123,
                "city": "Belo Horizonte",
                "state": "MG",
                "zip": 30140000
            },
            "geolocation": {
                "lat": -19.9245,
                "lng": -43.9352
            },
            "percentage": 50,
            "is_generating": true
            },
            {
            "code": 2,
            "name": "Escrit�rio",
            "description": "Unidade consumidora comercial",
            "address": {
                "street": "Avenida Paulista",
                "number": 1000,
                "city": "S�o Paulo",
                "state": "SP",
                "zip": 13100000
            },
            "geolocation": {
                "lat": -23.5614,
                "lng": -46.6564
            },
            "percentage": 30,
            "is_generating": false
            }
        ],
        "is_active": true
    }
    */

    const clientUpdateData = {
        name: req.body.name,                   // Nome do cliente
        cpf: req.body.cpf,                     // CPF (opcional)
        identity: req.body.identity,           // Identidade (opcional)
        client_code: req.body.client_code,     // C�digo do cliente (obrigat�rio)
        email: req.body.email,                 // Email (opcional)
        phone: req.body.phone,                 // Telefone (opcional)
        consumerUnit: req.body.consumerUnit,   // consumerUnit deve ser um array de objetos
        is_active: req.body.is_active || true  // Ativo por padr�o                    
    };

    await Models.Client.findByIdAndUpdate(id, clientUpdateData , {new: true}).then(data => {        
        res.status(Services.HTTPStatus.RECORD_UPDATED_SUCCESSFULLY.code).json({ message: Services.HTTPStatus.RECORD_UPDATED_SUCCESSFULLY.message});             
    }).catch( err => {
        res.status(Services.HTTPStatus.DATABASE_RECORD_NOT_FOUND.code).json({message: Services.HTTPStatus.DATABASE_RECORD_NOT_FOUND.message });
    }); 
};

exports.consumerUnitCreate = async (req, res) => {
    const {id} = req.params ;
    const newConsumerUnit = req.body;
    console.log(id,req.body);

    try {
        // Acha o cliente pelo ID
        const client = await Models.Client.findById(id);

        if (!client) {
            res.status(Services.HTTPStatus.DATABASE_RECORD_NOT_FOUND.code ).json({message: "Cliente não encontrado" });
        }

        // Adiciona o novo consumerUnit ao array
        client.consumerUnit.push(newConsumerUnit);

        // Salva o cliente com a nova consumerUnit
        await client.save();

        // Responde com sucesso
        res.status(Services.HTTPStatus.RECORD_CREATED_SUCCESSFULLY.code).json({ message: Services.HTTPStatus.RECORD_CREATED_SUCCESSFULLY.message, 
            data: newConsumerUnit
        });  

    } catch (err) {
        res.status(Services.HTTPStatus.INTERNAL_SERVER_ERROR.code ).json({message: "Erro ao adicionar ConsumerUnit", error: err.message});
    }
 };
 