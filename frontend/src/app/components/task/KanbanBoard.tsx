'use client';

import React, { useState, useEffect } from 'react';
import {
    Card,
    Image,
    Text,
    Group,
    Badge,
    Button,
    ActionIcon,
    Modal,
    TextInput,
    Textarea,
    Select,
    Stack,
    LoadingOverlay
} from '@mantine/core';
import {
    IconHeart,
    IconGripVertical,
    IconPlus,
    IconX,
    IconEdit,
} from '@tabler/icons-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useAuth } from '../AuthContext';

// TODO: add interfaces to model folder
interface Task {
    id: string;
    title: string;
    content: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
    dueDate: string | null;
    createdAt: string;
    updatedAt: string;
    userId: string;
    images: {id: string; url: string}[];
    group: {id: string; name: string} | null;
}

interface Column {
    id: string;
    title: string;
    tasks: Task[];
}

const statusOptions = [
    { value: 'PENDING', label: 'Pending' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'COMPLETED', label: 'Completed' },
]

export default function KanbanBoard() {
    const { isAuthenticated, accessToken, loading } = useAuth();
    const [columns, setColumns] = useState<Record<string, Column>>({});
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [newTask, setNewTask] = useState<{ title: string; content: string; status: string; dueDate: string }>({
        title: '',
        content: '',
        status: 'PENDING',
        dueDate: '',
    });
    const [editTask, setEditTask] = useState<Task | null>(null);
    const [isFetching, setIsFetching] = useState<boolean>(true);

    useEffect(() => {
        if (isAuthenticated && accessToken) {
            fetchTasks();
        }
    }, [isAuthenticated, accessToken]);

    const fetchTasks = async () => {
        setIsFetching(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/task`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                }
            });

            if (response.ok) { // TODO: there might be an issue, will find out when testing
                const tasks = await response.json();

                const initialColumns: Record<string, Column> = {
                    PENDING: { id: 'PENDING', title: 'Pending', tasks: [] },
                    IN_PROGRESS: { id: 'IN_PROGRESS', title: 'In Progress', tasks: [] },
                    COMPLETED: { id: 'COMPLETED', title: 'Completed', tasks: [] },
                };

                tasks.forEach((task: Task) => {
                    if (initialColumns[task.status]) {
                        initialColumns[task.status].tasks.push(task);
                    }
                });

                setColumns(initialColumns);
            } else {
                console.error('Error fetching tasks:', response.statusText);
            }
        } catch (err) {
            console.error('Error fetching tasks:', err);
        } finally {
            setIsFetching(false);
        }
    };

    const handleDragEnd = async (result: DropResult) => {
        const { source, destination, draggableId } = result;

        // Check if task was dropped outside of a droppable area
        if (!destination) return;

        const sourceColumn = columns[source.droppableId];
        const destColumn = columns[destination.droppableId];

        // Check if source and destination columns exist
        if (!sourceColumn || !destColumn) return;

        // Return if task was dropped in the same column and position
        if (sourceColumn.id === destColumn.id && source.index === destination.index) return;

        const movedTask = sourceColumn.tasks.find((task) => task.id === draggableId);
        if (!movedTask) return;

        // Remove from source column
        const newSourceTasks = [...sourceColumn.tasks];
        newSourceTasks.splice(source.index, 1);

        // Add to destination column
        const newDestTasks = [...destColumn.tasks];
        newDestTasks.splice(destination.index, 0, { ...movedTask, status: destColumn.id as Task['status'] });  
        
        setColumns({
            ...columns,
            [sourceColumn.id]: { ...sourceColumn, tasks: newSourceTasks },
            [destColumn.id]: { ...destColumn, tasks: newDestTasks },
        });

        // Update task status in backend
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/task/${draggableId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`, 
                }, 
                body: JSON.stringify({ status: destColumn.id }),
            });

            if (!response.ok) {
                console.error('Failed to update task status:', response.statusText);
                // TODO: revert changes in UI
                fetchTasks();
            }
        } catch (err) {
            console.error('Error updating task status:', err);
            // TODO: revert changes in UI
            fetchTasks();
        }
    }; 

    const openCreateModal = () => setIsCreateModalOpen(true);
    const closeCreateModel = () => {
        setIsCreateModalOpen(false);
        setNewTask({ title: '', content: '', status: 'PENDING', dueDate: '' });
    }; 

    const handleCreateTask = async () => {
        try {
            const { title, content, status, dueDate } = newTask;
            const images = [`https://picsum.photos/600/400?random=${Date.now()}`]; // Placeholder images

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/task`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                }, 
                body: JSON.stringify({ title, content, status, dueDate, images, groupId: null }),
            });

            if (response.ok) { // TODO: there might be an issue, will find out when testing
                const createdTask: Task = await response.json();
                // Add new task to appropriate column
                setColumns((prev) => ({
                    ...prev,
                    [createdTask.status]: {
                        ...prev[createdTask.status],
                        tasks: [createdTask, ...prev[createdTask.status].tasks],
                    },
                }));
                closeCreateModel();
            } else {
                const errorData = await response.json();
                console.error('Failed to create task:', errorData.message);
            }
        } catch (err) {
            console.error('Error creating task:', err);
        }
    };

    const openEditModal = (task: Task) => {
        setEditTask(task);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditTask(null);
    };

    // TODO: handleEditTask, loading and fetching screen (gif), error handling for auth, return statement
}