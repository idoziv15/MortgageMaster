import React, {useState, useEffect} from "react";
import {
    Box,
    Flex,
    Text,
    Icon,
    useColorModeValue,
    Checkbox,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    IconButton,
    Input,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure
} from "@chakra-ui/react";
import {MdCheckBox, MdMoreVert, MdDelete, MdEdit, MdCheck, MdClose} from "react-icons/md";
import Card from "../../../components/card/Card.js";
import TasksMenu from "./TasksMenu";
import IconBox from "../../../components/icons/IconBox";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import axios from "axios";

const getToken = () => {
    return sessionStorage.getItem('token') || localStorage.getItem('token');
};

const fetchUserTasks = async () => {
    const token = getToken();
    if (token) {
        try {
            const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/tasks`, {
                headers: {Authorization: `Bearer ${token}`}
            });
            return response.data.tasks || [];
        } catch (error) {
            console.error('Failed to fetch user tasks:', error);
            throw error;
        }
    } else {
        throw new Error('No token found');
    }
};

const saveTask = async (taskContent) => {
    const token = getToken();
    if (token) {
        try {
            const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/tasks`,
                {content: taskContent},
                {headers: {Authorization: `Bearer ${token}`}}
            );
            return response.data;
        } catch (error) {
            console.error('Failed to save task:', error);
            throw error;
        }
    } else {
        throw new Error('No token found');
    }
};

const editTask = async (taskId, newContent) => {
    const token = getToken();
    if (token) {
        try {
            await axios.put(`${process.env.REACT_APP_SERVER_URL}/tasks/${taskId}`,
                {content: newContent},
                {headers: {Authorization: `Bearer ${token}`}}
            );
        } catch (error) {
            console.error('Failed to edit task:', error);
            throw error;
        }
    } else {
        throw new Error('No token found');
    }
};

const deleteTask = async (taskId) => {
    const token = getToken();
    if (token) {
        try {
            await axios.delete(`${process.env.REACT_APP_SERVER_URL}/task/${taskId}`, {
                headers: {Authorization: `Bearer ${token}`}
            });
        } catch (error) {
            console.error('Failed to delete task:', error);
            throw error;
        }
    } else {
        throw new Error('No token found');
    }
};

const deleteAllTasks = async () => {
    const token = getToken();
    if (token) {
        try {
            await axios.delete(`${process.env.REACT_APP_SERVER_URL}/tasks`, {
                headers: {Authorization: `Bearer ${token}`}
            });
        } catch (error) {
            console.error('Failed to delete all tasks:', error);
            throw error;
        }
    } else {
        throw new Error('No token found');
    }
};

