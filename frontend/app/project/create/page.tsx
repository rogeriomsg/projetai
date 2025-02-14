"use client"

import ProjectFormV2 from "@/components/Forms/ProjectFormV2";
import { EProjectFormSubmissionType } from "@/types/IUtils";
import { Container, Title } from "@mantine/core";
import { useRouter } from 'next/navigation';


export default function CreateProject(){   
    const router = useRouter();
   
    function handleRedirect(): void {
        router.push("/project/list"); // Redireciona para a página de listagem"        
    }

    return(  
        <Container fluid size="responsive" h={50} >
            <Title  order={2}>Novo Projeto </Title>            
            <ProjectFormV2  
                formSubmissionType={EProjectFormSubmissionType.Create} 
                onCancel={handleRedirect} 
                onUpdate={handleRedirect}
                onSave={handleRedirect}
                onError={handleRedirect}
            />
        </Container>   
    );
}