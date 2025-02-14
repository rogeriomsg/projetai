import { IProjectDataValues } from "@/types/IProject";
import { Button, Center, Modal, ScrollArea, Table } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect } from "react";


interface ProjectViewProps {
    valuesView?: IProjectDataValues | null; // Valores iniciais para edição
    isOpen?: boolean; // Controla programaticamente se o modal está aberto
    onClose?: () => void; // Callback para fechamento do modal
    noButton?:boolean 
    labelButton?:string
  }

const ProjectView: React.FC<ProjectViewProps> = ({ valuesView, isOpen, onClose, noButton = false, labelButton}) => {
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
        <>
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
                            <Table.Th w={220}>Nome do projeto</Table.Th>
                            <Table.Td>{valuesView?.name || ""}</Table.Td>
                        </Table.Tr>

                        <Table.Tr>
                            <Table.Th>Descrição</Table.Th>
                            <Table.Td>{valuesView?.description || "Não informada"}</Table.Td>
                        </Table.Tr>

                        <Table.Tr>
                            <Table.Th>Distribuidora</Table.Th>
                            <Table.Td>{valuesView?.dealership || ""}</Table.Td>
                        </Table.Tr>

                        <Table.Tr>
                            <Table.Th>Tipo de projeto</Table.Th>
                            <Table.Td>{valuesView?.project_type || ""}</Table.Td>
                        </Table.Tr>
                        <Table.Tr >
                            <Table.Th bg={'var(--mantine-color-green-light)'}></Table.Th>
                            <Table.Td bg={'var(--mantine-color-green-light)'}>Informações do Cliente</Table.Td>
                        </Table.Tr>                        
                        <Table.Tr>
                            <Table.Th>Código do cliente</Table.Th>
                            <Table.Td>{valuesView?.client.client_code || ""}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>Nome do cliente</Table.Th>
                            <Table.Td>{valuesView?.client.name || ""}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>CPF</Table.Th>
                            <Table.Td>{valuesView?.client.cpf || ""}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>RG</Table.Th>
                            <Table.Td>{valuesView?.client.identity || "Não informado"}</Table.Td>                            
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th >Orgão expedidor</Table.Th>
                            <Table.Td>{valuesView?.client.identity_issuer || "Não informado"}</Table.Td>
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
                            <Table.Th>CEP</Table.Th>
                            <Table.Td>{valuesView?.client.address.zip || ""}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>Logradouro</Table.Th>
                            <Table.Td>{valuesView?.client.address.street || ""}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>Número</Table.Th>
                            <Table.Td>{valuesView?.client.address.number || ""}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>Complemento</Table.Th>
                            <Table.Td>{valuesView?.client.address.complement || ""}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>Bairro</Table.Th>
                            <Table.Td>{valuesView?.client.address.district || ""}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>Estado</Table.Th>
                            <Table.Td>{valuesView?.client.address.state || ""}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>Município</Table.Th>
                            <Table.Td>{valuesView?.client.address.city || ""}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>Bairro</Table.Th>
                            <Table.Td>{valuesView?.client.address.district || ""}</Table.Td>
                        </Table.Tr>
                        <Table.Tr >
                            <Table.Th bg={'var(--mantine-color-green-light)'}></Table.Th>
                            <Table.Th bg={'var(--mantine-color-green-light)'}>Informações da Usina</Table.Th>
                        </Table.Tr> 
                        <Table.Tr>
                            <Table.Th>Código da UC</Table.Th>
                            <Table.Td>{valuesView?.plant.consumer_unit_code || ""}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>Nome da Usina</Table.Th>
                            <Table.Td>{valuesView?.plant.name|| ""}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>Potência instalada de geração</Table.Th>
                            <Table.Td>{`${valuesView?.plant.installed_power} KWp` || ""}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>Tipo de geração</Table.Th>
                            <Table.Td>{valuesView?.plant.generation_type|| ""}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>Classe da UC</Table.Th>
                            <Table.Td>{valuesView?.plant.class || ""}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>Subgrupo</Table.Th>
                            <Table.Td>{valuesView?.plant.subgroup || ""}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>Tensão Fase neutro</Table.Th>
                            <Table.Td>{`${valuesView?.plant.service_voltage} kV`|| ""}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>Tipo de ramal</Table.Th>
                            <Table.Td>{valuesView?.plant.type_branch|| ""}</Table.Td>
                        </Table.Tr>                                             
                        <Table.Tr>
                            <Table.Th>Seção de entrada</Table.Th>
                            <Table.Td>{`${valuesView?.plant.branch_section} mm²` || ""}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>Tipo de conexão</Table.Th>
                            <Table.Td>{valuesView?.plant.connection_type || ""}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>Disjuntor de entrada</Table.Th>
                            <Table.Td>{`${valuesView?.plant.circuit_breaker} A` || ""} </Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>CEP</Table.Th>
                            <Table.Td>{valuesView?.plant.address.zip || ""}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>Logradouro</Table.Th>
                            <Table.Td>{valuesView?.plant.address.street || ""}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>Número</Table.Th>
                            <Table.Td>{valuesView?.plant.address.number || ""}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>Complemento</Table.Th>
                            <Table.Td>{valuesView?.plant.address.complement || ""}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>Bairro</Table.Th>
                            <Table.Td>{valuesView?.plant.address.district || ""}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>Estado</Table.Th>
                            <Table.Td>{valuesView?.plant.address.state || ""}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>Município</Table.Th>
                            <Table.Td>{valuesView?.plant.address.city || ""}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>Bairro</Table.Th>
                            <Table.Td>{valuesView?.plant.address.district || ""}</Table.Td>
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
                                <Table.Tr >
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
                        <Table.Tr >
                            <Table.Th bg={'var(--mantine-color-green-light)'}></Table.Th>
                            <Table.Th bg={'var(--mantine-color-green-light)'}>Inversor(es)</Table.Th>
                        </Table.Tr>   
                        {valuesView?.inverters.map((inverter, index) => (
                            <>
                                <Table.Tr >
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
                        <Table.Tr >
                            <Table.Th bg={'var(--mantine-color-green-light)'}></Table.Th>
                            <Table.Th bg={'var(--mantine-color-green-light)'}>Módulo(s)</Table.Th>
                        </Table.Tr> 
                        {valuesView?.modules.map((module, index) => (
                            <>
                                <Table.Tr >
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
                        <Table.Tr >
                            <Table.Th bg={'var(--mantine-color-green-light)'}></Table.Th>
                            <Table.Th bg={'var(--mantine-color-green-light)'}>Documentos</Table.Th>
                        </Table.Tr> 
                        <Table.Tr >
                            <Table.Th>Documento 1</Table.Th> {/* Substitua "property1" pela chave real */}
                            <Table.Td>{valuesView?.path_identity?.filename} kW</Table.Td> {/* Substitua "property2" pela chave real */}
                        </Table.Tr>
                        <Table.Tr >
                            <Table.Th>Documento 2</Table.Th> {/* Substitua "property1" pela chave real */}
                            <Table.Td>{valuesView?.path_bill?.filename} kW</Table.Td> {/* Substitua "property2" pela chave real */}
                        </Table.Tr>
                        <Table.Tr >
                            <Table.Th>Documento 3</Table.Th> {/* Substitua "property1" pela chave real */}
                            <Table.Td>{valuesView?.path_meter?.filename} kW</Table.Td> {/* Substitua "property2" pela chave real */}
                        </Table.Tr>
                        <Table.Tr >
                            <Table.Th>Documento 4</Table.Th> {/* Substitua "property1" pela chave real */}
                            <Table.Td>{valuesView?.path_meter_pole?.filename} kW</Table.Td> {/* Substitua "property2" pela chave real */}
                        </Table.Tr>
                        <Table.Tr >
                            <Table.Th>Documento 3</Table.Th> {/* Substitua "property1" pela chave real */}
                            <Table.Td>{valuesView?.path_procuration?.filename} kW</Table.Td> {/* Substitua "property2" pela chave real */}
                        </Table.Tr>
                    </Table.Tbody>
                </Table>
            </Modal>

            {
                !noButton && (
                    <Button justify={"center"} variant="default" onClick={open}>
                        {labelButton || "Conferir"}
                    </Button>  
                )
            }
                    
        </>
    );    
}  

export default ProjectView;