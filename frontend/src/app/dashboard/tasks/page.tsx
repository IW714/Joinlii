'use client';

import ProtectedRoute from '../../components/ProtectedRoute';
import KanbanBoard  from '../../components/task/KanbanBoard';

export default function TaskList() {
  return (
    <ProtectedRoute>
      <KanbanBoard />
    </ProtectedRoute>
  );
}