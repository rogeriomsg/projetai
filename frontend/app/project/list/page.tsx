'use client';
import { useState, useEffect, useRef } from 'react';
import {  Text,  Table, LoadingOverlay, Group, GridCol, Button, Grid, ActionIcon, Center, Menu, useModalsStack, Modal, Loader } from '@mantine/core';
import { Delete, Search } from '@/api/project';
import { useRouter } from 'next/navigation';
import { IconDots, IconDotsVertical, IconEdit, IconHome, IconPhoto, IconSearch, IconSun, IconTrash } from '@tabler/icons-react';
import MapModalGetSinglePoint, { IMarker } from '@/components/MapModal/MapModalGetSinglePoint';
import ProjectView from '@/components/Forms/ProjectView';
import { notifications, showNotification} from "@mantine/notifications";
import { modals, openConfirmModal } from '@mantine/modals';
import { IProjectDataValues, IProjectResponse } from '@/types/IProject';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
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

  const [openMessageSuccess, setOpenMessageSuccess] = useState(false);
  const [openMessageFail, setOpenMessageFail] = useState(false);
  const [alertProp, setalertProp] = useState<{}|null>(null);


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

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenMessageSuccess(false);
    setOpenMessageFail(false);
  };

  const handleDeleteClick = (project:IProjectDataValues)=>{
    setSelectedProject(project)
    setIsDeleteModalOpen(true)
  }

  const handleDelete = async () =>{
    if (!selectedProject) return;    
         
    setLoadingDelete(true);

      setalertProp({severity:'success',message:"Deletado com sucesso!"})
      setOpenMessageSuccess(true);
    // const response = await Delete(selectedProject._id);
    // if(response.error === 'none')
    // {      
    //   setProjects((prev) => prev.filter((p) => p._id !== selectedProject._id));
    //   setalertProp({severity:'success',children:"Deletado com sucesso!"})
    //   setOpenMessageSuccess(true);
    // }
    // else 
    // {
    //   setOpenMessageFail(true)
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
    const response = await Search("status=Recebido pela Projetai");
    if((response as IProjectResponse).error === false)
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
              //onClick={handleNewDelete}
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
        
        <Snackbar open={openMessageSuccess} autoHideDuration={5000} onClose={handleClose} anchorOrigin={ {vertical: 'top', horizontal: 'center'} } >
          <Alert
            onClose={handleClose}
            severity="success"
            variant="filled"
            sx={{ width: '100%' }}
          >
            Deletado com sucesso!
          </Alert>          
        </Snackbar>

        <Snackbar open={openMessageFail} autoHideDuration={5000} onClose={handleClose} anchorOrigin={ {vertical: 'top', horizontal: 'center'} }>
          <Alert
            onClose={handleClose}
            severity="error"
            variant="filled"
            sx={{ width: '100%' }}            
          >
            <Text>
              Falha ao tentar deletar!              
            </Text>
          </Alert>
        </Snackbar>

      
    </>
    
  );
}

