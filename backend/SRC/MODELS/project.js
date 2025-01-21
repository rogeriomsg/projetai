const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {   
    name: {type : String , require : true},
    client_name :  { type : String , require : true },
    // address:{
    //   street: {type : String , require : true},
    //   number: {type: Number},
    //   city: {type : String , require : true},
    //   state: {type : String , require : true},
    //   zip : {type : Number },
    // },
    // contact:
    // {
    //   phone: {type : String },
    //   email: {type : String },
    // },
    // geolocation:  { 
    //   lat: { type : Number , default : 0.0  },
    //   lng: { type : Number , default : 0.0  },
    // },
    client_unit_code :  { type : Number , require : true  },
    client_code : { type : Number , require : true  },
    //UCNumber: { type: mongoose.Schema.Types.ObjectId, ref: 'deviceCategory' , require: true},
    status : {type: String , enum :['Cadastrado', 'Aguardando' , 'Aprovado' ] , default : 'Cadastrado'},
    //description: {type : String ,default: ""} ,
    // rx:  { 
    //   hopCount: { type : Number , default : 5 ,require: false},
    // },
    is_active: { type: Boolean , default: true},
    //gateway: { type: mongoose.Schema.Types.ObjectId, ref: 'gateway'},
    //address:  { type: String , default: ""},
  },
  {
    timestamps: true, // Ativa automaticamente os campos createdAt e updatedAt
  }
);


const Project = mongoose.model("projetai-project", projectSchema );

module.exports = Project