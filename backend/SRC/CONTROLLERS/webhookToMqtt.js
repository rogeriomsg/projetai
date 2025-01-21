const Models = require('../MODELS');
const Services = require("../SERVICES")

var mqttClient = new Services.MqttHandler.MqttHandler();
mqttClient.connect();

exports.ordersClosed = async (req, res) => {


    console.log(req.body)

    //mqttClient.sendMessage(req.body.msg)



    res.status(Services.HTTPStatus.SUCCESS.code).send("Enviado");
    
    

};