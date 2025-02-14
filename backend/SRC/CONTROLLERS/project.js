const Models = require('../MODELS');
const Services = require("../SERVICES")

exports.search = async (req, res) => {
    const { filter, sort, limit, skip, fields } = req.query;

    // Montando a consulta dinamicamente
    const query = filter ? JSON.parse(filter) : {};
    const projection = fields ? fields.split(',').join(' ') : null;
    const sortOptions = sort ? JSON.parse(sort) : null;

    // Aplicando limites e paginação
    const options = {
      limit: limit ? parseInt(limit, 10) : 10,
      skip: skip ? parseInt(skip, 10) : 0,
    };


    // const {name = '', id, client_id, dealership = '', status, service_voltage, is_active} = req.query ;
    // console.log( id, name, client_id, dealership, status, service_voltage, is_active);    

    // const filtros = {} ;
    // filtros.name = { $regex: name , $options: 'i' }; // 'i' para case-insensitive = name ;
    // if(id) filtros._id = id ;
    // if(client_id) filtros.client_id = client_id ;
    // if(status) filtros.status = status ;
    // if(service_voltage) filtros.service_voltage = service_voltage ;
    // if(is_active) filtros.is_active = is_active ;

    //await Models.Project.find(filtros).then(data => {
    await Models.Project.find(query, projection, options).sort(sortOptions).then(data => { 
        if(data.length === 0)
            res
                .status(Services.HTTPStatus.DATABASE_RETURNED_AN_EMPTY_ARRAY.code)
                .json({
                    error:false,
                    message: Services.HTTPStatus.DATABASE_RETURNED_AN_EMPTY_ARRAY.message,
                    data: [],
                });       
        else
            res
                .status(Services.HTTPStatus.SUCCESS.code)
                .json({ 
                    error:false,
                    message: Services.HTTPStatus.SUCCESS.message,
                    data: data,
                });                           
    }).catch( err => {
        res
            .status(Services.HTTPStatus.INTERNAL_SERVER_ERROR.code)
            .json({ 
                error:true,
                message:`${Services.HTTPStatus.INTERNAL_SERVER_ERROR.message}: ${err.message}`,
                data:null
            });
    });       
};

exports.byId = async (req, res) => {
    const {id} = req.params ;
    console.log("Busca por id: ",id);
    
    await Models.Project.findById(id).then(data => { 
        if(data === null)
            res
                .status(Services.HTTPStatus.DATABASE_RECORD_NOT_FOUND.code)
                .json({ 
                    error: true,
                    message: Services.HTTPStatus.DATABASE_RECORD_NOT_FOUND.message,
                    data : null,
                });        
        else
            res
                .status(Services.HTTPStatus.SUCCESS.code)
                .json({
                    error:false,
                    message: Services.HTTPStatus.SUCCESS.message,
                    data:data,
                });          
    }).catch( err => {
        res
            .status(Services.HTTPStatus.INTERNAL_SERVER_ERROR.code)
            .json({ 
                error: true,
                message: `${Services.HTTPStatus.INTERNAL_SERVER_ERROR.message}: ${err.message}`,
                data:null
            });
    });       
};

    // exports.create = async (req, res) => {
    //     console.log("Criação: " )
    //     console.log(req.body)
    //     /*
    //     {
    //         "is_active": true,
    //         "name": "Solar Power Project A",
    //         "description": "Residential solar power installation project.",
    //         "dealership": "Neoenergia Brasília",
    //         "client": {
    //             "client_code": 12345,
    //             "name": "Maria Fulana",
    //             "cpf": "123.456.789-00",
    //             "identity": "RG12345678",
    //             "identity_issuer" : "SSP",
    //             "email": "maria.fulana@example.com",
    //             "phone": "(12) 99456-7890",
    //             "address": {
    //             "street": "123 Solar St.",
    //             "number": 456,
    //             "city": "Brasília",
    //             "state": "DF",
    //             "zip": 70000000
    //             },
    //         },
    //         "plant": {
    //             "consumer_unit_code": 67890,
    //             "name": "Residential Solar Plant",
    //             "description": "5 kW solar power plant installation.",
    //             "circuit_breaker": 30,
    //             "installed_load" : 30,
    //             "installed_power": 5,
    //             "service_voltage": 220,
    //             "address": {
    //             "street": "123 Solar St.",
    //             "number": 456,
    //             "city": "Sunnyvale",
    //             "state": "CA",
    //             "zip": 94086
    //             },
    //             "geolocation": {
    //             "lat": 37.36883,
    //             "lng": -122.03635
    //             }
    //         },
    //         "consumerUnit": [
    //             {
    //             "consumer_unit_code": 67890,
    //             "name": "Main Consumer Unit",
    //             "description": "Main unit for energy consumption.",
    //             "percentage": 100,
    //             "is_plant": true
    //             }
    //         ],
    //         "inverters": [
    //             {
    //             "model": "Inv-5000",
    //             "manufacturer": "InverterCo",
    //             "power": 5000,
    //             "quantity": 1,
    //             "description": "High-efficiency inverter."
    //             }
    //         ],
    //         "modules": [
    //             {
    //             "model": "SolarMax-400",
    //             "manufacturer": "SolarTech",
    //             "power": 400,
    //             "quantity": 13,
    //             "width": 1.2,
    //             "height": 1.6,
    //             "description": "High-efficiency solar module."
    //             }
    //         ],
    //         "path_meter_pole": "/path/to/meter_pole.jpg",
    //         "path_meter": "/path/to/meter.jpg",
    //         "path_bill": "/path/to/bill.pdf",
    //         "path_identity": "/path/to/identity.pdf",
    //         "path_procuration": "/path/to/procuration.pdf",
    //         "status": "Em cadastro"
    //     }
    //     */
    //     // const project = new Models.Project({
    //     //     is_active: req.body.is_active !== undefined ? req.body.is_active : true, // Padrão é true
    //     //     client: req.body.client, // ID do cliente, deve ser válido no banco de dados
    //     //     name: req.body.name,
    //     //     description: req.body.description,
    //     //     dealership: req.body.dealership,
    //     //     plant: req.body.plant,   
    //     //     consumerUnit:   req.body.consumerUnit,  
    //     //     inverters: req.body.inverters, // Array de inversores, conforme o schema `inverterSchema`
    //     //     modules: req.body.modules, // Array de módulos, conforme o schema `moduleSchema`
    //     //     path_meter_pole: req.body.path_meter_pole, // Caminho para arquivo (opcional)
    //     //     path_meter: req.body.path_meter, // Caminho para arquivo (opcional)
    //     //     path_bill: req.body.path_bill, // Caminho para arquivo (opcional)
    //     //     path_identity: req.body.path_identity, // Caminho para arquivo (opcional)
    //     //     path_procuration: req.body.path_procuration, // Caminho para arquivo (opcional)
    //     //     status: req.body.status, // Opcional, padrão é 'Em cadastro'
    //     // });

    //     await Models.Project.create(req.body).then(req => {     
    //         console.log("Sucesso") 
    //         res.status(Services.HTTPStatus.RECORD_CREATED_SUCCESSFULLY.code).json({ message: Services.HTTPStatus.RECORD_CREATED_SUCCESSFULLY.message,});   
    //     }).catch(err => {
    //         console.log("Sucesso") 
    //         res.status(Services.HTTPStatus.INTERNAL_SERVER_ERROR.code ).json({message: err.message });
    //     }); 
    //  };

