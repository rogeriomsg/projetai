//Como o mapa será carregado e exibido no lado do cliente 
'use client' ; 

// Importe os módulos e funções necessários de bibliotecas externas e do nosso próprio projeto 
import { Libraries , useJsApiLoader } from  '@react-google-maps/api' ; 
import { ReactNode } from  'react' ; 

// Defina uma lista de bibliotecas para carregar da API do Google Maps 
const libraries = [ 'places' , 'drawing' , 'geometry' ]; 

// Defina um componente de função chamado MapProvider que recebe uma propriedade children 
export  function  MapProvider ( { children }: { children: ReactNode } ) { 

  // Carregue a API JavaScript do Google Maps de forma assíncrona 
  const { isLoaded : scriptLoaded, loadError } = useJsApiLoader ({ 
    googleMapsApiKey : process.env.NEXT_PUBLIC_GOOGLE_MAP_API  as  string , 
    libraries : libraries as  Libraries , 
  }); 

  if (loadError) return  <p> Erro encontrado ao carregar o Google Maps </p>

   if (!scriptLoaded) return  <p> O script do mapa está carregando ... </p>

   // Retorna a propriedade children encapsulada por este componente MapProvider 
  return children; 
}