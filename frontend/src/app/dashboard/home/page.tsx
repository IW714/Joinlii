'use client';

import ProtectedRoute from '../../components/ProtectedRoute';

export default function HomePage() {
  return (
    <ProtectedRoute>
      <h1>Welcome to Your Dashboard</h1>
      {/* Home page content goes here */}
    </ProtectedRoute>
  );
}