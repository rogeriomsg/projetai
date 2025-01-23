'use client';
import { useForm ,hasLength, matches,isNotEmpty} from '@mantine/form';
import { Affix,Text,Table , Autocomplete, ActionIcon,Switch,Stepper, Button, Group, NumberInput, TextInput, LoadingOverlay,Grid,InputBase,Tooltip, GridCol, Textarea,} from '@mantine/core';
import { useEffect, useState } from 'react';
import { IMaskInput } from 'react-imask';
import { randomId } from '@mantine/hooks';
import {
  IconUserCheck,
  IconHomeBolt,
  IconFileUpload,
  IconExposure,
  IconCircleCheck,
  IconTrash,
  IconPlus,
} from '@tabler/icons-react';
import axios from "axios";

export default function  NewProject() {
  const [activeStep, setActiveStep] = useState(0);  
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visible, setVisible] = useState(false);

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { 
      name: 'Paulo', 
      client_code: 123 ,
      cpf: "00349176086",
      identity: '123',
      identity_issuer : 'SSP-DF',
      email: "rogeriomsg@hotmail.com", 
      phone: 12982230206,
      consumerUnit: [{ 
        key: randomId(),
        code: undefined , 
        name: '', 
        description: '', 
        address: { 
          street: '',
          number: undefined,
          city: '',
          state: '',
          zip: undefined
        },
        geolocation: {
          lat: undefined,
          lng: undefined
        }, 
        percentage: 100,
        is_generating: true
      }], 
      
    },
    // functions will be used to validate values at corresponding key
    validate: {
      name: hasLength({ min: 2}, 'Nome deve ter ao menos 2 letras'),
      email: (value) => (value === undefined? 'Email é obrigatório': (/^\S+@\S+$/.test(value) ? null : 'E-mail inválido') ),
      cpf: hasLength({ min: 14 , max: 14}, 'CPF inválido'),
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

  // const fields = form.getValues().consumerUnit.map((item, index) => (
    
  // ));

  const consumerUnits = form.getValues().consumerUnit.map((item, index) => (
    <Table.Tr key={item.key} >
      <Table.Td >           
        <Grid ml="md" mr="md">
          <Grid.Col span={12}>
            <Switch             
              label="A usina será instalada nesta Unidade?"
              key={form.key(`consumerUnit.${index}.is_generating`)}
              {...form.getInputProps(`consumerUnit.${index}.is_generating`, { type: 'checkbox' })}
            />
          </Grid.Col>
          <Grid.Col span={1}>  
            <TextInput
              label="Código da UC"
              placeholder="Código da UC"
              //style={{ flex: 1 }}
              key={form.key(`consumerUnit.${index}.code`)}
              {...form.getInputProps(`consumerUnit.${index}.code`)}
              required
            />
          </Grid.Col>
          <Grid.Col span={1}>
            <NumberInput
              label="Porcentagem"
              placeholder=""
              key={form.key(`consumerUnit.${index}.percentage`)}
              {...form.getInputProps(`consumerUnit.${index}.percentage`)} 
              required           
            />
          </Grid.Col> 
          <Grid.Col span={10} >
            <TextInput
              placeholder="Digite um nome, por ex.: Casa a ser instalada a usina"
              label="Nome da UC"
              key={form.key(`consumerUnit.${index}.name`)}
              {...form.getInputProps(`consumerUnit.${index}.name`)}
            />
          </Grid.Col>
          {
            form.values.consumerUnit[index].is_generating && (
              <>
                <Grid.Col span={8}>             
                  <TextInput
                    label="Endereço"
                    key={form.key(`consumerUnit.${index}.address.street`)}
                    {...form.getInputProps(`consumerUnit.${index}.address.street`)}
                    required
                  />    
                </Grid.Col>
                <Grid.Col span={2}>
                  <NumberInput
                    label="Número"
                    key={form.key(`consumerUnit.${index}.address.number`)}
                    {...form.getInputProps(`consumerUnit.${index}.address.number`)} 
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <Autocomplete
                    label="Estado"
                    placeholder="Digite o estado"
                    data={['Distrito Federal', 'Goiás', 'São Paulo', 'Rio Grande do Sul']}
                    key={form.key(`consumerUnit.${index}.address.state`)}
                    {...form.getInputProps(`consumerUnit.${index}.address.state`)} 
                    required
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <Autocomplete
                    label="Município"
                    placeholder="Digite o município"
                    data={['Brasília','Uruguaiana','Taubaté','Porto Alegre']}
                    key={form.key(`consumerUnit.${index}.address.city`)}
                    {...form.getInputProps(`consumerUnit.${index}.address.city`)} 
                    required
                  />
                </Grid.Col>
                <Grid.Col span={3}>
                  <NumberInput
                    label="Latitude"
                    placeholder=""
                    key={form.key(`consumerUnit.${index}.geolocation.lat`)}
                    {...form.getInputProps(`consumerUnit.${index}.geolocation.lat`)} 
                    required           
                  />
                </Grid.Col>
                <Grid.Col span={3}>
                  <NumberInput
                    label="Longitude"
                    placeholder=""
                    key={form.key(`consumerUnit.${index}.geolocation.lng`)}
                    {...form.getInputProps(`consumerUnit.${index}.geolocation.lng`)} 
                    required           
                  />
                </Grid.Col>
              </>
            )
          }                                    
        </Grid>
      </Table.Td>
      <Table.Td>
        <Group gap={0} justify="flex-end">                   
          <ActionIcon color="red" variant="subtle" onClick={() => form.removeListItem('consumerUnit', index)}>
            <IconTrash size={28} stroke={1.8}/>
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

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
                  onBlur={(e)=>{()=>{}}}
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
          <Table.ScrollContainer minWidth={900}>
            <Table verticalSpacing="xl" highlightOnHover withColumnBorders>
              <Table.Tbody>{consumerUnits}</Table.Tbody>
            </Table>
          </Table.ScrollContainer>
          

          <Group justify="center" mt="md">            
            <Button
              onClick={() =>
                form.insertListItem('consumerUnit', { 
                  key: randomId(),
                  code: undefined , 
                  name: '', 
                  description: '', 
                  address: { 
                    street: '',
                    number: undefined,
                    city: '',
                    state: '',
                    zip: undefined
                  },
                  geolocation: {
                    lat: undefined,
                    lng: undefined
                  }, 
                  percentage: 0,
                  is_generating: false
                })
              }
            >
              Adicionar unidade consumidora
            </Button>
          </Group>  
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
          Salvar e editar depois
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