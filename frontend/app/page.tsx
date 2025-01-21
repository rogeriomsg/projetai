"use client";

import { Button, Group, Text, useMantineColorScheme } from "@mantine/core";

export default function HomePage() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  return (
    <div style={{ padding: "20px" }}>
      <Text size="xl" ta="center">
        Bem-vindo ao App com Mantine!
      </Text>

      <Group justify="center" mt="xl">
        <Button onClick={() => toggleColorScheme()}>
          Alternar para {dark ? "Tema Claro" : "Tema Escuro"}
        </Button>
      </Group>
    </div>
  );
}

