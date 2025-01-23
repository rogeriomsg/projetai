const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({   
  client_code : { type : Number , require : true  }, // Código único do cliente
  name: {type : String , require : true}, // Nome do cliente
  cpf: {type : String , require : false}, // CPF do cliente (opcional)
  identity :{type : String , require : false}, // Documento de identidade do cliente (opcional)
  identity_issuer : {type : String , require : false}, //Emissor do documento de identidade
  email: {type : String , require : false}, // E-mail do cliente (opcional)
  phone : {type : String , require : false}, // Telefone do cliente (opcional)
  address:{ // Endereço do cliente
    street: {type : String , require : true}, // Logradouro do cliente
    number: {type: Number, require : false}, // Número da residência (opcional)
    city: {type : String , require : true}, // Cidade
    state: {type : String , require : true}, // Estado
    zip : {type : Number , require : true}, // CEP
  }, 
});

const plantSchema = new mongoose.Schema({  
  consumer_unit_code :  { type : Number , default: 0 , require : true  }, // Código único da unidade consumidora que será instalada a usina
  name: {type : String , require : false}, // Nome da usina (opcional)
  description: {type : String ,default: ""} , // Descrição da usina (opcional)
  circuit_breaker : { type : Number ,  require : true }, // Valor do disjuntor em amperes do padrão de entrada da unidade consumidora 
  installed_load : { type : Number ,  require : true }, //Carga instalada - refere-se a carga instalada na residência 
  installed_power : { type : Number ,  require : true }, // Potência instalada da usina em kW - geralmente é a potência total máxima dos módulos 
  service_voltage : { type : Number ,  require : true }, // Tensão de serviço em kV
  address:{ // Endereço da usina( é o mesmo da unidade consumidora principal e endereço do cliente )
    street: {type : String , require : true}, // Logradouro
    number: {type: Number, require : false}, // Número da residência (opcional)
    city: {type : String , require : true}, // Cidade
    state: {type : String , require : true}, // Estado
    zip : {type : Number , require : true}, // CEP
  },
  geolocation:  { // Geolocalização da usina
    lat: { type : Number , default : 0.0  }, // Latitude
    lng: { type : Number , default : 0.0  }, // Longitude
  },
});

const consumerUnitSchema = new mongoose.Schema({       
  consumer_unit_code :  { type : Number , default: 0 , require : true  }, // Código único da unidade consumidora
  name: {type : String , require : false}, // Nome da unidade consumidora (opcional)
  description: {type : String ,default: ""} , // Descrição da unidade consumidora (opcional)
  percentage : { type : Number , default: 0 , require : false }, // Porcentagem de participação no sistema de compensação(opcional)
  is_plant: { type: Boolean , default: false}, // Indica se essa unidade consumidora será instalada a usina
});

const inverterSchema = new mongoose.Schema({       
  model: {type : String , require : true}, // Modelo do inversor
  brand: {type : String , require : true}, // Marca do inversor
  power : {type : Number , require : true}, // Potência do inversor em kW
  quantity: {type : Number , require : true}, // Quantidade de inversores
  description: {type : String ,default: ""}, // Descrição do inversor (opcional)
});
  
const moduleSchema = new mongoose.Schema({       
  model: {type : String , require : true}, // Modelo do módulo fotovoltaico
  brand: {type : String , require : true}, // Marca do módulo fotovoltaico
  power : {type : Number , require : true}, // Potência do módulo em kW
  quantity: {type : Number , default: 2.23, require : true}, // Quantidade de módulos
  width : {type : Number , default: 1.15, require : true}, // Largura do módulo em metros
  height : {type : Number , require : true}, // Altura do módulo em metros
  description: {type : String ,default: "", require : false}, // Descrição do módulo (opcional)
});
    
const projectSchema = new mongoose.Schema(
  {   
    is_active: { type: Boolean , default: true}, // Indica se o projeto está ativo
    name: {type : String , require : false}, // Nome do projeto (opcional)
    description: {type : String ,default: ""}, // Descrição do projeto (opcional)
    dealership: {type : String , require : false}, // Nome da concessionária ou distribuidora (opcional)
    client: { type: clientSchema, require: true}, // Cliente associado ao projeto
    plant:{type: plantSchema,}, // Dados da sina associada ao projeto
    consumerUnit: {type : [consumerUnitSchema], default: []}, // Lista de unidades consumidoras participantes do sistema de 
    inverters:{type : [inverterSchema], default: []}, // Lista de inversores usados no projeto
    modules:{type : [moduleSchema], default: []}, // Lista de módulos fotovoltaicos usados no projeto
    path_meter_pole: { type: String, required: false }, // Caminho para a foto do poste do medidor (opcional)
    path_meter: { type: String, required: false }, // Caminho para a foto do medidor (opcional)
    path_bill: { type: String, required: false }, // Caminho para a fatura de energia (opcional)
    path_identity:{ type: String, required: false }, // Caminho para a identidade do cliente (opcional)
    path_procuration:{ type: String, required: false}, // Caminho para o arquivo de procuração (opcional)
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