const Models = require('../MODELS');
const Services = require("../SERVICES")

exports.getAll = async (req, res) => {
    console.log("Teste");

    await Models.DeviceCategory.find().then(data => {     
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

    await Models.DeviceCategory.findById(id).then(data => { 
        res.status(Services.HTTPStatus.SUCCESS.code).json(data);             
    }).catch( err => {
        res.status(Services.HTTPStatus.DATABASE_RECORD_NOT_FOUND.code).json({ message: Services.HTTPStatus.DATABASE_RECORD_NOT_FOUND.message});
    });
};

exports.create = async (req, res) => {
    //console.log(req.body);

    const Device = new Models.DeviceCategory({
        name: req.body.name,
        description: req.body.description,
     });

    await Models.DeviceCategory.create(Device).then(data => {      
        res.status(Services.HTTPStatus.RECORD_CREATED_SUCCESSFULLY.code).json({ message: Services.HTTPStatus.RECORD_CREATED_SUCCESSFULLY.message,});   
    }).catch(err => {
        res.status(Services.HTTPStatus.INTERNAL_SERVER_ERROR.code ).json({message: err.message });
    }); 
 };

exports.delete = async (req, res) => {
    const {id} = req.params ;
    console.log(id);

    await Models.DeviceCategory.findByIdAndDelete(id).then(data => {      
        res.status(Services.HTTPStatus.RECORD_DELETED_SUCCESSFULLY.code).json({message: Services.HTTPStatus.RECORD_DELETED_SUCCESSFULLY.message });   
    }).catch(err => {
        res.status(Services.HTTPStatus.DATABASE_RECORD_NOT_FOUND.code).json({message: Services.HTTPStatus.DATABASE_RECORD_NOT_FOUND.message });
    }); 
};

exports.update = async (req, res) => {
    const {id} = req.params ;

    const update = {
        name: req.body.name,
        description : req.body.description,                       
    };
    await Models.DeviceCategory.findByIdAndUpdate(id, update , {new: true}).then(data => {        
        res.status(Services.HTTPStatus.RECORD_UPDATED_SUCCESSFULLY.code).json({ message: Services.HTTPStatus.RECORD_UPDATED_SUCCESSFULLY.message});             
    }).catch( err => {
        res.status(Services.HTTPStatus.DATABASE_RECORD_NOT_FOUND.code).json({message: Services.HTTPStatus.DATABASE_RECORD_NOT_FOUND.message });
    }); 
};