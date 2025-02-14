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
    console.log(`Recebendo dados para atualização de projeto:`, req.body);
    const {id} = req.params ;   


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

 