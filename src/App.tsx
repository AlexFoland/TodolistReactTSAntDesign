import { useState } from "react";
import { v1 } from "uuid";
import "./App.css";
import AddItemForm from "./AddItemForm";
import ToDoList from "./ToDoList";
import type { TaskType } from "./ToDoList";

export type FilterValuesType = "all" | "completed" | "active";

type TodoListType = {
  id: string;
  title: string;
  filter: FilterValuesType;
};

type TasksStateType = {
  [key: string]: Array<TaskType>;
};

function App() {
  function removeTask(id: string, todoListId: string) {
    let tasks = tasksObj[todoListId];
    let filteredTasks = tasks.filter((t) => t.id !== id);
    tasksObj[todoListId] = filteredTasks;
    setTasks({ ...tasksObj });
  }

  function addTask(title: string, todoListId: string) {
    let task = { id: v1(), title: title, isDone: false };
    let tasks = tasksObj[todoListId];
    let newTasks = [task, ...tasks];
    tasksObj[todoListId] = newTasks;
    setTasks({ ...tasksObj });
  }

  function changeStatus(taskId: string, isDone: boolean, todoListId: string) {
    let tasks = tasksObj[todoListId];
    let task = tasks.find((t) => t.id === taskId);
    if (task) {
      task.isDone = isDone;
      setTasks({ ...tasksObj });
    }
  }

  function changeTitle(taskId: string, newTitle: string, todoListId: string) {
    let tasks = tasksObj[todoListId];
    let task = tasks.find((t) => t.id === taskId);
    if (task) {
      task.title = newTitle;
      setTasks({ ...tasksObj });
    }
  }

  function changeFilter(value: FilterValuesType, todoListId: string) {
    let todolist = todoLists.find((tl) => tl.id === todoListId);
    if (todolist) {
      todolist.filter = value;
      setTodoLists([...todoLists]);
    }
  }

  let todoListId1 = v1();
  let todoListId2 = v1();
  let [todoLists, setTodoLists] = useState<Array<TodoListType>>([
    { id: todoListId1, title: "What to learn", filter: "all" },
    { id: todoListId2, title: "What to buy", filter: "all" },
  ]);

  let removeTodoList = (todoListID: string) => {
    let filteredTodoList = todoLists.filter((tl) => tl.id !== todoListID);
    setTodoLists(filteredTodoList);
    delete tasksObj[todoListID];
    setTasks({ ...tasksObj });
  };

  function changeTodoListTitle(id: string, newTitle: string) {
    const toDoList = todoLists.find((tl) => tl.id === id);
    if (toDoList) {
      toDoList.title = newTitle;
      setTodoLists([...todoLists]);
    }
  }

  let [tasksObj, setTasks] = useState<TasksStateType>({
    [todoListId1]: [
      { id: v1(), title: "CSS", isDone: true },
      { id: v1(), title: "JS", isDone: false },
      { id: v1(), title: "React", isDone: true },
    ],
    [todoListId2]: [
      { id: v1(), title: "CSS", isDone: true },
      { id: v1(), title: "JS", isDone: false },
      { id: v1(), title: "React", isDone: true },
    ],
  });

  function addTodoList(title: string) {
    let todoList: TodoListType = {
      id: v1(),
      filter: "all",
      title: title,
    };
    setTodoLists([todoList, ...todoLists]);
    setTasks({
      ...tasksObj,
      [todoList.id]: [],
    });
  }
  return (
    <div className='formTask'>
      <AddItemForm addItem={addTodoList} />
      {todoLists.map((tl) => {
        let tasksForToDoList = tasksObj[tl.id];
        if (tl.filter === "completed") {
          tasksForToDoList = tasksForToDoList.filter((t) => t.isDone === true);
        }
        if (tl.filter === "active") {
          tasksForToDoList = tasksForToDoList.filter((t) => t.isDone === false);
        }

        return (
          <ToDoList
            title={tl.title}
            key={tl.id}
            id={tl.id}
            tasks={tasksForToDoList}
            removeTask={removeTask}
            changeFilter={changeFilter}
            addTask={addTask}
            changeTaskStatus={changeStatus}
            changeTaskTitle={changeTitle}
            filter={tl.filter}
            removeTodoList={removeTodoList}
            changeTodoList={changeTodoListTitle}
          />
        );
      })}
    </div>
  );
}

export default App;
