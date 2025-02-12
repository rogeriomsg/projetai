'use client';
import { useState, useEffect, useRef } from 'react';
import {  Text,  Table, LoadingOverlay, Group, GridCol, Button, Grid, ActionIcon, Center, Menu, useModalsStack, Modal, Loader } from '@mantine/core';
import { Delete, Search } from '@/api/project';
import { useRouter } from 'next/navigation';
import { IconDots, IconDotsVertical, IconEdit, IconCopyCheck, IconPhoto, IconSearch, IconSun, IconTrash, IconCopy } from '@tabler/icons-react';
import MapModalGetSinglePoint, { IMarker } from '@/components/MapModal/MapModalGetSinglePoint';
import ProjectView from '@/components/Forms/ProjectView';
import { notifications, showNotification} from "@mantine/notifications";
import { modals, openConfirmModal } from '@mantine/modals';
import { IProjectDataValues, IProjectResponse } from '@/types/IProject';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import ProjectViewV2 from '@/components/Forms/ProjectViewV2';
type Project = {
  id: number;
  name: string;
  description: string;
};

export default function ProjectsList() {
  const router = useRouter();
  const isMounted = useRef(false);
  const [projects, setProjects] = useState<IProjectDataValues[]>([]);
  const [sketchs, setSketchs] = useState<IProjectDataValues[]>([]);
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
        fetchSketchs();
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
  const handleSaveAs = (id:string) => {
    router.push(`/project/update/${id}?opt=SaveAs`); // Redireciona para a página "/destination-page"
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
    const response = await Delete(selectedProject._id);
    if(response.error === false)
    {      
      setProjects((prev) => prev.filter((p) => p._id !== selectedProject._id));
      setalertProp({severity:'success',children:"Deletado com sucesso!"})
      setOpenMessageSuccess(true);
    }
    else 
    {
      setOpenMessageFail(true)
    }
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
    const response = await Search('filter={ "status": { "$nin": ["Em cadastro"] } }');
    
    if((response as IProjectResponse).error === false)
    {
      setProjects(response.data as IProjectDataValues[])
    }            
    setLoading(false);
  };

  const fetchSketchs = async () => {
    setLoading(true);
    const response = await Search('filter={ "status": { "$in": ["Em cadastro"] } }');
    //alert(JSON.stringify(response.data))
    if((response as IProjectResponse).error === false)
    {
      setSketchs(response.data as IProjectDataValues[])
    }            
    setLoading(false);
  };  

  if (loading) {
    return <><LoadingOverlay visible={loading} zIndex={1} overlayProps={{ radius: "sm", blur: 2 }} /></>;
  }
  
  const projectRows = projects.map((element) => (
    <Table.Tr key={element._id} >
      <Table.Td>{element.name}</Table.Td>
      <Table.Td>{element.dealership}</Table.Td>
      <Table.Td>{element.plant.installed_power?`${element.plant.installed_power} kWp`:""}</Table.Td>
      <Table.Td>{element.client?.name}</Table.Td>
      <Table.Td>
        <MapModalGetSinglePoint
          centerDefault={{lat:Number(element.plant.geolocation.lat),lng:Number(element.plant.geolocation.lng)}}          
          zoom={18}
          dataMarkers={[ 
            {available:true,selected:true,clickable:false,id:"0",lat:Number(element.plant.geolocation.lat),lng:Number(element.plant.geolocation.lng)}
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
              leftSection={<IconCopy  style={{ width: '80%', height: '80%' }} stroke={1.5} />}
              onClick={()=>handleSaveAs(element._id)}
              c="green"
            >
              Usar como modelo
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
              c="red"
            >
              Deletar
            </Menu.Item>
            <Menu.Item
              leftSection={<IconTrash   style={{ width: '80%', height: '80%' }} stroke={1.5} />}              
              onClick={()=>handleDeleteClick(element)}
              c="brown"
              fw={570}
            >
              Histórico
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Table.Td>
    </Table.Tr>
  ));

  const sketchsRows = sketchs.map((element) => (
    <Table.Tr key={element._id} >
      <Table.Td>{element.name}</Table.Td>
      <Table.Td>{element.dealership}</Table.Td>
      <Table.Td>{element.plant.installed_power?`${element.plant.installed_power} kWp`:""}</Table.Td>
      <Table.Td>{element.client?.name}</Table.Td>
      <Table.Td>
        <MapModalGetSinglePoint
          centerDefault={{lat:Number(element.plant.geolocation.lat),lng:Number(element.plant.geolocation.lng)}}          
          zoom={18}
          dataMarkers={[ 
            {available:true,selected:true,clickable:false,id:"0",lat:Number(element.plant.geolocation.lat),lng:Number(element.plant.geolocation.lng)}
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
              Continuar Editando
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
              c="red"
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
          <Button onClick={handleCreate}>Iniciar Novo Projeto</Button>
        </Group>
        
        <Table withTableBorder striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th w={300}>Nome do projeto</Table.Th>
              <Table.Th>Distribuidora</Table.Th>
              <Table.Th>Potência de geração</Table.Th>
              <Table.Th>Nome do titular</Table.Th>
              <Table.Th>Local da usina</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Ações</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{projectRows}</Table.Tbody>
        </Table>      

        <Group justify="space-between" mb="sm" mt="xl">
          <Text fw={700} c="red" size='lg'>Rascunhos</Text >        
          {/* <Button onClick={handleCreate}>Novo Projeto</Button> */}
        </Group>

        <Table withTableBorder striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
            <Table.Th w={300}>Nome do projeto</Table.Th>
              <Table.Th>Distribuidora</Table.Th>
              <Table.Th>Potência de geração</Table.Th>
              <Table.Th>Nome do titular</Table.Th>
              <Table.Th>Local da usina</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Ações</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{sketchsRows}</Table.Tbody>
        </Table>

        <Center h={200} >
            <ProjectViewV2 noButton isOpen={openProjectView} valuesView={projectView} onClose={()=>setOpenProjectView(false)}/> 
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

