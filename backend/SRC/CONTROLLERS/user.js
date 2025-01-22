const Models = require('../MODELS');
const Services = require("../SERVICES")

exports.search = async (req, res) => {
    console.log(req.body);
    //console.log(req.query)
    const {name = '', id, email, cpf, dateOfBirth, is_active } = req.query ;
    console.log(name, id, email, cpf, dateOfBirth, is_active);
    const filtros = {} ;
    filtros.name = { $regex: name , $options: 'i' }; // 'i' para case-insensitive = name ;
    if(id) filtros._id = id ;
    if(cpf) filtros.cpf = cpf ;// 'i' para case-insensitive = status ;    
    if(email) filtros.email = email ;
    if(is_active) filtros.is_active = is_active ;
/*
    {   
        "name": "Nome do usuário",
        "email":"usuario@email",
        "dateOfBirth" : '09-05-1981',
        "cpf": "003.491.760-86",
    }
    */


    await Models.User.find().then(data => {        
        if(data.lenght === 0)
            res.status(Services.HTTPStatus.DATABASE_RETURNED_AN_EMPTY_ARRAY.code).json({ message: Services.HTTPStatus.DATABASE_RETURNED_AN_EMPTY_ARRAY.message});   
        else         
            res.status(Services.HTTPStatus.SUCCESS.code).json(data);   
    }).catch( err => {
        res.status(Services.HTTPStatus.INTERNAL_SERVER_ERROR.code).json({ message: err.message});
    });       
};


exports.create = async (req, res) => {
    console.log(req.body);
    /*
    {   
        "name": "Nome do usuário",
        "email":"usuario@email",
        "dateOfBirth" : '09-05-1981',
        "cpf": "003.491.760-86",
        is_active : true,
    }
    */
    const userDataCreate = new Models.User({
        name: req.body.name,
        email: req.body.email,
        dateOfBirth: req.body.dateOfBirth,
        cpf: req.body.cpf,
        is_active : true 
     });

    await Models.User.create(userDataCreate).then(data => {      
        res.status(Services.HTTPStatus.RECORD_CREATED_SUCCESSFULLY.code).json({ message: Services.HTTPStatus.RECORD_CREATED_SUCCESSFULLY.message,});   
    }).catch(err => {
        res.status(Services.HTTPStatus.INTERNAL_SERVER_ERROR.code ).json({message: err.message });
    }); 
 };

exports.delete = async (req, res) => {
    const {id} = req.params ;
    console.log(id);

    await Models.User.findByIdAndDelete(id).then(data => {      
        res.status(Services.HTTPStatus.RECORD_DELETED_SUCCESSFULLY.code).json({message: Services.HTTPStatus.RECORD_DELETED_SUCCESSFULLY.message });   
    }).catch(err => {
        res.status(Services.HTTPStatus.DATABASE_RECORD_NOT_FOUND.code).json({message: Services.HTTPStatus.DATABASE_RECORD_NOT_FOUND.message });
    }); 
};

exports.update = async (req, res) => {
    const {id} = req.params ;
    /*
    {   
        "name": "Nome do usuário",
        "email":"usuario@email",
        "dateOfBirth" : '09-05-1981',
        "cpf": "003.491.760-86",
        is_active : true,
    }
    */
    const userDataUpdate = {
        name: req.body.name,
        email: req.body.email,
        dateOfBirth: req.body.dateOfBirth,
        cpf: req.body.cpf,
        is_active : req.body.is_active                        
    };
    await Models.User.findByIdAndUpdate(id, userDataUpdate , {new: true}).then(data => {        
        res.status(Services.HTTPStatus.RECORD_UPDATED_SUCCESSFULLY.code).json({ message: Services.HTTPStatus.RECORD_UPDATED_SUCCESSFULLY.message});             
    }).catch( err => {
        res.status(Services.HTTPStatus.DATABASE_RECORD_NOT_FOUND.code).json({message: Services.HTTPStatus.DATABASE_RECORD_NOT_FOUND.message });
    }); 
};
