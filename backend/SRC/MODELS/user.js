const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {   
    name: {type : String , require : true},
    email:{type: String },
    dateOfBirth : {type: Date},
    cpf: {type : String},
    is_active :{type:Boolean , default: true, require: false}
  },
  {
    timestamps: true, // Ativa automaticamente os campos createdAt e updatedAt
  }  
);


const User = mongoose.model("User", userSchema );

module.exports = User