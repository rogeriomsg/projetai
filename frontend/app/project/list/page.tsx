'use client';

import { useState, useEffect } from 'react';
import { Button, Modal, TextInput, Textarea, Group, Table, Loader } from '@mantine/core';
import axios from 'axios';

type Project = {
  id: number;
  name: string;
  description: string;
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpened, setModalOpened] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

//   useEffect(() => {
//     async function fetchProjects() {
//       const response = await axios.get('/api/projects');
//       setProjects(response.data);
//       setLoading(false);
//     }
//     fetchProjects();

//   }, []);
  useEffect(() => {
    const data = [
        {id:1,name:"João",description:"Descrição 1"},
        {id:2,name:"Tereza",description:"Descrição 2"},
        {id:3,name:"Alberto",description:"Descrição 3"},
        {id:4,name:"Cristina",description:"Descrição 4"},]

    setProjects(data);
    setLoading(false);
  }, []);

  const handleAddProject = async () => {
    try {
      const response = await axios.post('/api/projects', { name, description });
      setProjects((prev) => [...prev, response.data]); // Atualiza a lista com o novo projeto
      setModalOpened(false); // Fecha o modal
      setName(''); // Reseta o formulário
      setDescription('');
    } catch (error) {
      console.error('Erro ao adicionar projeto:', error);
    }
  };

  return (
    <div>
      <Group position="apart" mb="md">
        <h1>Projetos</h1>
        <Button onClick={() => setModalOpened(true)}>Novo Projeto</Button>
      </Group>

      {loading ? (
        <Loader />
      ) : (
        <Table highlightOnHover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Descrição</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td>{project.id}</td>
                <td>{project.name}</td>
                <td>{project.description}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Modal */}
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Adicionar Novo Projeto"
      >
        <TextInput
          label="Nome"
          placeholder="Digite o nome do projeto"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Textarea
          label="Descrição"
          placeholder="Descreva o projeto"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          mt="md"
        />
        <Group position="right" mt="md">
          <Button onClick={handleAddProject}>Salvar</Button>
        </Group>
      </Modal>
    </div>
  );
}