exports.create = async (req, res) => {
    console.log("Recebendo dados para criação de projeto:", req.body);

    try {
        // Validação básica (pode ser expandida)
        if (!req.body.name || !req.body.client || !req.body.plant) {
        return res.status(400).json({ message: "Os campos 'name' e 'client' são obrigatórios." });
        }

        const { _id, ...data } = req.body; // Exclui _id de req.body
       
        // Criar o projeto diretamente no banco
        const newProject = await Models.Project.create(data);

        console.log("Projeto criado com sucesso:", newProject);

        // Retornar resposta de sucesso
        res
            .status(Services.HTTPStatus.RECORD_CREATED_SUCCESSFULLY.code)
            .json({
                error:false,
                message: Services.HTTPStatus.RECORD_CREATED_SUCCESSFULLY.message,
                data: newProject,
            });
    } catch (error) {
        console.error("Erro ao criar projeto:", error);

        // Retornar erro apropriado
        res
            .status(Services.HTTPStatus.INTERNAL_SERVER_ERROR.code)
            .json({
                error: true,
                message: `${Services.HTTPStatus.INTERNAL_SERVER_ERROR.message}: ${error.message}`,
                data : null,
            });
    }
};

exports.delete = async (req, res) => {
    const {id} = req.params ;
    console.log("Deletando registro:", id);

    await Models.Project.findByIdAndDelete(id).then(data => {      
        res
            .status(Services.HTTPStatus.RECORD_DELETED_SUCCESSFULLY.code)
            .json({
                error:false,
                message: Services.HTTPStatus.RECORD_DELETED_SUCCESSFULLY.message ,
                data: data,
            });   
    }).catch(err => {
        res
            .status(Services.HTTPStatus.DATABASE_RECORD_NOT_FOUND.code)
            .json({
                error:true,
                message: Services.HTTPStatus.DATABASE_RECORD_NOT_FOUND.message,
                data: null
            });
    }); 
};

exports.update = async (req, res) => {
    const {id} = req.params ;   
    console.log(`Recebendo dados para atualização de projeto:`, req.body);


    await Models.Project.findByIdAndUpdate(id, req.body , {new: true}).then(data => {   
        console.log("Projeto atualizado com sucesso:", data);     
        res
            .status(Services.HTTPStatus.RECORD_UPDATED_SUCCESSFULLY.code)
            .json({ 
                error: false,
                message: Services.HTTPStatus.RECORD_UPDATED_SUCCESSFULLY.message,
                data : data,
            });             
    }).catch( err => {
        res
            .status(Services.HTTPStatus.DATABASE_RECORD_NOT_FOUND.code)
            .json({
                error:true,
                message: Services.HTTPStatus.DATABASE_RECORD_NOT_FOUND.message, 
                data:null,
            });
    }); 
};

 