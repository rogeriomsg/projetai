const mongoose = require("mongoose");

const gatewaySchema = new mongoose.Schema(
{   
    name: { type: String , default: ""},        
    gatewayId : { type: String ,require :true},
    geolocation:{
        lat:{ type : Number , default: 0 },
        lng:{ type : Number , default: 0},
        alt:{ type : Number , default: 0}
    },
    address: { type: String ,default: ""},
},
{
  timestamps: true, // Ativa automaticamente os campos createdAt e updatedAt
}
);

const Gateway = mongoose.model("Gateway", gatewaySchema );

module.exports = Gateway