import { IProjectDataValues, IProjectResponse } from "@/types/IProject";
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
        const response = await Api.get(`?${params}`);
        // Certifique-se de que `response.data` é um array e tem ao menos um elemento
        const data  = response.data as IProjectResponse ;

       return(data)


    } catch (err:any) {
        let msg = ""
        if (err.response) {
            msg = `data: ${err.response.data}, status: ${err.response.status}, header: ${err.response.headers}`
        } else if (err.request) { 
            msg = `request: ${err.request}` 
        } else {
            msg = `${err.message || 'Erro desconhecido.'}`
        } 
        return {error: true , message:msg , data: null }
    }
};

export const Create = async (projectDataCreate:IProjectDataValues) => {

    try {
        const response = await Api.post(`/`,projectDataCreate);
        // Certifique-se de que `response.data` é um array e tem ao menos um elemento
        const data = response.data as IProjectResponse
        return(data)
    } catch (err:any) {
        let msg = ""
        if (err.response) {
            msg = `data: ${err.response.data}, status: ${err.response.status}, header: ${err.response.headers}`
        } else if (err.request) { 
            msg = `request: ${err.request}` 
        } else {
            msg = `${err.message || 'Erro desconhecido.'}`
        } 
        return {error: true , message:msg, data: null }
    }
};

export const CreateSketch = async (projectDataCreate:IProjectDataValues) => {

    try {
        const response = await Api.post(`/sketch`,projectDataCreate);
        // Certifique-se de que `response.data` é um array e tem ao menos um elemento
        const data = response.data as IProjectResponse
        return(data)
    } catch (err:any) {
        let msg = ""
        if (err.response) {
            msg = `data: ${err.response.data}, status: ${err.response.status}, header: ${err.response.headers}`
        } else if (err.request) { 
            msg = `request: ${err.request}` 
        } else {
            msg = `${err.message || 'Erro desconhecido.'}`
        } 
        return {error: true , message:msg, data: null }
    }
};

export const Update = async (id:string,projectdataUpdate:IProjectDataValues) => {

    try {
        const response = await Api.patch(`/${id}`,projectdataUpdate);
        // Certifique-se de que `response.data` é um array e tem ao menos um elemento
        const data = response.data as IProjectResponse
        return(data)

    } catch (err:any) {
        let msg = ""
        if (err.response) {
            msg = `data: ${err.response.data}, status: ${err.response.status}, header: ${err.response.headers}`
        } else if (err.request) { 
            msg = `request: ${err.request}` 
        } else {
            msg = `${err.message || 'Erro desconhecido.'}`
        } 
        return {error: true , message:msg, data: null }
    }
};

export const Delete = async (id:string) => {

    try {
        const response = await Api.delete(`/${id}`);
        // Certifique-se de que `response.data` é um array e tem ao menos um elemento
        const data = response.data as IProjectResponse
        return(data)
    } catch (err:any) {
        let msg = ""
        if (err.response) {
            msg = `data: ${err.response.data}, status: ${err.response.status}, header: ${err.response.headers}`
        } else if (err.request) { 
            msg = `request: ${err.request}` 
        } else {
            msg = `${err.message || 'Erro desconhecido.'}`
        } 
        return {error: true , message:msg, data: null }
    }
};


export default Api;