import ProjectForm from "@/components/Forms/ProjectForm";
import { EProjectFormSubmissionType } from "@/types/IUtils";

export default function CreateProject(){
    
   
    return(     

        <ProjectForm  formSubmissionType={EProjectFormSubmissionType.Create} />
    );
}