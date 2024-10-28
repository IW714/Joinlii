'use client';

import { useEffect, useState } from 'react';
import { Stack, Tooltip, UnstyledButton, rem } from '@mantine/core';
import {
  IconHome2,
  IconGauge,
  IconUsersGroup,
  IconCalendarStats,
  IconUser,
  IconSettings,
  IconLogout,
  IconSwitchHorizontal,
  IconLogin,
} from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import classes from './NavbarMinimal.module.css';
import { useAuth } from '../AuthContext'; 

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
      <UnstyledButton
        component={Link}
        href={href || '#'}
        onClick={onClick}
        className={classes.link}
        data-active={active ? 'true' : undefined}>
          <Icon style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}

const mockdata = [
  { icon: IconHome2, label: 'Home', href: '/dashboard/home' },
  { icon: IconGauge, label: 'Tasks', href: '/dashboard/tasks' },
  { icon: IconUsersGroup, label: 'Groups', href: '/dashboard/groups' },
  { icon: IconCalendarStats, label: 'Calendar', href: '/dashboard/calendar' },
  { icon: IconUser, label: 'Account', href: '/dashboard/profile' },
];

export function NavbarMinimal() {
  const pathname = usePathname();
  const router = useRouter();
  const [active, setActive] = useState<number | null>(null);
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const activeIndex = mockdata.findIndex((link) => link.href === pathname);
    if (activeIndex !== -1) {
      setActive(activeIndex);
    }
  }, [pathname]);

  console.log('Navbar isAuthenticated:', isAuthenticated); // Debugging

  const links = isAuthenticated
    ? mockdata.map((link, index) => (
        <NavbarLink
          {...link}
          key={link.label}
          active={index === active}
          onClick={() => setActive(index)}
        />
      ))
    : null;

  const handleLogout = () => {
    logout();
    router.push('/');
  }

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Stack justify="center" gap={0}>
          {links}
        </Stack>
      </div>

      <Stack justify="center" gap={0}>
        {isAuthenticated ? (
          <>
            <NavbarLink icon={IconSwitchHorizontal} label="Change account" href="/login" />
            {/* Logout as a separate button */}
            <Tooltip label="Logout" position="right" transitionProps={{ duration: 0 }}>
              <UnstyledButton onClick={handleLogout} className={classes.link} aria-label="Logout">
                <IconLogout style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
              </UnstyledButton>
            </Tooltip>
          </>
        ) : (
          <NavbarLink icon={IconLogin} label="Login" href="/login" />
        )}
      </Stack>
    </nav>
  );
}