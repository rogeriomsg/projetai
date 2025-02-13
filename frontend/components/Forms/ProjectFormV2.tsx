'use client';

import { Text,Table , Autocomplete, ActionIcon,Stepper, Button, Group, NumberInput, TextInput, Grid,InputBase,Tooltip, GridCol,  FileInput, Center, Space} from '@mantine/core';
import { useForm ,} from '@mantine/form';
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
  IconHome,
  IconCheckupList,
  IconCheckbox,
  IconDeviceComputerCamera,
  IconInfoCircle,
  IconActivity,
  IconUpload, 
  IconPhoto, 
  IconX
} from '@tabler/icons-react';


import Api, { Create, Update } from '@/api/project';
import { useRouter } from 'next/navigation';
import { EBranchSection, ECircuitBreaker, EClassUC, EConnectionType, EDealership, EGenerationType, EProjectSchemaType, EProjectStatus, EProjectType, ESubgroup, ETypeBranch, EVoltageskV, IProjectDataValues, IProjectResponse } from '@/types/IProject';
import { EProjectFormSubmissionType, IStatesDataValues } from '@/types/IUtils';
import { fullProjectSchema, getSchemaFromActiveStep, projectMainSchema} from '@/validations/project';
import { z } from 'zod';
import ProjectViewV2 from './ProjectViewV2';



interface FormProps {
    initialValues?: IProjectDataValues | null; // Valores iniciais para edição
    formSubmissionType?: EProjectFormSubmissionType
};

