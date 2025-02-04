const Models = require('../MODELS');
const Services = require("../SERVICES")

exports.search = async (req, res) => {

    const {name = '', id, client_id, dealership = '', status, service_voltage, is_active} = req.query ;
    console.log( id, name, client_id, dealership, status, service_voltage, is_active);    

    const filtros = {} ;
    filtros.name = { $regex: name , $options: 'i' }; // 'i' para case-insensitive = name ;
    if(id) filtros._id = id ;
    if(client_id) filtros.client_id = client_id ;
    if(status) filtros.status = status ;
    if(service_voltage) filtros.service_voltage = service_voltage ;
    if(is_active) filtros.is_active = is_active ;

    await Models.Project.find(filtros).then(data => { 
        if(data.length === 0)
            res.status(Services.HTTPStatus.DATABASE_RETURNED_AN_EMPTY_ARRAY.code).json({ message: Services.HTTPStatus.DATABASE_RETURNED_AN_EMPTY_ARRAY.message});        
        else
            res.status(Services.HTTPStatus.SUCCESS.code).json(data);          
    }).catch( err => {
        res.status(Services.HTTPStatus.INTERNAL_SERVER_ERROR.code).json({ message: err.message});
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
      if (!req.body.name || !req.body.client) {
        return res
          .status(400)
          .json({ message: "Os campos 'name' e 'client' são obrigatórios." });
      }
  
      // Criar o projeto diretamente no banco
      const newProject = await Models.Project.create({
        is_active: req.body.is_active ?? true, // Padrão é true
        name: req.body.name,
        description: req.body.description,
        dealership: req.body.dealership,
        client: req.body.client,
        plant: req.body.plant,
        consumerUnit: req.body.consumerUnit,
        inverters: req.body.inverters,
        modules: req.body.modules,
        path_meter_pole: req.body.path_meter_pole,
        path_meter: req.body.path_meter,
        path_bill: req.body.path_bill,
        path_identity: req.body.path_identity,
        path_procuration: req.body.path_procuration,
        status: req.body.status ?? "Em cadastro", // Padrão é "Em cadastro"
      });
  
      console.log("Projeto criado com sucesso:", newProject);
  
      // Retornar resposta de sucesso
      res
        .status(Services.HTTPStatus.RECORD_CREATED_SUCCESSFULLY.code)
        .json({
          message: Services.HTTPStatus.RECORD_CREATED_SUCCESSFULLY.message,
          project: newProject,
        });
    } catch (error) {
      console.error("Erro ao criar projeto:", error);
  
      // Retornar erro apropriado
      res.status(Services.HTTPStatus.INTERNAL_SERVER_ERROR.code).json({
        message: "Erro ao criar o projeto.",
        error: error.message,
      });
    }
};

exports.delete = async (req, res) => {
    const {id} = req.params ;
    console.log(id);

    await Models.Project.findByIdAndDelete(id).then(data => {      
        res.status(Services.HTTPStatus.RECORD_DELETED_SUCCESSFULLY.code).json({message: Services.HTTPStatus.RECORD_DELETED_SUCCESSFULLY.message });   
    }).catch(err => {
        res.status(Services.HTTPStatus.DATABASE_RECORD_NOT_FOUND.code).json({message: Services.HTTPStatus.DATABASE_RECORD_NOT_FOUND.message });
    }); 
};

exports.update = async (req, res) => {
    const {id} = req.params ;
    
    // Prepara o objeto de atualização com base no corpo da requisiçãoo
    const projectUpdateData = {
        is_active: req.body.is_active !== undefined ? req.body.is_active : true, // Padrão é true
        client: req.body.client, // Cliente associado ao projeto
        name: req.body.name, // Nome do projeto (opcional)
        description: req.body.description,// Descrição do projeto (opcional)
        dealership: req.body.dealership,// Nome da concessionária ou revendedora (opcional)
        plant: req.body.plant,   // Dados da usina associada ao projeto
        consumerUnit:   req.body.consumerUnit,  // Lista de unidades consumidoras
        inverters: req.body.inverters, // Lista de inversores usados no projeto
        modules: req.body.modules, // Lista de módulos fotovoltaicos usados no projeto
        path_meter_pole: req.body.path_meter_pole, // Caminho para a foto do poste do medidor (opcional)
        path_meter: req.body.path_meter, // Caminho para a foto do medidor (opcional)
        path_bill: req.body.path_bill, // Caminho para a fatura de energia (opcional)
        path_identity: req.body.path_identity, // Caminho para a identidade do cliente (opcional)
        path_procuration: req.body.path_procuration, // Caminho para o arquivo de procuração (opcional)
        status: req.body.status, // Status do projeto - Status padrão: "Em cadastro"
    };

    await Models.Project.findByIdAndUpdate(id, projectUpdateData , {new: true}).then(data => {        
        res.status(Services.HTTPStatus.RECORD_UPDATED_SUCCESSFULLY.code).json({ message: Services.HTTPStatus.RECORD_UPDATED_SUCCESSFULLY.message});             
    }).catch( err => {
        res.status(Services.HTTPStatus.DATABASE_RECORD_NOT_FOUND.code).json({message: Services.HTTPStatus.DATABASE_RECORD_NOT_FOUND.message });
    }); 
};

 