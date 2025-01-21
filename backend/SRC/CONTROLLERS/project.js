const Models = require('../MODELS');
const Services = require("../SERVICES")

exports.search = async (req, res) => {
    //console.log(req.query)
    const {name = '', id, client_id, dealership = '', status, service_voltage, is_active} = req.query ;
    console.log(name, id, client_id, dealership, status, service_voltage, is_active);
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

exports.getById = async (req, res) => {
    const {id} = req.params ;

    console.log(id)

    await Models.Project.findById(id).then(data => {              
        res.status(Services.HTTPStatus.SUCCESS.code).json(data);             
    }).catch( err => {
        res.status(Services.HTTPStatus.DATABASE_RECORD_NOT_FOUND.code).json({ message: Services.HTTPStatus.DATABASE_RECORD_NOT_FOUND.message});
    });
};

exports.create = async (req, res) => {
    console.log(req.body);
    /*
    {
        "client_id": "64dfb4c2e7e1ab00123abc45", 
        "name": "Projeto Solar Residencial",
        "dealership": "Distribuidora Solar SP", //Nome da distribuidora de energia respons�vel.
        "status": "Em cadastro",
        "description": "Projeto de instala��o de energia solar para resid�ncia.",
        "is_active": true,
        "circuit_breaker": 50,
        "installed_power": 5.0,
        "service_voltage": 220,
        "inverters": [
            {
            "model": "INV-5000X",
            "brand": "SolarTech",
            "power": 5000,
            "quantity": 1,
            "description": "Inversor de alta efici�ncia para uso residencial."
            }
        ],
        "modules": [
            {
            "model": "MOD-450P",
            "brand": "SunPower",
            "power": 450,
            "quantity": 12,
            "width": 1.1,
            "height": 2.0,
            "description": "M�dulos solares monocristalinos com alta efici�ncia."
            },
            {
            "model": "MOD-300P",
            "brand": "EcoSolar",
            "power": 300,
            "quantity": 8,
            "width": 1.2,
            "height": 1.8,
            "description": "Pain�is solares econ�micos para complementar o sistema."
            }
        ],
        "path_meter_pole": "/uploads/documents/meter_pole.pdf",
        "path_meter": "/uploads/documents/meter_image.png",
        "path_bill": "/uploads/documents/electric_bill.pdf",
        "path_identity": "/uploads/documents/identity_card.pdf",
        "path_procuration": "/uploads/documents/procuration.pdf"
    }
    */
    const project = new Models.Project({
        client_id: req.body.client_id, // ID do cliente, deve ser v�lido no banco de dados
        name: req.body.name,
        dealership: req.body.dealership,
        status: req.body.status, // Opcional, padr�o � 'Em cadastro'
        description: req.body.description,
        is_active: req.body.is_active !== undefined ? req.body.is_active : true, // Padr�o � true
        circuit_breaker: req.body.circuit_breaker,
        installed_power: req.body.installed_power,
        service_voltage: req.body.service_voltage,
        inverters: req.body.inverters, // Array de inversores, conforme o schema `inverterSchema`
        modules: req.body.modules, // Array de m�dulos, conforme o schema `moduleSchema`
        path_meter_pole: req.body.path_meter_pole, // Caminho para arquivo (opcional)
        path_meter: req.body.path_meter, // Caminho para arquivo (opcional)
        path_bill: req.body.path_bill, // Caminho para arquivo (opcional)
        path_identity: req.body.path_identity, // Caminho para arquivo (opcional)
        path_procuration: req.body.path_procuration // Caminho para arquivo (opcional)
    });

    await Models.Project.create(project).then(data => {      
        res.status(Services.HTTPStatus.RECORD_CREATED_SUCCESSFULLY.code).json({ message: Services.HTTPStatus.RECORD_CREATED_SUCCESSFULLY.message,});   
    }).catch(err => {
        res.status(Services.HTTPStatus.INTERNAL_SERVER_ERROR.code ).json({message: err.message });
    }); 
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
    
    // Prepara o objeto de atualiza��o com base no corpo da requisi��o
    const projectUpdateData = {
        name: req.body.name, // Nome do projeto
        dealership: req.body.dealership, // Nome da concession�ria (opcional)
        status: req.body.status || 'Em cadastro', // Status do projeto (opcional, com valor padr�o)
        description: req.body.description, // Descri��o do projeto (opcional)
        is_active: req.body.is_active !== undefined ? req.body.is_active : true, // Ativo por padr�o
        circuit_breaker: req.body.circuit_breaker, // Disjuntor (obrigat�rio)
        installed_power: req.body.installed_power, // Pot�ncia instalada (obrigat�rio)
        service_voltage: req.body.service_voltage, // Tens�o de servi�o (obrigat�rio)
        inverters: req.body.inverters, // Lista de inversores (opcional)
        modules: req.body.modules, // Lista de m�dulos fotovoltaicos (opcional)
        path_meter_pole: req.body.path_meter_pole, // Caminho para a foto do poste do medidor (opcional)
        path_meter: req.body.path_meter, // Caminho para a foto do medidor (opcional)
        path_bill: req.body.path_bill, // Caminho para a fatura de energia (opcional)
        path_identity: req.body.path_identity, // Caminho para a identidade (opcional)
        path_procuration: req.body.path_procuration, // Caminho para a procura��o (opcional)
    };

    await Models.Project.findByIdAndUpdate(id, projectUpdateData , {new: true}).then(data => {        
        res.status(Services.HTTPStatus.RECORD_UPDATED_SUCCESSFULLY.code).json({ message: Services.HTTPStatus.RECORD_UPDATED_SUCCESSFULLY.message});             
    }).catch( err => {
        res.status(Services.HTTPStatus.DATABASE_RECORD_NOT_FOUND.code).json({message: Services.HTTPStatus.DATABASE_RECORD_NOT_FOUND.message });
    }); 
};

 