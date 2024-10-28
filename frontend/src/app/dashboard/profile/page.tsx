'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../components/AuthContext';
import { useRouter } from 'next/navigation';
import { TextInput, Button, Paper, Alert, Stack } from '@mantine/core';

export default function ProfilePage() {
  const { accessToken, loading: authLoading } = useAuth(); // Destructure loading
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [name, setName] = useState<string>('');
  const [preferences, setPreferences] = useState<any>({});

  useEffect(() => {
    const fetchProfile = async () => {
      // Log the accessToken to verify it's available
      console.log('Access Token:', accessToken);

      if (!accessToken) {
        setErrorMessage('No access token found. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });

        console.log('Profile Fetch Response Status:', response.status);

        if (response.ok) {
          const data = await response.json();
          console.log('Profile Data:', data);
          setProfile(data);
          setName(data.name);
          setPreferences(data.preferences || {});
          setLoading(false);
        } else {
          // Optionally, extract error message from response
          const errorData = await response.json();
          console.log('Profile Fetch Error:', errorData);
          setErrorMessage(errorData.message || 'Failed to fetch profile');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setErrorMessage('An error occurred while fetching your profile.');
        setLoading(false);
      }
    };

    // Only fetch profile if authentication state has been initialized
    if (!authLoading) {
      fetchProfile();
    }
  }, [accessToken, authLoading]); // Depend on authLoading

  const handleSave = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ name, preferences }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Profile Updated:', data);
        setProfile(data);
        setErrorMessage(null);
      } else {
        // Optionally, extract error message from response
        const errorData = await response.json();
        console.log('Profile Update Error:', errorData);
        setErrorMessage(errorData.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage('An error occurred while updating your profile.');
    }
  };

  // Render a loading state while fetching profile or initializing auth
  if (authLoading || loading) {
    return <p>Loading...</p>;
  }

  return (
    <Paper radius="md" p="xl" withBorder style={{ maxWidth: 600, margin: 'auto' }}>
      <h1>Your Profile</h1>

      {errorMessage && (
        <Alert title="Error" color="red" mb="lg">
          {errorMessage}
        </Alert>
      )}

      <Stack>
        <TextInput
          label="Name"
          value={name}
          onChange={(event) => setName(event.currentTarget.value)}
        />

        {/* Add inputs for preferences as needed */}
        {/* Example: Theme Preference */}
        {/* <Select
          label="Theme"
          value={preferences.theme || ''}
          onChange={(value) => setPreferences({ ...preferences, theme: value })}
          data={[
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
          ]}
        /> */}
      </Stack>

      <Button mt="md" onClick={handleSave}>
        Save Changes
      </Button>
    </Paper>
  );
}