const ProjectFormV2: React.FC<FormProps> = ({ initialValues = null, formSubmissionType  }) =>{   

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

    const [file, setFile] = useState<File | null>(null);

    const [schemaType, setSchemaType] = useState<EProjectSchemaType>(EProjectSchemaType.stepInfoClient);

    const [projectFormSubmissionType, setprojectFormSubmissionType] = useState<EProjectFormSubmissionType>(EProjectFormSubmissionType.Create); //
    const router = useRouter();
    
    const nextStep = () => setActiveStep((currentStep) => (validateForm(getSchemaFromActiveStep(currentStep)) ? currentStep + 1 : currentStep ));    
    const prevStep = () => setActiveStep((currentStep) => (currentStep > 0 ? currentStep - 1 : currentStep));
    
    const  form = useForm<IProjectDataValues>({
        mode: 'uncontrolled',

        initialValues: initialValues || { 
            _id : "",
            status : EProjectStatus.None,
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
                    number: "",
                    district:"",
                    state: "",
                    city: "",
                    zip: "",
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
                    number: "",
                    district:"",
                    state: "",
                    city: "",
                    zip: ""
                },
                geolocation: {
                    lat: 0,
                    lng: 0,
                    link_point:""
                }, 
            },
            consumerUnit: [], 
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
            consumerUnit: values.consumerUnit?.map((item)=>({   
                ...item,      
                consumer_unit_code: Number(item.consumer_unit_code) ,
                name: item.name, 
                description: item.description, 
                percentage:  Number(item.percentage),
                is_plant: Boolean(item.is_plant),
            })) || null,
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
                form.setFieldValue('client.address.number',"")
                setNoNumberClient(true)
            }
            else{        
                setNoNumberClient(false)
            }
            if(values.plant.address.no_number){ 
                form.clearFieldError('plant.address.number')
                form.setFieldValue('plant.address.number',"")
                setNoNumberPlant(true)
            }
            else{        
                setNoNumberPlant(false)
            } 

        },
    });
    
    // Buscar estados
    useEffect(() => {   
        setprojectFormSubmissionType(initialValues!==undefined?EProjectFormSubmissionType.update:EProjectFormSubmissionType.Create)
    }, []);
        
    const calculateArea = (index:number) => {
        // Recalcula total_area após a alteração
        const total_area = Number(form.getValues().modules[index].height) * Number(form.getValues().modules[index].width) * Number(form.getValues().modules[index].quantity);
        form.setFieldValue(`modules.${index}.total_area`, total_area);
    };

    const calculatesTotalPowerModules = (index:number) => {
        const power = Number(form.getValues().modules[index].power);
        const quantity = Number(form.getValues().modules[index].quantity);

        // Verifica se power é um número válido antes de fazer a multiplicação
        if (!isNaN(power) && !isNaN(quantity)) {
            form.setFieldValue(`modules.${index}.total_power`, power * quantity);
        }
    };

    const calculatesTotalPowerInverters = (index:number) => {
        // Recalcula a potência total após a alteração
        const total_power = Number(form.getValues().inverters[index].power) * Number(form.getValues().inverters[index].quantity) ;
        form.setFieldValue(`inverters.${index}.total_power`, total_power);
    };    
   
    const CheckPorcentagemConsumerUnit = ()=>{
        var _porcentagem = 0
        form.getValues().consumerUnit?.map((item,_index)=>{ 
            const p = Number(item.percentage) 
            if(!isNaN(p))    
                _porcentagem += p
        })    
        setcolorSlider(_porcentagem!==100?"red":"green")
        setPorcentagem(_porcentagem!==100?false:true)
    }   
    
    const consumerUnits1 = form.getValues().consumerUnit?.map((item, index) => {
        //alert(JSON.stringify(item))
    })
    
    
    const consumerUnits = form.getValues().consumerUnit?.map((item, index) => ( 
        <Table.Tr key={index} >
            <Table.Td >           
                <Grid ml="lg" mr="md">          
                    <Grid.Col span={2}>  
                        <NumberInput
                            placeholder="Código da UC"
                            allowDecimal={false}
                            hideControls={true}
                            allowLeadingZeros={false}
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
                >
                    <IconTrash size={27} stroke={1.6}/>
                </ActionIcon>             
                </Group>
            </Table.Td>
        </Table.Tr>  
    ));
        
    const invertersDataRows = form.getValues().inverters.map((item, index) => (
        <Table.Tr key={index} >
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
                    allowLeadingZeros={false}
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
        <Table.Tr key={index} >
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
                    allowLeadingZeros={false}
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
                    allowLeadingZeros={false}
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
                    allowLeadingZeros={false}
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
                    <ActionIcon color="red" variant="subtle" onClick={() => form.removeListItem('modules', index)} disabled >
                        <IconTrash size={27} stroke={1.6}/>
                    </ActionIcon>                    
                    ) 
                }
                {
                    index!==0 &&(
                    <ActionIcon color="red" variant="subtle" onClick={() => form.removeListItem('modules', index)}>
                        <IconTrash size={27} stroke={1.6}/>
                    </ActionIcon>
                    ) 
                } 
                </Group>
            </Table.Td>
        </Table.Tr>
    ));

    const validateForm = (schema: z.ZodSchema<any>) => {
        try {
            
            schema.parse(form.getTransformedValues());
            return true;
        } catch (err) {
            if (err instanceof z.ZodError) {
            // Mapear os erros para o formulário
            const errors = err.errors.reduce((acc, error) => {
                const path = error.path.join(".");
                acc[path] = error.message;
                return acc;
            }, {} as Record<string, string>);
            //alert(JSON.stringify(errors))
            form.setErrors(errors);
            return false;
            }
        }
    };
    
    const handleSubmit = async (isSketch:boolean) => {  

        
    const handleSubmit = async (isSketch:boolean) => {                 
        //alert("stop")
        setSaving(true);
        switch(form.getValues().status)
        {
            case EProjectStatus.None:  //Criação de projeto enviado ou rascunho    
                alert("Criação de projeto ou rascunho")            
                if(validateForm(isSketch?projectMainSchema:fullProjectSchema)){
                    form.setFieldValue("status",isSketch?EProjectStatus.EmCadastro:EProjectStatus.RecebidoPelaProjetai)
                    const responseCreate = await Create(form.getTransformedValues());
                    if((responseCreate as IProjectResponse).error === false){
                        alert(isSketch?"Rascunho salvo com sucesso":"Projeto salvo com sucesso")
                    }else{
                        alert(isSketch?"Erro ao salvar rascunho":"Erro ao salvar projeto")
                    }
                } 
                break;
            case EProjectStatus.EmCadastro: //Edição de sketch que pode virar projeto enviado
                alert("Edição de sketch "+form.getValues().project_type)
                if(validateForm(isSketch?projectMainSchema:fullProjectSchema)){
                    form.setFieldValue("status",isSketch?EProjectStatus.EmCadastro:EProjectStatus.RecebidoPelaProjetai)
                    const responseUpdate = await Update(form.getTransformedValues()._id,form.getValues());
                    if((responseUpdate as IProjectResponse).error === false){
                        alert(isSketch?"Rascunho atualizado com sucesso":"Projeto enviado salvo com sucesso")
                    }else{
                        alert(isSketch?"Erro ao atualizar rascunho":"Erro ao salvar projeto editado")
                    }
                }    
                break;
            case EProjectStatus.RecebidoPelaProjetai:
                if(isSketch) return;
                alert("Edição de projeto enviado")
                if(validateForm(fullProjectSchema)){                    
                    const responseUpdate = await Update(form.getTransformedValues()._id,form.getValues());
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
                label="Passo 1" 
                description="Informações do Projeto"
                icon={<IconFileUpload size={18} />}
                >
                    <Grid mt="sm">
                        <Grid.Col span={3}>
                            <Autocomplete
                                label="Distribuidora"
                                placeholder="Selecione a distribuidora"
                                data={Object.values(EDealership)}
                                key={form.key("dealership")}
                                {...form.getInputProps("dealership")} 
                                required
                            />
                        </Grid.Col>  
                        <Grid.Col span={2}>
                            <Autocomplete
                                label="Tipo de projeto"
                                placeholder="Tipo de projeto"
                                rightSection={<IconDeviceComputerCamera></IconDeviceComputerCamera>}
                                //data={[ 'Até 10kWp', 'Maior que 10kWp', 'Maior que 75kWp',]}
                                data={Object.values(EProjectType)}
                                key={form.key("project_type")}
                                {...form.getInputProps("project_type")} 
                                required
                            />
                        </Grid.Col>
                        <Grid.Col span={7}>
                            <TextInput
                                label="Nome do projeto"
                                placeholder="Nome do projeto"
                                rightSection={<IconCheck></IconCheck>}
                                key={form.key("name")}
                                {...form.getInputProps("name")} 
                                required 

                            /> 
                        </Grid.Col>
                    </Grid>
                </Stepper.Step> 
                <Stepper.Step 
                    label="Passo 2" 
                    description="Informações Básicas"
                    icon={<IconFileUpload size={18} />}
                >
                    <Grid mt="sm">
                        <Grid.Col span={12}>
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
                        <Grid.Col span={10}>

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
                        <Grid.Col span={10}>
                            <TextInput
                                label="E-mail"
                                key={form.key("client.email")}
                                {...form.getInputProps("client.email")}
                                required
                            />
                        </Grid.Col>
                        <Grid.Col span={2} >
                            <NumberInput
                                label="Potência instalada de geração (kWp)"
                                placeholder="Digite"
                                decimalScale={3}
                                allowLeadingZeros={false}
                                allowedDecimalSeparators={['.',',']}
                                hideControls={true}
                                min={0}
                                key={form.key(`plant.installed_power`)}
                                {...form.getInputProps(`plant.installed_power`)} 
                                //readOnly          
                            />
                        </Grid.Col>  
                        <Grid.Col span={2}>
                            <Autocomplete
                                label="Tipo de conexão"
                                placeholder="Selecione"
                                data={Object.values(EConnectionType)}
                                key={form.key(`plant.connection_type`)}
                                {...form.getInputProps(`plant.connection_type`)} 
                                required
                            />
                        </Grid.Col>    
                        <Grid.Col span={2}>
                            <Autocomplete
                                label="Tensão de fornecimento (kV)"
                                placeholder="Selecione"
                                data={Object.values(EVoltageskV)}
                                key={form.key(`plant.service_voltage`)}
                                {...form.getInputProps(`plant.service_voltage`)} 
                                required
                            />
                        </Grid.Col>  
                        <Grid.Col span={2}>
                            <Autocomplete
                                label="Tipo de ramal do padrão de entrada"
                                placeholder="Selecione"
                                data={Object.values(ETypeBranch)}
                                key={form.key(`plant.type_branch`)}
                                {...form.getInputProps(`plant.type_branch`)} 
                                required
                            />
                        </Grid.Col>
                        <Grid.Col span={2}>
                            <Autocomplete
                                label="Bitola da Concessionária(mm²)"
                                placeholder="Selecione"
                                data={Object.values(EBranchSection)}
                                key={form.key(`plant.branch_section`)}
                                {...form.getInputProps(`plant.branch_section`)} 
                                required
                            />
                        </Grid.Col>                                 
                        <Grid.Col span={2}>
                            <Autocomplete
                                label="Disjuntor padrão de entrada(A)"
                                placeholder="Digite"
                                data={Object.values(ECircuitBreaker)}
                                key={form.key(`plant.circuit_breaker`)}
                                {...form.getInputProps(`plant.circuit_breaker`)} 
                                required
                            />              
                        </Grid.Col>
                        <Grid.Col span={2}>
                            <NumberInput
                                label="Latitude da UC"
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
                                label="Longitude da UC"
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
                    </Grid> 
                </Stepper.Step>
                <Stepper.Step 
                    label="Passo 3" 
                    description="Compensação de Créditos"
                    icon={<IconExposure size={18} />}
                >                  
                    <Table.ScrollContainer minWidth={900} type="native" mt="xl">
                    <Table verticalSpacing="sm" highlightOnHover withColumnBorders>
                        <Table.Tr key={randomId()}>
                            <Table.Td>
                                <Grid ml="lg" mr="md" >          
                                    <Grid.Col span={2}>  
                                        <Text fw={700}> Código da UC </Text>
                                    </Grid.Col>
                                    <Grid.Col span={2}>  
                                        <Text fw={700} c={colorSlider}> Porcentagem {porcentagem} </Text>
                                    </Grid.Col>
                                    <Grid.Col span={8}>
                                        <Text fw={700}> Nome da Unidade consumidora</Text>
                                    </Grid.Col>                                          
                                </Grid>
                            </Table.Td>
                            <Table.Td w={30}>
                                <Group justify="flex-end">           
                                    <ActionIcon color="gray"> </ActionIcon>             
                                </Group>                               
                            </Table.Td>
                        </Table.Tr >
                        <Table.Tbody >{consumerUnits}</Table.Tbody>
                    </Table>
                    </Table.ScrollContainer>         

                    <Group justify="right" mt="md"> 
                        {/* <ActionIcon 
                            color="green" 
                            //variant="subtle" 
                            size="xl" 
                            onClick={() => {
                                validateForm(getSchemaFromActiveStep(activeStep))
                            }} 
                        >
                            <IconCheck  size={28} stroke={1.5} />
                        </ActionIcon> */}

                        <ActionIcon 
                            color="orange" 
                            //variant="subtle" 
                            size="xl" 
                            onClick={() => {
                                form.insertListItem('consumerUnit', { 
                                key: randomId(),
                                consumer_unit_code: "" , 
                                name: "", 
                                description: "",         
                                percentage: 100,
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
                            <Table.Tr key={randomId()}>
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
                            <Table.Tr key={randomId()}>
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
                                    width: "",
                                    height: "",
                                    total_area:0,
                                    power: 0,
                                    quantity: 1,
                                    total_power : 0,
                                })             
                            }} 
                        >
                            <IconPlus  size={28} stroke={1.5} />
                        </ActionIcon>                
                    </Group>
                </Stepper.Step>
                <Stepper.Step 
                    label="Passo 4" 
                    description="Documentos"
                    icon={<IconFileUpload size={18} />}
                >
                    <Grid mt="xl">
                        <GridCol >
                            <FileInput 
                                label="Foto da conta de energia do cliente" 
                                placeholder="Upload de arquivos" 
                                accept="image/png,image/jpeg,application/pdf" 
                                key={form.key(`path_bill`)}
                                {...form.getInputProps(`path_bill`)} 
                                value={file}
                                onChange={setFile}  
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
                        <ProjectViewV2 labelButton="Verificar" isOpen={activeStep === 5} valuesView={form.getValues()}/> 
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
                        disabled={form.getValues().status!==EProjectStatus.None&&form.getValues().status!==EProjectStatus.EmCadastro}
                        onClick={() => handleSubmit(true)}
                    >
                        Salvar e editar depois
                    </Button>
                </>          
                )}        
                {activeStep < 5 && (
                <Button 
                    onClick={nextStep} 
                    color='green' 
                >
                    {activeStep === 4 ? "Conferir tudo" : "Próximo passo"}
                </Button>
                )} 
                {activeStep === 5 && (
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
    );
}


export default ProjectFormV2;