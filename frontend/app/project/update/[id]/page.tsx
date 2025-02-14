'use client'
import React, { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { Container, LoadingOverlay, Title } from "@mantine/core";
import { Byid } from '@/api/project'
import { EProjectStatus, IProjectDataValues, IProjectResponse } from '@/types/IProject';
import { EProjectFormSubmissionType } from '@/types/IUtils';
import ProjectFormV2 from '@/components/Forms/ProjectFormV2';
import { useRouter } from 'next/navigation';

export default function EditProject(){
    const { id } = useParams<{ id: string }>(); // Captura o ID da URL 
    const router = useRouter();
    
    const [searchParams] = useSearchParams();
   
    const isMounted = useRef(false);
    const [projectData, setProjectData] = useState<IProjectDataValues | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    
    
    useEffect(() => {
        if (id && !isMounted.current )
        {
            //alert(id)
            isMounted.current = true;              
            const fetchRecord = async () => {
                setLoading(true);
                const response = await Byid(id);
                if((response as IProjectResponse).error === false)
                {
                    if(searchParams){
                        if(searchParams[1]==="SaveAs")                      
                            (response.data as IProjectDataValues).status = EProjectStatus.None
                    }                  
                    setProjectData(response.data)
                }
                else 
                {
                    setError(response.message)
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

    function handleRedirect(): void {
        router.push("/project/list"); // Redireciona para a página de listagem"        
    }

    return(  
        <Container fluid size="responsive" h={50} >
            <Title  order={2}>Edição de Projeto</Title>
            <Title  order={5} c="dimmed">{`#${projectData.name}# (${projectData.status})`} </Title>
            <ProjectFormV2 
                formSubmissionType={EProjectFormSubmissionType.update} 
                initialValues={projectData} 
                onCancel={handleRedirect} 
                onUpdate={handleRedirect}
                onSave={handleRedirect}
                onError={handleRedirect}
            />
        </Container>    
        
    );
    
    

}


