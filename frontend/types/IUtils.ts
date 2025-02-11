export interface IZipCodeDataValues {
    cep: string,
    logradouro: string,
    complemento: string,
    unidade: string,
    bairro: string,
    localidade: string,
    uf: string,
    estado: string,
    regiao: string,
    ibge: string,
    gia: string,
    ddd: string,
    siafi: string,
};

export interface IStatesDataValues {
    id: number,
    sigla: string,
    nome: string,
    regiao: {
      id: number,
      sigla: string,
      nome: string
    }
}

export interface IAddress {
  street: string;
  complement:string;
  no_number: boolean;
  number: number | "";
  district:string;
  state: string;
  city: string;
  zip: number | "";
};

// Definindo uma enumeração do 
export enum EProjectFormSubmissionType {
  Create = "create",
  update = "update",
  createSketch = "createSketch",
  updateSketch = "updateSketch"
}