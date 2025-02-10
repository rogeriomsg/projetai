import { z } from 'zod';

const addressSchema = z.object({
    street: z.string() ,
    complement:z.string() ,
    no_number: z.boolean() , 
    number: z.number(),
    district:z.string() ,
    state: z.string() ,
    city: z.string() ,
    zip: z.number(),
});

const clientSchema = z.object({
    client_code: z.number() ,
    name: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres.' }),
    cpf: z.string() ,
    identity: z.string() ,
    identity_issuer: z.string() ,
    email: z.string().email({ message: 'E-mail inválido.' }),
    phone: z.string() ,
    address: addressSchema,
});

const geolocationSchema = z.object({
    lat: z.number() ,
    lng: z.number() ,
    link_point:z.string() ,
});

const plantSchema = z.object({
    consumer_unit_code: z.number() , 
    name: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres.' }), 
    description: z.string() ,
    class:z.string() ,
    subgroup:z.string() ,
    connection_type:z.string() ,
    generation_type:z.string() ,
    type_branch:z.string() ,
    branch_section: z.number() , 
    circuit_breaker: z.number() ,
    installed_load: z.number() ,
    installed_power: z.number() ,
    service_voltage: z.number() ,        
    address: addressSchema,
    geolocation: geolocationSchema,
});

const consumerUnitSchema = z.object({
    key:z.string(),
    consumer_unit_code: z.number(), 
    name: z.string(), 
    description: z.string(),         
    percentage: z.number(),
    is_plant: z.boolean(),
});

const invertersSchema = z.object({
    key:z.string() ,
    model: z.string() ,
    manufacturer: z.string() ,
    power: z.number() ,
    quantity: z.number() ,
    total_power : z.number() ,
    description: z.string() 
});

const modulesSchema = z.object({
    key:z.string() ,
    model: z.string() ,
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
export const parcialProjectchema = z.object({
    status : z.string(),
    project_type : z.string().min(2, { message: 'salvar rascunho' }) ,
    is_active: z.boolean() , // Indica se o projeto está ativo
    name: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres.' }),       
    dealership: z.string() , // Nome da concessionária ou distribuidora (opcional)       
});

export const fullProjectchema = z.object({ 
    status : z.string(),
    project_type : z.string().min(2, { message: 'salvar completo' }),
    name: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres.' }),
    description: z.string() , // Descrição do projeto (opcional)
    dealership: z.string() , // Nome da concessionária ou distribuidora (opcional)
    path_meter_pole: z.instanceof(File).refine((file) => file.size > 0, {
            message: "O arquivo não pode estar vazio.",
    }), // Caminho para a foto do poste do medidor (opcional)
    path_meter: z.instanceof(File).refine((file) => file.size > 0, {
        message: "O arquivo não pode estar vazio.",
    }), // Caminho para a foto do medidor (opcional)
    path_bill: z.instanceof(File).refine((file) => file.size > 0, {
        message: "O arquivo não pode estar vazio.",
    }), // Caminho para a fatura de energia (opcional)
    path_identity:z.instanceof(File).refine((file) => file.size > 0, {
        message: "O arquivo não pode estar vazio.",
    }), // Caminho para a identidade do cliente (opcional)
    path_procuration:z.instanceof(File).refine((file) => file.size > 0, {
        message: "O arquivo não pode estar vazio.",
    }), // Caminho para o arquivo de procuração (opcional)  
    compensation_system: z.string() ,
    client: clientSchema,
    plant: plantSchema,
    consumerUnit: z.array(consumerUnitSchema).min(1, "Pelo menos uma UC deve ser fornecida."),
    inverters:  z.array(invertersSchema).min(1, "Pelo menos um inversor deve ser fornecido."),
    modules: z.array(modulesSchema).min(1, "Pelo menos um módulo deve ser fornecido."),
});

export const getSchema = (isSketch: boolean) => isSketch? parcialProjectchema : fullProjectchema

