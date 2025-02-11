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
});

const clientSchema = z.object({
    client_code: z.number().min(1,{message: "O código do cliente é obrigatório" }) ,
    name: z.string().min(2, { message: "O nome do cliente deve ser informado" }),
    cpf: z.string().min(14, { message: "O deve ser informado corretamente" }),
    identity: z.string() ,
    identity_issuer: z.string() ,
    email: z.string().email({ message: 'E-mail cliente inválido.' }),
    phone: z.string().min(15, { message: "Informe um número para contato" }) ,
    address: addressSchema,
});

const geolocationSchema = z.object({
    lat: z.number() ,
    lng: z.number() ,
    link_point:z.string() ,
});

const plantSchema = z.object({
    consumer_unit_code: z.number().min(1,{message:"Preencha numero da UC"}) , 
    name: z.string().min(2, { message: 'Nome da usina deve ter mínimo 2 caracters' }).nonempty( { message: 'Nome da usina é obrigatório' }), 
    description: z.string(), 
    class:z.string().min(1,{message:"Classe da UC deve ser selecionada"})  ,
    subgroup:z.string().min(1,{message:"Subgrupo da UC deve ser selecionada"})  ,
    connection_type:z.string().min(1,{message:"Tipo de conexão deve ser selecionado"})  ,
    generation_type:z.string().min(1,{message:"Tipo de geração deve ser selecionado"})  ,
    type_branch:z.string().min(1,{message:"Tipo de ramal deve ser selecionado"})  ,
    branch_section: z.number().min(1,{message:"Seção do ramal de entrada deve ser especificado"})  , 
    circuit_breaker: z.number().min(1,{message:"Disjuntor padrão de entrada deve ser especificado"}) ,
    installed_load: z.number() ,
    installed_power: z.number() ,
    service_voltage: z.number().gte(0,{message:"Tensão deve ser selecionada"})   ,//(0.1,{message:"Tensão deve ser selecionada"})  ,        
    address: addressSchema,
    geolocation: geolocationSchema,
});

const consumerUnitSchema = z.object({
    consumer_unit_code: z.number().min(0,{message: 'Código da UC deve ser especificado'}), 
    name: z.string().min(2, { message: 'Nome da UC deve ser informado' }) ,
    description: z.string(),         
    percentage: z.number(),
    is_plant: z.boolean(),
});

const invertersSchema = z.object({
    model: z.string().min(2, { message: 'Modelo de ve ser informado' }) ,
    manufacturer: z.string() ,
    power: z.number() ,
    quantity: z.number() ,
    total_power : z.number() ,
    description: z.string() 
});

const modulesSchema = z.object({
    model: z.string().min(2, { message: 'Nome da UC deve ser informado' }) ,
    manufacturer: z.string() ,
    description: z.string() ,
    quantity: z.number() ,
    width: z.number() ,
    height: z.number() ,
    total_area: z.number() ,
    power: z.number() ,
    total_power : z.number() ,
});

// Definindo o esquema de validação com Zod
export const projectMainSchema = z.object({
    status : z.string(),
    project_type : z.string().min(2, { message: 'Tipo do projeto deve ser informado' }) ,
    is_active: z.boolean() , // Indica se o projeto está ativo
    name: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres.' }),       
    dealership: z.string().min(2, { message: 'O nome da distribuidora deve ser informado' }) , // Nome da concessionária ou distribuidora (opcional)       
});

// Definindo o esquema de validação do cliente
export const projectClientSchema = z.object({
    client : clientSchema     
});

// Definindo o esquema de validação do cliente
export const projectPlantSchema = z.object({
    plant : plantSchema     
});

// Definindo o esquema de validação do cliente
export const projectConsumerUnitSchema = z.object({
    consumerUnit: z.array(consumerUnitSchema).min(1, "Pelo menos uma UC deve ser fornecida."),   
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
    projectClientSchema,
    projectPlantSchema,
    projectConsumerUnitSchema,
    projectEquipamentsSchema,
    projectDocumentsSchema,
])



export const getSchemaFromActiveStep = (activestep:number) => {
    //alert(activestep)
    var schema 
    switch (activestep) {
        case 0: //informações do projeto
            schema = projectMainSchema
            break;
        case 1: //informações do projeto   
            schema = projectClientSchema
            break;
        case 2: //informações da usina
            schema = projectPlantSchema
            break;
        case 3: //informações do sistema de compensação
        //alert("aqui")
            schema = projectConsumerUnitSchema
            break;
        case 4: //informações dos equipamentos
            schema = projectEquipamentsSchema
            break;
        case 5: //informações dos documentos
            schema = projectDocumentsSchema
            break;
        default: //informações do projeto
            schema = projectDocumentsSchema
    }
    return schema   
}

