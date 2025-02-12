import ProjectForm from "@/components/Forms/ProjectForm";
import ProjectFormV2 from "@/components/Forms/ProjectFormV2";
import { EProjectFormSubmissionType } from "@/types/IUtils";

export default function CreateProject(){   
   
    return(     
        <ProjectFormV2  formSubmissionType={EProjectFormSubmissionType.Create} />
    );
}