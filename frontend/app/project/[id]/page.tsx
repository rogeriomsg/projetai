'use client'
import ProjectForm, {IDataValuesProject} from "@/components/Forms/ProjectForm"

import { randomId } from '@mantine/hooks';
import { useParams } from 'next/navigation';

import  { Search } from '@/api/project'

import React, { useEffect, useRef, useState } from 'react';


export default function EditProject(){
    const isMounted = useRef(false);
    const { id } = useParams(); // Captura o ID da URL
    const [record, setRecord] = useState<IDataValuesProject[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        if (!id) return;
        if (!isMounted.current)
        {
            isMounted.current = true;  
            setLoading(true);
            const fetchRecord = async () => {
               const response = await Search(`id=${id}`) as IDataValuesProject[]
               if (Array.isArray(response) && response.length > 0) {
                    setRecord(response)
                } else {
                    throw new Error('Dados retornados não é um array');
                }
            };    
            setLoading(false);
            fetchRecord();
        }
        
    }, [id]);

    if (loading) {
    return <><p>Carregando...{id}</p></>;
    }

    if (error) {
    return <><p>Erro: {error}</p></>;
    }

    if (!record) {
    return <><p>Registro não encontrado.</p></>;
    }

    // const init = { 
    //     status : 'Em cadastro',
    //     project_type : 'Até 10kWp',
    //     is_active: true, // Indica se o projeto está ativo
    //     name: "Projeto Nome", // Nome do projeto (opcional)
    //     description: "Descrição do projeto", // Descrição do projeto (opcional)
    //     dealership: "", // Nome da concessionária ou distribuidora (opcional)
    //     path_meter_pole: null, // Caminho para a foto do poste do medidor (opcional)
    //     path_meter: null, // Caminho para a foto do medidor (opcional)
    //     path_bill: null, // Caminho para a fatura de energia (opcional)
    //     path_identity:null, // Caminho para a identidade do cliente (opcional)
    //     path_procuration:null, // Caminho para o arquivo de procuração (opcional)     
    //     compensation_system:"", 
    //     client: {
    //         client_code: 0,
    //         name: "Nome do cliente",
    //         cpf: "",
    //         identity: "",
    //         identity_issuer:"",
    //         email: "",
    //         phone: "",
    //         address: {
    //         street: "",
    //         complement:"",
    //         no_number: false,
    //         number: 0,
    //         district:"",
    //         state: "",
    //         city: "",
    //         zip: 0,
    //         },
    //     },
    //     plant: { 
    //         consumer_unit_code: 0 , 
    //         name: '', 
    //         description: '',
    //         class:"",
    //         subgroup:"",
    //         connection_type:"",
    //         generation_type:"",
    //         type_branch:"",
    //         branch_section: 0, 
    //         circuit_breaker: 0,
    //         installed_load: 0,
    //             installed_power: 0,
    //             service_voltage: 0,        
    //         address: { 
    //         street: "",
    //         complement:"",
    //         no_number: false,
    //         number: 0,
    //         district:"",
    //         state: "",
    //         city: "",
    //         zip: 0
    //         },
    //         geolocation: {
    //         lat: 0,
    //         lng: 0,
    //         link_point:""
    //         }, 
    //     },
    //     consumerUnit: [{ 
    //         key: randomId(),
    //         consumer_unit_code: 0 , 
    //         name: 'Unidade consumidora geradora', 
    //         description: '',         
    //         percentage: 100,
    //         is_plant: true
    //     }], 
    //     inverters: [{
    //         key: randomId(),
    //         model: "",
    //         manufacturer: "",
    //         power: 0,
    //         quantity: 1,
    //         total_power : 0,
    //         description: ""
    //     }],
    //     modules: [{
    //         key: randomId(),
    //         model: "",
    //         manufacturer: "",
    //         description: "",
    //         width: 0,
    //         height: 0,
    //         total_area: 0,
    //         power: 0,
    //         quantity: 1,
    //         total_power : 0,
    //     }],
                    
    // }

    return(
        // <div>
        //     <h1>Detalhes do Projeto</h1>
        //     <p><strong>Nome:</strong> {record[0].name}</p>
        //     <p><strong>Email:</strong> {record[0].description}</p>
        // </div>
        <ProjectForm initialValues={record[0]}>

        </ProjectForm>
    );
    
    

}


