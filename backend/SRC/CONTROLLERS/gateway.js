const Models = require('../MODELS');
const Services = require("../SERVICES")

exports.getAll = async (req, res) => {
    await Models.Gateway.find().then(data => {        
        res.status(200).json(data);             
    }).catch( err => {
        res.status(500).json({ message: err.message});
    });       
};

exports.getById = async (req, res) => {
    const {id} = req.params ;

    await Models.Gateway.findById(id).then(data => {        
        res.status(200).json(data);             
    }).catch( err => {
        res.status(422).json({ message: err.message});
    });
};

exports.delete = async (req, res) => {
    const {id} = req.params ;
    console.log(id);

    await Models.Gateway.findByIdAndDelete(id).then(data => {      
        res.status(Services.HTTPStatus.RECORD_DELETED_SUCCESSFULLY.code).json({message: Services.HTTPStatus.RECORD_DELETED_SUCCESSFULLY.message });   
    }).catch(err => {
        res.status(Services.HTTPStatus.DATABASE_RECORD_NOT_FOUND.code).json({message: Services.HTTPStatus.DATABASE_RECORD_NOT_FOUND.message });
    }); 
};

exports.create = async (req, res) => {
    //console.log(req.body);
    /*
    name: { type: String , default: ""},        
    gatewayId : { type: String ,require :true},
    geolocation:{
        lat:{ type : Number , default: 0 },
        lng:{ type : Number , default: 0},
        alt:{ type : Number , default: 0}
    },
    address: { type: String ,default: ""},
    */

    const gateway = new Models.Gateway({
        name: req.body.name ,
        gId: req.body.gId,
        geolocation: req.body.geolocation,
        address: req.body.address,
     });

    await Models.Gateway.create(gateway).then(data => {      
        res.status(Services.HTTPStatus.RECORD_CREATED_SUCCESSFULLY.code).json({ message: Services.HTTPStatus.RECORD_CREATED_SUCCESSFULLY.message,});   
    }).catch(err => {
        res.status(Services.HTTPStatus.INTERNAL_SERVER_ERROR.code ).json({message: err.message });
    }); 
 };

exports.update = async (req, res) => {
    const {id} = req.params ;
    /*
   name: { type: String , default: ""},        
    gatewayId : { type: String ,require :true},
    geolocation:{
        lat:{ type : Number , default: 0 },
        lng:{ type : Number , default: 0},
        alt:{ type : Number , default: 0}
    },
    address: { type: String ,default: ""},
    */

    const update = {
        name: req.body.name,
        gatewayId: req.body.gId,
        geolocation: req.body.geolocation,
        address: req.body.address,                     
    };
    await Models.Gateway.findByIdAndUpdate(id, update , {new: true}).then(data => {        
        res.status(Services.HTTPStatus.RECORD_UPDATED_SUCCESSFULLY.code).json({ message: Services.HTTPStatus.RECORD_UPDATED_SUCCESSFULLY.message});             
    }).catch( err => {
        res.status(Services.HTTPStatus.DATABASE_RECORD_NOT_FOUND.code).json({message: Services.HTTPStatus.DATABASE_RECORD_NOT_FOUND.message });
    }); 
};
