import { EProjectSchemaType } from '@/types/IProject';
import { z } from 'zod';

const addressSchema = z.object({
    street: z.string().min(1,{message:"O logradouro deve ser informado"})  ,
    complement:z.string() ,
    no_number: z.boolean() , 
    number: z.number(),
    district:z.string().min(1,{message:"O bairro deve ser informado"})  ,
    state: z.string().min(1,{message:"O estado deve ser selecionado"})  ,
    city: z.string().min(1,{message:"O município deve ser selecionado"})  ,
    zip: z.number().min(1,{message:"O CEP deve ser especificado"}) ,
}).superRefine((data, ctx) => {    
    if (data.no_number===false && data.number===0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "O numero deve ser fornecido",
        path: ["number"], // Deixar o path vazio para indicar erro geral
      });
    }
});

const clientSchema = z.object({
    client_code: z.number(),
    name: z.string().min(2, { message: "O nome do cliente deve ser informado" }),
    cpf: z.string().min(14, { message: "O deve ser informado corretamente" }),
    email: z.string().email({ message: 'E-mail cliente inválido.' }),
    phone: z.string().min(15, { message: "Informe um número para contato" }) ,
});

const geolocationSchema = z.object({
    lat: z.number() ,
    lng: z.number() ,
    link_point:z.string() ,
});

const plantSchema = z.object({
    consumer_unit_code: z.number(), 
    name: z.string(), 
    description: z.string(), 
    class:z.string()  ,
    subgroup:z.string()  ,
    connection_type:z.string().min(1,{message:"Tipo de conexão deve ser selecionado"})  ,
    generation_type:z.string()  ,
    type_branch:z.string().min(1,{message:"Tipo de ramal deve ser selecionado"})  ,
    branch_section: z.number().min(1,{message:"Seção do ramal de entrada deve ser especificado"})  , 
    circuit_breaker: z.number().min(1,{message:"Disjuntor padrão de entrada deve ser especificado"}) ,
    installed_load: z.number() ,
    installed_power: z.number() ,
    service_voltage: z.number().gte(0,{message:"Tensão de fornecimento deve ser selecionada"})   ,//(0.1,{message:"Tensão deve ser selecionada"})  , 
    geolocation: geolocationSchema,
});

const consumerUnitSchema = z.object({
    consumer_unit_code: z.number().min(2, { message: 'Código da UC deve ser informado' }) , 
    name: z.string() ,
    description: z.string(),         
    percentage: z.number().min(0).max(100),
    is_plant: z.boolean(),
});

const invertersSchema = z.object({
    model: z.string().min(2, { message: 'Modelo do inversor deve ser informado' }) ,
    manufacturer: z.string().min(2, { message: 'Fabricante do inversor deve ser informado' }) ,
    power: z.number() ,
    quantity: z.number() ,
    total_power : z.number() ,
    description: z.string() 
});

const modulesSchema = z.object({
    model: z.string().min(2, { message: 'Modelo do módulo deve ser informado' }) ,
    manufacturer: z.string().min(2, { message: 'Fabricante do módulo deve ser informado' }) ,
    description: z.string() ,
    quantity: z.number() ,
    width: z.number() ,
    height: z.number() ,
    total_area: z.number() ,
    power: z.number() ,
    total_power : z.number() ,
});


// Definindo o esquema de validação do cliente
export const projectConsumerUnitSchema = z.object({
    consumerUnit: z.array(consumerUnitSchema)
   
}).superRefine((data, ctx) => {
    // Calcular o somatório dos percentuais
    if( data.consumerUnit.length > 0) {
        const totalPercentage = data.consumerUnit.reduce((sum, unit) => sum + unit.percentage, 0);  
        // Se o total não for exatamente 100, adicionar um erro geral
        if (totalPercentage !== 100) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `O somatório dos percentuais de todas as UCs deve ser exatamente 100. Atualmente ${totalPercentage}`,
            path: ['consumerUnit.0.percentage'], // Deixar o path vazio para indicar erro geral        
        });
        }
    }    
  });

// Definindo o esquema de validação com Zod
export const projectBasicsSchema = z.object({     
    client : clientSchema  ,
    plant : plantSchema    
});

// Definindo o esquema de validação com Zod
export const projectMainSchema = z.object({
    status : z.string(),
    is_active: z.boolean() , // Indica se o projeto está ativo
    dealership: z.string().min(2, { message: 'O nome da distribuidora deve ser informado' }) , // Nome da concessionária ou distribuidora (opcional)     
    project_type : z.string().min(2, { message: 'Tipo do projeto deve ser informado' }) ,
    name: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres.' }),       
});

export const projectEquipamentsSchema = z.object({
    inverters:  z.array(invertersSchema).min(1, "Pelo menos um inversor deve ser fornecido."),
    modules: z.array(modulesSchema).min(1, "Pelo menos um módulo deve ser fornecido."),   
});

export const projectDocumentsSchema = z.object({
    // path_meter_pole: z.instanceof(File).refine((file) => file.size > 0, {
    //     message: "O arquivo não pode estar vazio.",
    // }), // Caminho para a foto do poste do medidor (opcional)
    // path_meter: z.instanceof(File).refine((file) => file.size > 0, {
    //     message: "O arquivo não pode estar vazio.",
    // }), // Caminho para a foto do medidor (opcional)
    // path_bill: z.instanceof(File).refine((file) => file.size > 0, {
    //     message: "O arquivo não pode estar vazio.",
    // }), // Caminho para a fatura de energia (opcional)
    // path_identity:z.instanceof(File).refine((file) => file.size > 0, {
    //     message: "O arquivo não pode estar vazio.",
    // }), // Caminho para a identidade do cliente (opcional)
    // path_procuration:z.instanceof(File).refine((file) => file.size > 0, {
    //     message: "O arquivo não pode estar vazio.",
    // }), // Caminho para o arquivo de procuração (opcional)    
});


export const fullProjectSchema = z.union([
    projectMainSchema,
    projectBasicsSchema,
    projectConsumerUnitSchema,
    projectEquipamentsSchema,
    projectDocumentsSchema,
])


export const getSchemaFromActiveStep = (activestep:number) => {
    //alert(activestep)
    var schema 
    switch (activestep) {
        case 0: //informações basicas
            schema = projectMainSchema
            break;
        case 1: //informações basicas
            schema = projectBasicsSchema
            break;
        case 2: //Sistema de compensação  
            schema = projectConsumerUnitSchema
            break;       
        case 3: //informações dos equipamentos
            schema = projectEquipamentsSchema
            break;
        case 4: //informações dos documentos
            schema = projectDocumentsSchema
            break;
        default: //informações do projeto
            schema = projectDocumentsSchema
    }
    return schema   
}

