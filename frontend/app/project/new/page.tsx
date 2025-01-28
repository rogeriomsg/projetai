'use client';
import { useForm ,hasLength, matches,isNotEmpty, FORM_INDEX,} from '@mantine/form';
import { Slider,SegmentedControl,Tabs,Text,Table , Autocomplete, ActionIcon,Switch,Stepper, Button, Group, NumberInput, TextInput, LoadingOverlay,Grid,InputBase,Tooltip, GridCol, Textarea, Box,} from '@mantine/core';
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
  IconCheck,
  IconX,
} from '@tabler/icons-react';
import axios from "axios";



export default function  NewProject() {
  const [activeStep, setActiveStep] = useState(0);  
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visible, setVisible] = useState(false);
  const [checked, setChecked] = useState(false);
  const [colorSlider, setcolorSlider] = useState("red");
  const [porcentagem, setPorcentagem] = useState("");

  const form = useForm({
    mode: 'uncontrolled',
    validateInputOnBlur:true,
    initialValues: { 
      status : 'Em cadastro',
      project_type : 'Até 10kWp',
      is_active: true, // Indica se o projeto está ativo
      name: "", // Nome do projeto (opcional)
      description: "", // Descrição do projeto (opcional)
      dealership: "", // Nome da concessionária ou distribuidora (opcional)
      path_meter_pole: "", // Caminho para a foto do poste do medidor (opcional)
      path_meter: "", // Caminho para a foto do medidor (opcional)
      path_bill: "", // Caminho para a fatura de energia (opcional)
      path_identity:"", // Caminho para a identidade do cliente (opcional)
      path_procuration:"", // Caminho para o arquivo de procuração (opcional)
      
      client: {
        client_code: 0,
        name: "",
        cpf: "",
        identity: "",
        identity_issuer:"",
        email: "",
        phone: "",
        address: {
          street: "",
          number: 0,
          district:"",
          city: "",
          state: "",
          zip: 0,
        },
      },
      plant: { 
        consumer_unit_code: 0 , 
        name: '', 
        description: '',
        class:"",
        connection_type:"",
        generation_type:"",
        type_branch:"",
        branch_section: 0, 
        circuit_breaker: 0,
        installed_load: 0,
			  installed_power: 0,
			  service_voltage: 0.22,        
        address: { 
          street: '',
          number: 0,
          district:'',
          city: '',
          state: '',
          zip: 0
        },
        geolocation: {
          lat: 0,
          lng: 0
        }, 
      },
      consumerUnit: [{ 
        key: randomId(),
        consumer_unit_code: 0 , 
        name: 'Unidade consumidora geradora', 
        description: '',         
        percentage: 100,
        is_plant: true
      }], 
      inverters: [{
        key: randomId(),
        model: "",
        manufacturer: "",
        power: 0,
        quantity: 1,
        total_power : 0,
        description: ""
      }],
      modules: [{
        key: randomId(),
        model: "",
        manufacturer: "",
        description: "",
        width: 0,
        height: 0,
        total_area: 0,
        power: 0,
        quantity: 1,
        total_power : 0,
      }],
            
    },
    validate: (values) => {
      const errors: Record<string, any> = {};
      switch (activeStep) {
        case 0: //informações do projeto
          // errors.project_type =  values.project_type.length === 0?"O tipo do projeto é obrigatório":null;
          // errors.name = values.name.length < 3?"O nome do projeto deve ter pelo menos 3 caracters":null;
          // errors.dealership = values.dealership.length === 0?"A distribuidora é obrigatória":null;
          break;
        case 1: //informaçõe do cliente
          // errors["client.client_code"] = values.client.client_code < 2?"Verifique o código do cliente":null; 
          // errors["client.name"] = values.client.name.length < 3?"O nome do cliente deve ter pelo menos 3 caracters":null  
          // errors["client.cpf"] = values.client.cpf.length === 14?null:"O CPF está incompleto"      
          // errors["client.email"] = /^\S+@\S+$/.test(values.client.email)?null:"O e-mail esta inválido"
          // errors["client.phone"] = values.client.phone.length < 15?"O telefone está incompleto":null
          // errors["client.address.street"] = values.client.address.street.length < 3?"O logradouro é obrigatório":null
          // errors["client.address.state"] = values.client.address.state.length < 2?"O estado é obrigatório":null          
          // errors["client.address.city"] = values.client.address.city.length < 3?"O município é obrigatório":null
          break; 
        case 2: //informações da usina
        // class:"",
        // connection_type:"",
        // generation_type:"",
        // type_branch:"",
        // branch_section: 0, 
          // errors["plant.consumer_unit_code"] = Number(values.plant.consumer_unit_code) < 1?"verifique o código do cliente":null; 
          errors["plant.class"] = values.plant.class.length < 3?"Verifique a classe da UC":null;
          errors["plant.connection_type"] = values.plant.connection_type.length < 3?"Verifique o tipo de conexão da UC":null; 
          errors["plant.generation_type"] = values.plant.generation_type.length < 3?"Verifique o tipo de geração da usina":null;
          errors["plant.type_branch"] = values.plant.type_branch.length < 3?"Verifique o tipo de ramal de entrada da UC":null; 
          errors["plant.branch_section"] = Number(values.plant.branch_section) < 10?"Verifique a seção de entrda da UC":null; 
          // errors["plant.circuit_breaker"] = Number(values.plant.circuit_breaker) < 20?"O valor do disjuntor deve ser no mínimo 20A":null
          // errors["plant.address.street"] = values.plant.address.street.length < 3?"O logradouro é obrigatório":null
          // errors["plant.address.city"] = values.plant.address.city.length < 3?"O município é obrigatório":null
          // errors["plant.address.state"] = values.plant.address.state.length < 2?"O estado é obrigatório":null
          // errors["plant.geolocation.lat"] = Number(values.plant.geolocation.lat) < 1?"A latitude é obrigatória":null
          // errors["plant.geolocation.lng"] = Number(values.plant.geolocation.lng) < 1?"A longitude é obrigatória":null          
          break;
        case 3: //Unidades consumidoras 
          values.consumerUnit.map((item,index)=>(
            errors[`consumerUnit.${index}.consumer_unit_code`] = Number(item.consumer_unit_code) < 2?"Verifique o código da UC ":null
          )) 
          var porcentagem = 0
          form.getValues().consumerUnit.map((item,_index)=>{      
            porcentagem += item.percentage
          })
          if(porcentagem !== 100){
            setcolorSlider("red")
            form.getValues().consumerUnit.map((item,_index)=>{   
              errors[`consumerUnit.${_index}.percentage`] = "Somatória geral não resulta 100%"
            })      
          }
          else
          {
            setcolorSlider("green")
            form.getValues().consumerUnit.map((item,_index)=>{   
              errors[`consumerUnit.${_index}.percentage`] = null
            }) 
          }   
          break; 
        case 4: //Equipamentos      
          values.inverters.map((itemInv,index)=>(
            errors[`inverters.${index}.model`] = itemInv.model.length < 3?"O modelo é obrigatório":null,
            errors[`inverters.${index}.manufacturer`] = itemInv.manufacturer.length < 3?"O fabricante é obrigatório":null,
            errors[`inverters.${index}.power`] = Number(itemInv.power) === 0?"A potência não pode ser 0":null
          ));
          
          values.modules.map((item,index)=>(  
            errors[`modules.${index}.model`] = item.model.length < 3?"Teste":null,
            errors[`modules.${index}.manufacturer`] = item.manufacturer.length < 3?"O fabricante é obrigatório":null,          
            errors[`modules.${index}.power`] = Number(item.power) === 0?"A potência é obrigatória":null,
            errors[`modules.${index}.width`] = Number(item.width) === 0?"O largura deve ser maior que 0":null,
            errors[`modules.${index}.height`] = Number(item.height) === 0?"A altura deve ser maior que 0":null           
          ));
        break;
      }
      //alert(JSON.stringify(errors) ) 
      return errors;
    },

    transformValues: (values) => ({
      ...values,
      name:`Projeto de ${values.client.name} - ${values.client.client_code}`, // Nome do projeto (opcional)
      client: {
        client_code: Number(values.client.client_code),
        address: {          
          number: Number(values.client.address.number),          
          zip: Number(values.client.address.zip),
        },
      },
      plant: { 
        consumer_unit_code: Number(values.plant.consumer_unit_code) ,
        circuit_breaker: Number(values.plant.circuit_breaker),
        installed_load: Number(values.plant.installed_load),
        installed_power: Number(values.plant.installed_power),
        service_voltage: Number(values.plant.service_voltage),
        branch_section: Number(values.plant.branch_section), 
        address: { 
          number: Number(values.plant.address.number),
          zip:  Number(values.plant.address.zip)
        },
        geolocation: {
          lat: Number(values.plant.geolocation.lat),
          lng: Number(values.plant.geolocation.lng)
        }, 
      },      
      consumerUnit: values.consumerUnit.map((item)=>({
        consumer_unit_code: Number(item.consumer_unit_code) ,
        percentage:  Number(item.percentage),
      })),
      inverters: values.inverters.map((item)=>({
        power: Number(item.power),
        quantity: Number(item.quantity),
        total_power : Number(item.total_power),
      })),      
      modules: values.modules.map((item)=>({
        with: Number(item.width),
        heigth : Number(item.height),
        power: Number(item.power),
        quantity: Number(item.quantity),
        total_power : Number(item.total_power),
      })),
      path_meter_pole: values.path_meter_pole, // Caminho para a foto do poste do medidor (opcional)
      path_meter: values.path_meter, // Caminho para a foto do medidor (opcional)
      path_bill: values.path_bill, // Caminho para a fatura de energia (opcional)
      path_identity: values.path_identity, // Caminho para a identidade do cliente (opcional)
      path_procuration: values.path_procuration, // Caminho para o arquivo de procuração (opcional)
      status : 'Em Cadastro', 
    }),
  });

  // form.watch('client.address.zip', ({ previousValue, value, touched, dirty }) => {
  //   alert(JSON.stringify({ previousValue, value, touched, dirty }));
  // });

  const calculateArea = (index:number) => {
    // Recalcula total_area após a alteração
    const total_area = Number(form.getValues().modules[index].height) * Number(form.getValues().modules[index].width) ;
    form.setFieldValue(`modules.${index}.total_area`, total_area);
  };
  const calculatesTotalPowerModules = (index:number) => {
    // Recalcula a potência total após a alteração
    const total_power = form.getValues().modules[index].power * form.getValues().modules[index].quantity ;
    form.setFieldValue(`modules.${index}.total_power`, total_power);
  };
  const calculatesTotalPowerInverters = (index:number) => {
    // Recalcula a potência total após a alteração
    const total_power = Number(form.getValues().inverters[index].power) * Number(form.getValues().inverters[index].quantity) ;
    form.setFieldValue(`inverters.${index}.total_power`, total_power);
  };
  const CopyAddressFromClientToPlant = (_checked:boolean) => {
    if(_checked){
      form.setFieldValue(`plant.address.street`, form.getValues().client.address.street);
      form.setFieldValue(`plant.address.number`, Number(form.getValues().client.address.number) );
      form.setFieldValue(`plant.address.district`, form.getValues().client.address.district);
      form.setFieldValue(`plant.address.state`, form.getValues().client.address.state);
      form.setFieldValue(`plant.address.city`, form.getValues().client.address.city);
    }
    else{
      form.setFieldValue(`plant.address.street`, "");
      form.setFieldValue(`plant.address.number`, 0);
      form.setFieldValue(`plant.address.district`, "");
      form.setFieldValue(`plant.address.state`, "");
      form.setFieldValue(`plant.address.city`, "");
      form.setFieldValue(`plant.address.zip`, 0);
    }    
  };
 
  const CalculatesLoadAvailable = () => {
    // Recalcula a potência total após a alteração
    // circuit_breaker: undefined,
    //     installed_load: undefined,
		// 	  installed_power: undefined,
		// 	  service_voltage: undefined,
    // const installed_power = Number(form.getValues().plant.service_voltage) * Number(form.getValues().plant.circuit_breaker) *   
    // form.setFieldValue(`plant.`, installed_power);
  }
  const percentgem = (field:string,index:number,value:number)=>{
    var porcentagem = 0

    form.validate();
    //form.setFieldValue(`consumerUnit.${index}.percentage`,value)  
    form.getValues().consumerUnit.map((item,_index)=>{      
      porcentagem += item.percentage
    })
    if(porcentagem !== 100){
      setcolorSlider("red")
      // form.getValues().consumerUnit.map((item,_index)=>{      
      //   form.setFieldError(`consumerUnit.${_index}.percentage`,"Somatória geral não resulta 100%")
      // })      
    }
    else
    {
      setcolorSlider("green")
      // form.getValues().consumerUnit.map((item,_index)=>{      
      //   form.clearFieldError(`consumerUnit.${_index}.percentage`)
      // })       
    }   
  }

  const nextStep = () => setActiveStep((currentStep) => (form.validate().hasErrors ? currentStep : currentStep + 1));     
  const prevStep = () => setActiveStep((currentStep) => (currentStep > 0 ? currentStep - 1 : currentStep));

  const handleSubmit = async (_values: typeof form.values ) => {   
    
    if (!form.validate().hasErrors) {
      alert(JSON.stringify(_values))
      
      //setLoading(true);
    //   setIsSubmitting(true);
      // try {
      //   const data = {}
      //   const response = await axios.post("http://192.168.0.10:3333/project/create",
      //     _values,
      //     {headers: {'content-type': 'application/x-www-form-urlencoded'}}
      //   );
      //   alert("Resposta do servidor: "+ response.data)
      // } catch (e:any) {
      //   alert("Erro ao enviar os dados: " + e.message);
      // } finally {
      //   setIsSubmitting(false);
      // }
    }
    else{
      alert("O formulário contem pendências!");
   }
  };
  
  const consumerUnits = form.getValues().consumerUnit.map((item, index) => (
    <Table.Tr key={item.key} >
      <Table.Td >           
        <Grid ml="md" mr="md" mb="sm">          
          <Grid.Col span={2}>  
            <NumberInput
              placeholder="Código da UC"
              allowDecimal={false}
              hideControls={true}
              min={1}
              key={form.key(`consumerUnit.${index}.consumer_unit_code`)}
              {...form.getInputProps(`consumerUnit.${index}.consumer_unit_code`)}              
              required
            />
          </Grid.Col>
          <Grid.Col span={2}>   
            <NumberInput
              placeholder="Código da UC"
              allowDecimal={false}
              min={0}
              max={100}
              key={form.key(`consumerUnit.${index}.percentage`)}
              {...form.getInputProps(`consumerUnit.${index}.percentage`)} 
              onChange={(e)=>{
                percentgem(`consumerUnit.${index}.percentage`,index,Number(e))
              }}             
              required
            />
            {/* <Slider                
              color={colorSlider}
              defaultValue={0}                
              labelAlwaysOn={true}
              key={form.key(randomId())}
              {...form.getInputProps(`consumerUnit.${index}.percentage`)} 
              onChange={(e)=>{
                
                //form.setFieldValue(`consumerUnit.${index}.percentage`,Number(e))
                percentgem(`consumerUnit.${index}.percentage`,index,e)
              }}
            /> */}
                  
            
          </Grid.Col> 
          <Grid.Col span={8} >
            <TextInput
              placeholder="Digite um nome para essa unidade, por ex.: Sitio da família"
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
        <Grid ml="sm" mr="md" >          
          <Grid.Col span={4}>  
            <TextInput
              placeholder="Modelo do inversor"
              key={form.key(`inverters.${index}.model`)}
              {...form.getInputProps(`inverters.${index}.model`)}
              required
            />
          </Grid.Col>
          <Grid.Col span={4}>  
            <TextInput
              placeholder="Fabricante do inversor"
              key={form.key(`inverters.${index}.manufacturer`)}
              {...form.getInputProps(`inverters.${index}.manufacturer`)}
              required
            />
          </Grid.Col>
          <Grid.Col span={2}>
            <NumberInput
              placeholder="Potência em kw"              
              min={0}
              allowedDecimalSeparators={['.',',']}
              key={form.key(`inverters.${index}.power`)}
              {...form.getInputProps(`inverters.${index}.power`)}
              onBlur={(e)=>{
                form.setFieldValue(`inverters.${index}.power`,Number(e.target.value))
                calculatesTotalPowerInverters(index)
              }} 
              required           
            />
          </Grid.Col> 
          <Grid.Col span={1}>
            <NumberInput
              placeholder="Quantidade de inversores"
              allowDecimal={false}
              allowLeadingZeros={false}
              min={1}
              key={form.key(`inverters.${index}.quantity`)}
              {...form.getInputProps(`inverters.${index}.quantity`)} 
              onBlur={(e)=>{
                form.setFieldValue(`inverters.${index}.quantity`,Number(e.target.value))
                calculatesTotalPowerInverters(index)
              }} 
              required           
            />
          </Grid.Col> 
          <Grid.Col span={1}>
            <NumberInput
              decimalScale={3}
              key={form.key(`inverters.${index}.total_power`)}
              {...form.getInputProps(`inverters.${index}.total_power`)} 
              readOnly
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
        <Grid ml="md" mr="md" >          
          <Grid.Col span={3}>  
            <TextInput
              placeholder="Modelo do módulo fotovoltaico"
              key={form.key(`modules.${index}.model`)}
              {...form.getInputProps(`modules.${index}.model`)}
              required
            />
          </Grid.Col>
          <Grid.Col span={3}>  
            <TextInput
              placeholder="Marca do módulo fotovoltaico"
              key={form.key(`modules.${index}.manufacturer`)}
              {...form.getInputProps(`modules.${index}.manufacturer`)}
              required
            />
          </Grid.Col>
          <Grid.Col span={1}>  
            <NumberInput
              placeholder="Largura"
              min={0}
              allowedDecimalSeparators={['.',',']}
              hideControls={true}
              key={form.key(`modules.${index}.width`)}
              {...form.getInputProps(`modules.${index}.width`)}
              onBlur={(e)=>{ 
                // Atualiza o campo modificado no estado do form
                form.setFieldValue(`modules.${index}.width`, Number(e.target.value));
                calculateArea(index)
              }}
              required
            />
          </Grid.Col>
          <Grid.Col span={1}>  
            <NumberInput
              placeholder="Altura"
              min={0}
              allowedDecimalSeparators={['.',',']}
              hideControls={true}
              key={form.key(`modules.${index}.height`)}
              {...form.getInputProps(`modules.${index}.height`)}
              onBlur={(e)=>{ 
                // Atualiza o campo modificado no estado do form
                form.setFieldValue(`modules.${index}.height`, Number(e.target.value)); 
                calculateArea(index)
              }}
              required
            />
          </Grid.Col>
          <Grid.Col span={1}>  
            <NumberInput
              placeholder="Área"
              decimalScale={3}
              key={form.key(`modules.${index}.total_area`)}
              {...form.getInputProps(`modules.${index}.total_area`)}
              readOnly
            />
          </Grid.Col>
          <Grid.Col span={1}>
            <NumberInput
              min={0}
              allowedDecimalSeparators={['.',',']}
              key={form.key(`modules.${index}.power`)}
              hideControls={true}
              {...form.getInputProps(`modules.${index}.power`)} 
              onBlur={(e)=>{ 
                // Atualiza o campo modificado no estado do form
                form.setFieldValue(`modules.${index}.power`, Number(e.target.value)); 
                calculatesTotalPowerModules(index)
              }}
              required         
            />
          </Grid.Col>          
          <Grid.Col span={1}>
            <NumberInput
              placeholder="Quantidade de inversores"
              min={1}
              allowLeadingZeros={false}
              allowDecimal={false}
              key={form.key(`modules.${index}.quantity`)}
              {...form.getInputProps(`modules.${index}.quantity`)} 
              onBlur={(e)=>{ 
                // Atualiza o campo modificado no estado do form
                form.setFieldValue(`modules.${index}.quantity`, Number(e.target.value)); 
                calculatesTotalPowerModules(index)
              }}
              required           
            />
          </Grid.Col> 
          <Grid.Col span={1}>
            <NumberInput
              decimalScale={3}
              key={form.key(`modules.${index}.total_power`)}
              {...form.getInputProps(`modules.${index}.total_power`)}               
              readOnly  
            />
          </Grid.Col>                           
        </Grid>
        
      </Table.Td>
      <Table.Td>
        <Group gap={0} justify="flex-end"> 
          {
            index===0 &&(
              <>
              <ActionIcon color="red" variant="subtle" onClick={() => form.removeListItem('modules', index)} disabled >
                <IconTrash size={28} stroke={1.8}/>
              </ActionIcon>
              </>
            ) 
          }
          {
            index!==0 &&(
              <>
              <ActionIcon color="red" variant="subtle" onClick={() => form.removeListItem('modules', index)}>
                <IconTrash size={28} stroke={1.8}/>
              </ActionIcon>
              </>
            ) 
          } 
        </Group>
      </Table.Td>
    </Table.Tr>
  ));


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
          label="Passo 5" 
          description="Informções do projeto"
          icon={<IconFileUpload size={18} />}
        >
          <Grid mt="sm">
            <Grid.Col span={3}>
              <Autocomplete
                label="Tipo de projeto"
                data={[ 'Até 10kWp', 'Maior que 10kWp', 'Maior que 75kWp',]}
                key={form.key("project_type")}
                {...form.getInputProps("project_type")} 
                required
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Nome do projeto"
                placeholder="Digite um nome para o projeto"
                key={form.key("name")}
                {...form.getInputProps("name")}  
              /> 
            </Grid.Col>
            <Grid.Col span={3}>
              <Autocomplete
                label="Distribuidora"
                placeholder="Selecione o nome da distribuidora"
                data={['Neoenergia Brasília', 'Goiás', ]}
                key={form.key("dealership")}
                {...form.getInputProps("dealership")} 
                required
              />
            </Grid.Col>            
            <Grid.Col span={12}>
              <Textarea
                label="Descrição"
                placeholder="Digite uma descrição para o projeto"
                key={form.key("description")}
                {...form.getInputProps("description")}  
              /> 
            </Grid.Col>            
          </Grid>          
        </Stepper.Step>
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
                  allowDecimal={false}
                  allowLeadingZeros={false}
                  hideControls={true}
                  min={1}
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
                  required
                />
              </Tooltip>
            </Grid.Col>
            <Grid.Col span={2}>
              <InputBase
                label="CPF"
                component={IMaskInput}
                mask="000.000.000-00"
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
                placeholder='Emissor da identidade'
                key={form.key("client.identity_issuer")}
                {...form.getInputProps("client.identity_issuer")}  
              /> 
            </Grid.Col>
            <Grid.Col span={4}>
              <TextInput
                label="E-mail"
                key={form.key("client.email")}
                {...form.getInputProps("client.email")}
                required
              />
            </Grid.Col>
            <Grid.Col span={2}>
              <InputBase
                label="Telefone"
                component={IMaskInput}
                placeholder='Celular com DDD'
                mask="(00) 00000-0000"
                key={form.key("client.phone")}
                {...form.getInputProps("client.phone")}
                required
              />              
            </Grid.Col>
            <Grid.Col span={2}> 
              <InputBase
                label="Código postal"
                component={IMaskInput}
                placeholder='Digite o CEP'              
                mask="00.000-000"
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
                allowDecimal={false}
                allowLeadingZeros={false}
                min={1}
                key={form.key(`client.address.number`)}
                {...form.getInputProps(`client.address.number`)} 
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <TextInput
                label="Bairro"
                placeholder="Digite o bairro"
                key={form.key(`client.address.district`)}
                {...form.getInputProps(`client.address.district`)} 
              />
            </Grid.Col>
            <Grid.Col span={2}>
              <Autocomplete
                label="Estado"
                placeholder="Digite o estado"
                data={['Distrito Federal', 'Goiás', 'São Paulo', 'Rio Grande do Sul']}
                key={form.key(`client.address.state`)}
                {...form.getInputProps(`client.address.state`)} 
                required
              />
            </Grid.Col>
            <Grid.Col span={3}>
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
                min={1}
                key={form.key(`plant.consumer_unit_code`)}
                {...form.getInputProps(`plant.consumer_unit_code`)}
                required
              />
            </Grid.Col>                
            <Grid.Col span={8} >
              <TextInput
                placeholder="Digite um nome para usina (opcional)"
                label="Nome da usina"
                key={form.key(`plant.name`)}
                {...form.getInputProps(`plant.name`)}
              />
            </Grid.Col> 
            <Grid.Col span={2} >
              <NumberInput
                label="Potência instalada da usina(kWp)"
                placeholder="Digite"
                decimalScale={3}
                allowedDecimalSeparators={['.',',']}
                hideControls={true}
                min={0}
                key={form.key(`plant.installed_power`)}
                {...form.getInputProps(`plant.installed_power`)} 
                //readOnly          
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <Autocomplete
                label="Tipo de geração"
                placeholder="Selecione"
                data={['Solar', 'Eólica']}
                key={form.key(`plant.generation_type`)}
                {...form.getInputProps(`plant.generation_type`)} 
                required
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <Autocomplete
                label="Classe da UC geradora"
                placeholder="Selecione"
                data={['Residencial', 'Condominio']}
                key={form.key(`plant.class`)}
                {...form.getInputProps(`plant.class`)} 
                required
              />
            </Grid.Col> 
            <Grid.Col span={3}>
              <Autocomplete
                label="SubGrupo UC geradora"
                placeholder="Selecione"
                data={['B1', 'B2']}
                key={form.key(`plant.subgroup`)}
                {...form.getInputProps(`plant.subgroup`)} 
                required
              />
            </Grid.Col> 
            <Grid.Col span={3}>
              <Autocomplete
                label="Tensão Fase neutro (kV)"
                placeholder="Selecione"
                data={['0.22', '0.38', '1', '6.9','13.8']}
                key={form.key(`plant.service_voltage`)}
                {...form.getInputProps(`plant.service_voltage`)} 
                required
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <Autocomplete
                label="Tipo de conexão"
                placeholder="Selecione"
                data={['Monofásico', 'Bifásico', 'Trifásico']}
                key={form.key(`plant.connection_type`)}
                {...form.getInputProps(`plant.connection_type`)} 
                required
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <Autocomplete
                label="Tipo de ramal"
                placeholder="Selecione"
                data={['Aéreo', 'Subterrâneo']}
                key={form.key(`plant.type_branch`)}
                {...form.getInputProps(`plant.type_branch`)} 
                required
              />
            </Grid.Col>
            <Grid.Col span={2}>
              <Autocomplete
                label="Seção do ramal de entrada(mm²)"
                placeholder="Selecione"
                data={['10','16','25']}
                key={form.key(`plant.branch_section`)}
                {...form.getInputProps(`plant.branch_section`)} 
                required
              />
            </Grid.Col>                                                       
            <Grid.Col span={2}>
              <Autocomplete
                label="Disjuntor padrão de entrada(A)"
                placeholder="Digite"
                data={['20', '30', '50', '63','80','100','120']}
                key={form.key(`plant.circuit_breaker`)}
                {...form.getInputProps(`plant.circuit_breaker`)} 
                required
              />              
            </Grid.Col> 
            <Grid.Col span={2}>
              <NumberInput
                label="Carga disponibilizada"
                placeholder="Em (kW)"
                min={0}
                decimalScale={3}
                hideControls={true}
                allowedDecimalSeparators={['.',',']}
                key={form.key(`plant.installed_load`)}
                {...form.getInputProps(`plant.installed_load`)} 
                //readOnly         
              />
            </Grid.Col> 
            <Grid.Col span={12}>
              <Switch
                onChange={(e) =>{ 
                  setChecked(e.currentTarget.checked)
                  CopyAddressFromClientToPlant(e.currentTarget.checked);
                }}
                checked={checked}
                color="teal"
                size="md"
                label="Copiar o endereço do cliente titular"
                thumbIcon={
                  checked ? (
                    <IconCheck size={12} color="var(--mantine-color-teal-6)" stroke={3} />
                  ) : (
                    <IconX size={12} color="var(--mantine-color-red-6)" stroke={3} />
                  )
                }
              />
            </Grid.Col>  
            <Grid.Col span={2}>             
              {/* <TextInput
                label="CEP"
                placeholder='Digite o CEP'
                key={form.key(`plant.address.zip`)}
                {...form.getInputProps(`plant.address.zip`)}
              />    */}

              <InputBase
                label="Código postal"
                component={IMaskInput}
                placeholder='Digite o CEP'              
                mask="00000000"
                key={form.key(`plant.address.zip`)}
                {...form.getInputProps(`plant.address.zip`)}
                required
              />  
            </Grid.Col>               
            <Grid.Col span={8}>             
              <TextInput
                label="Logradouro"
                key={form.key(`plant.address.street`)}
                {...form.getInputProps(`plant.address.street`)}
                required
              />    
            </Grid.Col>
            <Grid.Col span={2}>
              <NumberInput
                label="Número"
                allowDecimal={false}
                allowLeadingZeros={false}
                min={1}
                key={form.key(`plant.address.number`)}
                {...form.getInputProps(`plant.address.number`)} 
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <TextInput
                label="Bairro"
                placeholder="Digite o bairro"
                key={form.key(`plant.address.district`)}
                {...form.getInputProps(`plant.address.district`)} 
              />
            </Grid.Col>
            <Grid.Col span={2}>
              <Autocomplete
                label="Estado"
                placeholder="Digite o estado"
                data={['Distrito Federal', 'Goiás', 'São Paulo', 'Rio Grande do Sul']}
                key={form.key(`plant.address.state`)}
                {...form.getInputProps(`plant.address.state`)} 
                required
              />
            </Grid.Col>
            <Grid.Col span={3}>
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
                min={1}
                decimalScale={5}
                allowedDecimalSeparators={['.',',']}
                hideControls={true}
                key={form.key(`plant.geolocation.lat`)}
                {...form.getInputProps(`plant.geolocation.lat`)} 
                required           
              />
            </Grid.Col>
            <Grid.Col span={2}>
              <NumberInput
                label="Longitude"
                placeholder=""
                min={1}
                decimalScale={5}
                allowedDecimalSeparators={['.',',']}
                hideControls={true}
                key={form.key(`plant.geolocation.lng`)}
                {...form.getInputProps(`plant.geolocation.lng`)} 
                required           
              />
            </Grid.Col> 
             
               
          </Grid> 
        </Stepper.Step>
        <Stepper.Step 
          label="Passo 3" 
          description="Unidades consumidoras"
          icon={<IconExposure size={18} />}
        >          
          <Table.ScrollContainer minWidth={900} type="native">
            <Table verticalSpacing="sm" highlightOnHover withColumnBorders>
              <Table.Th>
                <Grid ml="md" mr="md" >          
                  <Grid.Col span={2}>  
                  <Text fw={500}> Código da UC </Text>
                  </Grid.Col>
                  <Grid.Col span={3}>  
                    <Text fw={500} color={colorSlider}> Porcentagem {porcentagem} </Text>
                  </Grid.Col>
                  <Grid.Col span={7}>
                  <Text fw={500}> Nome da Unidade consumidora</Text>
                  </Grid.Col>                                          
                </Grid>
              </Table.Th >
              <Table.Tbody>{consumerUnits}</Table.Tbody>
            </Table>
          </Table.ScrollContainer>         

          <Group justify="center" mt="md">            
            <Button
              onClick={() =>
                form.insertListItem('consumerUnit', { 
                  key: randomId(),
                  consumer_unit_code: 0 , 
                  name: '', 
                  description: '',         
                  percentage: 50,
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
          <Tabs color="orange" variant="pills" defaultValue="inverters">
            <Tabs.List grow>
              <Tabs.Tab value="inverters" icon={<IconHomeBolt size={20} />}>Inversor(es)</Tabs.Tab>
              <Tabs.Tab value="modules" icon={<IconUserCheck size={20} />}>Módulo(s)</Tabs.Tab>              
            </Tabs.List>

            <Tabs.Panel value="inverters" pt="xl">

              <Table.ScrollContainer minWidth={900} type="native">
                <Table verticalSpacing="sm" highlightOnHover withColumnBorders>
                  <Table.Tr>
                    <Grid ml="sm" mr="md" >          
                      <Grid.Col span={4}>  
                        Modelo
                      </Grid.Col>
                      <Grid.Col span={4}>  
                        Fabricante
                      </Grid.Col>
                      <Grid.Col span={2}>
                        Potência (kW)
                      </Grid.Col> 
                      <Grid.Col span={1}>
                        Quantidade
                      </Grid.Col> 
                      <Grid.Col span={1}>
                        Total (kW)
                      </Grid.Col>                           
                    </Grid>
                  </Table.Tr >
                  <Table.Tbody>{invertersDataRows}</Table.Tbody>
                </Table>
              </Table.ScrollContainer>         

              <Group justify="center" mt="md" mb="xl">          
                <Button
                  onClick={() =>
                    form.insertListItem('inverters', { 
                      key: randomId(),
                      model: "",
                      manufacturer: "",
                      power: 0,
                      quantity: 1,
                      total_power : 0,
                    })
                  }
                >
                  Adicionar inversor
                </Button>
              </Group>
            </Tabs.Panel>

            <Tabs.Panel value="modules" pt="xl">

              <Table.ScrollContainer minWidth={900} type="native">
                <Table verticalSpacing="sm" highlightOnHover withColumnBorders>
                  <Table.Tr>
                    <Grid ml="sm" mr="md" >          
                      <Grid.Col span={3}>  
                        Modelo
                      </Grid.Col>
                      <Grid.Col span={3}>  
                        Fabricante
                      </Grid.Col>
                      <Grid.Col span={1}>  
                        Largura (m)
                      </Grid.Col>
                      <Grid.Col span={1}>  
                        Altura (m)
                      </Grid.Col>
                      <Grid.Col span={1}>  
                        Área total (m)
                      </Grid.Col>
                      <Grid.Col span={1}>
                        Potência (kW)
                      </Grid.Col> 
                      <Grid.Col span={1}>
                        Quantidade
                      </Grid.Col> 
                      <Grid.Col span={1}>
                        Total (kW)
                      </Grid.Col>                           
                    </Grid>
                  </Table.Tr >
                  <Table.Tbody>{modulesDataRows}</Table.Tbody>
                </Table>
              </Table.ScrollContainer>         

              <Group justify="center" mt="md">            
                <Button
                  onClick={() =>
                    form.insertListItem('modules', { 
                      key: randomId(),
                      model: "",
                      manufacturer: "",
                      description: "",
                      width: 0,
                      height: 0,
                      total_area:0,
                      power: 0,
                      quantity: 0,
                      total_power : 0,
                    })
                  }
                >
                  Adicionar módulo fotovoltaico
                </Button>
              </Group>
            </Tabs.Panel>

          </Tabs>

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
        {activeStep < 6 && (
          <Button onClick={nextStep} >
            {activeStep === 5 ? "Conferir tudo" : "Próximo passo"}
          </Button>
        )} 
        {activeStep === 6 && (
          <Button type='submit'>Enviar para análise</Button>
        )}
      </Group>
      
      
    </form>
    
  );
}