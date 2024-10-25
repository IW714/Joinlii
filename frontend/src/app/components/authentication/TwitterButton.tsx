import { Button, ButtonProps } from '@mantine/core';
import { IconBrandX } from '@tabler/icons-react';

export function TwitterButton(props: ButtonProps & React.ComponentPropsWithoutRef<'button'>) {
  return (
    <Button
      leftSection={<IconBrandX style={{ width: '1rem', height: '1rem' }} color="#00ACEE" />}
      variant="default"
      {...props}
    />
  );
}