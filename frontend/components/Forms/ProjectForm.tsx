'use client';
import { useForm ,hasLength, matches,isNotEmpty, FORM_INDEX, zodResolver,} from '@mantine/form';
import { Checkbox,Select,Slider,SegmentedControl,Tabs,Text,Table , Autocomplete, ActionIcon,Switch,Stepper, Button, Group, NumberInput, TextInput, LoadingOverlay,Grid,InputBase,Tooltip, GridCol, Textarea, Box, Loader, Divider, SimpleGrid, FileInput, Center, Space, Alert,} from '@mantine/core';
import React , { useEffect, useState } from 'react';
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
  IconHome,
  IconCheckupList,
  IconCheckbox,
  IconDeviceComputerCamera,
  IconInfoCircle,
} from '@tabler/icons-react';

import MapModalGetSinglePoint, { IMarker } from '@/components/MapModal/MapModalGetSinglePoint';
import Api, { Create, Update } from '@/api/project';
import { FetchMunicipalities, FetchStates, FetchZipCode } from '@/api/utils';
import { useRouter } from 'next/navigation';
import ProjectView from './ProjectView';
import { EProjectSchemaType, IProjectDataValues, IProjectResponse } from '@/types/IProject';
import { EProjectFormSubmissionType, IStatesDataValues, IZipCodeDataValues } from '@/types/IUtils';
import { fullProjectSchema, getSchemaFromActiveStep, projectMainSchema} from '@/validations/project';
import { z } from 'zod';


interface FormProps {
    initialValues?: IProjectDataValues | null; // Valores iniciais para edição
    formSubmissionType?: EProjectFormSubmissionType
};

