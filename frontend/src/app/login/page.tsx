'use client';

import AuthenticationForm from '../components/authentication/AuthenticationForm';

export default function LoginPage() {
  return (
    <div style={{ maxWidth: 400, margin: 'auto', paddingTop: '100px' }}>
      <AuthenticationForm />
    </div>
  );
}