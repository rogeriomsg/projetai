const mongoose = require("mongoose");

const consumerUnitSchema = new mongoose.Schema(
{       
  code :  { type : Number , default: 0 , require : true  },   
  name: {type : String , require : false},    
  description: {type : String ,default: ""} ,
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
  percentage : { type : Number , default: 0 , require : false },
  is_generating: { type: Boolean , default: false},
});


const clientSchema = new mongoose.Schema(
  {   
    name: {type : String , require : true},    
    cpf: {type : String , require : false}, 
    identity :{type : String , require : false},
    client_code : { type : Number , require : true  },
    email: {type : String , require : false},
    phone : {type : String , require : false},
    consumerUnit: {type : [consumerUnitSchema], default: []},
    is_active: { type: Boolean , default: true},
  },
  {
    timestamps: true, // Ativa automaticamente os campos createdAt e updatedAt
  }
);


const Client = mongoose.model("projetai-client", clientSchema );

module.exports = Client