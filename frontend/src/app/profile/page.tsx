'use client';

import ProtectedRoute from '../components/ProtectedRoute';

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <h1>Your Profile</h1>
      {/* Profile content goes here */}
    </ProtectedRoute>
  );
}