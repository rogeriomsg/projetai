import { IAddress } from "./IUtils";

export interface IProjectDataValues {
    _id:string ,
    status : string,
    project_type : string;
    is_active: boolean; // Indica se o projeto está ativo
    name: string; // Nome do projeto (opcional)
    description: string; // Descrição do projeto (opcional)
    dealership: string; // Nome da concessionária ou distribuidora (opcional)
    path_meter_pole: Buffer | null; // Caminho para a foto do poste do medidor (opcional)
    path_meter: Buffer | null; // Caminho para a foto do medidor (opcional)
    path_bill: Buffer | null; // Caminho para a fatura de energia (opcional)
    path_identity:Buffer | null; // Caminho para a identidade do cliente (opcional)
    path_procuration:Buffer | null; // Caminho para o arquivo de procuração (opcional)  
    compensation_system: string;
    client: {
        client_code: number;
        name: string;
        cpf: string;
        identity: string;
        identity_issuer:string;
        email: string;
        phone: string;
        address: IAddress
    };
    plant: { 
        consumer_unit_code: number ; 
        name: string; 
        description: string;
        class:string;
        subgroup:string;
        connection_type:string;
        generation_type:string;
        type_branch:string;
        branch_section: number; 
        circuit_breaker: number;
        installed_load: number;
            installed_power: number;
            service_voltage: number;        
        address: IAddress
        geolocation: {
            lat: number;
            lng: number;
            link_point:string;
        }; 
    };
    consumerUnit: { 
        key:string;
        consumer_unit_code: number ; 
        name: string; 
        description: string;         
        percentage: number;
        is_plant: Boolean;
    }[]; 
    inverters: {
        key:string;
        model: string;
        manufacturer: string;
        power: number;
        quantity: number;
        total_power : number;
        description: string
    }[];
    modules: {
        key:string;
        model: string;
        manufacturer: string;
        description: string;
        quantity: number;
        width: number;
        height: number;
        total_area: number;
        power: number;
        total_power : number;
    }[];
};

export interface IProjectResponse {
    error: boolean;
    message: string;
    data:any
}