const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  street: {type : String , require : false}, // Logradouro
  complement:{type:String,require:false},
  no_number:{type:Boolean,default:false},
  number: {type: Number, require : false}, // Número da residência (opcional)
  district: {type : String , require : false}, // Bairro 
  city: {type : String , require : false}, // Cidade
  state: {type : String , require : false}, // Estado
  zip : {type : Number , require : false}, // CEP

},
{ 
  _id:false //excluir o _id do subdocumento
});

const clientSchema = new mongoose.Schema({   
  client_code : { type : Number , require : false  }, // Código único do cliente
  name: {type : String , require : false}, // Nome do cliente
  person : {type: String , enum : [
    'cpf',
    'cnpj'
  ] , require : false}, // Nome do cliente
  cpf: {type : String , require : false}, // CPF do cliente (opcional)
  cnpj:{type : String , require : false},
  identity :{type : String , require : false}, // Documento de identidade do cliente (opcional)
  identity_issuer : {type : String , require : false}, //Emissor do documento de identidade
  email: {type : String , require : false}, // E-mail do cliente (opcional)
  phone : {type : String , require : false}, // Telefone do cliente (opcional)
  address:{type: addressSchema, require:false}, // Endereço do cliente
},
{ 
  _id:false //excluir o _id do subdocumento
});

const plantSchema = new mongoose.Schema({  
  consumer_unit_code :  { type : Number , require : false  }, // Código único da unidade consumidora que será instalada a usina
  name: {type : String , require : false}, // Nome da usina (opcional)
  description: {type : String ,default: ""} , // Descrição da usina (opcional)
  class:{ type: String , require : false  },
  connection_type:{ type:String , require : false},
  generation_type:{ type:String , require : false},
  type_branch:{ type:String , require : false},
  branch_section: { type : Number ,  require : false },
  subgroup: { type : String , require : false },
  circuit_breaker : { type : Number ,  require : false }, // Valor do disjuntor em amperes do padrão de entrada da unidade consumidora 
  installed_load : { type : Number ,  require : false }, //Carga instalada - refere-se a carga instalada na residência 
  installed_power : { type : Number ,  require : false }, // Potência instalada da usina em kW - geralmente é a potência total máxima dos módulos 
  service_voltage : { type : String ,  require : false }, // Tensão de serviço em kV
  address:{type: addressSchema, require:false}, // Endereço da usina( é o mesmo da unidade consumidora principal e endereço do cliente ) 
  geolocation:  { // Geolocalização da usina
    lat: { type : Number , require : false  }, // Latitude
    lng: { type : Number , require : false  }, // Longitude
    link_point:{type:String,require:false}
  },
},
{ 
  _id:false //excluir o _id do subdocumento
});

const consumerUnitSchema = new mongoose.Schema({       
  consumer_unit_code :  { type : Number ,  require : false  }, // Código único da unidade consumidora
  name: {type : String , require : false}, // Nome da unidade consumidora (opcional)
  description: {type : String ,default: ""} , // Descrição da unidade consumidora (opcional)
  percentage : { type : Number ,  require : false }, // Porcentagem de participação no sistema de compensação(opcional)
  is_plant: { type: Boolean , default: false}, // Indica se essa unidade consumidora será instalada a usina
},
{ 
  _id:false //excluir o _id do subdocumento
});

const inverterSchema = new mongoose.Schema({       
  model: {type : String , require : false}, // Modelo do inversor
  manufacturer: {type : String , require : false}, // Marca do inversor
  power : {type : Number , require : false}, // Potência do inversor em kW
  quantity: {type : Number , require : false}, // Quantidade de inversores
  total_power : {type : Number , require : false},
  description: {type : String ,default: ""}, // Descrição do inversor (opcional)
},
{ 
  _id:false //excluir o _id do subdocumento
});
  
const moduleSchema = new mongoose.Schema({       
  model: {type : String , require : false}, // Modelo do módulo fotovoltaico
  manufacturer: {type : String , require : false}, // Marca do módulo fotovoltaico
  description: {type : String ,default: "", require : false}, // Descrição do módulo (opcional)
  width : {type : Number ,  require : false}, // Largura do módulo em metros
  height : {type : Number , require : false}, // Altura do módulo em metros
  total_area: {type : Number , require : false}, // Área total do módulo em metros
  power : {type : Number , require : false}, // Potência do módulo em kW
  quantity: {type : Number , require : false}, // Quantidade de módulos
  total_power : {type : Number , require : false},
},
{ 
  _id:false //excluir o _id do subdocumento
});

const fileSchema = new mongoose.Schema({
  filename: String,
  mimetype: String,
  data: String, // Armazena os arquivos diretamente no banco em Base64 (melhor para pequenos arquivos)
}, { timestamps: true });

const projectSchema = new mongoose.Schema(
  {  
    project_type : { // Tipo de projeto
      type: String ,require : false // Status padrão: "Até 10kWp"
    },
    is_active: { type: Boolean , default: true}, // Indica se o projeto está ativo
    name: {type : String , require : false}, // Nome do projeto (opcional)
    description: {type : String ,default: ""}, // Descrição do projeto (opcional)
    dealership: {type : String , require : false}, // Nome da concessionária ou distribuidora (opcional)
    client: { type: clientSchema, require: false}, // Cliente associado ao projeto
    plant:{type: plantSchema, require : false}, // Dados da usina associada ao projeto
    compensation_system: {type:String, require: false},
    consumerUnit: {type : [consumerUnitSchema], require : false }, // Lista de unidades consumidoras participantes do sistema de 
    inverters:{type : [inverterSchema], require : false}, // Lista de inversores usados no projeto
    modules:{type : [moduleSchema], default: []}, // Lista de módulos fotovoltaicos usados no projeto
    path_meter_pole: { type: fileSchema, require : false},// Caminho para a foto do poste do medidor (opcional)
    path_meter: { type: fileSchema, require : false}, // Caminho para a foto do medidor (opcional)
    path_bill: { type: fileSchema, require : false}, // Caminho para a fatura de energia (opcional)
    path_identity:{ type: fileSchema, require : false}, // Caminho para a identidade do cliente (opcional)
    path_procuration:{ type: fileSchema, require : false}, // Caminho para o arquivo de procuração (opcional)
    path_optional:{ type: fileSchema, require : false}, // Caminho para o arquivo de procuração (opcional)
    status : { // Status do projeto
      type: String ,       
      require : false
    },
  },
  {
    timestamps: true, // Ativa automaticamente os campos createdAt e updatedAt
  }
);

const Project = mongoose.model("projetai-project", projectSchema );

module.exports = Project