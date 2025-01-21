const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
  {   
    name: {type : String , require : true},    
    cpf: {type : String , require : false}, 
    identity :{type : String , require : false},
    client_code : { type : Number , require : true  },
    email: {type : String , require : false},
    phone : {type : String , require : false},
    is_active: { type: Boolean , default: true},
  },
  {
    timestamps: true, // Ativa automaticamente os campos createdAt e updatedAt
  }
);


const Client = mongoose.model("projetai-client", clientSchema );

module.exports = Client