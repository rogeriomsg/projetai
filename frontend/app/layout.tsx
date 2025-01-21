import '@mantine/core/styles.css';
import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from '@mantine/core';
import { BasicAppShell } from '@/components/BasicAppShell/BasicAppShell';
import { theme } from "../theme";

export const metadata = {
  title: 'PR Solar Projetos',
  description: 'Ambiente para gerenciar seus projetos',
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="pt-BR" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <MantineProvider theme={theme}>  
            <BasicAppShell >{children}</BasicAppShell> 
        </MantineProvider>
      </body>
    </html>
  );
}