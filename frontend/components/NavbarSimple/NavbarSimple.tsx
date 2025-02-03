"use client";
import { useState , useEffect } from 'react';
import {
  Icon2fa,
  IconBellRinging,
  IconMap,
  IconFingerprint,
  IconKey,
  IconLogout,
  IconReceipt2,
  IconSettings,
  IconSwitchHorizontal,
  IconSun, 
  IconMoonStars 
} from '@tabler/icons-react';
import classes from './NavbarSimple.module.css';
import { Group, Text, useMantineColorScheme,Switch } from "@mantine/core";
import { usePathname } from 'next/navigation';
  

const data = [
  { link: '/', label: 'Início', icon: IconBellRinging },
  { link: '/project/new', label: 'Projetos', icon: IconReceipt2 },
  { link: '/map', label: 'Mapa', icon: IconMap },
  { link: '/mapMulti', label: 'Mapa2', icon: IconKey },
  // { link: '', label: 'Databases', icon: IconDatabaseImport },
  // { link: '', label: 'Authentication', icon: Icon2fa },
  // { link: '', label: 'Other Settings', icon: IconSettings },
];

export function NavbarSimple() {
  const pathname = usePathname(); // Obtém o caminho atual da URL
  const [active, setActive] = useState('Início');
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";

  // Atualizar o estado "active" com base na URL atual
  useEffect(() => {
    const activeItem = data.find((item) => item.link === pathname);
    if (activeItem) {
      setActive(activeItem.label);
    }
  }, [pathname]); // Atualizar sempre que a URL mudar

  const links = data.map((item) => (
    <a
      className={classes.link}
      data-active={pathname === item.link || undefined}
      href={item.link}
      key={item.label}      
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </a>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>        
        {links}
      </div>

      <div className={classes.footer}>
        <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
          <IconSettings className={classes.linkIcon} stroke={1.5} />
          <span>Configurações</span>
        </a>

        <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Sair</span>
        </a>
      </div>
      <Group justify="center" mt="xl">        
        <Switch
        checked={isDark}
        onChange={() => toggleColorScheme()}
        color="dark.4"
        size="lg"
        offLabel={<IconSun size={16} stroke={2.5} color="var(--mantine-color-yellow-4)" />}
        onLabel={<IconMoonStars size={16} stroke={2.5} color="var(--mantine-color-blue-6)" />}
      />
      </Group>
    </nav>
  );
}