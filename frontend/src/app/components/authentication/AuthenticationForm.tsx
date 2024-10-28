'use client';

import { useToggle, upperFirst } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Divider,
  Checkbox,
  Anchor,
  Stack,
  Alert,
} from '@mantine/core';
import { GoogleButton } from './GoogleButton';
import { TwitterButton } from './TwitterButton';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '../AuthContext';

export default function AuthenticationForm(props: PaperProps) {
  const router = useRouter();
  const { login } = useAuth();
  const [type, toggle] = useToggle(['login', 'register']);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      password: '',
      terms: false,
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val) =>
        val.length <= 6 ? 'Password should include at least 6 characters' : null,
      name: (val) => (type === 'register' && !val ? 'Name is required' : null),
      terms: (val) => (type === 'register' && !val ? 'You must accept the terms' : null),
    },
  });

  async function handleSubmit(values: typeof form.values) {
    const { email, password, name } = values;
    setErrorMessage(null); // Reset error message

    try {
      if (type === 'login') {
        await login(email, password);
        router.push('/dashboard/profile'); // Redirect after successful login
      } else {
        // Registration logic
        console.log('Attempting to register:', { email, password, name });
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name }),
        });

        console.log('Registration response status:', response.status);

        if (response.ok) {
          // Automatically log in the user after registration
          await login(email, password);
          router.push('/dashboard/profile');
        } else {
          const errorData = await response.json();
          console.error('Registration error data:', errorData);
          setErrorMessage(errorData.message || 'Registration failed');
        }
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      setErrorMessage(error.message);
    }
  }

  return (
    <Paper radius="md" p="xl" withBorder {...props}>
      <Text size="lg" fw={500}>
        Welcome to Your App, {type} with
      </Text>

      <Group grow mb="md" mt="md">
        <GoogleButton radius="xl">Google</GoogleButton>
        <TwitterButton radius="xl">Twitter</TwitterButton>
      </Group>

      <Divider label="Or continue with email" labelPosition="center" my="lg" />

      {errorMessage && (
        <Alert title="Authentication Error" color="red" mb="sm">
          {errorMessage}
        </Alert>
      )}

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          {type === 'register' && (
            <TextInput
              label="Name"
              name="name"
              placeholder="Your name"
              value={form.values.name}
              onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
              error={form.errors.name}
              radius="md"
            />
          )}

          <TextInput
            required
            label="Email"
            name="email"
            placeholder="hello@example.com"
            value={form.values.email}
            onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
            error={form.errors.email}
            radius="md"
          />

          <PasswordInput
            required
            label="Password"
            name="password"
            placeholder="Your password"
            value={form.values.password}
            onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
            error={form.errors.password}
            radius="md"
          />

          {type === 'register' && (
            <Checkbox
              label="I accept terms and conditions"
              checked={form.values.terms}
              onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)}
              error={form.errors.terms}
            />
          )}
        </Stack>

        <Group position="apart" mt="xl">
          <Anchor
            component="button"
            type="button"
            color="dimmed"
            onClick={() => toggle()}
            size="xs"
          >
            {type === 'register'
              ? 'Already have an account? Login'
              : "Don't have an account? Register"}
          </Anchor>
          <Button type="submit" radius="xl">
            {upperFirst(type)}
          </Button>
        </Group>
      </form>
    </Paper>
  );
}