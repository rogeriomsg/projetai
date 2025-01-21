const mongoose = require("mongoose");

const inverterSchema = new mongoose.Schema(
  {       
    model: {type : String , require : true}, // Modelo do inversor
    brand: {type : String , require : true}, // Marca do inversor
    power : {type : Number , require : true}, // Potência do inversor (em watts)
    quantity: {type : Number , require : true}, // Quantidade de inversores
    description: {type : String ,default: ""}, // Descrição do inversor
  });
  
  const moduleSchema = new mongoose.Schema(
  {       
    model: {type : String , require : true}, // Modelo do módulo fotovoltaico
    brand: {type : String , require : true}, // Marca do módulo fotovoltaico
    power : {type : Number , require : true}, // Potência do módulo (em watts)
    quantity: {type : Number , default: 2.23, require : true}, // Quantidade de módulos
    width : {type : Number , default: 1.15, require : true}, // Largura do módulo (em metros)
    height : {type : Number , require : true}, // Altura do módulo (em metros)
    description: {type : String ,default: "", require : false}, // Descrição do módulo
  });
  
  const projectSchema = new mongoose.Schema(
    {   
      client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'projetai-client', require: true}, // ID do cliente associado ao projeto
      name: {type : String , require : false}, // Nome do projeto
      dealership: {type : String , require : false}, // Nome da concessionária ou revendedora
      status : { 
        type: String , 
        enum :['Em cadastro', 'Recebido', 'Em análise', 'Recebido pela distribuidora', 'Em análise na distribuidora', 'Aprovado'], 
        default : 'Em cadastro' 
      }, // Status do projeto, com valores possíveis e um valor padrão
      description: {type : String ,default: ""}, // Descrição do projeto
      is_active: { type: Boolean , default: true}, // Indica se o projeto está ativo
      circuit_breaker : { type : Number ,  require : true }, // Valor do disjuntor (em amperes)
      installed_power : { type : Number ,  require : true }, // Potência instalada no projeto (em kW)
      service_voltage : { type : Number ,  require : true }, // Tensão de serviço do projeto (em kV)
      inverters:[inverterSchema], // Lista de inversores usados no projeto
      modules:[moduleSchema], // Lista de módulos fotovoltaicos usados no projeto
      path_meter_pole: { type: String, required: false }, // Caminho para o arquivo da foto do poste do medidor
      path_meter: { type: String, required: false }, // Caminho para o arquivo da foto do medidor
      path_bill: { type: String, required: false }, // Caminho para o arquivo da foto ou PDF da fatura de energia
      path_identity:{ type: String, required: false }, // Caminho para o arquivo da foto ou PDF da identidade com foto do cliente
      path_procuration:{ type: String, required: false}, // Caminho para o arquivo PDF de procuração
    },
    {
      timestamps: true, // Ativa automaticamente os campos createdAt e updatedAt
    }
  );
// inserir 
// const project = new Order({
//    client_id: 21ghafVsdfs3tsah6651hj2,
//    name: 'Projeto do João Silva',
//    dealership: 'Neoenergia Brasília',
//    circuit_breaker :50,
//    installed_power:30.4,
//    service_voltage:0.22,
//    inverters: [
//      { model: 'A1B1', brand: 'Marca 1', quantity: 1, power: 4.5 },
//      { model: 'A1B2', brand: 'Marca 2', quantity: 1, power: 7.0 },
//      { model: 'HNT34', brand: 'Marca 3', quantity: 2, power: 2.7 },
//    ],
//    modules: [
//      { model: 'A1B1', brand: 'Marca 1', quantity: 1, power: 4.5, width : 1.21, height : 2.21},
//      { model: 'A1B2', brand: 'Marca 2', quantity: 1, power: 7.0 , width : 1.15, height : 2.18},
//      { model: 'HNT34', brand: 'Marca 3', quantity: 2, power: 2.7 , width : 1.16, height : 2.22},
//    ],
// });

// project.save()
//   .then((projeto) => {
//     console.log('Projeto salvo:', projeto);
//   })
//   .catch((err) => {
//     console.error('Erro ao salvar projeto:', err);
//   });


const Project = mongoose.model("projetai-project", projectSchema );

module.exports = Project