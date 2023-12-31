import { useState, useContext } from "react";
import { Form, Icon, Button, Card } from "semantic-ui-react";
import "../App.css";
import { v4 as uuidv4 } from "uuid";
import { Task } from "../types";
import DeleteAllTasksModal from "./DeleteAllTasksModal";
import { TaskListContext } from "../Context";

const ToDoApp = () => {

    // Context
    const {taskList, setTaskList} = useContext(TaskListContext)

    // State
    const [inputValue, setInputValue] = useState('');
    const [taskAlreadyExists, setTaskAlreadyExists] = useState(false);
    const [deleteAllModalOpen, setDeleteAllModalOpen] = useState(false);
    
    const handleTaskSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newTask: Task = {
            id: uuidv4(),
            content: inputValue,
            completed: false,
            created_at: new Date().toUTCString(),
        };

        if (newTask.content && !doesContentExist(newTask.content)) {
            setTaskList((prevTaskList) => [...prevTaskList, newTask]);
            if (taskAlreadyExists) setTaskAlreadyExists(false);
        } else if (doesContentExist(newTask.content)) {
            setTaskAlreadyExists(true);
        }
        setInputValue('');
    }

    const AddTask = () => {
        return (
            <div className="AddToDo">
                <label htmlFor="taskInput">Add a task:</label>
                <Form onSubmit={(e) => handleTaskSubmit(e)}>
                    <input
                        id="taskInput"
                        name="input"
                        placeholder="Task..."
                        type="text"
                        autoComplete="off"
                        autoFocus={true}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                    {taskAlreadyExists && <label className="TaskAlreadyExists">* Task already added</label>}
                    <div className="AddToDoBtn">
                        <Button type="submit" primary>
                            Add
                        </Button>
                    </div>
                    <div className="DeleteAllTasksBtn">
                        <DeleteAllTasksBtn />
                    </div>
                </Form>
            </div>
        );
    }

    const DeleteAllTasksBtn = () => {
        return (
            <Button
                type="button"
                onClick={() => setDeleteAllModalOpen(true)}
                negative
            >
                Delete All
            </Button>
        );
    };

    const deleteTask = (taskToDelete: Task) => {
        const updatedTaskList = taskList.filter((task) => task.id !== taskToDelete.id);

        if (updatedTaskList.length === taskList.length) {
            console.warn(`Failed to remove task from the list: ${taskToDelete.content}`);
            return;
        }

        setTaskList(updatedTaskList);
    }

    const handleCheckbox = (taskToCheck: Task) => {
        setTaskList((prevTaskList) => {
            return prevTaskList.map((task) => {
                if (taskToCheck.id === task.id) {
                    return {
                        ...task,
                        completed: !task.completed,
                    };
                }
                return task;
            });
        });
    };

    const doesContentExist = (newTaskContent: string) => {
        return taskList.some((task) => task.content === newTaskContent);    
    };

    const displayTasks = () => {
        let listItems: JSX.Element[] = [];
        taskList.forEach((task) => {
            listItems.push(
                <Card key={task.id} color={task.completed ? "green" : "grey"} raised>
                    <Card.Content>
                        <Icon className="DeleteBtn"
                            name="trash"
                            color="red"
                            onClick={() => deleteTask(task)}
                        />
                        <Card.Header className={task.completed ? "TaskContentComplete" : "TaskContent"}>
                            {task.content}
                        </Card.Header>
                        <Card.Meta>Created at: {task.created_at.slice(17, -7)}</Card.Meta>
                        <Card.Description>
                            Completed: <input className="CompletedCheckbox"
                                name="complete"
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => handleCheckbox(task)}
                            />
                        </Card.Description>
                    </Card.Content>
                </Card>
            )
        })
        return listItems;
    };

    const TaskList = () => {
        return (
            <div className="Tasks">
                <Card.Group centered stackable>
                    {taskList && displayTasks()}
                </Card.Group>
            </div>
        );
    };

    return (
        <>
            <div className="ToDoApp">
                <DeleteAllTasksModal
                    isOpen={deleteAllModalOpen}
                    setOpen={setDeleteAllModalOpen}
                    setTaskList={setTaskList}
                />
                <div className="AddTask">
                    <AddTask />
                </div>
                <div className="TaskList">
                    <TaskList />
                </div>
            </div>
        </>
    )
}

export default ToDoApp;