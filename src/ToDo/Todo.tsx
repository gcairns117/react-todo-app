import { useState } from "react";
import { Form, Icon, Button, Card } from "semantic-ui-react";
import "./Todo.css";
import { v4 as uuidv4 } from "uuid";
import { Task } from "./types";

const Todo = () => {

    // TODO:
    // check if task exists function
    // stop new task being created if task with === newTask.content has already been created
    // use localStorage to maintain list between reloads?

    // State
    const [taskList, setTaskList] = useState<Task[]>([]);
    const [inputValue, setInputValue] = useState<string>('');
    
    const handleTaskSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newTask: Task = {
            id: uuidv4(),
            content: inputValue,
            completed: false,
            created_at: new Date(),
        };

        if (newTask.content) setTaskList((taskList) => [...taskList, newTask]);
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
                    <div className="AddToDoBtn">
                        <Button type="submit" primary>
                            Add
                        </Button>
                    </div>
                </Form>
            </div>
        );
    }

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
                        <Card.Header className={task.completed ? "CompletedTask" : ""}>
                            {task.content}
                        </Card.Header>
                        <Card.Meta>Created at: {task.created_at.toUTCString().slice(17, -7)}</Card.Meta>
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

export default Todo;