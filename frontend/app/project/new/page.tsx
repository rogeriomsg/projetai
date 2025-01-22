'use client';
import { useForm } from '@mantine/form';
import { Stepper, Button, Group, NumberInput, TextInput, Box, LoadingOverlay} from '@mantine/core';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { Notification } from '@mantine/core';
import {
  IconUserCheck,
  IconHomeBolt,
  IconFileUpload,
  IconExposure,
  IconCircleCheck,
} from '@tabler/icons-react';
import axios from "axios";

export default function  Demo() {
  const [active, setActive] = useState(0);  
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { name: '', email: '', age: 0 },

    // functions will be used to validate values at corresponding key
    validate: {
      name: (value) => (value.length < 2 ? 'Nome deve ter ao menos 2 letras' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'E-mail inválido'),
      age: (value) => (value < 18 ? 'Você deve ter ao menos 18 anos para se regitrar' : null),
    },
  });

  const nextStep = () => setActive((current) => (form.validate().hasErrors ? current : current + 1));     
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  const handleSubmit = async () => {   
    
    if (!form.validate().hasErrors) {
      alert(JSON.stringify(form.values, null, 3))

      //setLoading(true);
    //   setIsSubmitting(true);
    //   try {
    //     const data = { ...form.values };
    //     await axios.post("http://192.168.0.10:3333/project/create", data);
    //     alert("Cadastro realizado com sucesso!");
    //   } catch (e) {
    //     alert("Erro ao enviar os dados: " + e.message);
    //   } finally {
    //     setIsSubmitting(false);
    //   }
    // }
    // else{
    //   alert("O formulário contem pendências!");
   }
  };


  return (
    <Box  mx="auto" mt="xl" ml="xl" mr="xl">
      <LoadingOverlay visible={loading} />
      <Stepper 
        active={active} 
        onStepClick={setActive} 
        completedIcon={<IconCircleCheck size={20} />}
      >
        <Stepper.Step 
          label="Passo 1" 
          description="Informações do cliente"
          icon={<IconUserCheck size={18} />}
        >          
          <TextInput
            label="Nome"
            placeholder="Nome"
            //key={form.key("name")}
            {...form.getInputProps("name")}
            required
          />
          <TextInput
            mt="sm"
            label="E-mail"
            placeholder="E-mail"
            //key={form.key("email")}
            {...form.getInputProps("email")}
          />
          <NumberInput
            mt="sm"
            label="Idade"
            placeholder="Idade"
            min={0}
            max={120}
            //key={form.key("age")}
            {...form.getInputProps("age")}
          />
        </Stepper.Step>
        <Stepper.Step 
          label="Passo 2" 
          description="Unidades consumidoras"
          icon={<IconHomeBolt size={18} />}
        >
          
          Step 2 content: Verify email
        </Stepper.Step>
        <Stepper.Step 
          label="Passo 3" 
          description="Equipamentos"
          icon={<IconExposure size={18} />}
        >
          Step 3 content: Get full access
        </Stepper.Step>
        <Stepper.Step 
          label="Passo 4" 
          description="Documentos"
          icon={<IconFileUpload size={18} />}
        >
          Step 4 content: teste
        </Stepper.Step>
        <Stepper.Completed>
          <p>Confirme os dados antes de enviar:</p>
          <pre>{JSON.stringify(form.values, null, 3)}</pre>
          <Notification color="teal">
            {apiResponse || "Ready to submit your data"}
          </Notification>
          <Button onClick={handleSubmit}>Enviar</Button>
        </Stepper.Completed>
      </Stepper>

      <Group justify="center" mt="xl">        
        {active > 0 && (
          <Button variant="default" onClick={prevStep}>
            Voltar
          </Button>
        )}
        <Button variant="default" onClick={prevStep} disabled={false}>
            Salva rascunho
        </Button>
        {active < 4 && (
          <Button onClick={nextStep} >
            {active === 4 ? "Concluir" : "Próximo"}
          </Button>
        )} 
           
        
      </Group>

      
      
    </Box>
  );
}