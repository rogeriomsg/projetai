const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  street: {type : String , require : true}, // Logradouro
  complement:{type:String,require:false},
  no_number:{type:Boolean,default:false},
  number: {type: Number, require : false}, // Número da residência (opcional)
  district: {type : String , require : false}, // Bairro 
  city: {type : String , require : true}, // Cidade
  state: {type : String , require : true}, // Estado
  zip : {type : Number , require : true}, // CEP

},
{ 
  _id:false //excluir o _id do subdocumento
});

const clientSchema = new mongoose.Schema({   
  client_code : { type : Number , require : true  }, // Código único do cliente
  name: {type : String , require : true}, // Nome do cliente
  cpf: {type : String , require : false}, // CPF do cliente (opcional)
  identity :{type : String , require : false}, // Documento de identidade do cliente (opcional)
  identity_issuer : {type : String , require : false}, //Emissor do documento de identidade
  email: {type : String , require : false}, // E-mail do cliente (opcional)
  phone : {type : String , require : false}, // Telefone do cliente (opcional)
  address:{type: addressSchema, require:true}, // Endereço do cliente
},
{ 
  _id:false //excluir o _id do subdocumento
});

const plantSchema = new mongoose.Schema({  
  consumer_unit_code :  { type : Number , default: 0 , require : true  }, // Código único da unidade consumidora que será instalada a usina
  name: {type : String , require : false}, // Nome da usina (opcional)
  description: {type : String ,default: ""} , // Descrição da usina (opcional)
  class:{ // classe da usina
    type: String ,default : 'Residencial'
  },
  connection_type:{ type:String ,enum:[
    "Trifásico",
    "Bifásico",
    "Monofásico"
  ] ,default: "Monofásico"},
  generation_type:{ type:String ,enum:[
    "Solar",
    "Eólica",
  ] ,default: "Solar"},
  type_branch:{ type:String ,enum:[
    "Aérea",
    "Subterrânea",
  ] ,default: "Aérea"},
  branch_section: { type : Number ,  require : true },
  subgroup: { type : String ,  default : "B1" },
  circuit_breaker : { type : Number ,  require : true }, // Valor do disjuntor em amperes do padrão de entrada da unidade consumidora 
  installed_load : { type : Number ,  require : true }, //Carga instalada - refere-se a carga instalada na residência 
  installed_power : { type : Number ,  require : true }, // Potência instalada da usina em kW - geralmente é a potência total máxima dos módulos 
  service_voltage : { type : Number ,  require : true }, // Tensão de serviço em kV
  address:{type: addressSchema, require:true}, // Endereço da usina( é o mesmo da unidade consumidora principal e endereço do cliente ) 
  geolocation:  { // Geolocalização da usina
    lat: { type : Number , default : 0.0  }, // Latitude
    lng: { type : Number , default : 0.0  }, // Longitude
    link_point:{type:String,require:false}
  },
},
{ 
  _id:false //excluir o _id do subdocumento
});

const consumerUnitSchema = new mongoose.Schema({       
  consumer_unit_code :  { type : Number , default: 0 , require : true  }, // Código único da unidade consumidora
  name: {type : String , require : false}, // Nome da unidade consumidora (opcional)
  description: {type : String ,default: ""} , // Descrição da unidade consumidora (opcional)
  percentage : { type : Number , default: 0 , require : false }, // Porcentagem de participação no sistema de compensação(opcional)
  is_plant: { type: Boolean , default: false}, // Indica se essa unidade consumidora será instalada a usina
},
{ 
  _id:false //excluir o _id do subdocumento
});

const inverterSchema = new mongoose.Schema({       
  model: {type : String , require : true}, // Modelo do inversor
  manufacturer: {type : String , require : true}, // Marca do inversor
  power : {type : Number , require : true}, // Potência do inversor em kW
  quantity: {type : Number , require : true}, // Quantidade de inversores
  total_power : {type : Number , require : true},
  description: {type : String ,default: ""}, // Descrição do inversor (opcional)
},
{ 
  _id:false //excluir o _id do subdocumento
});
  
const moduleSchema = new mongoose.Schema({       
  model: {type : String , require : true}, // Modelo do módulo fotovoltaico
  manufacturer: {type : String , require : true}, // Marca do módulo fotovoltaico
  description: {type : String ,default: "", require : false}, // Descrição do módulo (opcional)
  width : {type : Number , default: 1.15, require : true}, // Largura do módulo em metros
  height : {type : Number , require : true}, // Altura do módulo em metros
  total_area: {type : Number , require : true}, // Área total do módulo em metros
  power : {type : Number , require : true}, // Potência do módulo em kW
  quantity: {type : Number , default: 2.23, require : true}, // Quantidade de módulos
  total_power : {type : Number , require : true},
},
{ 
  _id:false //excluir o _id do subdocumento
});

const projectSchema = new mongoose.Schema(
  {  
    project_type : { // Status do projeto
      type: String , 
      enum :[
        'Até 10kWp', 
        'Maior que 10kWp', 
        'Maior que 75kWp',
      ], 
      default : 'Até 10kWp' // Status padrão: "Até 10kWp"
    },
    is_active: { type: Boolean , default: true}, // Indica se o projeto está ativo
    name: {type : String , require : false}, // Nome do projeto (opcional)
    description: {type : String ,default: ""}, // Descrição do projeto (opcional)
    dealership: {type : String , require : false}, // Nome da concessionária ou distribuidora (opcional)
    client: { type: clientSchema, require: true}, // Cliente associado ao projeto
    plant:{type: plantSchema,}, // Dados da sina associada ao projeto
    compensation_system: {type:String, require: true},
    consumerUnit: {type : [consumerUnitSchema], default: []}, // Lista de unidades consumidoras participantes do sistema de 
    inverters:{type : [inverterSchema], default: []}, // Lista de inversores usados no projeto
    modules:{type : [moduleSchema], default: []}, // Lista de módulos fotovoltaicos usados no projeto
    path_meter_pole: { data: Buffer, contentType: String }, // Caminho para a foto do poste do medidor (opcional)
    path_meter: { data: Buffer, contentType: String }, // Caminho para a foto do medidor (opcional)
    path_bill: { data: Buffer, contentType: String }, // Caminho para a fatura de energia (opcional)
    path_identity:{ data: Buffer, contentType: String }, // Caminho para a identidade do cliente (opcional)
    path_procuration:{ data: Buffer, contentType: String }, // Caminho para o arquivo de procuração (opcional)
    status : { // Status do projeto
      type: String , 
      enum :[
        'Em cadastro', 
        'Recebido pela Projetai', 
        'Em análise pela Projetai', 
        'Recebido pela distribuidora', 
        'Em análise na distribuidora', 
        'Aprovado pela distribuidora',
        'Projeto sendo executado',
        'Solicitado troca do medidor',
        'Medido trocado',
        'Usina gerando',
      ], 
      default : 'Em cadastro' // Status padrão: "Em cadastro"
    },
  },
  {
    timestamps: true, // Ativa automaticamente os campos createdAt e updatedAt
  }
);

const Project = mongoose.model("projetai-project", projectSchema );

module.exports = Project