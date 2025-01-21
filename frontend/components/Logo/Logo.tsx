// components/Logo.tsx
import { Group, Image, Text, createTheme  ,rem} from '@mantine/core';

const theme = createTheme({
    fontFamily: 'Verdana, sans-serif',
    fontFamilyMonospace: 'Monaco, Courier, monospace',
    headings: { fontFamily: 'Greycliff CF, sans-serif' },
  });

export function Logo() {
    return (
        <Group gap="sm">
        <Image src="./logo.png" alt="Logo" width={40} height={40} />
        <Text fw={700} size="xl" variant="gradient" gradient={{ from: 'blue', to: 'cyan', deg: 90 }} style={{fontSize: rem(28)}}>            
            PR Solar Projetos
        </Text>
        </Group>
    );
}
