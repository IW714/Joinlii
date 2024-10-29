'use client';

import React, { useState, useEffect } from 'react';
import {
    Card,
    Text,
    Group,
    Image,
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
    
        // Return if task was dropped in the same position
        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) {
            return;
        }
    
        const movedTask = sourceColumn.tasks.find((task) => task.id === draggableId);
        if (!movedTask) return;
    
        // Reordering within the same column
        if (source.droppableId === destination.droppableId) {
            const newTasks = Array.from(sourceColumn.tasks);
            newTasks.splice(source.index, 1);
            newTasks.splice(destination.index, 0, movedTask);
    
            setColumns((prevColumns) => ({
                ...prevColumns,
                [sourceColumn.id]: {
                    ...sourceColumn,
                    tasks: newTasks,
                },
            }));
    
            // TODO: currently, order of tasks is not saved. Will need to add a task order field in the backend
            return;
        }
    
        // Moving to a different column
        const newSourceTasks = Array.from(sourceColumn.tasks);
        newSourceTasks.splice(source.index, 1);
    
        const newDestTasks = Array.from(destColumn.tasks);
        newDestTasks.splice(destination.index, 0, { ...movedTask, status: destColumn.id as Task['status'] });
    
        setColumns((prevColumns) => ({
            ...prevColumns,
            [sourceColumn.id]: {
                ...sourceColumn,
                tasks: newSourceTasks,
            },
            [destColumn.id]: {
                ...destColumn,
                tasks: newDestTasks,
            },
        }));
    
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
                const errorData = await response.json();
                console.error('Failed to update task status:', errorData.message || response.statusText);
                // Revert changes in UI
                fetchTasks();
            }
        } catch (err) {
            console.error('Error updating task status:', err);
            // Revert changes in UI
            fetchTasks();
        }
    };
    

    const openCreateModal = () => setIsCreateModalOpen(true);
    const closeCreateModal = () => {
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

            if (response.ok) { 
                const createdTask: Task = await response.json();
                // Add new task to appropriate column
                setColumns((prev) => ({
                    ...prev,
                    [createdTask.status]: {
                        ...prev[createdTask.status],
                        tasks: [createdTask, ...prev[createdTask.status].tasks],
                    },
                }));
                closeCreateModal();
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

    const handleEditTask = async () => {
        if (!editTask) return;

        try { 
            const { title, content, status, dueDate, images, group } = editTask;
            
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/task/${editTask.id}`, {
                method: 'PUT', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ title, content, status, dueDate, images: images.map(img => img.url), groupId: group ? group.id : null }),
            });

            if (response.ok) { 
                const updatedTask: Task = await response.json();
                // Update task in columns
                setColumns((prev) => {
                    const newColumns = { ...prev };
                    // Remove task from previous column
                    Object.keys(newColumns).forEach((colId) => {
                        newColumns[colId].tasks = newColumns[colId].tasks.filter(task => task.id !== updatedTask.id);
                    });
                    // Add task to updated column
                    newColumns[updatedTask.status].tasks.unshift(updatedTask);
                    return newColumns;
                });
                closeEditModal();
            } else {
                const errorData = await response.json();
                console.error('Failed to update task:', errorData.message);
            }
        } catch (err) {
            console.error('Error updating task:', err);
        }
    };

    if (loading || isFetching) {
        return (
            <div className="relative">
                <LoadingOverlay visible={true} />
                <div className="flex items-center justify-center min-h-screen bg-gray-50">
                    <Image
                    src="/assets/joinlii.gif"
                    alt="Loading..."
                    width={700}
                    height={700}
                    />
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <Text>Please log in to view your tasks.</Text>
            </div>
        );
    }
    
    return (
        <div className="p-4">
            <Group align="apart" mb="md">
                <Button onClick={openCreateModal}>
                    <IconPlus size={16} />
                    Add Task
                </Button>
                {/* Future: Add filters or group selectors here */}
            </Group>

            {/* Kanban Board */}
            <DragDropContext onDragEnd={handleDragEnd}>
                <Group grow align="start">

                    {/* Columns */}
                    {Object.values(columns).map((column) => (
                        <div
                            key={column.id}
                            style={{
                                background: '#fafafa', 
                                padding: '16px', 
                                paddingTop: '24px', 
                                borderRadius: '4px',
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column', 
                                maxWidth: '300px',
                            }}
                        >
                            <Text fw={500} mb="sm">
                                {column.title}
                            </Text>

                            <Droppable droppableId={column.id} key={column.id}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        style={{
                                            background: snapshot.isDraggingOver ? '#f0f0f0' : '#fafafa', 
                                            padding: '8px', 
                                            borderRadius: '4px',
                                            minHeight: '0px',
                                            flex: 1,
                                            display: 'flex',
                                            flexDirection: 'column', 
                                        }}
                                    >
                                        <div className="grow">
                                            {/* Tasks */}
                                            {column.tasks.map((task, index) => (
                                                <Draggable key={task.id} draggableId={task.id} index={index}>
                                                    {(provided, snapshot) => (
                                                        <Card
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            shadow="sm"
                                                            padding="lg"
                                                            mb="sm"
                                                            style={{
                                                                userSelect: 'none',
                                                                backgroundColor: snapshot.isDragging ? '#e0e0e0' : '#ffffff',
                                                                ...provided.draggableProps.style,
                                                            }}
                                                        >   

                                                            <Card.Section>
                                                                {/* Placeholder Images TODO:*/}
                                                                <Image
                                                                    src={
                                                                        task.images.length > 0
                                                                            ? task.images[0].url
                                                                            : `https://picsum.photos/seed/${encodeURIComponent(task.id)}/600/400`
                                                                    }
                                                                    alt={task.title}
                                                                    height={100}
                                                                    fit="cover"
                                                                    radius="sm"
                                                                    mb="sm"style={{
                                                                        borderBottomLeftRadius: '0px', 
                                                                        borderBottomRightRadius: '0px',
                                                                    }}
                                                                />
                                                            </Card.Section>

                                                            
                                                            <Group align="apart" mb="xs">
                                                                <Text fw={500}>{task.title}</Text>
                                                                <Badge color="green" variant="light">
                                                                    {task.status.replace('_', ' ')}
                                                                </Badge>
                                                                {/* Edit Button */}
                                                                <ActionIcon onClick={() => openEditModal(task)} aria-label="Edit Task">
                                                                    <IconEdit size={16} />
                                                                </ActionIcon>
                                                            </Group>

                                                            <Text size="sm" c="dimmed">
                                                                {task.content}
                                                            </Text>

                                                            {task.dueDate && (
                                                                <Badge c="red" variant="light" mt="sm">
                                                                    Due: {new Date(task.dueDate).toLocaleDateString()} 
                                                                </Badge>
                                                            )}
                                                        </Card>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    ))}
                </Group>
            </DragDropContext>

            {/* Modal for Creating a New Task */}
            <Modal opened={isCreateModalOpen} onClose={closeCreateModal} title="Create New Task">
                <Stack gap="md">   
                    <TextInput
                        label="Title"
                        placeholder="Task title"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.currentTarget.value})}
                        required
                    />
                    <Textarea
                        label="Content"
                        placeholder="Task description"
                        value={newTask.content}
                        onChange={(e) => setNewTask({ ...newTask, content: e.currentTarget.value})}
                        required
                    />
                    <Select
                        label="Status"
                        placeholder="Select status"
                        data={statusOptions}
                        value={newTask.status}
                        onChange={(value) => setNewTask({ ...newTask, status: value || 'PENDING'})}
                        required
                    />
                    <TextInput
                        label="Due Date"
                        placeholder="YYYY-MM-DD" // TODO: add date picker, change date format
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.currentTarget.value })}
                        type="date"
                    />
                    <Button onClick={handleCreateTask}>Create Task</Button>
                </Stack>
            </Modal>

            {/* Modal for Editing an Existing Task 
                TODO: Change placeholder to prev info */} 
            <Modal opened={isEditModalOpen} onClose={closeEditModal} title="Edit Task">
                {editTask && (
                    <Stack gap="md">   
                    <TextInput
                        label="Title"
                        placeholder="Task title"
                        value={editTask.title}
                        onChange={(e) => setEditTask({ ...editTask, title: e.currentTarget.value})}
                        required
                    />
                    <Textarea
                        label="Content"
                        placeholder="Task description"
                        value={editTask.content}
                        onChange={(e) => setEditTask({ ...editTask, content: e.currentTarget.value})}
                        required
                    />
                    <Select
                        label="Status"
                        placeholder="Select status"
                        data={statusOptions}
                        value={editTask.status}
                        onChange={(value) => setEditTask({ ...editTask, status: value as 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' || 'PENDING'})}
                        required
                    />
                    <TextInput
                        label="Due Date"
                        placeholder="YYYY-MM-DD" // TODO: add date picker, change date format
                        value={editTask.dueDate ? editTask.dueDate.slice(0, 10) : ''}
                        onChange={(e) => setEditTask({ ...editTask, dueDate: e.currentTarget.value })}
                        type="date"
                    />
                    {/* future TODO: Add image upload or selection here */}
                    <Button onClick={handleEditTask}>Save Changes</Button>
                </Stack>
                )}
            </Modal>
        </div>
    )
}