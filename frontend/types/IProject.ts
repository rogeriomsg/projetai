import { IAddress } from "./IUtils";

export interface IProjectDataValues {
    _id:string ,
    status : EProjectStatus | "",
    project_type : string;
    is_active: boolean; // Indica se o projeto está ativo
    name: string; // Nome do projeto (opcional)
    description: string; // Descrição do projeto (opcional)
    dealership: string; // Nome da concessionária ou distribuidora (opcional)
    
    path_meter_pole: IFile | null; // Caminho para a foto do poste do medidor (opcional)
    path_meter: IFile | null; // Caminho para a foto do medidor (opcional)
    path_bill: IFile | null; // Caminho para a fatura de energia (opcional)
    path_identity:IFile | null; // Caminho para a identidade do cliente (opcional)
    path_procuration:IFile | null ; // Caminho para o arquivo de procuração (opcional)  

    compensation_system: string;
    client: {
        client_code: number | "";
        name: string;
        cpf: string;
        identity: string;
        identity_issuer:string;
        email: string;
        phone: string;
        address: IAddress
    };
    plant: { 
        consumer_unit_code: number | ""; 
        name: string; 
        description: string;
        class:string;
        subgroup:string;
        connection_type:string;
        generation_type:string;
        type_branch:string;
        branch_section: number | ""; 
        circuit_breaker: number | "";
        installed_load: number | "";
            installed_power: number | "";
            service_voltage: number | "";        
        address: IAddress
        geolocation: {
            lat: number | "";
            lng: number | "";
            link_point:string;
        }; 
    };
    consumerUnit: { 
        key:string;
        consumer_unit_code: number | ""; 
        name: string; 
        description: string;         
        percentage: number | "";
        is_plant: Boolean;
    }[] | null; 
    inverters: {
        key:string;
        model: string;
        manufacturer: string;
        power: number | "";
        quantity: number | "";
        total_power : number | "";
        description: string
    }[];
    modules: {
        key:string;
        model: string;
        manufacturer: string;
        description: string;
        quantity: number | "";
        width: number | "";
        height: number | "";
        total_area: number | "";
        power: number | "";
        total_power : number | "";
    }[];
};

export interface IFile {
    filename: string;
    mimetype: string;
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
    EmCadastro = "Em cadastro",
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
    V0_22 = '0.22',
    V0_38 = '0.38', 
    V1 = '1',
    V6_9 = '6.9',
    V13_8 = '13.8',
};

export enum ETypeBranch{
    aerial = "Aérea",
    underground = "Subterrânea"
};

export enum EBranchSection{
    BS10 = "10",
    BS16 = "16",
    BS20 = "20",
    BS30 = "25",
    BS50 = "50",
};

export enum EConnectionType{
    SinglePhase = "Monofásica",
    TwoPhase = "Bifásica",
    ThreePhase = "Trifásica"
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
