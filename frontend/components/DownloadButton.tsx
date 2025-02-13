import { IFile } from "@/types/IProject";
import { ActionIcon, Button } from "@mantine/core";
import { IconDownload } from "@tabler/icons-react";

interface DownloadButtonProps {
  file: IFile | null
}

const DownloadButton = ({ file }: DownloadButtonProps) => {
    const downloadBase64File = (base64: string, filename: string, mimetype: string) => {
        // Decodifica o Base64
        const byteCharacters = atob(base64.split(",")[1]);
        const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: mimetype });      
        // Cria o link de download
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <>
        {
            file && (                
                <ActionIcon 
                    variant="subtle" 
                    //size="xl" 
                    onClick={() => downloadBase64File(file.data, file.filename, file.mimetype)}  
                >
                    <IconDownload  size={28} stroke={1.5} />
                </ActionIcon>
            )
        } 
        </>
    );
};

export default DownloadButton;