import axios from "axios";

const Api = axios.create({
    baseURL: 'http://localhost:8080', // URL base da API
    timeout: 10000,                    // Timeout em milissegundos
    headers: {
      //'Content-Type': 'application/json',
      'content-type': 'application/x-www-form-urlencoded'
    },
});
  

export const Search = async (params:string) => {

    try {
        const response = await Api.get(`/project/search?${params}` ,{
            headers: {
                'Content-Type': 'application/json',
            },
        });
        // Certifique-se de que `response.data` é um array e tem ao menos um elemento
        if (Array.isArray(response.data) && response.data.length > 0) {
            return response.data; // Define o primeiro elemento no estado
        } else {
            throw new Error('Dados retornados não é um array');
        }

    } catch (err:any) {
        if (err.response) {
            return ({data: err.response.data, status: err.response.status, header: err.response.headers});
        } else if (err.request) {  
            return ({error: err.request});
        } else {
            return ({error: err.message || 'Erro desconhecido.'});
        }  
    }
};



export default Api;