const ProjectForm: React.FC<FormProps> = ({ initialValues, formSubmissionType  }) =>{   
    const [saving, setSaving] = useState(false); 
    const [activeStep, setActiveStep] = useState(0); 
    const [checked, setChecked] = useState(false);
    const [colorSlider, setcolorSlider] = useState("green");
    const [porcentagem, setPorcentagem] = useState(false);
    const [states, setStates] = useState<IStatesDataValues[] | null>(null); // Lista de estados
    const [municipalities, setMunicipalities] = useState<any[]>([]); // Lista de municípios   
    const [loadingStates, setLoadingStates] = useState<boolean>(false); // Carregamento de estados
    const [loadingMunicipalities, setLoadingMunicipalities] = useState<boolean>(false); // Carregamento de municípios
    const [loadingZipCode, setLoadingZipCode] = useState<boolean>(false); // Carregamento de estados
    const [noNumberClient, setNoNumberClient] = useState<boolean>(false);
    const [noNumberPlant, setNoNumberPlant] = useState<boolean>(false);

    const [schemaType, setSchemaType] = useState<EProjectSchemaType>(EProjectSchemaType.stepInfoClient);

    const [projectFormSubmissionType, setprojectFormSubmissionType] = useState<EProjectFormSubmissionType>(EProjectFormSubmissionType.Create); //
    const router = useRouter();

    
    const nextStep = () => setActiveStep((currentStep) => (validateForm(getSchemaFromActiveStep(currentStep)) ? currentStep + 1 : currentStep ));    
    const prevStep = () => setActiveStep((currentStep) => (currentStep > 0 ? currentStep - 1 : currentStep));
    
    const form = useForm<IProjectDataValues>({
        mode: 'uncontrolled',

        //validateInputOnBlur:true,

        initialValues: initialValues || { 
            _id : "",
            status : "",
            project_type : "",
            is_active: true, // Indica se o projeto está ativo
            name: "", // Nome do projeto (opcional)
            description: "", // Descrição do projeto (opcional)
            dealership: "", // Nome da concessionária ou distribuidora (opcional)
            path_meter_pole: null, // Caminho para a foto do poste do medidor (opcional)
            path_meter: null, // Caminho para a foto do medidor (opcional)
            path_bill: null, // Caminho para a fatura de energia (opcional)
            path_identity:null, // Caminho para a identidade do cliente (opcional)
            path_procuration:null, // Caminho para o arquivo de procuração (opcional)     
            compensation_system:"", 
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
                consumer_unit_code: 0 , 
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

        validate: {},

        //validate: (values) => {             
            // const errors: Record<string, any> = {};      
            // switch (activeStep) {
            //     case 0: //informações do projeto
            //         errors.project_type =  values.project_type.length === 0?"O tipo do projeto é obrigatório":null;
            //         errors.name =  values.name.length === 0?"O nome do projeto é obrigatório":null;
            //         errors.name = values.name.length < 3?"O nome do projeto deve ter pelo menos 3 caracters":null;
            //         errors.dealership = values.dealership.length === 0?"A distribuidora é obrigatória":null;
            //     break;
            //     case 1: //informaçõe do cliente
            //         // errors["client.client_code"] = values.client.client_code < 2?"Verifique o código do cliente":null; 
            //         // errors["client.name"] = values.client.name.length < 3?"O nome do cliente deve ter pelo menos 3 caracters":null  
            //         // errors["client.cpf"] = values.client.cpf.length === 14?null:"O CPF está incompleto"      
            //         // errors["client.email"] = /^\S+@\S+$/.test(values.client.email)?null:"O e-mail esta inválido"
            //         // errors["client.phone"] = values.client.phone.length < 15?"O telefone está incompleto":null
            //         // errors["client.address.street"] = values.client.address.street.length < 3?"O logradouro é obrigatório":null
            //         // errors["client.address.number"] = Number(values.client.address.number) < 3?values.client.address.no_number?null:"O número é obrigatório":null
            //         // errors["client.address.state"] = values.client.address.state.length < 2?"O estado é obrigatório":null          
            //         // errors["client.address.city"] = values.client.address.city.length < 3?"O município é obrigatório":null
            //     break; 
            //     case 2: //informações da usina
            //         // errors["plant.consumer_unit_code"] = Number(values.plant.consumer_unit_code) < 1?"verifique o código do cliente":null; 
            //         // errors["plant.class"] = values.plant.class.length < 3?"Verifique a classe da UC":null;
            //         // errors["plant.subgroup"] = values.plant.subgroup.length < 1?"Verifique a subgrupo da UC":null;                
            //         // errors["plant.connection_type"] = values.plant.connection_type.length < 3?"Verifique o tipo de conexão da UC":null; 
            //         // errors["plant.generation_type"] = values.plant.generation_type.length < 3?"Verifique o tipo de geração da usina":null;
            //         // errors["plant.type_branch"] = values.plant.type_branch.length < 3?"Verifique o tipo de ramal de entrada da UC":null; 
            //         // errors["plant.branch_section"] = Number(values.plant.branch_section) < 10?"Verifique a seção de entrda da UC":null; 
            //         // errors["plant.service_voltage"] = Number(values.plant.service_voltage) === 0?"Verifique a tensão fase neutro":null; 
            //         // errors["plant.circuit_breaker"] = Number(values.plant.circuit_breaker) < 20?"O valor do disjuntor deve ser no mínimo 20A":null
            //         // errors["plant.address.street"] = values.plant.address.street.length < 3?"O logradouro é obrigatório":null
            //         // errors["plant.address.district"] = values.plant.address.district.length < 2?"O Bairro é obrigatório":null
            //         // errors["plant.address.city"] = values.plant.address.city.length < 3?"O município é obrigatório":null
            //         // errors["plant.address.state"] = values.plant.address.state.length < 2?"O estado é obrigatório":null
            //         // errors["plant.geolocation.lat"] = Number(values.plant.geolocation.lat) === 0?"A latitude é obrigatória":null
            //         // errors["plant.geolocation.lng"] = Number(values.plant.geolocation.lng) === 0?"A longitude é obrigatória":null          
            //         break;
            //     case 3: //Sistema de compensação
            //         // errors[`compensatiom_system`] = values.compensation_system.length < 2?"Selecione o tipo de compensação":null
            //         // values.consumerUnit.map((item,index)=>(
            //         //   errors[`consumerUnit.${index}.consumer_unit_code`] = Number(item.consumer_unit_code) < 2?"Verifique o código da UC ":null
            //         // )) 
            //         // values.consumerUnit.forEach((_, index) => {
            //         //   errors[`consumerUnit.${index}.percentage`] = !porcentagem?"A soma dos percentuais deve ser igual a 100.":null;
            //         // });
            //     break; 
            //     case 4: //Equipamentos      
            //         // values.inverters.map((itemInv,index)=>(
            //         //   errors[`inverters.${index}.model`] = itemInv.model.length < 3?"O modelo é obrigatório":null,
            //         //   errors[`inverters.${index}.manufacturer`] = itemInv.manufacturer.length < 3?"O fabricante é obrigatório":null,
            //         //   errors[`inverters.${index}.power`] = Number(itemInv.power) === 0?"A potência não pode ser 0":null
            //         // ));
                    
            //         // values.modules.map((item,index)=>(  
            //         //   errors[`modules.${index}.model`] = item.model.length < 3?"Teste":null,
            //         //   errors[`modules.${index}.manufacturer`] = item.manufacturer.length < 3?"O fabricante é obrigatório":null,          
            //         //   errors[`modules.${index}.power`] = Number(item.power) === 0?"A potência é obrigatória":null,
            //         //   errors[`modules.${index}.width`] = Number(item.width) === 0?"O largura deve ser maior que 0":null,
            //         //   errors[`modules.${index}.height`] = Number(item.height) === 0?"A altura deve ser maior que 0":null           
            //         // ));
            //         // const hasKeyStartingWith = (obj: Record<string, any>, prefix: string): boolean => {
            //         //   return Object.keys(obj).some((key) => key.startsWith(prefix));
            //         // };
            //         // if(hasKeyStartingWith(errors, 'inverters.'))
            //         //   changeTab("inverters")
            //         // else if(hasKeyStartingWith(errors, 'modules.'))
            //         //   changeTab("modules")
            //     break;
            // }
            // //alert(JSON.stringify(errors) ) 
            // return errors;
        //},

        transformValues: (values) => ({
            _id: values._id,
            status : values.status,
            project_type : values.project_type,
            is_active: true, // Indica se o projeto está ativo
            name: values.name, // Nome do projeto (opcional)
            description: values.description, // Descrição do projeto (opcional)
            dealership: values.dealership, // Nome da concessionária ou distribuidora (opcional)
            path_meter_pole: values.path_meter_pole, // Caminho para a foto do poste do medidor (opcional)
            path_meter: values.path_meter, // Caminho para a foto do medidor (opcional)
            path_bill: values.path_bill, // Caminho para a fatura de energia (opcional)
            path_identity:values.path_identity, // Caminho para a identidade do cliente (opcional)
            path_procuration:values.path_procuration, // Caminho para o arquivo de procuração (opcional)   
            compensation_system: values.compensation_system,     
            client: {
                client_code: Number(values.client.client_code),
                name: values.client.name,
                cpf: values.client.cpf,
                identity: values.client.identity,
                identity_issuer:values.client.identity_issuer,
                email: values.client.email,
                phone: values.client.phone,        
                address: {  
                street: values.client.address.street,
                complement:values.client.address.complement,
                no_number: Boolean(values.client.address.no_number),          
                district:values.client.address.district,
                state: values.client.address.state,
                city: values.client.address.city,                 
                number: Number(values.client.address.number),          
                zip: Number(values.client.address.zip),
                },
            },
            plant: { 
                consumer_unit_code: Number(values.plant.consumer_unit_code) ,
                name: values.plant.name, 
                description: values.plant.description,
                class:values.plant.class,
                subgroup:values.plant.subgroup,
                connection_type:values.plant.connection_type,
                generation_type:values.plant.generation_type,
                type_branch:values.plant.type_branch,  
                circuit_breaker: Number(values.plant.circuit_breaker),
                installed_load: Number(values.plant.installed_load),
                installed_power: Number(values.plant.installed_power),
                service_voltage: Number(values.plant.service_voltage),
                branch_section: Number(values.plant.branch_section), 
                address: { 
                street: values.plant.address.street,
                complement:values.plant.address.complement,
                no_number: Boolean(values.plant.address.no_number),          
                district:values.plant.address.district,
                state: values.plant.address.state,
                city: values.plant.address.city,                 
                number: Number(values.plant.address.number),          
                zip: Number(values.plant.address.zip),
                },
                geolocation: {          
                lat: Number(values.plant.geolocation.lat),
                lng: Number(values.plant.geolocation.lng),
                link_point:values.plant.geolocation.link_point
                }, 
            },      
            consumerUnit: values.consumerUnit.map((item)=>({   
                ...item,      
                consumer_unit_code: Number(item.consumer_unit_code) ,
                name: item.name, 
                description: item.description, 
                percentage:  Number(item.percentage),
                is_plant: Boolean(item.is_plant),
            })),
            inverters: values.inverters.map((item)=>({
                ...item, 
                model: item.model,
                manufacturer: item.manufacturer, 
                description: item.description,
                power: Number(item.power),
                quantity: Number(item.quantity),
                total_power : Number(item.total_power),
            })),      
            modules: values.modules.map((item)=>({
                ...item, 
                model: item.model,
                manufacturer: item.manufacturer,
                description: item.description,        
                quantity: Number(item.quantity),
                width: Number(item.width),
                height : Number(item.height),
                total_area: Number(item.total_area),
                power: Number(item.power),
                total_power : Number(item.total_power),
            })),      
        }),

        onValuesChange: (values,previous) => {
            //form.setValues(values)
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
            const response = await FetchStates()
            setStates(response as IStatesDataValues[])
            setLoadingStates(false);
        };
        fetchStates();

        setprojectFormSubmissionType(initialValues!==undefined?EProjectFormSubmissionType.update:EProjectFormSubmissionType.Create)
    }, []);

    const fetchMunicipalities = async (selectedState:string) => {    
        if(!(selectedState.toString().trim().length === 2)) return false;         
        setLoadingMunicipalities(true);
        const response = await FetchMunicipalities(selectedState)
        setMunicipalities(response as any);
        setLoadingMunicipalities(false);
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
        if(value.toString().trim().length < 8) return; 
        const response = (await FetchZipCode(value.toString())) as IZipCodeDataValues;
        form.setFieldValue('client.address.street', response.logradouro ||'')
        form.setFieldValue('client.address.district', response.bairro ||'')
        form.setFieldValue(`client.address.state`, response.uf ||'' ) 
        form.setFieldValue('client.address.city', response.localidade ||'')
        form.setFieldValue('client.address.complement', response.complemento ||'')
    });

    // Buscar municípios do  cliente quando o estado é selecionado
    form.watch('plant.address.zip', async ({value}) => {  
        // if(!(value.toString().trim().length === 8)) return; 
        // const response = (await FetchZipCode(value.toString())) as IZipCodeDataValues;
        // form.setFieldValue('plant.address.street', response.logradouro || '')
        // form.setFieldValue('plant.address.district', response.bairro || '')
        // form.setFieldValue(`plant.address.state`, response.uf || '' ) 
        // form.setFieldValue('plant.address.city', response.localidade || '')
        // form.setFieldValue('plant.address.complement', response.complemento || '')
    });
    
    const CopyAddressFromClientToPlant = (_checked:boolean) => {
        form.setFieldValue(`plant.address.street`,_checked?form.getValues().client.address.street:"");
        form.setFieldValue(`plant.address.complement`, _checked?form.getValues().client.address.complement:"0" );
        form.setFieldValue(`plant.address.number`, _checked?Number(form.getValues().client.address.number):0 );
        form.setFieldValue(`plant.address.district`, _checked?form.getValues().client.address.district:"");
        form.setFieldValue(`plant.address.state`, _checked?form.getValues().client.address.state:"");
        form.setFieldValue(`plant.address.city`, _checked?form.getValues().client.address.city:"");
        form.setFieldValue(`plant.address.zip`, _checked?Number(form.getValues().client.address.zip):0);
        form.setFieldValue(`plant.address.complement`, _checked?form.getValues().client.address.complement:"");
        form.setFieldValue(`plant.address.no_number`, _checked?form.getValues().client.address.no_number:false);      
    };

    const calculateArea = (index:number) => {
        // Recalcula total_area após a alteração
        const total_area = Number(form.getValues().modules[index].height) * Number(form.getValues().modules[index].width) * Number(form.getValues().modules[index].quantity);
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
    
    const calculatesLoadAvailable = () => {
        alert("calculatesLoadAvailable ")
        // Mapeamento do tipo de conexão para o número correspondente
        const connectionTypeMultiplier: Record<string, number> = {
        Trifásico: 3,
        Bifásico: 2,
        Monofásico: 1,
        };
        // Obtém o multiplicador do tipo de conexão
        const connectionTypeValue = connectionTypeMultiplier[form.getValues().plant.connection_type] || 1;
        const installed_power = Number(form.getValues().plant.service_voltage) * Number(form.getValues().plant.circuit_breaker) * connectionTypeValue  
        form.setFieldValue(`plant.installed_load`, installed_power);
    }

    const CheckPorcentagemConsumerUnit = ()=>{
        var _porcentagem = 0
        form.getValues().consumerUnit.map((item,_index)=>{      
            _porcentagem += item.percentage
        })    
        setcolorSlider(_porcentagem!==100?"red":"green")
        setPorcentagem(_porcentagem!==100?false:true)
    }    

    const handleSalvepointPlant = (selecteds:IMarker[]) => {
        if (selecteds.length>0) {
            form.setFieldValue("plant.geolocation.lat", selecteds[0].lat);
            form.setFieldValue("plant.geolocation.lng", selecteds[0].lng);
        }
    };  
    
    const consumerUnits = form.getValues().consumerUnit.map((item, index) => (
        <Table.Tr key={item.key} >
        <Table.Td >           
            <Grid ml="md" mr="md">          
            <Grid.Col span={2}>  
                <NumberInput
                placeholder="Código da UC"
                allowDecimal={false}
                hideControls={true}
                allowLeadingZeros={false}
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
            <Group justify="flex-end">           
            <ActionIcon color="red" variant="subtle" onClick={() => {
                form.removeListItem('consumerUnit', index)
                }} 
                disabled={index!==0?false:true} 
            >
                <IconTrash size={27} stroke={1.6}/>
            </ActionIcon>             
            </Group>
        </Table.Td>
        </Table.Tr>
    ));

    const invertersDataRows = form.getValues().inverters.map((item, index) => (
        <Table.Tr key={item.key} >
        <Table.Td >           
            <Grid ml="md" mr="md" >          
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
            <Group justify="flex-end"> 
            {
                index===0 &&(
                <>
                <ActionIcon color="red" variant="subtle" onClick={() => form.removeListItem('inverters', index)} disabled >
                    <IconTrash size={27} stroke={1.6}/>
                </ActionIcon>
                </>
                ) 
            }
            {
                index!==0 &&(
                <>
                <ActionIcon color="red" variant="subtle" onClick={() => form.removeListItem('inverters', index)}>
                    <IconTrash size={27} stroke={1.6}/>
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
                        calculateArea(index)
                    }}
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
                decimalScale={2}
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
                decimalScale={3}
                key={form.key(`modules.${index}.total_power`)}
                {...form.getInputProps(`modules.${index}.total_power`)}               
                readOnly  
                />
            </Grid.Col>                           
            </Grid>        
        </Table.Td>
        <Table.Td>
            <Group justify="flex-end"> 
            {
                index===0 &&(
                <>
                <ActionIcon color="red" variant="subtle" onClick={() => form.removeListItem('modules', index)} disabled >
                    <IconTrash size={27} stroke={1.6}/>
                </ActionIcon>
                </>
                ) 
            }
            {
                index!==0 &&(
                <>
                <ActionIcon color="red" variant="subtle" onClick={() => form.removeListItem('modules', index)}>
                    <IconTrash size={27} stroke={1.6}/>
                </ActionIcon>
                </>
                ) 
            } 
            </Group>
        </Table.Td>
        </Table.Tr>
    ));

    const validateForm = (schema: z.ZodSchema<any>) => {
        try {
            // Validar os valores do formulário usando o esquema Zod
            schema.parse(form.getValues());
            return true;
        } catch (err) {
            if (err instanceof z.ZodError) {
            // Mapear os erros para o formulário
            const errors = err.errors.reduce((acc, error) => {
                const path = error.path.join(".");
                acc[path] = error.message;
                return acc;
            }, {} as Record<string, string>);
            alert(JSON.stringify(errors))
            form.setErrors(errors);
            return false;
            }
        }
    };
    
    const handleSubmit = async (isSketch:boolean) => {                 
        alert(projectFormSubmissionType.toString()) 
        setSaving(true);
        switch(form.getValues().status)
        {
            case "":  //Criação de projeto enviado ou rascunho    
                alert("Criação de projeto ou rascunho")            
                if(validateForm(isSketch?projectMainSchema:fullProjectSchema)){
                    form.setFieldValue("status",isSketch?"Em cadastro":"Recebido pela Projetai")
                    const responseCreate = await Create(form.getValues());
                    if((responseCreate as IProjectResponse).error === false){
                        alert(isSketch?"Rascunho salvo com sucesso":"Projeto salvo com sucesso")
                    }else{
                        alert(isSketch?"Erro ao salvar rascunho":"Erro ao salvar projeto")
                    }
                }              
                
                break;
            case "Em cadastro": //Edição de sketch que pode virar projeto enviado
                alert("Edição de sketch "+form.getValues().project_type)
                if(validateForm(isSketch?projectMainSchema:fullProjectSchema)){
                    form.setFieldValue("status",isSketch?"Em cadastro":"Recebido pela Projetai")
                    const responseUpdate= await Update(form.getValues()._id,form.getValues());
                    if((responseUpdate as IProjectResponse).error === false){
                        alert(isSketch?"Rascunho atualizado com sucesso":"Projeto enviado salvo com sucesso")
                    }else{
                        alert(isSketch?"Erro ao atualizar rascunho":"Erro ao salvar projeto editado")
                    }
                }    
                break;
            case "Recebido pela Projetai":
            case "Analisado com pendências": //Edição de projeto enviado 
                if(isSketch) return;
                alert("Edição de projeto enviado")
                if(validateForm(fullProjectSchema)){                    
                    const responseUpdate = await Update(form.getValues()._id,form.getValues());
                    if((responseUpdate as IProjectResponse).error === false){
                        alert("Projeto enviado atualizado com sucesso")
                    }else{
                        alert("Erro ao atualizar projeto enviado")
                    }
                }    
                break;
        } 
        setSaving(false);
        router.push("/project/list"); // Redireciona para a página de listagem"
    }
    
    return (
        <>
        {/* <Alert variant="filled" color="red" title="Atenção" withCloseButton icon={<IconInfoCircle size={30} />} radius="lg" onClose={()=>alert("Teste")}>
            Este aviso serve para que você possar.
        </Alert> */}
        <form 
            //onSubmit={form.onSubmit((values,event)=>handleSubmit(values,event!))}  
            onSubmit={(e) => e.preventDefault()} // Impede a submissão padrão
        >            
            <Stepper 
            active={activeStep} 
            onStepClick={setActiveStep} 
            completedIcon={<IconCheckbox size={20} />}
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
                        //label="Tipo de projeto"
                        placeholder="Tipo de projeto"
                        rightSection={<IconDeviceComputerCamera></IconDeviceComputerCamera>}
                        data={[ 'Até 10kWp', 'Maior que 10kWp', 'Maior que 75kWp',]}
                        key={form.key("project_type")}
                        {...form.getInputProps("project_type")} 
                        required
                        />
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <TextInput
                        //label="Nome do projeto"
                        placeholder="Nome do projeto"
                        rightSection={<IconCheck></IconCheck>}
                        key={form.key("name")}
                        {...form.getInputProps("name")} 
                        required 

                        /> 
                    </Grid.Col>
                    <Grid.Col span={3}>
                        <Autocomplete
                        //label="Distribuidora"
                        placeholder="Selecione a distribuidora"
                        data={['Neoenergia Brasília', 'Goiás', ]}
                        key={form.key("dealership")}
                        {...form.getInputProps("dealership")} 
                        required
                        />
                    </Grid.Col>            
                    <Grid.Col span={12}>
                        <Textarea
                        //label="Descrição"
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
                            validateForm(getSchemaFromActiveStep(activeStep))            
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
                    <GridCol span={12}>
                    <Divider my="sm" 
                        label={
                        <>
                            <IconHome size={20} />
                            <Box ml={5}>Endereço da fatura do cliente</Box>
                        </>
                        } 
                        labelPosition="center" 
                    />
                    </GridCol>
                    <Grid.Col span={2}> 
                        <NumberInput               
                        label="Código postal"
                        placeholder='Digite o CEP' 
                        allowLeadingZeros={false}
                        allowDecimal={false}
                        hideControls={true}
                        maxLength={8}
                        rightSection={loadingZipCode && <Loader size={20} mr="sm"/>}   
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
                        data={loadingStates ? ["Carregando..."] : states?.map((state) => state.sigla)}
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
                            validateForm(getSchemaFromActiveStep(activeStep))
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
                        label="Tipo de ramal"
                        placeholder="Selecione"
                        data={["Aérea","Subterrânea"]}
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
                    {/* <Grid.Col span={2}>
                        <NumberInput
                        label="Carga disponibilizada"
                        placeholder="Em (kW)"
                        min={0}
                        decimalScale={3}
                        hideControls={true}
                        allowedDecimalSeparators={['.',',']}
                        key={form.key(`plant.installed_load`)}
                        {...form.getInputProps(`plant.installed_load`)} 
                        readOnly         
                        />
                    </Grid.Col>  */}
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
                        placeholder='Digite o CEP' 
                        allowDecimal={false}
                        allowLeadingZeros={false}
                        hideControls={true} 
                        rightSection={loadingZipCode && <Loader size={20} mr="sm"/>}                 
                        maxLength={8} // Limita o número de caracteres no CEP
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
                        data={loadingStates ? ["Carregando..."] : states?.map((state) => state.sigla)} 
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
                        decimalScale={8}
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
                        decimalScale={8}
                        allowedDecimalSeparators={['.',',']}
                        hideControls={true}
                        key={form.key(`plant.geolocation.lng`)}
                        {...form.getInputProps(`plant.geolocation.lng`)} 
                        required           
                        />
                    </Grid.Col>
                    <GridCol span={3} mt="lg">
                        <MapModalGetSinglePoint
                            onSelectionChange={handleSalvepointPlant}                        
                            dataMarkers={
                                projectFormSubmissionType===EProjectFormSubmissionType.update?
                                [ {id:"0",available:true,selected:true,draggable:true,clickable:false,lat:form.getValues().plant.geolocation.lat,lng:form.getValues().plant.geolocation.lng}]
                                :
                                [{id:"0",available:true,selected:true,draggable:true,clickable:false,lat:-15.78421850,lng:-47.93389432}]
                            }
                            centerDefault={
                                Number(form.getValues().plant.geolocation.lat)!==0&&Number(form.getValues().plant.geolocation.lng)!==0?
                                {lat:form.getValues().plant.geolocation.lat,lng:form.getValues().plant.geolocation.lng}
                                :
                                {lat:-15.78421850,lng:-47.93389432}
                            }
                            zoom={18}
                        />
                    </GridCol>
                </Grid> 
                <Group justify="center" mt="xl">   
                    <ActionIcon 
                        color="green" 
                        variant="subtle" 
                        size="xl" 
                        onClick={() => {
                            validateForm(getSchemaFromActiveStep(activeStep))
                        }} 
                    >
                        <IconCheck  size={28} stroke={1.5} />
                    </ActionIcon> 
                </Group>  
            </Stepper.Step>
            <Stepper.Step 
                label="Passo 3" 
                description="Sistema de compensação"
                icon={<IconExposure size={18} />}
            > 
                <SimpleGrid cols={3}>
                <Autocomplete
                    label="Tipo de sistema de compensação"
                    data={['AutoConsumo remoto','AutoConsumo local','Condominio','Associação',"Cooperativa",'Consórcio']}
                    key={form.key(`compensation_system`)}
                    {...form.getInputProps(`compensation_system`)}                
                    required
                    ml="lg"
                    mt="xl"
                /> 
                </SimpleGrid>
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

                <Group justify="right" mt="md"> 
                    <ActionIcon 
                    color="green" 
                        //variant="subtle" 
                        size="xl" 
                        onClick={() => {
                            validateForm(getSchemaFromActiveStep(activeStep))
                        }} 
                    >
                        <IconCheck  size={28} stroke={1.5} />
                    </ActionIcon>

                    <ActionIcon 
                        color="orange" 
                        //variant="subtle" 
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
                <Text fw={700} size="xl" tt="capitalize" mb="lg" mt="xl"> Inversores </Text>
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

                <Group justify="right" mt="sm">  
                    <ActionIcon 
                        color="orange" 
                        //variant="subtle" 
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

                <Text fw={700} size="xl" tt="capitalize" mb="lg"> Módulos </Text>
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
                            <Text fw={500}> Quantidade </Text>
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
                            <Text fw={500}> Total (kW) </Text>
                            </Grid.Col>                           
                        </Grid>
                        </Table.Tr >
                        <Table.Tbody>{modulesDataRows}</Table.Tbody>
                    </Table>
                </Table.ScrollContainer>         

                <Group justify="right" mt="sm"> 
                    {/* <ActionIcon 
                        color="green" 
                        variant="subtle" 
                        size="xl" 
                        onClick={() => {
                        form.validate()
                        }} 
                    >
                        <IconCheck  size={28} stroke={1.5} />
                    </ActionIcon> */}
                    <ActionIcon 
                        color="orange" 
                        //variant="subtle" 
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
            </Stepper.Step>
            <Stepper.Step 
                label="Passo 5" 
                description="Documentos"
                icon={<IconFileUpload size={18} />}
            >
                <Grid mt="xl">
                    <GridCol >
                        <FileInput 
                        accept="image/png,image/jpeg,application/pdf" 
                        label="Foto da conta de energia do cliente" 
                        placeholder="Upload de arquivos" 
                        key={form.key(`path_bill`)}
                        {...form.getInputProps(`path_bill`)}   
                        /> 
                    </GridCol>
                    <GridCol >
                        <FileInput 
                        accept="image/png,image/jpeg,application/pdf" 
                        label="Cópia do documento de identidade do cliente" 
                        placeholder="Upload de arquivos" 
                        key={form.key(`path_identity`)}
                        {...form.getInputProps(`path_identity`)}   
                        /> 
                    </GridCol>
                    <GridCol >
                        <FileInput 
                        accept="image/png,image/jpeg" 
                        label="Foto do padrão de entrada " 
                        placeholder="Upload de arquivos" 
                        key={form.key(`path_meter`)}
                        {...form.getInputProps(`path_meter`)} 
                        /> 
                    </GridCol>
                    <GridCol >
                        <FileInput 
                        accept="image/png,image/jpeg" 
                        label="Foto do poste do padrão de entrada" 
                        placeholder="Upload de arquivos" 
                        key={form.key(`path_meter_pole`)}
                        {...form.getInputProps(`path_meter_pole`)} 
                        /> 
                    </GridCol>
                    <GridCol >
                        <FileInput 
                        accept="image/png,image/jpeg,application/pdf" 
                        label="Foto da procuração" 
                        placeholder="Upload de arquivos" 
                        key={form.key(`path_procuration`)}
                        {...form.getInputProps(`path_procuration`)}                     
                        /> 
                    </GridCol>
                </Grid>
            </Stepper.Step>
            <Stepper.Completed>
                <Space h="xl"> </Space>
                <Center>
                    <Text size={"xl"} fw={500}>
                        Confira os dados, se estiver tudo certo você pode salvar e continuar editando depois ou enviar para análise: {projectFormSubmissionType}
                    </Text>
                </Center>
                <Center h={200} >
                    <ProjectView labelButton="Verificar" isOpen={activeStep === 6} valuesView={form.getValues()}/> 
                </Center>                
            </Stepper.Completed>
            </Stepper>
            <Group justify="right" mt="xl" mr="xl">        
                {activeStep > 0 && (
                <>
                <Button variant="default" onClick={prevStep}>
                    Voltar
                </Button>
                <Button 
                    variant="default" 
                    disabled={form.getValues().status!==""&&form.getValues().status!=="Em cadastro"}
                    onClick={() => handleSubmit(true)}
                >
                    Salvar e editar depois
                </Button>
                </>          
                )}        
                {activeStep < 6 && (
                <Button 
                    onClick={nextStep} 
                    color='green' 
                >
                    {activeStep === 5 ? "Conferir tudo" : "Próximo passo"}
                </Button>
                )} 
                {activeStep === 6 && (
                    //<Button type='submit'>{projectFormSubmissionType==='update'?"Salvar Alterações":"Enviar para análise"}</Button>
                    <Button 
                        type="button"
                        onClick={() => handleSubmit(false)}
                    >
                        {projectFormSubmissionType==='update'?"Salvar Alterações":"Enviar para análise"}
                    </Button>
                )}
            </Group>    
            </form>  
        </>    
    );


}


export default ProjectForm;