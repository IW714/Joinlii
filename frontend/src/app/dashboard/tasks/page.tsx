'use client';

import ProtectedRoute from '../../components/ProtectedRoute';

export default function TaskList() {
  return (
    <ProtectedRoute>
      <h1>Welcome to Task List</h1>
      {/* Home page content goes here */}
    </ProtectedRoute>
  );
}