import { IProjectDataValues } from "@/types/IProject";
import axios from "axios";

const Api = axios.create({
    baseURL: 'http://localhost:3333/project', // URL base da API
    timeout: 10000,                    // Timeout em milissegundos
    headers: {
      'Content-Type': 'application/json',
    },
});
  

export const Search = async (params:string) => {
    try {
        const response = await Api.get(`/${params}`);
        // Certifique-se de que `response.data` é um array e tem ao menos um elemento
        if (Array.isArray(response.data) && response.data.length > 0) {            
            return {is_array: true , count: response.data.length , error:"none", status_code: response.status , data: response.data }
        } else {
            return {is_array: false , count: 0 , error:"Dados retornados não é um array",  status_code: response.status , data: [] }
        }

    } catch (err:any) {
        let msg = ""
        if (err.response) {
            msg = `data: ${err.response.data}, status: ${err.response.status}, header: ${err.response.headers}`
        } else if (err.request) { 
            msg = `request: ${err.request}` 
        } else {
            msg = `${err.message || 'Erro desconhecido.'}`
        } 
        return {is_array: false , count: 0 , error:msg,  status_code: err.status , data: [] }
    }
};

export const Create = async (projectDataCreate:IProjectDataValues) => {

    try {
        const response = await Api.post(`/`,projectDataCreate);
        // Certifique-se de que `response.data` é um array e tem ao menos um elemento
        if (response.status === 201) {            
            return {is_array: false , count: 0 , error:"none",  status_code: response.status ,data: response.data }
        } else {
            return {count: 0 , error:"Servidor retornou erros, veja no campo data.message", is_array: false , status_code: response.status ,data: null }
        }

    } catch (err:any) {
        let msg = ""
        if (err.response) {
            msg = `data: ${err.response.data}, status: ${err.response.status}, header: ${err.response.headers}`
        } else if (err.request) { 
            msg = `request: ${err.request}` 
        } else {
            msg = `${err.message || 'Erro desconhecido.'}`
        } 
        return {is_array: false , count: 0 , error:"msg",  status_code: err.status , data: null }
    }
};

export const Update = async (id:string,projectdataUpdate:IProjectDataValues) => {

    try {
        const response = await Api.patch(`/${id}`,projectdataUpdate);
        // Certifique-se de que `response.data` é um array e tem ao menos um elemento
        if (response.status === 200) {            
            return {is_array: false , count: 0 , error:"none",  status_code: response.status ,data: response.data }
        } else {
            return {count: 0 , error:"Servidor retornou erros, veja no campo data.message", is_array: false , status_code: response.status ,data: null }
        }

    } catch (err:any) {
        let msg = ""
        if (err.response) {
            msg = `data: ${err.response.data}, status: ${err.response.status}, header: ${err.response.headers}`
        } else if (err.request) { 
            msg = `request: ${err.request}` 
        } else {
            msg = `${err.message || 'Erro desconhecido.'}`
        } 
        return {is_array: false , count: 0 , error:"msg",  status_code: err.status , data: null }
    }
};

export const Delete = async (id:string) => {

    try {
        const response = await Api.delete(`/${id}`);
        // Certifique-se de que `response.data` é um array e tem ao menos um elemento
        if (response.status === 200) {            
            return {is_array: false , count: 0 , error:"none",  status_code: response.status ,data: response.data }
        } else {
            return {count: 0 , error:"Servidor retornou erros, veja no campo data.message", is_array: false , status_code: response.status ,data: null }
        }

    } catch (err:any) {
        let msg = ""
        if (err.response) {
            msg = `data: ${err.response.data}, status: ${err.response.status}, header: ${err.response.headers}`
        } else if (err.request) { 
            msg = `request: ${err.request}` 
        } else {
            msg = `${err.message || 'Erro desconhecido.'}`
        } 
        return {is_array: false , count: 0 , error:"msg",  status_code: err.status , data: null }
    }
};


export default Api;