import ProjectForm from "@/components/Forms/ProjectForm";
import ProjectFormV2 from "@/components/Forms/ProjectFormV2";
import { EProjectFormSubmissionType } from "@/types/IUtils";
import { Container, Title } from "@mantine/core";




export default function CreateProject(){   
    const demoProps = {
        //bg: 'var(--mantine-color-blue-light)', 
    };
   
    return(  
        <Container fluid size="responsive" h={50} {... demoProps}>
            <Title  order={2}>Novo Projeto</Title>
            <ProjectFormV2  formSubmissionType={EProjectFormSubmissionType.Create} />
        </Container>   
    );
}