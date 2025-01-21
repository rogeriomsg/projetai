"use client";
import { AppShell, Burger, Group, Skeleton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Logo } from '@/components/Logo/Logo';
import { NavbarSimple } from '../NavbarSimple/NavbarSimple';
import { usePathname } from 'next/navigation';

export function BasicAppShell({
    children,
  }: {
    children: React.ReactNode;
  }) {
  const [opened, { toggle }] = useDisclosure();
  const pathname = usePathname();

  // Rotas públicas que não prcisam do layout do appshell
  const publicRoutes = ['/login', '/register'];

  // Verifique se a rota atual é pública
  const isPublicRoute = publicRoutes.includes(pathname);

  if (isPublicRoute) {
    // Retorne apenas o conteúdo da página pública
    return <>{children}</>;
  }

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
      transitionDuration={500}
      transitionTimingFunction="ease"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Logo />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <NavbarSimple/>
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}