'use client';
import { useState, useEffect, useRef } from 'react';
import {  Text,  Table, LoadingOverlay, Group, GridCol, Button, Grid, ActionIcon, Center, Menu, useModalsStack, Modal, Loader } from '@mantine/core';
import { IProjectDataValues } from '@/components/Forms/ProjectForm';
import { Delete, Search } from '@/api/project';
import { useRouter } from 'next/navigation';
import { IconDots, IconDotsVertical, IconEdit, IconHome, IconPhoto, IconSearch, IconSun, IconTrash } from '@tabler/icons-react';
import MapModalGetSinglePoint, { IMarker } from '@/components/MapModal/MapModalGetSinglePoint';
import ProjectView from '@/components/Forms/ProjectView';
import { notifications, showNotification} from "@mantine/notifications";
import { modals, openConfirmModal } from '@mantine/modals';

type Project = {
  id: number;
  name: string;
  description: string;
};

export default function ProjectsList() {
  const router = useRouter();
  const isMounted = useRef(false);
  const [projects, setProjects] = useState<IProjectDataValues[]>([]);
  const [selectedProject, setSelectedProject] = useState<IProjectDataValues | null>(null);
  const [loading, setLoading] = useState(true);
  const [openProjectView, setOpenProjectView] = useState(false);
  const [projectView, setProjectView] = useState<IProjectDataValues | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  useEffect(() => {
    if (!isMounted.current )
    {
        isMounted.current = true;
        fetchProjects();
    }
    else 
        return;        
  }, []);

  const handleCreate = () => {
    router.push("/project/create"); // Redireciona para a página "/destination-page"
  };

  const handleEdit = (id:string) => {
    router.push(`/project/update/${id}`); // Redireciona para a página "/destination-page"
  };

  const handleDeleteClick = (project: IProjectDataValues) => {
    //setSelectedProject(project);
      //setIsDeleteModalOpen(true);
      //showNotification({ message: 'Hello' });

      showNotification({ message: 'Hello' });

  };

  const handleOpenConfirmModal = () => {
    openConfirmModal({
      title: 'Confirmar ação',
      children: <p>Você realmente deseja realizar esta ação?</p>,
      labels: { confirm: 'Sim', cancel: 'Não' },
      onConfirm: () => console.log('Ação confirmada'),
    });
  };


  const handleDelete = async () =>{
    if (!selectedProject) return;

    // showNotification({
    //   title: "Sucesso",
    //   message: `Projeto "${selectedProject.name}" foi deletado com sucesso.`,
    //   color: "green",
    // });

    // notifications.show({
    //   title:"Sucesso" ,
    //   message: `Projeto "${selectedProject.name}" foi deletado com sucesso.🌟` ,
    //   color: "green",
    // })

    notifications.show({
      title: 'Notification with custom styles',
      message: 'It is default blue',
      position: 'top-center',
    })
         
    setLoadingDelete(true);
    // const response = await Delete(selectedProject._id);
    // if(response.error === 'none')
    // {
    //   alert(`Deletado com sucesso: ${response.data}`)
    //   setProjects((prev) => prev.filter((p) => p._id !== selectedProject._id));
    //   showNotification({
    //     title: "Sucesso",
    //     message: `Projeto "${selectedProject.name}" foi deletado com sucesso.`,
    //     color: "green",
    //   });
      
    // }
    // else 
    // {
    //   showNotification({
    //     title: "Erro",
    //     message: `Falha ao deletar o projeto: ${response.error}`,
    //     color: "red",
    //   });
    // }
    setLoadingDelete(false);
    setIsDeleteModalOpen(false);
    setSelectedProject(null);
    
  };

  const handleView = (item:IProjectDataValues) => {
    //alert(JSON.stringify(item))
    setProjectView(item)
    setOpenProjectView(true)
  };

  const fetchProjects = async () => {
    setLoading(true);
    const response = await Search("");
    if(response.error === 'none')
    {
      setProjects(response.data as IProjectDataValues[])
    }            
    setLoading(false);
  };  

  if (!projects) {
    return <><LoadingOverlay visible={!projects} zIndex={1} overlayProps={{ radius: "sm", blur: 2 }} /></>;
  }
  
  const rows = projects.map((element) => (
    <Table.Tr key={element._id} >
      <Table.Td>{element.name}</Table.Td>
      <Table.Td>{element.description}</Table.Td>
      <Table.Td>{element.client.name}</Table.Td>
      <Table.Td>
        <MapModalGetSinglePoint
          centerDefault={{lat:element.plant.geolocation.lat,lng:element.plant.geolocation.lng}}          
          zoom={18}
          dataMarkers={[ 
            {available:true,selected:true,clickable:false,id:"0",lat:element.plant.geolocation.lat,lng:element.plant.geolocation.lng}
          ]}           
        />
      </Table.Td>
      <Table.Td>{element.status}</Table.Td>
      <Table.Td>  
        <Menu shadow="md" width={200} position="left-start" withArrow arrowPosition="center" trigger="hover" openDelay={100} closeDelay={200}>
          <Menu.Target>
            <ActionIcon variant="subtle" size="lg">
              <IconDotsVertical  stroke={1.5} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            {/* <Menu.Label>Ferramentas</Menu.Label> */}
            <Menu.Item
              leftSection={<IconEdit  style={{ width: '80%', height: '80%' }} stroke={1.5} />}
              onClick={()=>handleEdit(element._id)}
              c="green"
            >
              Editar
            </Menu.Item>
            <Menu.Item
              leftSection={<IconSearch  style={{ width: '80%', height: '80%' }} stroke={1.5} />}
              onClick={()=>handleView(element)}
            >
              Visualizar
            </Menu.Item>
            {/* <Menu.Divider /> */}
            <Menu.Item
              leftSection={<IconTrash   style={{ width: '80%', height: '80%' }} stroke={1.5} />}              
              onClick={()=>handleDeleteClick(element)}
              fw={570}
            >
              Deletar
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      
      <Group justify="space-between"  mb="sm" mt="lg">
        <Text fw={700} c="red" size='lg'>Listagem dos projetos</Text >        
        <Button onClick={handleCreate}>Novo Projeto</Button>
      </Group>
      
      <Table withTableBorder striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Nome</Table.Th>
            <Table.Th>Descrição</Table.Th>
            <Table.Th>Nome do cliente</Table.Th>
            <Table.Th>Local da usina</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Ações</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>      

      <Group justify="space-between" mb="sm" mt="xl">
        <Text fw={700} c="red" size='lg'>Rascunhos</Text >        
        {/* <Button onClick={handleCreate}>Novo Projeto</Button> */}
      </Group>

      <Table withTableBorder striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Nome</Table.Th>
            <Table.Th>Descrição</Table.Th>
            <Table.Th>Nome do cliente</Table.Th>
            <Table.Th>Local da usina</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Ações</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody></Table.Tbody>
      </Table>

      <Center h={200} >
          <ProjectView noButton isOpen={openProjectView} valuesView={projectView} onClose={()=>setOpenProjectView(false)}/> 
      </Center>

      {/* Modal de Confirmação */}
      <Modal
        opened={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirmação de Exclusão"
        c={"red"}
        centered
      >
        <Text>
          Tem certeza que deseja deletar o projeto{" "}
          <strong>{selectedProject?.name}</strong>?
        </Text>
        <Group justify="center" mt="md">
          <Button variant="default" onClick={() => setIsDeleteModalOpen(false)}>
            Cancelar
          </Button>
          <Button
            color="red"
            onClick={handleDelete}
            disabled={loadingDelete}
          >
            {loadingDelete ? (
              <Center>
                <Loader size="sm" />
              </Center>
            ) : (
              "Confirmar"
            )}
          </Button>
        </Group>
      </Modal>

      
    </>
    
  );
}

