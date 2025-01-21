const mongoose = require("mongoose");

const consumerUnitSchema = new mongoose.Schema(
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
  },
  {
    timestamps: true, // Ativa automaticamente os campos createdAt e updatedAt
  }
);


const ConsumerUnit = mongoose.model("projetai-consumerUnit", consumerUnitSchema );

module.exports = ConsumerUnit