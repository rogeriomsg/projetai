'use client';
import { useForm ,hasLength, matches,isNotEmpty, FORM_INDEX,} from '@mantine/form';
import { Checkbox,Select,Slider,SegmentedControl,Tabs,Text,Table , Autocomplete, ActionIcon,Switch,Stepper, Button, Group, NumberInput, TextInput, LoadingOverlay,Grid,InputBase,Tooltip, GridCol, Textarea, Box,} from '@mantine/core';
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
  IconMap2,
} from '@tabler/icons-react';

import axios from "axios";
import MapModal from '@/components/MapModal/MapModalGetSinglePoint';
import MapModalGetMultiple from '@/components/MapModal/MapModalGetMultiple';

export default function  NewProject() {
  const [activeStep, setActiveStep] = useState(0); 
  const [checked, setChecked] = useState(false);
  const [colorSlider, setcolorSlider] = useState("green");
  const [porcentagem, setPorcentagem] = useState(false);
  const [states, setStates] = useState<any[]>([]); // Lista de estados
  const [municipalities, setMunicipalities] = useState<any[]>([]); // Lista de municípios   
  const [loadingStates, setLoadingStates] = useState<boolean>(false); // Carregamento de estados
  const [loadingMunicipalities, setLoadingMunicipalities] = useState<boolean>(false); // Carregamento de municípios
  const [loadingZipCode, setLoadingZipCode] = useState<boolean>(false); // Carregamento de estados
  const [noNumberClient, setNoNumberClient] = useState<boolean>(false);
  const [noNumberPlant, setNoNumberPlant] = useState<boolean>(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }>({lat: -15.783579727102195, lng: -47.93393761657747});


  const nextStep = () => setActiveStep((currentStep) => (form.validate().hasErrors ? currentStep : currentStep + 1));     
  const prevStep = () => setActiveStep((currentStep) => (currentStep > 0 ? currentStep - 1 : currentStep));

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
          complement:"",
          no_number: false,
          number: 0,
          district:"",
          state: "",
          city: "",
          zip: 0,
        },
      },
      plant: { 
        consumer_unit_code: "" , 
        name: '', 
        description: '',
        class:"",
        subgroup:"",
        connection_type:"",
        generation_type:"",
        type_branch:"",
        branch_section: 0, 
        circuit_breaker: 0,
        installed_load: 0,
			  installed_power: 0,
			  service_voltage: 0,        
        address: { 
          street: "",
          complement:"",
          no_number: false,
          number: 0,
          district:"",
          state: "",
          city: "",
          zip: 0
        },
        geolocation: {
          lat: 0,
          lng: 0,
          link_point:""
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
          // errors.name =  values.name.length === 0?"O nome do projeto é obrigatório":null;
          // errors.name = values.name.length < 3?"O nome do projeto deve ter pelo menos 3 caracters":null;
          // errors.dealership = values.dealership.length === 0?"A distribuidora é obrigatória":null;
          break;
        case 1: //informaçõe do cliente
          errors["client.client_code"] = values.client.client_code < 2?"Verifique o código do cliente":null; 
          errors["client.name"] = values.client.name.length < 3?"O nome do cliente deve ter pelo menos 3 caracters":null  
          errors["client.cpf"] = values.client.cpf.length === 14?null:"O CPF está incompleto"      
          errors["client.email"] = /^\S+@\S+$/.test(values.client.email)?null:"O e-mail esta inválido"
          errors["client.phone"] = values.client.phone.length < 15?"O telefone está incompleto":null
          errors["client.address.street"] = values.client.address.street.length < 3?"O logradouro é obrigatório":null
          errors["client.address.number"] = Number(values.client.address.number) < 3?values.client.address.no_number?null:"O número é obrigatório":null
          errors["client.address.state"] = values.client.address.state.length < 2?"O estado é obrigatório":null          
          errors["client.address.city"] = values.client.address.city.length < 3?"O município é obrigatório":null
          break; 
        case 2: //informações da usina
          // errors["plant.consumer_unit_code"] = Number(values.plant.consumer_unit_code) < 1?"verifique o código do cliente":null; 
          // errors["plant.class"] = values.plant.class.length < 3?"Verifique a classe da UC":null;
          // errors["plant.subgroup"] = values.plant.subgroup.length < 1?"Verifique a subgrupo da UC":null;
          // errors["plant.connection_type"] = values.plant.connection_type.length < 3?"Verifique o tipo de conexão da UC":null; 
          // errors["plant.generation_type"] = values.plant.generation_type.length < 3?"Verifique o tipo de geração da usina":null;
          // errors["plant.type_branch"] = values.plant.type_branch.length < 3?"Verifique o tipo de ramal de entrada da UC":null; 
          // errors["plant.branch_section"] = Number(values.plant.branch_section) < 10?"Verifique a seção de entrda da UC":null; 
          // errors["plant.service_voltage"] = Number(values.plant.service_voltage) === 0?"Verifique a tensão fase neutro":null; 
          // errors["plant.circuit_breaker"] = Number(values.plant.circuit_breaker) < 20?"O valor do disjuntor deve ser no mínimo 20A":null
          // errors["plant.address.street"] = values.plant.address.street.length < 3?"O logradouro é obrigatório":null
          // errors["plant.address.district"] = values.plant.address.district.length < 2?"O Bairro é obrigatório":null
          // errors["plant.address.city"] = values.plant.address.city.length < 3?"O município é obrigatório":null
          // errors["plant.address.state"] = values.plant.address.state.length < 2?"O estado é obrigatório":null
          // errors["plant.geolocation.lat"] = Number(values.plant.geolocation.lat) < 1?"A latitude é obrigatória":null
          // errors["plant.geolocation.lng"] = Number(values.plant.geolocation.lng) < 1?"A longitude é obrigatória":null          
          break;
        case 3: //Unidades consumidoras 
          // values.consumerUnit.map((item,index)=>(
          //   errors[`consumerUnit.${index}.consumer_unit_code`] = Number(item.consumer_unit_code) < 2?"Verifique o código da UC ":null
          // )) 
          // values.consumerUnit.forEach((_, index) => {
          //   errors[`consumerUnit.${index}.percentage`] = !porcentagem?"A soma dos percentuais deve ser igual a 100.":null;
          // });
          break; 
        case 4: //Equipamentos      
          // values.inverters.map((itemInv,index)=>(
          //   errors[`inverters.${index}.model`] = itemInv.model.length < 3?"O modelo é obrigatório":null,
          //   errors[`inverters.${index}.manufacturer`] = itemInv.manufacturer.length < 3?"O fabricante é obrigatório":null,
          //   errors[`inverters.${index}.power`] = Number(itemInv.power) === 0?"A potência não pode ser 0":null
          // ));
          
          // values.modules.map((item,index)=>(  
          //   errors[`modules.${index}.model`] = item.model.length < 3?"Teste":null,
          //   errors[`modules.${index}.manufacturer`] = item.manufacturer.length < 3?"O fabricante é obrigatório":null,          
          //   errors[`modules.${index}.power`] = Number(item.power) === 0?"A potência é obrigatória":null,
          //   errors[`modules.${index}.width`] = Number(item.width) === 0?"O largura deve ser maior que 0":null,
          //   errors[`modules.${index}.height`] = Number(item.height) === 0?"A altura deve ser maior que 0":null           
          // ));
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

    onValuesChange: (values) => {
      CheckPorcentagemConsumerUnit()
      if(values.client.address.no_number){ 
        form.clearFieldError('client.address.number')
        form.setFieldValue('client.address.number',0)
        setNoNumberClient(true)
      }
      else{        
        setNoNumberClient(false)
      }
      if(values.plant.address.no_number){ 
        form.clearFieldError('plant.address.number')
        form.setFieldValue('plant.address.number',0)
        setNoNumberPlant(true)
      }
      else{        
        setNoNumberPlant(false)
      }
    },
  });

  // Buscar estados
  useEffect(() => {
    const fetchStates = async () => {
      setLoadingStates(true);
      try {
        const response = await axios.get("http://servicodados.ibge.gov.br/api/v1/localidades/estados");
        setStates(response.data);
      } catch (error) {
        console.error("Erro ao buscar estados", error);
      } finally {
        setLoadingStates(false);
      }
    };

    fetchStates();
  }, []);

  const fetchMunicipalities = async (selectedState:string) => {    
    setLoadingMunicipalities(true);       
    try {
      const response = await axios.get(
        `http://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedState}/municipios`
      );      
      setMunicipalities(response.data);
    } catch (error) {
      console.error("Erro ao buscar municípios", error);
    } finally {
      setLoadingMunicipalities(false);
    }
  };

  const fetchZipCode = async (zipcode:string) => {     
    setLoadingZipCode(true)
    try {
      const response = await axios.get(
        `https://viacep.com.br/ws/${zipcode}/json/`
      );  
      const data = response.data;
      return data;
    } catch (error) {
      //console.error('Erro ao buscar o CEP:', error);
      return {};
    } finally {   
      setLoadingZipCode(false)     
    }
  };
  
  // Buscar municípios do  cliente quando o estado é selecionado
  form.watch('client.address.state', ({value}) => {    
    form.setFieldValue('client.address.city', "") 
    fetchMunicipalities(value);    
  });

  // Buscar municípios do usina quando o estado é selecionado
  form.watch('plant.address.state', ({value}) => {    
    form.setFieldValue(`plant.address.city`, "");    
    fetchMunicipalities(value);    
  });

  // Buscar municípios do  cliente quando o estado é selecionado
  form.watch('client.address.zip', async ({value}) => 
  {   
    if(!(value.toString().trim().length === 8)) 
      return false; 
    const zipCodeData = await fetchZipCode(value.toString())
    form.setFieldValue('client.address.street', zipCodeData.logradouro||'')
    form.setFieldValue('client.address.district', zipCodeData.bairro||'')
    form.setFieldValue(`client.address.state`, zipCodeData.uf||'' ) 
    form.setFieldValue('client.address.city', zipCodeData.localidade||'')
    form.setFieldValue('client.address.complement', zipCodeData.complemento||'')
  });

  // Buscar municípios do  cliente quando o estado é selecionado
  form.watch('plant.address.zip', async ({value}) => 
    {   
      if(!(value.toString().trim().length === 8)) 
        return false; 
      const zipCodeData = await fetchZipCode(value.toString())
      form.setFieldValue('plant.address.street', zipCodeData.logradouro||'')
      form.setFieldValue('plant.address.district', zipCodeData.bairro||'')
      form.setFieldValue(`plant.address.state`, zipCodeData.uf||'' ) 
      form.setFieldValue('plant.address.city', zipCodeData.localidade||'')
      form.setFieldValue('plant.address.complement', zipCodeData.complemento||'')
    });

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
    form.setFieldValue(`plant.address.street`,_checked?form.getValues().client.address.street:"");
    form.setFieldValue(`plant.address.number`, _checked?Number(form.getValues().client.address.number):0 );
    form.setFieldValue(`plant.address.district`, _checked?form.getValues().client.address.district:"");
    form.setFieldValue(`plant.address.state`, _checked?form.getValues().client.address.state:"");
    form.setFieldValue(`plant.address.city`, _checked?form.getValues().client.address.city:"");
    form.setFieldValue(`plant.address.zip`, _checked?Number(form.getValues().client.address.zip):0);
    form.setFieldValue(`plant.address.complement`, _checked?form.getValues().client.address.complement:"0");
    form.setFieldValue(`plant.address.no_number`, _checked?form.getValues().client.address.no_number:false);      
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

  const CheckPorcentagemConsumerUnit = ()=>{
    var _porcentagem = 0
    form.getValues().consumerUnit.map((item,_index)=>{      
      _porcentagem += item.percentage
    })    
    setcolorSlider(_porcentagem!==100?"red":"green")
    setPorcentagem(_porcentagem!==100?false:true)
  }
  
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
              readOnly={index===0?true:false}           
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
              required
            />
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
          <ActionIcon color="red" variant="subtle" onClick={() => {
            form.removeListItem('consumerUnit', index)
            }} 
            disabled={index!==0?false:true} 
          >
            <IconTrash size={28} stroke={1.8}/>
          </ActionIcon>             
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

  const handleSaveCoordinates = () => {
    if (coordinates) {
      form.setFieldValue("plant.geolocation.lat", coordinates.lat);
      form.setFieldValue("plant.geolocation.lng", coordinates.lng);
    }
    setModalOpen(false);
  };

  return (
    <>
      <form onSubmit={form.onSubmit(handleSubmit)}  >
        
        <Stepper 
          active={activeStep} 
          onStepClick={setActiveStep} 
          completedIcon={<IconCircleCheck size={20} />}
          allowNextStepsSelect={false}
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
                  required 
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
                  placeholder="Digite uma descrição para o projeto (Opcional)"
                  key={form.key("description")}
                  {...form.getInputProps("description")}  
                /> 
              </Grid.Col>            
            </Grid> 
            <Group justify="center" mt="xl">   
              <ActionIcon 
                color="green" 
                variant="subtle" 
                size="xl" 
                onClick={() => {
                  form.validate()
                }} 
              >
                <IconCheck  size={28} stroke={1.5} />
              </ActionIcon> 
            </Group>         
          </Stepper.Step>
          <Stepper.Step 
            label="Passo 1" 
            description="Informações do cliente"
            icon={<IconUserCheck size={18} />}
          >  
            <Grid mt="xl">
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
                <NumberInput               
                  label="Código postal"
                  placeholder='Digite o CEP' 
                  allowDecimal={false}
                  hideControls={true}
                  maxLength={8}
                  key={form.key(`client.address.zip`)}
                  {...form.getInputProps(`client.address.zip`)}
                  required
                /> 
              </Grid.Col>               
              <Grid.Col span={7}>             
                <TextInput
                  label="Logradouro"
                  key={form.key(`client.address.street`)}
                  {...form.getInputProps(`client.address.street`)}
                  required
                />    
              </Grid.Col>
              <Grid.Col span={1}>             
                <Checkbox
                  mt="xl"
                  label="Sem número"
                  key={form.key(`client.address.no_number`)}
                  {...form.getInputProps(`client.address.no_number`,{ type: "checkbox" })}                
                />    
              </Grid.Col>            
              <Grid.Col span={2}>
                <NumberInput
                  label="Número"
                  allowDecimal={false}
                  allowLeadingZeros={false}
                  hideControls={true}
                  disabled={noNumberClient}
                  min={1}
                  key={form.key(`client.address.number`)}
                  {...form.getInputProps(`client.address.number`)} 
                />
              </Grid.Col>
              <Grid.Col span={5}>
                <TextInput
                  label="Complemento"
                  placeholder=""
                  key={form.key(`client.address.complement`)}
                  {...form.getInputProps(`client.address.complement`)} 
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
                  placeholder={loadingStates ?"Carregando...":"Digite o estado"}                  
                  key={form.key(`client.address.state`)}
                  {...form.getInputProps(`client.address.state`)}                             
                  data={loadingStates ? ["Carregando..."] : states.map((state) => state.sigla)}
                  required
                />
              </Grid.Col>
              <Grid.Col span={2}>
                <Autocomplete
                  label="Município"
                  placeholder={loadingMunicipalities?"Carregando...":"Digite o município"}
                  key={form.key(`client.address.city`)}
                  {...form.getInputProps(`client.address.city`)} 
                  data={loadingMunicipalities ?  ["Carregando..."] : municipalities.map((item) => item.nome)}               
                  required
                />
              </Grid.Col>
              <Grid.Col span={2}></Grid.Col>
            </Grid> 
            <Group justify="center" mt="xl">   
              <ActionIcon 
                color="green" 
                variant="subtle" 
                size="xl" 
                onClick={() => {
                  form.validate()
                }} 
              >
                <IconCheck  size={28} stroke={1.5} />
              </ActionIcon>
            </Group>            
          </Stepper.Step>
          <Stepper.Step 
            label="Passo 2" 
            description="Informações da usina"
            icon={<IconHomeBolt size={18} />}
          >                 
            <Grid mt="xl">                
              <Grid.Col span={2}>  
                <TextInput
                  label="Código da UC"
                  placeholder="Código da UC"
                  min={1}
                  key={form.key(`plant.consumer_unit_code`)}
                  {...form.getInputProps(`plant.consumer_unit_code`)}
                  onBlur={(e)=>{
                    form.setFieldValue("consumerUnit.0.consumer_unit_code",e.target.value)
                  }}
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
                  label="Subgrupo UC geradora"
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
                <NumberInput
                  label="Código postal"
                  allowDecimal={false}
                  hideControls={true}
                  maxLength={8} // Limita o número de caracteres no CEP
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
              <Grid.Col span={1}>             
                <Checkbox
                  mt="xl"
                  label="Sem número"
                  key={form.key(`plant.address.no_number`)}
                  {...form.getInputProps(`plant.address.no_number`,{ type: "checkbox" })}
                />    
              </Grid.Col>
              <Grid.Col span={2}>
                <NumberInput
                  label="Número"
                  allowDecimal={false}
                  allowLeadingZeros={false}
                  hideControls={true}
                  disabled={noNumberPlant}
                  min={1}
                  key={form.key(`plant.address.number`)}
                  {...form.getInputProps(`plant.address.number`)} 
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <TextInput
                  label="Complemento"
                  placeholder=""
                  key={form.key(`plant.address.complement`)}
                  {...form.getInputProps(`plant.address.complement`)} 
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
                  key={form.key(`plant.address.state`)}
                  {...form.getInputProps(`plant.address.state`)} 
                  data={loadingStates ? ["Carregando..."] : states.map((state) => state.sigla)}                
                  required
                />
              </Grid.Col>
              <Grid.Col span={3}>
                <Autocomplete
                  label="Município"
                  placeholder={loadingMunicipalities?"Carregando...":"Digite o município"}
                  data={loadingMunicipalities ? ["Carregando..."] : municipalities.map((item) => item.nome)}
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
                  decimalScale={6}
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
                  decimalScale={6}
                  allowedDecimalSeparators={['.',',']}
                  hideControls={true}
                  key={form.key(`plant.geolocation.lng`)}
                  {...form.getInputProps(`plant.geolocation.lng`)} 
                  required           
                />
              </Grid.Col>
            </Grid> 
            <Group justify="center" mt="xl">   
              <ActionIcon 
                color="green" 
                variant="subtle" 
                size="xl" 
                onClick={() => {
                  form.validate()
                }} 
              >
                <IconCheck  size={28} stroke={1.5} />
              </ActionIcon> 
            </Group>  
          </Stepper.Step>
          <Stepper.Step 
            label="Passo 3" 
            description="Unidades consumidoras"
            icon={<IconExposure size={18} />}
          >          
            <Table.ScrollContainer minWidth={900} type="native" mt="xl">
              <Table verticalSpacing="sm" highlightOnHover withColumnBorders>
                <Table.Tr>
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
                </Table.Tr >
                <Table.Tbody>{consumerUnits}</Table.Tbody>
              </Table>
            </Table.ScrollContainer>         

              <Group justify="center" mt="md"> 
                <ActionIcon 
                  color="green" 
                  variant="subtle" 
                  size="xl" 
                  onClick={() => {
                    form.validate()
                  }} 
                >
                  <IconCheck  size={28} stroke={1.5} />
                </ActionIcon>

                <ActionIcon 
                  color="green" 
                  variant="subtle" 
                  size="xl" 
                  onClick={() => {
                    form.insertListItem('consumerUnit', { 
                      key: randomId(),
                      consumer_unit_code: 0 , 
                      name: '', 
                      description: '',         
                      percentage: 50,
                      is_plant: false
                    })              
                  }} 
                >
                  <IconPlus  size={28} stroke={1.5} />
                </ActionIcon>
              </Group>
            </Stepper.Step>
            <Stepper.Step 
              label="Passo 4" 
              description="Equipamentos"
              icon={<IconFileUpload size={18} />}
            >
              <Tabs color="orange" variant="pills" defaultValue="inverters" mt="xl">
                <Tabs.List grow>
                  <Tabs.Tab value="inverters" icon={<IconHomeBolt size={20} />}><Text fw={500}> Inversor(es) </Text></Tabs.Tab>
                  <Tabs.Tab value="modules" icon={<IconUserCheck size={20} />}><Text fw={500}> Módulo(s) </Text></Tabs.Tab>              
                </Tabs.List>

                <Tabs.Panel value="inverters" pt="xl">

                  <Table.ScrollContainer minWidth={900} type="native">
                    <Table verticalSpacing="sm" highlightOnHover withColumnBorders>
                      <Table.Tr>
                        <Grid ml="sm" mr="md" >          
                          <Grid.Col span={4}>  
                            <Text fw={500}> Modelo </Text>
                          </Grid.Col>
                          <Grid.Col span={4}>  
                            <Text fw={500}> Fabricante </Text>
                          </Grid.Col>
                          <Grid.Col span={2}>
                            <Text fw={500}> Potência (kW) </Text>
                          </Grid.Col> 
                          <Grid.Col span={1}>
                            <Text fw={500}> Quantidade </Text>
                          </Grid.Col> 
                          <Grid.Col span={1}>
                            <Text fw={500}> Total (kW) </Text>
                          </Grid.Col>                           
                        </Grid>
                      </Table.Tr >
                      <Table.Tbody>{invertersDataRows}</Table.Tbody>
                    </Table>
                  </Table.ScrollContainer>         

                  <Group justify="center" mt="md" mb="xl">
                    <ActionIcon 
                      color="green" 
                      variant="subtle" 
                      size="xl" 
                      onClick={() => {
                        form.validate()
                      }} 
                    >
                      <IconCheck  size={28} stroke={1.5} />
                    </ActionIcon>

                    <ActionIcon 
                      color="green" 
                      variant="subtle" 
                      size="xl" 
                      onClick={() => {
                        form.insertListItem('inverters', { 
                          key: randomId(),
                          model: "",
                          manufacturer: "",
                          power: 0,
                          quantity: 1,
                          total_power : 0,
                        })              
                      }} 
                    >
                      <IconPlus  size={28} stroke={1.5} />
                    </ActionIcon>
                  </Group>
                </Tabs.Panel>

                <Tabs.Panel value="modules" pt="xl">

                  <Table.ScrollContainer minWidth={900} type="native">
                    <Table verticalSpacing="sm" highlightOnHover withColumnBorders>
                      <Table.Tr>
                        <Grid ml="sm" mr="md" >          
                          <Grid.Col span={3}>  
                          <Text ml="lg" fw={500}> Modelo </Text>
                          </Grid.Col>
                          <Grid.Col span={3}>  
                          <Text ml="sm"   fw={500}> Fabricante </Text>
                          </Grid.Col>
                          <Grid.Col span={1}>  
                          <Text fw={500}> Largura (m) </Text>
                          </Grid.Col>
                          <Grid.Col span={1}>  
                          <Text fw={500}> Altura (m) </Text>
                          </Grid.Col>
                          <Grid.Col span={1}>  
                          <Text fw={500}> Área total (m) </Text>
                          </Grid.Col>
                          <Grid.Col span={1}>
                          <Text fw={500}> Potência (kW) </Text>
                          </Grid.Col> 
                          <Grid.Col span={1}>
                          <Text fw={500}> Quantidade </Text>
                          </Grid.Col> 
                          <Grid.Col span={1}>
                          <Text fw={500}> Total (kW) </Text>
                          </Grid.Col>                           
                        </Grid>
                      </Table.Tr >
                      <Table.Tbody>{modulesDataRows}</Table.Tbody>
                    </Table>
                  </Table.ScrollContainer>         

                  <Group justify="center" mt="md"> 
                    <ActionIcon 
                      color="green" 
                      variant="subtle" 
                      size="xl" 
                      onClick={() => {
                        form.validate()
                      }} 
                    >
                      <IconCheck  size={28} stroke={1.5} />
                    </ActionIcon>
                    <ActionIcon 
                      color="green" 
                      variant="subtle" 
                      size="xl" 
                      onClick={() => {
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
                      }} 
                    >
                      <IconPlus  size={28} stroke={1.5} />
                    </ActionIcon>                
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
              <Button onClick={nextStep} color='green' >
                {activeStep === 5 ? "Conferir tudo" : "Próximo passo"}
              </Button>
            )} 
            {activeStep === 6 && (
              <Button type='submit'>Enviar para análise</Button>
            )}
          </Group>
          
          
        </form>
        
        <MapModal
          isOpen={isModalOpen}
          onClose={handleSaveCoordinates}
          setCoordinates={setCoordinates}
          centerMap={coordinates}
        />

        <MapModalGetMultiple 
          title={"Selecione os dispositivos"} 
          labelButton={"Selecionar no mapa"}     
          data={[
            {id:'1',name:"device1",available:true,lat:-15.783409087327046,lng:-47.93393934544606},
            {id:'2',name:"device2",available:true,lat:-15.783722169965136,lng:-47.93397602701885},
            {id:'3',name:"device3",available:false,lat:-15.783789697529565,lng:-47.93371447145638},
            {id:'4',name:"device4",available:false,lat:-15.783605531391776,lng:-47.933644298012794},
            {id:'5',name:"device5",available:true,lat:-15.783277101364115,lng:-47.933535848145425},
          ]} 
          onSelectionChange={(devs)=>{
            alert(JSON.stringify(devs))
          }}
          
        />    
    </>
    


    
  );
}