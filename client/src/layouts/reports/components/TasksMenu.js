import React from "react";
import {
    Icon,
    Flex,
    Text,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
} from "@chakra-ui/react";
import {MdOutlineMoreHoriz, MdOutlineAdd, MdDelete, MdSort, MdCheck, MdClearAll, MdFilterList} from "react-icons/md";

export default function TaskMenu({addTask, removeCompletedTasks, sortTasksAlphabetically, markAllAsCompleted,
                                     clearAllTasks}) {

    return (
        <Menu>
            <MenuButton>
                <Icon as={MdOutlineMoreHoriz} w='24px' h='24px'/>
            </MenuButton>
            <MenuList>
                <MenuItem onClick={addTask}>
                    <Flex align='center'>
                        <Icon as={MdOutlineAdd} h='16px' w='16px' me='8px'/>
                        <Text fontSize='sm' fontWeight='400'>Add Task</Text>
                    </Flex>
                </MenuItem>
                <MenuItem onClick={removeCompletedTasks}>
                    <Flex align='center'>
                        <Icon as={MdDelete} h='16px' w='16px' me='8px'/>
                        <Text fontSize='sm' fontWeight='400'>Remove Completed</Text>
                    </Flex>
                </MenuItem>
                <MenuItem onClick={sortTasksAlphabetically}>
                    <Flex align='center'>
                        <Icon as={MdSort} h='16px' w='16px' me='8px'/>
                        <Text fontSize='sm' fontWeight='400'>Sort</Text>
                    </Flex>
                </MenuItem>
                <MenuItem onClick={markAllAsCompleted}>
                    <Flex align='center'>
                        <Icon as={MdCheck} h='16px' w='16px' me='8px'/>
                        <Text fontSize='sm' fontWeight='400'>Mark All Completed</Text>
                    </Flex>
                </MenuItem>
                <MenuItem onClick={clearAllTasks}>
                    <Flex align='center'>
                        <Icon as={MdClearAll} h='16px' w='16px' me='8px'/>
                        <Text fontSize='sm' fontWeight='400'>Clear All Tasks</Text>
                    </Flex>
                </MenuItem>
            </MenuList>
        </Menu>
    );
}
