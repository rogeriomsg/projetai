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
        client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'projetai-client' , require: true},
        name: {type : String , require : false},    
        address:{
            street: {type : String , require : true},
            number: {type: Number, require : false},
            city: {type : String , require : true},
            state: {type : String , require : true},
            zip : {type : Number , require : true},
        },
        geolocation:  { 
            lat: { type : Number , default : 0.0  },
            lng: { type : Number , default : 0.0  },
        },
        unit_code :  { type : Number , default: 0 , require : true  },   
        description: {type : String ,default: ""} ,
        is_active: { type: Boolean , default: true},
        circuit_breaker : { type : Number , default: 0 , require : false },
        installed_power : { type : Number , default: 0 , truerequire : false },
        service_voltage : { type : Number , default: 0.127 , truerequire : false },
        percentage : { type : Number , default: 0 , require : false },
    }
    */

    const consumerUnit = new Models.ConsumerUnit({
        client_id: req.body.client_id ,
        name: req.body.name,    
        address:{
            street: req.body.street,
            number: req.body.number,
            city: req.body.city,
            state: req.body.state,
            zip : req.body.zip,
        },
        geolocation:  { 
            lat: req.body.lat,
            lng: req.body.lng,
        },
        unit_code :  req.body.unit_code,   
        description: req.body.description,
        circuit_breaker : req.body.circuit_breaker,
        installed_power : req.body.installed_power,
        service_voltage : req.body.service_voltage ,
        percentage : req.body.percentage,
     });

    await Models.ConsumerUnit.create(consumerUnit).then(data => {      
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

 