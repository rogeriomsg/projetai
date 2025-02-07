'use client'
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { LoadingOverlay } from "@mantine/core";
import { Search } from '@/api/project'
import { IProjectDataValues } from '@/types/IProject';
import ProjectForm from '@/components/Forms/ProjectForm';


export default function EditProject(){
    const isMounted = useRef(false);
    const { id } = useParams(); // Captura o ID da URL
    const [projectData, setProjectData] = useState<IProjectDataValues[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        if (id && !isMounted.current )
        {
            isMounted.current = true;              
            const fetchRecord = async () => {
                setLoading(true);
                const response = await Search(`?id=${id}`);
                if(response.error === 'none')
                {
                    setProjectData(response.data)
                }
                else 
                {
                    setError(response.error)
                }
                setLoading(false);
            };    
            
            fetchRecord();
        }
        else 
            return;        
    }, [id]);
    

    if (error) {
    return <><p>Erro: {error}</p></>;
    }

    if (!projectData) {
    return <><LoadingOverlay visible={!projectData} zIndex={1} overlayProps={{ radius: "sm", blur: 2 }} /></>;
    }    

    return(     
        <ProjectForm initialValues={projectData[0]} />
    );
    
    

}


