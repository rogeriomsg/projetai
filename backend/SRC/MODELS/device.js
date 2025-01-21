const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema(
  {   
    name: {type : String , require : true},
    deviceId :  { type : Number , require : true },
    device_type:  { type: String , default : "Fotocelula" },
    geolocation:  { 
      lat: { type : Number , default : 0.0  },
      lng: { type : Number , default : 0.0  },
      alt: { type : Number , default : 0.0  },
    },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'deviceCategory' , require: true},
    operating_mode : {type: String , enum :['Convencional', 'Comandado' , 'Agendado' ] , default : 'Convencional'},
    description: {type : String ,default: ""} ,
    rx:  { 
      hopCount: { type : Number , default : 5 ,require: false},
    },
    is_active: { type: Boolean , default: false},
    gateway: { type: mongoose.Schema.Types.ObjectId, ref: 'gateway'},
    address:  { type: String , default: ""},
  },
  {
    timestamps: true, // Ativa automaticamente os campos createdAt e updatedAt
  }
);


const Device = mongoose.model("Device", deviceSchema );

module.exports = Device