import ProjectForm from "@/components/Forms/ProjectForm";
import { IProjectFormSubmissionType } from "@/types/IUtils";

export default function CreateProject(){
    
   
    return(     

        <ProjectForm  formSubmissionType={IProjectFormSubmissionType.Create} />
    );
}