'use client';

import { ReactNode } from 'react';
import { NavbarMinimal } from './navigation/NavBarMinimal';

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <NavbarMinimal />
      <div style={{ marginLeft: '80px' }}>{children}</div>
    </>
  );
}