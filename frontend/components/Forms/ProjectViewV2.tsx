import { IProjectDataValues } from "@/types/IProject";
import { Button, Center, Modal, ScrollArea, Table } from "@mantine/core";
import { randomId, useDisclosure } from "@mantine/hooks";
import { useEffect } from "react";


interface ProjectViewProps {
    valuesView?: IProjectDataValues | null; // Valores iniciais para edição
    isOpen?: boolean; // Controla programaticamente se o modal está aberto
    onClose?: () => void; // Callback para fechamento do modal
    noButton?:boolean 
    labelButton?:string
  }

const ProjectViewV2: React.FC<ProjectViewProps> = ({ valuesView, isOpen, onClose, noButton = false, labelButton}) => {
    const [opened, { open, close }] = useDisclosure(false);

     // Sincroniza a prop `isOpen` com o estado interno do modal
    useEffect(() => {
        if (isOpen) {
            open();
        } else {
            close();
        }
        if(noButton)
            noButton = noButton 

    }, [isOpen, open, close]);


    return(        
            <Modal 
                size="xl"
                opened={opened} 
                onClose={() => {
                    close();
                    onClose?.(); // Chama o callback caso fornecido
                }} 
                title="Confira os dados do prjeto"
                scrollAreaComponent={ScrollArea.Autosize}
            >
                <Table variant="vertical" layout="fixed" withTableBorder>
                    <Table.Tbody>
                        <Table.Tr>
                            <Table.Th w={220}>Distribuidora</Table.Th>
                            <Table.Td>{valuesView?.dealership || ""}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>Tipo de projeto</Table.Th>
                            <Table.Td>{valuesView?.project_type || ""}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th >Nome do projeto</Table.Th>
                            <Table.Td>{valuesView?.name || ""}</Table.Td>
                        </Table.Tr>
                        <Table.Tr >
                            <Table.Th bg={'var(--mantine-color-green-light)'}></Table.Th>
                            <Table.Td bg={'var(--mantine-color-green-light)'}>Informações do Básicas</Table.Td>
                        </Table.Tr>  
                        <Table.Tr>
                            <Table.Th>Nome do titular</Table.Th>
                            <Table.Td>{valuesView?.client.name || ""}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>CPF/CNPJ</Table.Th>
                            <Table.Td>{valuesView?.client.cpf || ""}</Table.Td>
                        </Table.Tr>                        
                        <Table.Tr>
                            <Table.Th>E-mail</Table.Th>
                            <Table.Td>{valuesView?.client.email || ""}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>Telefone</Table.Th>
                            <Table.Td>{valuesView?.client.phone || ""}</Table.Td>
                        </Table.Tr>  
                        <Table.Tr>
                            <Table.Th>Potência instalada de geração</Table.Th>
                            <Table.Td>{`${valuesView?.plant.installed_power} KWp` || ""}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>Tipo de conexão</Table.Th>
                            <Table.Td>{valuesView?.plant.connection_type || ""}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>Tensão de fornecimento</Table.Th>
                            <Table.Td>{`${valuesView?.plant.service_voltage} kV`|| ""}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>Tipo de ramal</Table.Th>
                            <Table.Td>{valuesView?.plant.type_branch|| ""}</Table.Td>
                        </Table.Tr>                                             
                        <Table.Tr>
                            <Table.Th>Bitola de entrada</Table.Th>
                            <Table.Td>{`${valuesView?.plant.branch_section} mm²` || ""}</Table.Td>
                        </Table.Tr>                        
                        <Table.Tr>
                            <Table.Th>Disjuntor de entrada</Table.Th>
                            <Table.Td>{`${valuesView?.plant.circuit_breaker} A` || ""} </Table.Td>
                        </Table.Tr>  
                        <Table.Tr>
                            <Table.Th>Latitude</Table.Th>
                            <Table.Td>{valuesView?.plant.geolocation.lat || ""}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>Longitude</Table.Th>
                            <Table.Td>{valuesView?.plant.geolocation.lng || ""}</Table.Td>
                        </Table.Tr>                  
                       
                        <Table.Tr >
                            <Table.Th bg={'var(--mantine-color-green-light)'}></Table.Th>
                            <Table.Th bg={'var(--mantine-color-green-light)'}>Sistema de Compensação</Table.Th>
                        </Table.Tr>                         
                        {valuesView?.consumerUnit?.map((uc, index) => (
                            <>
                                <Table.Tr key={index} >
                                    <Table.Th bg={'var(--mantine-color-orange-light)'}></Table.Th>
                                    <Table.Th bg={'var(--mantine-color-orange-light)'}></Table.Th>
                                </Table.Tr> 
                                <Table.Tr key={index}>
                                    <Table.Th>Nome da unidade</Table.Th> {/* Substitua "property1" pela chave real */}
                                    <Table.Td>{uc.name}</Table.Td> {/* Substitua "property2" pela chave real */}
                                </Table.Tr>
                                <Table.Tr key={index}>
                                    <Table.Th>Código da UC</Table.Th> {/* Substitua "property1" pela chave real */}
                                    <Table.Td>{uc.consumer_unit_code}</Table.Td> {/* Substitua "property2" pela chave real */}
                                </Table.Tr>
                                <Table.Tr key={index}>
                                    <Table.Th>Porcentagem</Table.Th> {/* Substitua "property1" pela chave real */}
                                    <Table.Td>{`${uc.percentage} %` || ""}</Table.Td> {/* Substitua "property2" pela chave real */}
                                </Table.Tr>
                            </>                            
                        ))}
                        <Table.Tr  key={randomId()}>
                            <Table.Th bg={'var(--mantine-color-green-light)'}></Table.Th>
                            <Table.Th bg={'var(--mantine-color-green-light)'}>Inversor(es)</Table.Th>
                        </Table.Tr>   
                        {valuesView?.inverters.map((inverter, index) => (
                            <>
                                <Table.Tr key={index} >
                                    <Table.Th bg={'var(--mantine-color-orange-light)'}></Table.Th>
                                    <Table.Th bg={'var(--mantine-color-orange-light)'}></Table.Th>
                                </Table.Tr> 
                                <Table.Tr key={index}>
                                    <Table.Th>Modelo</Table.Th> {/* Substitua "property1" pela chave real */}
                                    <Table.Td>{inverter.model}</Table.Td> {/* Substitua "property2" pela chave real */}
                                </Table.Tr>
                                <Table.Tr key={index}>
                                    <Table.Th>Fabricante</Table.Th> {/* Substitua "property1" pela chave real */}
                                    <Table.Td>{inverter.manufacturer}</Table.Td> {/* Substitua "property2" pela chave real */}
                                </Table.Tr>
                                <Table.Tr key={index}>
                                    <Table.Th>Quantidade</Table.Th> {/* Substitua "property1" pela chave real */}
                                    <Table.Td>{`${inverter.quantity} unidade(s)`}</Table.Td> {/* Substitua "property2" pela chave real */}
                                </Table.Tr>
                                <Table.Tr key={index}>
                                    <Table.Th>Potência</Table.Th> {/* Substitua "property1" pela chave real */}
                                    <Table.Td>{`${inverter.power} kW`}</Table.Td> {/* Substitua "property2" pela chave real */}
                                </Table.Tr>
                            </>                            
                        ))}
                        <Table.Tr key={randomId()}>
                            <Table.Th bg={'var(--mantine-color-green-light)'}></Table.Th>
                            <Table.Th bg={'var(--mantine-color-green-light)'}>Módulo(s)</Table.Th>
                        </Table.Tr> 
                        {valuesView?.modules.map((module, index) => (
                            <>
                                <Table.Tr key={index}>
                                    <Table.Th bg={'var(--mantine-color-orange-light)'}></Table.Th>
                                    <Table.Th bg={'var(--mantine-color-orange-light)'}></Table.Th>
                                </Table.Tr> 
                                <Table.Tr key={index}>
                                    <Table.Th>Modelo</Table.Th> {/* Substitua "property1" pela chave real */}
                                    <Table.Td>{module.model}</Table.Td> {/* Substitua "property2" pela chave real */}
                                </Table.Tr>
                                <Table.Tr key={index}>
                                    <Table.Th>Fabricante</Table.Th> {/* Substitua "property1" pela chave real */}
                                    <Table.Td>{module.manufacturer}</Table.Td> {/* Substitua "property2" pela chave real */}
                                </Table.Tr>
                                <Table.Tr key={index}>
                                    <Table.Th>Quantidade</Table.Th> {/* Substitua "property1" pela chave real */}
                                    <Table.Td>{`${module.quantity} unidade(s)`}</Table.Td> {/* Substitua "property2" pela chave real */}
                                </Table.Tr>
                                <Table.Tr key={index}>
                                    <Table.Th>Largura</Table.Th> {/* Substitua "property1" pela chave real */}
                                    <Table.Td>{`${module.width} m` || ""}</Table.Td> {/* Substitua "property2" pela chave real */}
                                </Table.Tr>
                                <Table.Tr key={index}>
                                    <Table.Th>Altura</Table.Th> {/* Substitua "property1" pela chave real */}
                                    <Table.Td>{`${module.height } m`|| ""}</Table.Td> {/* Substitua "property2" pela chave real */}
                                </Table.Tr>
                                <Table.Tr key={index}>
                                    <Table.Th>Potência</Table.Th> {/* Substitua "property1" pela chave real */}
                                    <Table.Td>{module.power} kW</Table.Td> {/* Substitua "property2" pela chave real */}
                                </Table.Tr>
                            </>                            
                        ))}
                        <Table.Tr key={randomId()} >
                            <Table.Th bg={'var(--mantine-color-green-light)'}></Table.Th>
                            <Table.Th bg={'var(--mantine-color-green-light)'}>Documentos</Table.Th>
                        </Table.Tr>                         
                        <Table.Tr >
                            <Table.Th>Conta do cliente</Table.Th> {/* Substitua "property1" pela chave real */}
                            <Table.Td>{valuesView?.path_identity?.filename}</Table.Td> {/* Substitua "property2" pela chave real */}
                        </Table.Tr>
                        <Table.Tr >
                            <Table.Th>Documento identidade</Table.Th> {/* Substitua "property1" pela chave real */}
                            <Table.Td>{valuesView?.path_bill?.filename}</Table.Td> {/* Substitua "property2" pela chave real */}
                        </Table.Tr>
                        <Table.Tr >
                            <Table.Th>Foto do medido</Table.Th> {/* Substitua "property1" pela chave real */}
                            <Table.Td>{valuesView?.path_meter?.filename}</Table.Td> {/* Substitua "property2" pela chave real */}
                        </Table.Tr>
                        <Table.Tr >
                            <Table.Th>Foto do poste</Table.Th> {/* Substitua "property1" pela chave real */}
                            <Table.Td>{valuesView?.path_meter_pole?.filename}</Table.Td> {/* Substitua "property2" pela chave real */}
                        </Table.Tr>
                        <Table.Tr >
                            <Table.Th>Procuração</Table.Th> {/* Substitua "property1" pela chave real */}
                            <Table.Td>{valuesView?.path_procuration?.filename}</Table.Td> {/* Substitua "property2" pela chave real */}
                        </Table.Tr>
                        
                        
                    </Table.Tbody>
                </Table>
            </Modal> 
    );    
}  

export default ProjectViewV2;