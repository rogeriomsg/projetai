const Models = require('../MODELS');
const Services = require("../SERVICES")

exports.search = async (req, res) => {
    //console.log(req.query)
    const {name = '', id, status, client_unit_code, client_name = '', client_code, is_active} = req.query ;
    console.log(name, id, status, client_unit_code, client_name, client_code, is_active);
    const filtros = {} ;
    filtros.name = { $regex: name , $options: 'i' }; // 'i' para case-insensitive = name ;
    if(id) filtros._id = id ;
    if(status) filtros.status = { $regex: status , $options: 'i' } ;// 'i' para case-insensitive = status ;
    if(client_unit_code) filtros.client_unit_code = client_unit_code ;
    filtros.client_name = { $regex: client_name , $options: 'i' }; // 'i' para case-insensitive = name ;
    if(client_code) filtros.client_code = client_code ;
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
        name: {type : String , require : true},
        client_name :  { type : String , require : true },
        client_unit_code :  { type : Number , require : true  },
        client_code : { type : Number , require : true  },
        status : {type: String , enum :['Cadastrado', 'Aguardando' , 'Aprovado' ] , default : 'Cadastrado'},
        is_active: { type: Boolean , default: true},
    }
    */

    const Device = new Models.Project({
        name: req.body.name,
        client_name :  req.body.client_name,
        client_unit_code:  req.body.client_unit_code ,        
        client_code: req.body.client_code ,
     });

    await Models.Project.create(Device).then(data => {      
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
    /*
    name: {type : String , require : true},
    deviceId :  { type : Number , require : true },
    device_type:  { type: String , default : "Fotoc�lula" },
    geolocation:  { 
      lat: { type : Number , default : 0 },
      lng: { type : Number , default : 0 },
      alt: { type : Number , default : 0 },
    },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'deviceCategory' },
    operating_mode : {type: String , enum :['Convencional', 'Comandado' , 'Agendado' ] , default : 'Convencional'},
    description: {type : String ,default: ""} ,
    rx:  { 
      hopCount: { type : Number , default : 5 }
    },
    is_active: { type: Boolean , default: false},
    gateway: { type: mongoose.Schema.Types.ObjectId, ref: 'gateway'},
    */

    const project = {
        name: req.body.name,
        deviceId:  req.body.devId,
        device_type:  req.body.device_type,
        geolocation:  req.body.geolocation,
        category: req.body.category,
        operating_mode : req.body.operating_mode,
        description: req.body.description,
        rx: req.body.rx,
        is_active: req.body.is_active,
        gateway: req.body.gateway,                       
    };
    await Models.Project.findByIdAndUpdate(id, project , {new: true}).then(data => {        
        res.status(Services.HTTPStatus.RECORD_UPDATED_SUCCESSFULLY.code).json({ message: Services.HTTPStatus.RECORD_UPDATED_SUCCESSFULLY.message});             
    }).catch( err => {
        res.status(Services.HTTPStatus.DATABASE_RECORD_NOT_FOUND.code).json({message: Services.HTTPStatus.DATABASE_RECORD_NOT_FOUND.message });
    }); 
};

 