const updateTaskCompletion = async (taskId, completed) => {
    const token = getToken();
    if (token) {
        try {
            await axios.put(`${process.env.REACT_APP_SERVER_URL}/tasks/${taskId}/completion`,
                {completed},
                {headers: {Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'}}
            );
        } catch (error) {
            console.error('Failed to update task completion status:', error);
            throw error;
        }
    } else {
        throw new Error('No token found');
    }
};

const deleteSelectedTasks = async (taskIds) => {
    const token = getToken();
    if (token) {
        try {
            await axios.post(`${process.env.REACT_APP_SERVER_URL}/tasks/delete-selected`,
                {taskIds},
                {headers: {Authorization: `Bearer ${token}`}}
            );
        } catch (error) {
            console.error('Failed to delete selected tasks:', error);
            throw error;
        }
    } else {
        throw new Error('No token found');
    }
};

export default function Tasks(props) {
    const {user, ...rest} = props;
    const textColor = useColorModeValue("secondaryGray.900", "white");
    const boxBg = useColorModeValue("secondaryGray.300", "navy.700");
    const brandColor = useColorModeValue("brand.500", "brand.400");

    const [tasks, setTasks] = useState([]);
    const [newTaskContent, setNewTaskContent] = useState("");
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editingTaskContent, setEditingTaskContent] = useState("");
    const {isOpen, onOpen, onClose} = useDisclosure();

    useEffect(() => {
        const loadTasks = async () => {
            try {
                const tasksData = await fetchUserTasks();
                setTasks(tasksData);
            } catch (error) {
                console.error('Failed to load tasks:', error);
            }
        };
        loadTasks();
    }, []);

    const handleSaveTask = async () => {
        if (newTaskContent.trim() === "") return;
        try {
            const newTask = await saveTask(newTaskContent);
            setTasks([...tasks, newTask]);
            setNewTaskContent("");
            onClose();
        } catch (error) {
            console.error('Failed to save new task:', error);
        }
    };

    const handleEditSave = async () => {
        if (editingTaskContent.trim() === "") {
            try {
                await deleteTask(editingTaskId);
                setTasks(tasks.filter(task => task.id !== editingTaskId));
            } catch (error) {
                console.error('Failed to delete task:', error);
            }
            return;
        }
        try {
            await editTask(editingTaskId, editingTaskContent);
            const updatedTasks = tasks.map(task =>
                task.id === editingTaskId ? {...task, content: editingTaskContent, isEditing: false} : task
            );
            setTasks(updatedTasks);
            setEditingTaskId(null);
            setEditingTaskContent("");
        } catch (error) {
            console.error('Failed to edit task:', error);
        }
    };

    const handleEditCancel = () => {
        toggleEditTask(editingTaskId);
    };

    const handleOnDragEnd = async (result) => {
        if (!result.destination) return;

        const reorderedTasks = Array.from(tasks);
        const [reorderedItem] = reorderedTasks.splice(result.source.index, 1);
        reorderedTasks.splice(result.destination.index, 0, reorderedItem);

        setTasks(reorderedTasks);
    };

    const toggleTaskCompletion = async (taskId) => {
        const task = tasks.find(task => task.id === taskId);
        try {
            await updateTaskCompletion(taskId, !task.completed);
            const updatedTasks = tasks.map(t =>
                t.id === taskId ? {...t, completed: !t.completed} : t
            );
            setTasks(updatedTasks);
        } catch (error) {
            console.error('Failed to update task completion status:', error);
        }
    };

    const removeCompletedTasks = async () => {
        try {
            const completedTaskIds = tasks.filter(task => task.completed).map(task => task.id);
            await deleteSelectedTasks(completedTaskIds);
            setTasks(tasks.filter(task => !task.completed));
        } catch (error) {
            console.error('Failed to remove completed tasks:', error);
        }
    };

    const sortTasksAlphabetically = () => {
        const sortedTasks = [...tasks].sort((a, b) => a.content.localeCompare(b.content));
        setTasks(sortedTasks);
    };

    const markAllAsCompleted = async () => {
        try {
            await Promise.all(tasks.map(task => updateTaskCompletion(task.id, true)));
            const updatedTasks = tasks.map(task => ({...task, completed: true}));
            setTasks(updatedTasks);
        } catch (error) {
            console.error('Failed to mark all tasks as completed:', error);
        }
    };

    const clearAllTasks = async () => {
        try {
            await deleteAllTasks();
            setTasks([]);
        } catch (error) {
            console.error('Failed to clear all tasks:', error);
        }
    };

    const toggleEditTask = (taskId) => {
        const updatedTasks = tasks.map(task =>
            task.id === taskId ? {...task, isEditing: !task.isEditing} : task
        );
        setTasks(updatedTasks);
        if (taskId) {
            const taskToEdit = tasks.find(task => task.id === taskId);
            setEditingTaskId(taskId);
            setEditingTaskContent(taskToEdit ? taskToEdit.content : "");
        } else {
            setEditingTaskId(null);
            setEditingTaskContent("");
        }
    };

    const handleInputKeyDown = (e, taskId) => {
        if (e.key === 'Enter') {
            if (taskId) {
                // Editing task
                handleEditSave();
            } else {
                // Adding new task
                handleSaveTask();
            }
        }
    };

    return (
        <Card p="20px" align="center" direction="column" w="100%" {...rest}>
            <Flex alignItems="center" w="100%">
                <IconBox
                    me="12px"
                    w="38px"
                    h="38px"
                    bg={boxBg}
                    icon={<Icon as={MdCheckBox} color={brandColor} w="24px" h="24px"/>}
                />
                <Text color={textColor} fontSize="lg" fontWeight="700">
                    Tasks
                </Text>
                <Flex ml="auto">
                    <TasksMenu
                        addTask={onOpen}
                        removeCompletedTasks={removeCompletedTasks}
                        sortTasksAlphabetically={sortTasksAlphabetically}
                        markAllAsCompleted={markAllAsCompleted}
                        clearAllTasks={clearAllTasks}
                    />
                </Flex>
            </Flex>

            <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="tasks">
                    {(provided) => (
                        <Box px="11px" ref={provided.innerRef} {...provided.droppableProps}>
                            {tasks.map((task, index) => (
                                <Draggable key={task.id} draggableId={task.id} index={index}>
                                    {(provided, snapshot) => (
                                        <Flex
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            bg={snapshot.isDragging ? "gray.100" : "inherit"}
                                            borderRadius="md"
                                            p="10px"
                                            justifyContent="space-between"
                                            alignItems="center"
                                        >
                                            <Checkbox
                                                me="16px"
                                                colorScheme="brandScheme"
                                                isChecked={task.completed}
                                                onChange={() => toggleTaskCompletion(task.id)}
                                            />
                                            {task.isEditing ? (
                                                <Flex align="center" w="100%">
                                                    <Input
                                                        value={editingTaskContent}
                                                        onChange={(e) => setEditingTaskContent(e.target.value)}
                                                        onKeyDown={(e) => handleInputKeyDown(e, editingTaskId)}
                                                        w="80%"
                                                    />
                                                    <IconButton
                                                        aria-label="Save"
                                                        icon={<MdCheck/>}
                                                        onClick={handleEditSave}
                                                        ml="10px"
                                                    />
                                                    <IconButton
                                                        aria-label="Cancel"
                                                        icon={<MdClose/>}
                                                        onClick={handleEditCancel}
                                                        ml="10px"
                                                    />
                                                </Flex>
                                            ) : (
                                                <Text
                                                    as={task.completed ? "s" : "span"}
                                                    fontWeight="bold"
                                                    color={textColor}
                                                    fontSize="md"
                                                >
                                                    {task.content}
                                                </Text>
                                            )}
                                            <Menu>
                                                <MenuButton as={IconButton} icon={<MdMoreVert/>} aria-label="Options"/>
                                                <MenuList minW="150px">
                                                    <MenuItem
                                                        icon={<MdEdit color="blue.500"/>}
                                                        onClick={() => toggleEditTask(task.id)}
                                                    >
                                                        {task.isEditing ? "Finish" : "Edit"}
                                                    </MenuItem>
                                                    <MenuItem
                                                        icon={<MdDelete color="red.500"/>}
                                                        onClick={() => {
                                                            deleteTask(task.id)
                                                                .then(() => setTasks(tasks.filter(t => t.id !== task.id)))
                                                                .catch(error => console.error('Failed to delete task:', error));
                                                        }}
                                                    >
                                                        Delete
                                                    </MenuItem>
                                                </MenuList>
                                            </Menu>
                                        </Flex>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </Box>
                    )}
                </Droppable>
            </DragDropContext>

            {/* Add Task Modal */}
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Add New Task</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <Input
                            placeholder="Task name"
                            value={newTaskContent}
                            onChange={(e) => setNewTaskContent(e.target.value)}
                            onKeyDown={(e) => handleInputKeyDown(e)}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleSaveTask}>
                            Save
                        </Button>
                        <Button variant="ghost" onClick={onClose}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Card>
    );
}
