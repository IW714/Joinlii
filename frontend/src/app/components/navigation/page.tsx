"use client";
import { useEffect, useState } from 'react';
import { Center, Tooltip, UnstyledButton, Stack, rem } from '@mantine/core';
import {
  IconHome2,
  IconGauge,
  IconUsersGroup,
  IconCalendarStats,
  IconUser,
  IconSettings,
  IconLogout,
  IconSwitchHorizontal,
} from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import classes from './NavbarMinimal.module.css';

interface NavbarLinkProps {
  icon: typeof IconHome2;
  label: string;
  active?: boolean;
  href?: string;
  onClick?(): void;
}

function NavbarLink({ icon: Icon, label, active, href, onClick }: NavbarLinkProps) {
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <Link href={href || '#'}>
        <UnstyledButton onClick={onClick} className={classes.link} data-active={active ? 'true' : undefined}>
          <Icon style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
        </UnstyledButton>
      </Link>
    </Tooltip>
  );
}

const mockdata = [
  { icon: IconHome2, label: 'Home', href: '/home'},
  { icon: IconGauge, label: 'Dashboard', href: '/dashboard'},
  { icon: IconUsersGroup, label: 'Groups', href: '/groups'},
  { icon: IconCalendarStats, label: 'Calendar', href: '/calendar'},
  { icon: IconUser, label: 'Account', href: '/account'},
  { icon: IconSettings, label: 'Settings', href: '/settings'},
];

export function NavbarMinimal() {
  const pathname = usePathname();
  const [active, setActive] = useState<number | null> (null);

  useEffect(() => {
    const activeIndex = mockdata.findIndex((link) => link.href === pathname);
    if (activeIndex !== -1) {
      setActive(activeIndex);
    }
  }, [pathname]);

  const links = mockdata.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={index === active}
      onClick={() => setActive(index)}
    />
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Stack justify="center" gap={0}>
          {links}
        </Stack>
      </div>

      <Stack justify="center" gap={0}>
        <NavbarLink icon={IconSwitchHorizontal} label="Change account" />
        <NavbarLink icon={IconLogout} label="Logout" />
      </Stack>
    </nav>
  );
}
