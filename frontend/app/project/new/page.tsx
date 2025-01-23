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
      client: {
        client_code: undefined,
        name: "",
        cpf: "",
        identity: "",
        email: "",
        phone: "",
        address: {
          street: "",
          number: undefined,
          city: "",
          state: "",
          zip: undefined,
        },
        is_active: true
      },      
      plant: { 
        consumer_unit_code: undefined , 
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
        circuit_breaker: undefined,
        installed_load: undefined,
			  installed_power: undefined,
			  service_voltage: undefined,
      },
      consumerUnit: [{ 
        key: randomId(),
        consumer_unit_code: undefined , 
        name: 'Unidade consumidora geradora', 
        description: '',         
        percentage: 100,
        is_plant: true
      }], 
      inverters: [{
        key: randomId(),
        model: undefined,
        brand: undefined,
        power: undefined,
        quantity: 1,
        description: ""
      }],
      modules: [{
        key: randomId(),
        model: undefined,
        brand: undefined,
        power: undefined,
        quantity: 1,
        width: undefined,
        height: undefined,
        description: ""
      }],
      
    },
    // // functions will be used to validate values at corresponding key
    // validate: {
    //   name: hasLength({ min: 2}, 'Nome deve ter ao menos 2 letras'),
    //   email: (value) => (value === undefined? 'Email é obrigatório': (/^\S+@\S+$/.test(value) ? null : 'E-mail inválido') ),
    //   cpf: hasLength({ min: 14 , max: 14}, 'CPF inválido'),
    //   client_code: (value) => (value === undefined? 'Código do cliente deve ser diferente de 0': null),
    //   phone: (value) => (value === undefined? 'Telefone é obrigatório' : null),
    // },
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


  const consumerUnits = form.getValues().consumerUnit.map((item, index) => (
    <Table.Tr key={item.key} >
      <Table.Td >           
        <Grid ml="md" mr="md" mb="sm">          
          <Grid.Col span={2}>  
            <TextInput
              label="Código da UC"
              placeholder="Código da UC"
              key={form.key(`consumerUnit.${index}.consumer_unit_code`)}
              {...form.getInputProps(`consumerUnit.${index}.consumer_unit_code`)}
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
          <Grid.Col span={9} >
            <TextInput
              placeholder="Digite um nome, por ex.: Casa a ser instalada a usina"
              label="Nome da UC"
              key={form.key(`consumerUnit.${index}.name`)}
              {...form.getInputProps(`consumerUnit.${index}.name`)}
            />
          </Grid.Col>                                         
        </Grid>
      </Table.Td>
      <Table.Td>
        <Group gap={0} justify="flex-end"> 
          {
            index===0 &&(
              <>
              <ActionIcon color="red" variant="subtle" onClick={() => form.removeListItem('consumerUnit', index)} disabled >
                <IconTrash size={28} stroke={1.8}/>
              </ActionIcon>
              </>
            ) 
          }
          {
            index!==0 &&(
              <>
              <ActionIcon color="red" variant="subtle" onClick={() => form.removeListItem('consumerUnit', index)}>
                <IconTrash size={28} stroke={1.8}/>
              </ActionIcon>
              </>
            ) 
          } 
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  const invertersDataRows = form.getValues().inverters.map((item, index) => (
    <Table.Tr key={item.key} >
      <Table.Td >           
        <Grid ml="md" mr="md" mb="sm">          
          <Grid.Col span={2}>  
            <TextInput
              label="Modelo"
              placeholder="Modelo do inversor"
              key={form.key(`inverters.${index}.model`)}
              {...form.getInputProps(`inverters.${index}.model`)}
              required
            />
          </Grid.Col>
          <Grid.Col span={2}>  
            <TextInput
              label="Marca"
              placeholder="Marca do inversor"
              key={form.key(`inverters.${index}.brand`)}
              {...form.getInputProps(`inverters.${index}.brand`)}
              required
            />
          </Grid.Col>
          <Grid.Col span={1}>
            <NumberInput
              label="Potência"
              placeholder="Potência em kw"
              key={form.key(`inverters.${index}.power`)}
              {...form.getInputProps(`inverters.${index}.power`)} 
              required           
            />
          </Grid.Col> 
          <Grid.Col span={1}>
            <NumberInput
              label="Quantidade"
              placeholder="Quantidade de inversores"
              key={form.key(`inverters.${index}.quantity`)}
              {...form.getInputProps(`inverters.${index}.quantity`)} 
              required           
            />
          </Grid.Col>                           
        </Grid>
      </Table.Td>
      <Table.Td>
        <Group gap={0} justify="flex-end"> 
          {
            index===0 &&(
              <>
              <ActionIcon color="red" variant="subtle" onClick={() => form.removeListItem('inverters', index)} disabled >
                <IconTrash size={28} stroke={1.8}/>
              </ActionIcon>
              </>
            ) 
          }
          {
            index!==0 &&(
              <>
              <ActionIcon color="red" variant="subtle" onClick={() => form.removeListItem('inverters', index)}>
                <IconTrash size={28} stroke={1.8}/>
              </ActionIcon>
              </>
            ) 
          } 
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  const modulesDataRows = form.getValues().modules.map((item, index) => (
    <Table.Tr key={item.key} >
      <Table.Td >           
        <Grid ml="md" mr="md" mb="sm">          
          <Grid.Col span={2}>  
            <TextInput
              label="Modelo"
              placeholder="Modelo do módulo fotovoltaico"
              key={form.key(`module.${index}.model`)}
              {...form.getInputProps(`module.${index}.model`)}
              required
            />
          </Grid.Col>
          <Grid.Col span={2}>  
            <TextInput
              label="Marca"
              placeholder="Marca do módulo fotovoltaico"
              key={form.key(`module.${index}.brand`)}
              {...form.getInputProps(`module.${index}.brand`)}
              required
            />
          </Grid.Col>
          <Grid.Col span={1}>
            <NumberInput
              label="Potência"
              placeholder="Potência em kw"
              key={form.key(`inverters.${index}.power`)}
              {...form.getInputProps(`inverters.${index}.power`)} 
              required           
            />
          </Grid.Col> 
          <Grid.Col span={1}>
            <NumberInput
              label="Quantidade"
              placeholder="Quantidade de inversores"
              key={form.key(`inverters.${index}.quantity`)}
              {...form.getInputProps(`inverters.${index}.quantity`)} 
              required           
            />
          </Grid.Col>                           
        </Grid>
      </Table.Td>
      <Table.Td>
        <Group gap={0} justify="flex-end"> 
          {
            index===0 &&(
              <>
              <ActionIcon color="red" variant="subtle" onClick={() => form.removeListItem('inverters', index)} disabled >
                <IconTrash size={28} stroke={1.8}/>
              </ActionIcon>
              </>
            ) 
          }
          {
            index!==0 &&(
              <>
              <ActionIcon color="red" variant="subtle" onClick={() => form.removeListItem('inverters', index)}>
                <IconTrash size={28} stroke={1.8}/>
              </ActionIcon>
              </>
            ) 
          } 
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
                  key={form.key("client.client_code")}
                  {...form.getInputProps("client.client_code")} 
                  required           
                />
            </Grid.Col>
            <Grid.Col span={10}>
              <Tooltip label="Nome do cliente da conta onde será instalada a usina" position="top-start" offset={24}>
                <TextInput
                  label="Nome completo do cliente titular UC"
                  placeholder="Nome"
                  key={form.key("client.name")}
                  {...form.getInputProps("client.name")}
                  onBlur={(e)=>{()=>{}}}
                  required
                />
              </Tooltip>
            </Grid.Col>
            <Grid.Col span={2}>
              <InputBase
                label="CPF"
                component={IMaskInput}
                mask="000.000.000-00"
                placeholder="CPF"
                key={form.key("client.cpf")}
                {...form.getInputProps("client.cpf")}
                required
              />
            </Grid.Col>
            <Grid.Col span={2}>
              <TextInput
                label="RG"
                placeholder="Numero da indentidade"
                key={form.key("client.identity")}
                {...form.getInputProps("client.identity")}  
              /> 
            </Grid.Col>
            <Grid.Col span={2}>
              <TextInput
                label="Orgão expedidor"
                placeholder="Orgão"
                key={form.key("client.identity_issuer")}
                {...form.getInputProps("client.identity_issuer")}  
              /> 
            </Grid.Col>
            <Grid.Col span={4}>
              <TextInput
                label="E-mail"
                placeholder="E-mail"
                key={form.key("client.email")}
                {...form.getInputProps("client.email")}
                required
              />
            </Grid.Col>
            <Grid.Col span={2}>
              <InputBase
                label="Telefone"
                component={IMaskInput}
                mask="(00) 00000-0000"
                placeholder="Telefone"
                key={form.key("client.phone")}
                {...form.getInputProps("client.phone")}
                required
              />
            </Grid.Col>
            <Grid.Col span={2}>             
              <TextInput
                label="CEP"
                placeholder='Digite o CEP'
                key={form.key(`client.address.zip`)}
                {...form.getInputProps(`client.address.zip`)}
                required
              />    
            </Grid.Col>               
            <Grid.Col span={8}>             
              <TextInput
                label="Logradouro"
                key={form.key(`client.address.street`)}
                {...form.getInputProps(`client.address.street`)}
                required
              />    
            </Grid.Col>
            <Grid.Col span={2}>
              <NumberInput
                label="Número"
                key={form.key(`client.address.number`)}
                {...form.getInputProps(`client.address.number`)} 
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <Autocomplete
                label="Estado"
                placeholder="Digite o estado"
                data={['Distrito Federal', 'Goiás', 'São Paulo', 'Rio Grande do Sul']}
                key={form.key(`client.address.state`)}
                {...form.getInputProps(`client.address.state`)} 
                required
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <Autocomplete
                label="Município"
                placeholder="Digite o município"
                data={['Brasília','Uruguaiana','Taubaté','Porto Alegre']}
                key={form.key(`client.address.city`)}
                {...form.getInputProps(`client.address.city`)} 
                required
              />
            </Grid.Col>
            <Grid.Col span={2}></Grid.Col>
          </Grid>             
        </Stepper.Step>
        <Stepper.Step 
          label="Passo 2" 
          description="Informações da usina"
          icon={<IconHomeBolt size={18} />}
        >                 
          <Grid mt="sm" ml="md" mr="md">                
            <Grid.Col span={2}>  
              <TextInput
                label="Código da UC"
                placeholder="Código da UC"
                //style={{ flex: 1 }}
                key={form.key(`plant.consumer_unit_code`)}
                {...form.getInputProps(`plant.consumer_unit_code`)}
                required
              />
            </Grid.Col>                
            <Grid.Col span={10} >
              <TextInput
                placeholder="Digite um nome, por ex.: usina instalada (opcional)"
                label="Nome da usina"
                key={form.key(`plant.name`)}
                {...form.getInputProps(`plant.name`)}
              />
            </Grid.Col> 
            <Grid.Col span={2}>             
              <TextInput
                label="CEP"
                placeholder='Digite o CEP'
                key={form.key(`plant.address.zip`)}
                {...form.getInputProps(`plant.address.zip`)}
                required
              />    
            </Grid.Col>               
            <Grid.Col span={7}>             
              <TextInput
                label="Logradouro"
                key={form.key(`plant.address.street`)}
                {...form.getInputProps(`plant.address.street`)}
                required
              />    
            </Grid.Col>
            <Grid.Col span={3}>
              <NumberInput
                label="Número"
                key={form.key(`plant.address.number`)}
                {...form.getInputProps(`plant.address.number`)} 
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <Autocomplete
                label="Estado"
                placeholder="Digite o estado"
                data={['Distrito Federal', 'Goiás', 'São Paulo', 'Rio Grande do Sul']}
                key={form.key(`plant,address.state`)}
                {...form.getInputProps(`plant.address.state`)} 
                required
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <Autocomplete
                label="Município"
                placeholder="Digite o município"
                data={['Brasília','Uruguaiana','Taubaté','Porto Alegre']}
                key={form.key(`plant.address.city`)}
                {...form.getInputProps(`plant.address.city`)} 
                required
              />
            </Grid.Col>
            <Grid.Col span={2}>
              <NumberInput
                label="Latitude"
                placeholder=""
                key={form.key(`plant.geolocation.lat`)}
                {...form.getInputProps(`plant.geolocation.lat`)} 
                required           
              />
            </Grid.Col>
            <Grid.Col span={2}>
              <NumberInput
                label="Longitude"
                placeholder=""
                key={form.key(`plant.geolocation.lng`)}
                {...form.getInputProps(`plant.geolocation.lng`)} 
                required           
              />
            </Grid.Col> 
            <Grid.Col span={2}>
              <NumberInput
                label="Tensão de atendimento "
                placeholder="Em (kV)"
                key={form.key(`plant.service_voltage`)}
                {...form.getInputProps(`plant.service_voltage`)} 
                required           
              />
            </Grid.Col>                                           
            <Grid.Col span={2}>
              <NumberInput
                label="Disjuntor padrão de entrada"
                placeholder="Em (A)"
                key={form.key(`plant.circuit_breaker`)}
                {...form.getInputProps(`plant.circuit_breaker`)} 
                required           
              />
            </Grid.Col> 
            <Grid.Col span={2}>
              <NumberInput
                label="Carga disponibilizada"
                placeholder="Em (kW)"
                key={form.key(`plant.installed_load`)}
                {...form.getInputProps(`plant.installed_load`)} 
                readOnly         
              />
            </Grid.Col>   
            <Grid.Col span={2} offset={4}>
              <NumberInput
                label="Potência instalada da usina"
                placeholder="Em (kWp)"
                key={form.key(`plant.installed_power`)}
                {...form.getInputProps(`plant.installed_power`)} 
                readOnly          
              />
            </Grid.Col>   
          </Grid> 
        </Stepper.Step>
        <Stepper.Step 
          label="Passo 3" 
          description="Unidades consumidoras"
          icon={<IconExposure size={18} />}
        >
          <Table.ScrollContainer minWidth={900}>
            <Table verticalSpacing="sm" highlightOnHover withColumnBorders>
              <Table.Tbody>{consumerUnits}</Table.Tbody>
            </Table>
          </Table.ScrollContainer>         

          <Group justify="center" mt="md">            
            <Button
              onClick={() =>
                form.insertListItem('consumerUnit', { 
                  key: randomId(),
                  consumer_unit_code: undefined , 
                  name: '', 
                  description: '',         
                  percentage: 0,
                  is_plant: false
                })
              }
            >
              Adicionar unidade consumidora
            </Button>
          </Group>
        </Stepper.Step>
        <Stepper.Step 
          label="Passo 4" 
          description="Equipamentos"
          icon={<IconFileUpload size={18} />}
        >
          <Table.ScrollContainer minWidth={900}>
            <Table verticalSpacing="sm" highlightOnHover withColumnBorders>
              <Table.Tbody>{invertersDataRows}</Table.Tbody>
            </Table>
          </Table.ScrollContainer>         

          <Group justify="center" mt="md">            
            <Button
              onClick={() =>
                form.insertListItem('consumerUnit', { 
                  key: randomId(),
                  consumer_unit_code: undefined , 
                  name: '', 
                  description: '',         
                  percentage: 0,
                  is_plant: false
                })
              }
            >
              Adicionar unidade consumidora
            </Button>
          </Group>
        </Stepper.Step>
        <Stepper.Step 
          label="Passo 5" 
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
        {activeStep < 5 && (
          <Button onClick={nextStep} >
            {activeStep === 4 ? "Conferir tudo" : "Próximo passo"}
          </Button>
        )} 
        {activeStep === 5 && (
          <Button type='submit'>Enviar para análise</Button>
        )}
      </Group>
    </form>
  );
}