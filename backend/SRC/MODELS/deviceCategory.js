const mongoose = require("mongoose");

const deviceCategorySchema = new mongoose.Schema(
  {   
    name: {type : String , require : true},
    description: {type : String } ,
    selected :  {type : String }  
  },
  {
    timestamps: true, // Ativa automaticamente os campos createdAt e updatedAt
  }  
);

const DeviceCategory = mongoose.model("DeviceCategory", deviceCategorySchema );

module.exports = DeviceCategory