import axios from "axios";
interface IzipCodeDataErro{
    erro:string
}

export const FetchStates = async () => { 
    try {
        const response = await axios.get("http://servicodados.ibge.gov.br/api/v1/localidades/estados");
        // Certifique-se de que `response.data` é um array e tem ao menos um elemento
        if (Array.isArray(response.data) && response.data.length > 0) {                      
            return response.data ;
        } else {
            return null
        }
    } catch (err:any) {
        return null
    }
};

export const FetchMunicipalities = async (state:string) => { 
    try {
        const response = await axios.get(`http://servicodados.ibge.gov.br/api/v1/localidades/estados/${state}/municipios`);
        // Certifique-se de que `response.data` é um array e tem ao menos um elemento
        if (Array.isArray(response.data) && response.data.length > 0) {                      
            return response.data ;
        } else {
            return null
        }
    } catch (err:any) {
        return null
    }
};

export const FetchZipCode = async (zipCode:string) => { 
    try {
        const response = await axios.get(`https://viacep.com.br/ws/${zipCode}/json/`);
        // Certifique-se de que `response.data` é um array e tem ao menos um elemento
        if((response.data as IzipCodeDataErro).erro  === "true"){
            return null;
        }
        else{
            return response.data ;
        }
        return response.data ;    
    } catch (err:any) {
        return null
    }
};

