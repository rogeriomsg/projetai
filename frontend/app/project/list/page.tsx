'use client';
import { useState, useEffect, useRef } from 'react';
import {  Text,  Table, LoadingOverlay, Group, GridCol, Button, Grid, ActionIcon } from '@mantine/core';
import { IProjectDataValues } from '@/components/Forms/ProjectForm';
import { Delete, Search } from '@/api/project';
import { useRouter } from 'next/navigation';
import { IconEdit, IconPhoto, IconSearch, IconSun, IconTrash } from '@tabler/icons-react';
import MapModalGetSinglePoint from '@/components/MapModal/MapModalGetSinglePoint';

type Project = {
  id: number;
  name: string;
  description: string;
};

export default function ProjectsList() {
  const router = useRouter();
  const isMounted = useRef(false);
  const [projects, setProjects] = useState<IProjectDataValues[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleDelete = (id:string) => {
    const deleteproject = async () => {      
      const response = await Delete(id);
      if(response.error === 'none')
      {
        alert(`Deletado com sucesso: ${response.data}`)
        fetchProjects();
      }
      else 
      {
        alert(`Erro ao deletar: ${response.data}`)
      }
    };   

    deleteproject();
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
    <Table.Tr key={element._id}>
      <Table.Td>{element.name}</Table.Td>
      <Table.Td>{element.description}</Table.Td>
      <Table.Td>{element.client.name}</Table.Td>
      <Table.Td>
        <MapModalGetSinglePoint
          title={ `Localização da usina ${element.plant.name}`}
          pointDefault={{lat:element.plant.geolocation.lat,lng:element.plant.geolocation.lng}}          
          zoom={16}
          changePoint={false}
        />
      </Table.Td>
      <Table.Td>{element.status}</Table.Td>
      <Table.Td>        
        <ActionIcon.Group>
          <ActionIcon variant="default" size="lg" aria-label="Gallery">
            <IconEdit onClick={()=>handleEdit(element._id)} style={{ width: '70%', height: '70%' }} stroke={1.5} />
          </ActionIcon>
          <ActionIcon variant="default" size="lg" aria-label="Settings">
            <IconSearch style={{ width: '70%', height: '70%' }} stroke={1.5} />
          </ActionIcon>
          <ActionIcon variant="default" size="lg" aria-label="Likes">
            <IconTrash onClick={()=>handleDelete(element._id)} style={{ width: '70%', height: '70%' }} stroke={1.5} />
          </ActionIcon>
        </ActionIcon.Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Group justify="space-between" mb="lg" mt="lg">
        <Text fw={700}>Listagem dos projetos</Text >        
        <Button onClick={handleCreate}>Novo Projeto</Button>
      </Group>
      
      <Table withTableBorder striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Nome</Table.Th>
            <Table.Th>Descrição</Table.Th>
            <Table.Th>Nome do cliente</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Ações</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </>
    
  );
}

