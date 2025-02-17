'use client';

import { Text,Table , Autocomplete, ActionIcon,Stepper, Button, Group, NumberInput, TextInput, Grid,InputBase,Tooltip, GridCol,  FileInput, Center, Space, Anchor, Flex, Radio, Textarea, Divider} from '@mantine/core';
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
import { EBranchSection, ECircuitBreaker, EClassUC, EConnectionType, EDealership, EGenerationType, EPerson, EProjectSchemaType, EProjectStatus, EProjectType, ESubgroup, ETypeBranch, EVoltageskV, IFile, IProjectDataValues, IProjectResponse } from '@/types/IProject';
import { EProjectFormSubmissionType, IStatesDataValues } from '@/types/IUtils';
import { fullProjectSchema, getSchemaFromActiveStep, projectMainSchema} from '@/validations/project';
import { z } from 'zod';
import ProjectViewV2 from './ProjectViewV2';
import DownloadButton from '../DownloadButton';

interface FormProps {
    initialValues?: IProjectDataValues | null; // Valores iniciais para edição
    formSubmissionType?: EProjectFormSubmissionType;
    onSave?: ()=>void ;
    onUpdate?: ()=>void ;
    onCancel?: ()=>void;
    onError?: (error:string | {message:string}) =>void;
};

const ProjectFormV2: React.FC<FormProps> = ({ initialValues = null, formSubmissionType , onSave, onUpdate,onCancel , onError}) => {   

    const [saving, setSaving] = useState(false); 
    const [activeStep, setActiveStep] = useState(0); 
    const [colorSlider, setcolorSlider] = useState("green");
    const [porcentagem, setPorcentagem] = useState(false);
   
    const [noNumberClient, setNoNumberClient] = useState<boolean>(false);
    const [noNumberPlant, setNoNumberPlant] = useState<boolean>(false);

    const [path_meter_pole, setPath_meter_pole] = useState<File | null>(null);
    const [path_meter, setPath_meter] = useState<File | null>(null);
    const [path_bill, setPath_bill] = useState<File | null>(null);
    const [path_identity, setPath_identity] = useState<File | null>(null);
    const [path_procuration, setPath_procuration] = useState<File | null>(null);
    const [path_optional, setPath_optional] = useState<File | null>(null);

    const [cpfCnpj, setcpfCnpj] = useState('cpf');

    const [projectFormSubmissionType, setprojectFormSubmissionType] = useState<EProjectFormSubmissionType>(EProjectFormSubmissionType.Create); //
    
    
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
            path_meter_pole: null, // Caminho para a foto do poste do medidor
            path_meter: null, // Caminho para a foto do medidor
            path_bill: null , // Caminho para a fatura de energia
            path_identity: null, // Caminho para a identidade do cliente
            path_procuration: null, // Caminho para o arquivo de procuração 
            path_optional: null, // Caminho para o arquivo de procuração (opcional)     
            compensation_system:"", 
            client: {
                client_code: 0,
                name: "",
                person : EPerson.cpf,
                cnpj:"",
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
                consumer_unit_code: "", 
                name: '', 
                description: '',
                class:"",
                subgroup:"",
                connection_type:"",
                generation_type:"",
                type_branch:"",
                branch_section: "", 
                circuit_breaker: "",
                installed_load: 0,
                installed_power: "",
                service_voltage: "",        
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
                    lat: "",
                    lng: "",
                    link_point:""
                }, 
            },
            consumerUnit: [], 
            inverters: [{
                model: "",
                manufacturer: "",
                power: 0,
                quantity: 1,
                total_power : 0,
                description: ""
            }],
            modules: [{
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

        transformValues: (values) => ( {
            ...values,
            is_active: true, // Indica se o projeto está ativo
            client: {
                ...values.client, 
                client_code: Number(values.client.client_code),
                cnpj : values.client.person===EPerson.cnpj?values.client.cnpj:"",
                cpf: values.client.person===EPerson.cpf?values.client.cpf:"",
                address: {  
                    ...values.client.address,
                    no_number: Boolean(values.client.address.no_number),  
                    number: Number(values.client.address.number),          
                    zip: Number(values.client.address.zip),
                },
            },
            plant: {
                ...values.plant, 
                consumer_unit_code: Number(values.plant.consumer_unit_code) ,
                circuit_breaker: Number(values.plant.circuit_breaker),
                installed_load: Number(values.plant.installed_load),
                installed_power: Number(values.plant.installed_power),
                branch_section: Number(values.plant.branch_section), 
                address: {  
                    ...values.plant.address,                
                    no_number: Boolean(values.plant.address.no_number), 
                    number: Number(values.plant.address.number),          
                    zip: Number(values.plant.address.zip),
                },
                geolocation: { 
                    ...values.plant.geolocation,         
                    lat: Number(values.plant.geolocation.lat),
                    lng: Number(values.plant.geolocation.lng),
                }, 
            },      
            consumerUnit: values.consumerUnit?.map((item)=>({   
                ...item,      
                consumer_unit_code: Number(item.consumer_unit_code) ,
                percentage:  Number(item.percentage),
                is_plant: Boolean(item.is_plant),
            })) || null,
            inverters: values.inverters.map((item)=>({
                ...item, 
                power: Number(item.power),
                quantity: Number(item.quantity),
                total_power : Number(item.total_power),
            })),      
            modules: values.modules.map((item)=>({
                ...item,    
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
        setPath_bill(convertIFileToFile(form.getValues().path_bill))
        setPath_identity(convertIFileToFile(form.getValues().path_identity))
        setPath_meter(convertIFileToFile(form.getValues().path_meter))
        setPath_meter_pole(convertIFileToFile(form.getValues().path_meter_pole))
        setPath_procuration(convertIFileToFile(form.getValues().path_procuration))
        setPath_optional(convertIFileToFile(form.getValues().path_optional))
        setcpfCnpj(form.getValues().client.person)

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
   
    const consumerUnits = form.getValues().consumerUnit?.map((item, index) => ( 
        
            <Table.Tr key={randomId()} >              
                <Table.Td>
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
                </Table.Td>
                <Table.Td>
                <NumberInput
                        placeholder="Código da UC"
                        allowDecimal={false}
                        min={0}
                        max={100}              
                        key={form.key(`consumerUnit.${index}.percentage`)}
                        {...form.getInputProps(`consumerUnit.${index}.percentage`)}
                        required
                    />                 
                </Table.Td>
                <Table.Td>
                    <TextInput
                        placeholder="Digite um nome para essa unidade, por ex.: Sitio da família (opcional)"
                        key={form.key(`consumerUnit.${index}.name`)}
                        {...form.getInputProps(`consumerUnit.${index}.name`)}
                    />
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
            <Table.Td>
            <TextInput
                    placeholder="Modelo do inversor"
                    key={form.key(`inverters.${index}.model`)}
                    {...form.getInputProps(`inverters.${index}.model`)}
                    required
                    />

            </Table.Td>
            <Table.Td>
                <TextInput
                    placeholder="Fabricante do inversor"
                    key={form.key(`inverters.${index}.manufacturer`)}
                    {...form.getInputProps(`inverters.${index}.manufacturer`)}
                    required
                />                
            </Table.Td>
            <Table.Td>
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
            </Table.Td>
            <Table.Td>
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
            </Table.Td>
            
            <Table.Td>
                <NumberInput
                    decimalScale={3}
                    key={form.key(`inverters.${index}.total_power`)}
                    {...form.getInputProps(`inverters.${index}.total_power`)} 
                    readOnly
                />                
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
            <Table.Td>
            <TextInput
                    placeholder="Modelo do módulo fotovoltaico"
                    key={form.key(`modules.${index}.model`)}
                    {...form.getInputProps(`modules.${index}.model`)}
                    required
                    />
            </Table.Td>
            <Table.Td>
            <TextInput
                        placeholder="Marca do módulo fotovoltaico"
                        key={form.key(`modules.${index}.manufacturer`)}
                        {...form.getInputProps(`modules.${index}.manufacturer`)}
                        required
                    />
            </Table.Td>
            <Table.Td>
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
                
            </Table.Td>
            <Table.Td>
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
                
            </Table.Td>
            <Table.Td>
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
                
            </Table.Td>
            <Table.Td>
            <NumberInput
                    placeholder="Área"
                    decimalScale={2}
                    key={form.key(`modules.${index}.total_area`)}
                    {...form.getInputProps(`modules.${index}.total_area`)}
                    readOnly
                    />
                
            </Table.Td>
            <Table.Td>
            <NumberInput
                    decimalScale={3}
                    key={form.key(`modules.${index}.total_power`)}
                    {...form.getInputProps(`modules.${index}.total_power`)}               
                    readOnly  
                    />
                
            </Table.Td>
            <Table.Td>
            <NumberInput
                    decimalScale={3}
                    key={form.key(`modules.${index}.total_power`)}
                    {...form.getInputProps(`modules.${index}.total_power`)}               
                    readOnly  
                    />
                
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
        //alert(JSON.stringify(form.getTransformedValues()))
        try {
            form.clearErrors();
            //schema.parse(form.getTransformedValues());
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
    
    const convertFileToIFile = (file: File | null, callback: (result: IFile | null) => void) => {
        if (!file) {
            callback(null);
            return;
        }        
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            callback({
                filename: file.name,
                mimetype: file.type,
                size: file.size,
                data: reader.result as string, // Base64
            });
        };
        reader.onerror = () => {
            console.error("Erro ao ler o arquivo.");
            callback(null);
        };
    };
    
    const convertIFileToFile = (iFile: IFile | null): File | null => {
        // Remover o prefixo "data:mimetype;base64," se existir
        if(iFile){            
            const base64Data = iFile.data.includes(",") ? iFile.data.split(",")[1] : iFile.data;            
            // Decodificar Base64 para um array de bytes
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length)
              .fill(0)
              .map((_, i) => byteCharacters.charCodeAt(i));
            const byteArray = new Uint8Array(byteNumbers);          
            // Criar um Blob com os dados do arquivo
            const blob = new Blob([byteArray], { type: iFile.mimetype });            
            // Criar um arquivo File
            return new File([blob], iFile.filename, { type: iFile.mimetype });
        }else{
            return null
        };
    }
    
    const handleFileChange = (file: File | null, field: keyof IProjectDataValues) => {
        convertFileToIFile(file, (result) => form.setFieldValue(field, result));
    };
    
    const handleSubmit = async (isSketch:boolean) => {       

        //console.log(JSON.stringify(form.getValues().path_bill))
        //console.log(JSON.stringify(form.getValues().path_identity))

        setSaving(true);
        switch(form.getValues().status)
        {
            case EProjectStatus.None:  //Criação de projeto enviado ou rascunho    
                alert("Criação de projeto ou rascunho")            
                if(validateForm(isSketch?projectMainSchema:fullProjectSchema)){
                    form.setFieldValue("status",isSketch?EProjectStatus.Rascunho:EProjectStatus.AguardandoPagamento)
                    Create(form.getTransformedValues()).then(res =>{
                        setSaving(false);
                        if((res as IProjectResponse).error === false){
                            alert(isSketch?"Rascunho salvo com sucesso":"Projeto salvo com sucesso")
                        }else{
                            const message = (res as IProjectResponse).message
                            alert(isSketch?`Erro ao salvar rascunho: ${message}`:`Erro ao salvar projeto: ${message}`)
                        }
                    });                    
                } 
                break;
            case EProjectStatus.Rascunho: //Edição de sketch que pode virar projeto enviado
                alert("Edição de sketch "+form.getValues().project_type)
                if(validateForm(isSketch?projectMainSchema:fullProjectSchema)){
                    form.setFieldValue("status",isSketch?EProjectStatus.Rascunho:EProjectStatus.AguardandoPagamento)
                    Update(form.getTransformedValues()._id,form.getTransformedValues()).then(res=>{
                        setSaving(false);
                        if((res as IProjectResponse).error === false){
                            alert(isSketch?"Rascunho atualizado com sucesso":"Projeto enviado atualizado com sucesso")
                            onUpdate?.();
                        }else{
                            const message = (res as IProjectResponse).message
                            alert(isSketch?`Erro ao atualizar rascunho : ${message}`:`Erro ao atualizar projeto editado: ${message}`)
                            onUpdate?.()
                        }
                    });                    
                }    
                break;
            case EProjectStatus.RecebidoPelaProjetai:
                if(isSketch) return;
                alert("Edição de projeto enviado")
                if(validateForm(fullProjectSchema)){                    
                    Update(form.getTransformedValues()._id,form.getTransformedValues()).then(res=>{
                        setSaving(false);
                        if((res as IProjectResponse).error === false){
                            alert("Projeto enviado atualizado com sucesso")
                            onUpdate?.();
                        }else{
                            const message = (res as IProjectResponse).message
                            alert(`Erro ao atualizar projeto enviado: ${message}`)
                            onUpdate?.();
                        }
                    });                    
                }    
                break;
        } 
    }

    return (      
        <form 
            //onSubmit={form.onSubmit((values,event)=>handleSubmit(values,event!))}  
            //onSubmit={(e) => e.preventDefault()} // Impede a submissão padrão
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
                        {/*<Grid.Col span={2}>
                            <Autocomplete
                                label="Tipo de projeto"
                                placeholder="Tipo de projeto"
                                rightSection={<IconDeviceComputerCamera></IconDeviceComputerCamera>}
                                data={Object.values(EProjectType)}
                                key={form.key("project_type")}
                                {...form.getInputProps("project_type")} 
                                required
                            />
                        </Grid.Col> */}
                        <Grid.Col span={9}>
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
                        <Grid.Col span={1}>                            
                            <Radio.Group
                                value={cpfCnpj}
                                key={form.key("client.person")}
                                {...form.getInputProps("client.person")}        
                                onChange={(value)=>{
                                    form.setFieldValue("client.person",value as EPerson)
                                    setcpfCnpj(value)
                                }} 
                            >
                                <Group>
                                    <Radio label="CPF" value="cpf" />
                                    <Radio label="CNPJ" value="cnpj" />                                
                                </Group>
                            </Radio.Group>
                        </Grid.Col>
                        
                        <Grid.Col span={2}>
                        {cpfCnpj==='cpf'?(
                            <InputBase
                                label="CPF"
                                component={IMaskInput}
                                mask="000.000.000-00"
                                key={form.key("client.cpf")}
                                {...form.getInputProps("client.cpf")}
                                required
                            />                            
                        ):(
                            <InputBase
                                label="CNPJ"
                                component={IMaskInput}
                                mask="00.000.000/0000-00"
                                key={form.key("client.cnpj")}
                                {...form.getInputProps("client.cnpj")}
                                required
                            />
                        )}                            
                        </Grid.Col>
                        <Grid.Col span={8}>

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
                                label="Potência de geração (kWp)"
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
                                label="Tipo de ramal de entrada"
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
                                min={-90}
                                max={90}
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
                                min={-180}
                                max={180}
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
                        <Table verticalSpacing="sm" highlightOnHover >
                            <Table.Thead >
                                <Table.Tr>
                                    <Table.Th w={160}>
                                        Código da UC 
                                        {/* <Text fw={700}> Código da UC </Text> */}
                                    </Table.Th>
                                    <Table.Th w={160}>
                                        Porcentagem {porcentagem} 
                                        {/* <Text fw={700} c={colorSlider}> Porcentagem {porcentagem} </Text> */}
                                    </Table.Th>
                                    <Table.Th>
                                        Nome da Unidade consumidora
                                        {/* <Text fw={700}> Nome da Unidade consumidora</Text> */}
                                    </Table.Th>
                                    <Table.Th w={30}>                                        
                                        <ActionIcon color="write"> </ActionIcon>    
                                    </Table.Th>

                                </Table.Tr>
                                {/* <Table.Th>
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
                                </Table.Th>
                                <Table.Th w={30}>
                                    <Group justify="flex-end">           
                                        <ActionIcon color="gray"> </ActionIcon>             
                                    </Group>                               
                                </Table.Th> */}
                            </Table.Thead >
                            <Table.Tbody >{consumerUnits}</Table.Tbody>
                        </Table>
                    </Table.ScrollContainer>         

                    <Group justify="right" mt="md">                        
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
                    <Text fw={700} size="xl"> Inversores (String ou Microinversores) </Text>
                    {/* <Text ml="sm" fw={700} c="dimmed"> Inversores (String ou Microinversores) </Text> */}
                    <Table.ScrollContainer minWidth={900} type="native">
                        <Table verticalSpacing="sm" highlightOnHover>
                            <Table.Thead>
                                <Table.Tr key={randomId()}>                                
                                    <Table.Th >
                                    Modelo 
                                    </Table.Th>
                                    <Table.Th>
                                    Fabricante
                                    </Table.Th>
                                    <Table.Th w={50}>
                                    Quantidade 
                                    </Table.Th>
                                    <Table.Th w={150}>
                                    Potência (kW)
                                    </Table.Th>                                
                                    <Table.Th w={150}>
                                    Total (kW)
                                    </Table.Th>
                                    <Table.Th w={30}>
                                        <Group justify="flex-end">           
                                            <ActionIcon color="write"> </ActionIcon>             
                                        </Group>  
                                    </Table.Th>
                                </Table.Tr >
                            </Table.Thead>                            
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

                    <Text fw={700} size="xl" tt="capitalize"> Módulos fotovoltaicos (placas)</Text>
                    <Table.ScrollContainer minWidth={900} type="native">
                        <Table verticalSpacing="sm" highlightOnHover >
                            <Table.Thead>
                                <Table.Tr key={randomId()}>                                    
                                    <Table.Th>
                                        Modelo 
                                    </Table.Th>
                                    <Table.Th>
                                        Fabricante 
                                    </Table.Th>
                                    <Table.Th w={30}>
                                        Quantidade 
                                    </Table.Th>
                                    <Table.Th w={100}>
                                        Largura (m) 
                                    </Table.Th >
                                    <Table.Th w={100}>
                                        Altura (m) 
                                    </Table.Th>
                                    <Table.Th w={150}>
                                        Área total (m) 
                                    </Table.Th>
                                    <Table.Th w={150}>
                                        Potência (kW) 
                                    </Table.Th>
                                    <Table.Th w={150}>
                                        Total (kW)  
                                    </Table.Th>
                                    <Table.Th w={30}>
                                        <Group justify="flex-end">           
                                            <ActionIcon color="write"> </ActionIcon>             
                                        </Group>   
                                    </Table.Th>
                                </Table.Tr >
                            </Table.Thead>                                
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
                        <GridCol span={6}>                           
                            <FileInput
                                accept="image/png,image/jpeg,application/pdf"
                                label="Fatura de Energia"
                                placeholder="Selecione um arquivo"
                                //key={form.key(`path_bill`)}
                                {...form.getInputProps(`path_bill`)} 
                                //value={path_bill||""} 
                                onChange={(file) => {
                                    setPath_bill(file)
                                    handleFileChange(file, "path_bill")
                                }}
                                //error={form.errors.path_bill?.toString()}
                            />   
                        </GridCol>
                        <GridCol span={1} mt="xl">
                            { formSubmissionType===EProjectFormSubmissionType.update && <DownloadButton file={form.getValues().path_bill } />}                            
                        </GridCol>                        
                        <GridCol span={1} mt="xl">
                            {path_bill && (
                                <ActionIcon color="red" variant="subtle" onClick={() => { setPath_bill(null); form.setFieldValue("path_bill",null ) }} >
                                    <IconTrash  size={28} stroke={1.5} />
                                </ActionIcon>    
                            )}                            
                        </GridCol>
                        <GridCol span={6} >
                            <FileInput
                                accept="image/png,image/jpeg,application/pdf"
                                label="Identidade do Cliente"
                                placeholder="Selecione um arquivo"
                                {...form.getInputProps(`path_identity`)} 
                                //value={path_identity}
                                onChange={(file) => {
                                    setPath_identity(file)
                                    handleFileChange(file, "path_identity")
                                }}
                            />
                        </GridCol>
                        <GridCol span={1} mt="xl">
                            { formSubmissionType===EProjectFormSubmissionType.update && <DownloadButton file={form.getValues().path_identity } />}
                        </GridCol>
                        <GridCol span={1} mt="xl">
                            {path_identity && (
                                <ActionIcon color="red" variant="subtle" onClick={() => { setPath_identity(null); form.setFieldValue("path_identity",null) }} >
                                    <IconTrash   size={28} stroke={1.5} />
                                </ActionIcon>    
                            )}                            
                        </GridCol>
                        
                        <GridCol span={6}>
                            <FileInput
                                accept="image/png,image/jpeg,application/pdf"
                                label="Foto do Poste e medidor"
                                placeholder="Selecione um arquivo"
                                {...form.getInputProps(`path_meter_pole`)} 
                                //value={path_meter_pole}
                                onChange={(file) => {
                                    setPath_meter_pole(file)
                                    handleFileChange(file, "path_meter_pole")
                                }}
                            />
                        </GridCol>
                        <GridCol span={1} mt="xl">
                            { formSubmissionType===EProjectFormSubmissionType.update && <DownloadButton file={form.getValues().path_meter_pole } />}
                        </GridCol>
                        <GridCol span={1} mt="xl">
                            {path_meter_pole && (
                                <ActionIcon color="red" variant="subtle" onClick={() => { setPath_meter_pole(null); form.setFieldValue("path_meter_pole",null) }} >
                                    <IconTrash  size={28} stroke={1.5} />
                                </ActionIcon>    
                            )}                            
                        </GridCol>
                        <GridCol span={6}>
                            <FileInput 
                                accept="image/png,image/jpeg,application/pdf" 
                                label="Foto da procuração" 
                                placeholder="Upload de arquivos" 
                                {...form.getInputProps(`path_procuration`)}
                                //value={path_procuration}
                                onChange={(file) => {
                                    setPath_procuration(file)
                                    handleFileChange(file, "path_procuration")
                                }}       
                            /> 
                        </GridCol>
                        <GridCol span={1} mt="xl">
                            { formSubmissionType===EProjectFormSubmissionType.update && <DownloadButton file={form.getValues().path_procuration} />}
                        </GridCol>
                        <GridCol span={1} mt="xl">
                            {path_procuration && (
                                <ActionIcon color="red" variant="subtle" onClick={() => { setPath_procuration(null); form.setFieldValue("path_procuration",null) }} >
                                    <IconTrash  size={28} stroke={1.5} />
                                </ActionIcon>    
                            )}                            
                        </GridCol>
                        <GridCol span={6}>
                            <FileInput
                                accept="image/png,image/jpeg,application/pdf"
                                label="Arquivo opcional"
                                placeholder="Selecione um arquivo"
                                {...form.getInputProps(`path_meter`)} 
                                //value={path_meter}
                                onChange={(file) => {
                                    setPath_meter(file)
                                    handleFileChange(file, "path_meter")
                                }}
                            />
                        </GridCol>
                        <GridCol span={1} mt="xl">
                            { formSubmissionType===EProjectFormSubmissionType.update && <DownloadButton file={form.getValues().path_meter } />}
                        </GridCol>
                        <GridCol span={1} mt="xl">
                            {path_meter && (
                                <ActionIcon color="red" variant="subtle" onClick={() => { setPath_meter(null); form.setFieldValue("path_meter",null) }} >
                                    <IconTrash  size={28} stroke={1.5} />
                                </ActionIcon>    
                            )}                            
                        </GridCol>
                        {/* <GridCol span={6}>
                            <FileInput 
                                accept="image/png,image/jpeg,application/pdf" 
                                label="Arquivo Opcional" 
                                placeholder="Upload de arquivos" 
                                {...form.getInputProps(`path_optional`)}
                                value={path_optional}
                                onChange={(file) => {
                                    setPath_optional(file)
                                    handleFileChange(file, "path_optional")
                                }}        
                            /> 
                        </GridCol>
                        <GridCol span={1} mt="xl">
                            { formSubmissionType===EProjectFormSubmissionType.update && <DownloadButton file={form.getValues().path_optional} />}
                        </GridCol>
                        <GridCol span={1} mt="xl">
                            {path_optional && (
                                <ActionIcon color="red" variant="subtle" onClick={() => { setPath_optional(null); form.setFieldValue("path_optional",null) }} >
                                    <IconTrash  size={28} stroke={1.5} />
                                </ActionIcon>    
                            )}                            
                        </GridCol> */}
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
                    <Button variant="default" onClick={prevStep}>
                        Voltar
                    </Button>  
                )} 
                <Button c="red" variant="default" onClick={()=>onCancel?.()}>
                        Cancelar
                </Button> 
                {activeStep > 0 && (               
                    <Button 
                        variant="default" 
                        disabled={form.getValues().status!==EProjectStatus.None&&form.getValues().status!==EProjectStatus.Rascunho}
                        onClick={() => handleSubmit(true)}
                    >
                        Salvar e editar depois
                    </Button>
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