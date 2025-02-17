import { IAddress } from "./IUtils";

export interface IProjectDataValues {
    _id:string ,
    status : EProjectStatus | "",
    project_type : string | String | "";
    is_active: boolean; // Indica se o projeto está ativo
    name: string | String | ""; // Nome do projeto (opcional)
    description: string | String | ""; // Descrição do projeto (opcional)
    dealership: string | String | ""; // Nome da concessionária ou distribuidora (opcional)
    
    path_meter_pole: IFile | null; // Caminho para a foto do poste do medidor
    path_meter: IFile | null; // Caminho para a foto do medidor
    path_bill: IFile | null; // Caminho para a fatura de energia
    path_identity:IFile | null; // Caminho para a identidade do cliente
    path_procuration:IFile | null ; // Caminho para o arquivo de procuração
    path_optional:IFile | null ; // Caminho para o arquivo de procuração (opcional)  

    compensation_system: string | String | "";
    client: {
        client_code: number | "";
        name: string | String | "";
        person : EPerson ,
        cpf: string | String | "" ;
        cnpj: string | String | "";
        identity: string | String | ""; 
        identity_issuer:string | String | "";
        email: string | String | "";
        phone: string | String | "";
        address: IAddress
    };
    plant: { 
        consumer_unit_code: number | ""; 
        name: string | String | ""; 
        description: string | String | "";
        class: string | String | "";
        subgroup: string | String | "";
        connection_type:string | String | "";
        generation_type:string | String | "";
        type_branch: string | String | "";
        branch_section: number | ""; 
        circuit_breaker: number | "";
        installed_load: number | "";
        installed_power: number | "";
        service_voltage: string | "";        
        address: IAddress
        geolocation: {
            lat: number | "";
            lng: number | "";
            link_point: string | String | "";
        }; 
    };
    consumerUnit: { 
        consumer_unit_code: number | ""; 
        name: string | String | ""; 
        description: string | String | "";         
        percentage: number | "";
        is_plant: Boolean;
    }[] | [] | null; 
    inverters: {
        model: string | String | "";
        manufacturer: string | String | "";
        power: number | "";
        quantity: number | "";
        total_power : number | "";
        description: string | String | "";
    }[];
    modules: {
        model: string;
        manufacturer: string | String | "";
        description: string | String | "";
        quantity: number | "";
        width: number | "";
        height: number | "";
        total_area: number | "";
        power: number | "";
        total_power : number | "";
    }[];
};

export enum EPerson {
    cpf = "cpf",
    cnpj = "cnpj",
}
export interface IFile {
    filename: string;
    mimetype: string;
    size: number;
    data: string; // Armazena os arquivos diretamente no banco em formato Base64 (melhor para pequenos arquivos)
}

export interface IProjectResponse {
    error: boolean;
    message: string;
    data:any
}

// Definindo uma enumeração para definir o esquema de validação do formulário de projetos 
export enum EProjectSchemaType {
    stepInfoProject = "stepInfoProject",
    stepInfoClient = "stepInfoClient",
    stepInfoPlant = "stepInfoPlant",
    stepCompensationsystem = "stepCompensationsystem",
    stepEquipments = "stepEquipments",
    stepDocuments = "stepDocuments",
    sketch = "Sketch"
};

export enum EProjectStatus {
    None = "None",
    Rascunho = "Rascunho",
    AguardandoPagamento = "Aguardando pagamento",
    RecebidoPelaProjetai = "Recebido pela Projetai",
};

export enum EProjectType{
    Ate10 = "Micro até 10kW",
    MicroMaiorQue10 = "Micro > 10 kWp",
    MicroMaiorQue10MenorIgual75 = "Micro > 10kWp <= 75kW",
    MiniMaiorQue75MenorIgual5MW = "Mini > 75kWp <= 5MW",
};

export enum EDealership{
    NeoenergiaBsb = "Neoenergia Brasília",
    Goias = "Goiás",
    
};

export enum EGenerationType{
    Solar = "Solar",
    Eolica = "Eólica",
    BioMassa = "Bio Massa"
};

export enum EClassUC{
    Residencial = "Residencial",
    Condominio = "Condomínio",
    Consorcio = "Consórcio",
    Associacao = "Associação"
};

export enum ESubgroup{
    B1 = "B1",
    B2 = "B2",
};

export enum EVoltageskV{
    V120_240 = '120/240V',
    V127_220 = '127/220V', 
    V220_380 = '220/380V',
    V440 = '440V',
    V13800 = '13800V',
    V34500 = '34500V',
};

export enum ETypeBranch{
    aerial = "Aéreo",
    underground = "Subterrâneo"
};

export enum EBranchSection{
    BS10 = "10",
    BS16 = "16",
    BS20 = "20",
    BS30 = "25",
    BS50 = "50",
};

export enum EConnectionType{
    SinglePhase = "Monofásico",
    TwoPhase = "Bifásico",
    ThreePhase = "Trifásico"
};
export enum ECircuitBreaker{
    CB10 = "20",
    CB16 = "16",
    CB30 = "30",
    CB36 = "36",
    CB50 = "50",
    CB63 = "63",
    CB80 = "80",
};
