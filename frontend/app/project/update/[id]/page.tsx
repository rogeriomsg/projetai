'use client'
import React, { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { LoadingOverlay } from "@mantine/core";
import { Byid } from '@/api/project'
import { EProjectStatus, IProjectDataValues, IProjectResponse } from '@/types/IProject';
import ProjectForm from '@/components/Forms/ProjectForm';
import { EProjectFormSubmissionType } from '@/types/IUtils';



export default function EditProject(){
    const { id } = useParams<{ id: string }>(); // Captura o ID da URL 
    
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

    return(     
        <ProjectForm formSubmissionType={EProjectFormSubmissionType.update} initialValues={projectData}  />
    );
    
    

}


