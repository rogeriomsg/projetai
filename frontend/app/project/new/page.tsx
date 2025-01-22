'use client';
import { useForm ,hasLength, matches,isNotEmpty} from '@mantine/form';
import { Stepper, Button, Group, NumberInput, TextInput, Box, LoadingOverlay,Fieldset,Grid,InputBase,Tooltip,} from '@mantine/core';
import { useEffect, useState } from 'react';
import { notifications } from '@mantine/notifications';
import { Notification } from '@mantine/core';
import { IMaskInput } from 'react-imask';
import {
  IconUserCheck,
  IconHomeBolt,
  IconFileUpload,
  IconExposure,
  IconCircleCheck,
} from '@tabler/icons-react';
import axios from "axios";

export default function  NewProject() {
  const [activeStep, setActiveStep] = useState(0);  
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { 
      name: undefined, 
      client_code: undefined ,
      cpf: undefined,
      identity: '',
      identity_issuer : '',
      email: undefined, 
      phone: undefined, 
    },
    // functions will be used to validate values at corresponding key
    validate: {
      name: hasLength({ min: 2}, 'Nome deve ter ao menos 2 letras'),
      email: (value) => (value === undefined? 'Email é obrigatório': (/^\S+@\S+$/.test(value) ? null : 'E-mail inválido') ),
      cpf: (value) => (value === undefined? 'CPF é obrigatório': null),
      client_code: (value) => (value === undefined? 'Código do cliente deve ser diferente de 0': null),
      phone: (value) => (value === undefined? 'Telefone é obrigatório' : null),
    },
  });

  const nextStep = () => { setActiveStep((current) => (form.validate().hasErrors ? current : current + 1))};     
  const prevStep = () => setActiveStep((current) => (current > 0 ? current - 1 : current));

  const handleSubmit = async (_values: typeof form.values ) => {   
    
    
    if (!form.validate().hasErrors) {
      alert(JSON.stringify(_values))
      
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
  const calcularResultado = (valor:string) => {
    //form.setFieldValue("email", `${valor.toLowerCase()}@exemplo.com ${form.values.cpf}`);              
  };

  useEffect(() => {
   
  });


  return (
    <form onSubmit={form.onSubmit(handleSubmit)}  >
      <LoadingOverlay visible={loading} />
      <Stepper 
        active={activeStep} 
        onStepClick={setActiveStep} 
        completedIcon={<IconCircleCheck size={20} />}
        mx="auto" mt="xl" ml="xl" mr="xl"      
      >
        <Stepper.Step 
          label="Passo 1" 
          description="Informações do cliente"
          icon={<IconUserCheck size={18} />}
        >  
          <Grid mt="sm">
            <Grid.Col span={2}>              
                <NumberInput
                  label="Código do cliente"
                  placeholder="Código do cliente"
                  key={form.key("client_code")}
                  {...form.getInputProps("client_code")} 
                  required           
                />
              
              
            </Grid.Col>
            <Grid.Col span={10}>
              <Tooltip label="Nome do cliente da conta onde será instalada a usina" position="top-start" offset={24}>
                <TextInput
                  label="Nome completo do cliente titular UC"
                  placeholder="Nome"
                  key={form.key("name")}
                  {...form.getInputProps("name")}
                  onBlur={(e)=>{calcularResultado(e.target.value)}}
                  required
                />
              </Tooltip>
            </Grid.Col>
            <Grid.Col span={6}>
              <InputBase
                label="CPF"
                component={IMaskInput}
                mask="000.000.000-00"
                placeholder="CPF"
                key={form.key("cpf")}
                {...form.getInputProps("cpf")}
                required
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <TextInput
                label="RG"
                placeholder="Numero da indentidade"
                key={form.key("identity")}
                {...form.getInputProps("identity")}  
              /> 
            </Grid.Col>
            <Grid.Col span={3}>
              <TextInput
                label="Orgão expedidor"
                placeholder="Orgão"
                key={form.key("identity_issuer")}
                {...form.getInputProps("identity_issuer")}  
              /> 
            </Grid.Col>
            <Grid.Col span={8}>
              <TextInput
                label="E-mail"
                placeholder="E-mail"
                key={form.key("email")}
                {...form.getInputProps("email")}
                required
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <InputBase
                label="Telefone"
                component={IMaskInput}
                mask="(00) 00000-0000"
                placeholder="Telefone"
                key={form.key("phone")}
                {...form.getInputProps("phone")}
                required
              />
            </Grid.Col>
          </Grid>             
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
          <p>Confirme os dados abaixo, se estiver tudo certo você pode salvar e continuar editando depois ou enviar para análise:</p>
          <pre>{JSON.stringify(form.getValues(), null, 3)}</pre>
          
          
        </Stepper.Completed>
      </Stepper>

      <Group justify="right" mt="xl" mr="xl">        
        {activeStep > 0 && (
          <>
          <Button variant="default" onClick={prevStep}>
            Voltar
          </Button>
          <Button variant="default" onClick={prevStep} disabled={false}>
          Salvar e continuar editando depois
          </Button>
          </>          
        )}        
        {activeStep < 4 && (
          <Button onClick={nextStep} >
            {activeStep === 3 ? "Conferir tudo" : "Próximo passo"}
          </Button>
        )} 
        {activeStep === 4 && (
          <Button type='submit'>Enviar para análise</Button>
        )} 
           
        
      </Group>

      
      
    </form>
  );
}