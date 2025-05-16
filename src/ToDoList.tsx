import AddItemForm from "./AddItemForm";
import EditableSpan from "./EditableSpan";
import { Button } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import type { FilterValuesType } from "./App";
import type { ChangeEvent } from "react";
import { z } from "zod";

export type TaskType = {
  id: string;
  title: string;
  isDone: boolean;
};

type PropsType = {
  id: string;
  title: string;
  tasks: Array<TaskType>;
  removeTask: (id: string, todoListId: string) => void;
  changeFilter: (value: FilterValuesType, todoListId: string) => void;
  addTask: (title: string, todoListId: string) => void;
  changeTaskStatus: (
    taskId: string,
    isDone: boolean,
    todoListId: string
  ) => void;
  changeTaskTitle: (
    taskId: string,
    newTitle: string,
    todoListId: string
  ) => void;
  filter: FilterValuesType;
  removeTodoList: (todoListID: string) => void;
  changeTodoList: (id: string, newTitle: string) => void;
};

const titleSchema = z
  .string()
  .trim()
  .min(1, "Название не может быть пустым")
  .max(50, "Максимум 50 символов")
  .regex(/^[^<>]*$/, "Недопустимые символы в названии");

export function ToDoList(props: PropsType) {
  const onAllClickHandler = () => {
    props.changeFilter("all", props.id);
  };
  const onActiveClickHandler = () => {
    props.changeFilter("active", props.id);
  };
  const onCompletedClickHandler = () => {
    props.changeFilter("completed", props.id);
  };
  const removeTodoList = () => {
    props.removeTodoList(props.id);
  };
  const changeTodoList = (newTitle: string) => {
    const result = titleSchema.safeParse(newTitle);
    if (!result.success) {
      alert(result.error.issues[0].message);
      return;
    }
    props.changeTodoList(props.id, newTitle);
  };
  const addTask = (title: string) => {
    const result = titleSchema.safeParse(title);
    if (!result.success) {
      alert(result.error.issues[0].message);
      return;
    }
    props.addTask(title, props.id);
  };

  return (
    <div className='listForm'>
      <h3 className='fontTask'>
        <EditableSpan title={props.title} onChange={changeTodoList} />
        <Button className='buttonDelete' block onClick={removeTodoList}>
          <CloseCircleOutlined />
        </Button>
      </h3>
      <AddItemForm addItem={addTask} />
      <ul className='ulList'>
        {props.tasks.map((t) => {
          const onRemoveHandler = () => {
            props.removeTask(t.id, props.id);
          };
          const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
            props.changeTaskStatus(t.id, e.currentTarget.checked, props.id);
          };

          const onChangeTitleHandler = (newValue: string) => {
            const result = titleSchema.safeParse(newValue);
            if (!result.success) {
              alert(result.error.issues[0].message);
              return;
            }
            props.changeTaskTitle(t.id, newValue, props.id);
          };

          return (
            <li className={t.isDone ? "is-done" : ""} key={t.id}>
              <input
                className='checkboxList'
                type='checkbox'
                onChange={onChangeHandler}
                checked={t.isDone}
              />
              <EditableSpan title={t.title} onChange={onChangeTitleHandler} />
              <Button block className='buttonDelete' onClick={onRemoveHandler}>
                <CloseCircleOutlined />
              </Button>
            </li>
          );
        })}
      </ul>
      <div className='threeButtons'>
        <Button
          className={props.filter === "all" ? "active-filter" : ""}
          onClick={onAllClickHandler}
        >
          All
        </Button>
        <Button
          className={props.filter === "active" ? "active-filter" : ""}
          onClick={onActiveClickHandler}
        >
          Active
        </Button>
        <Button
          className={props.filter === "completed" ? "active-filter" : ""}
          onClick={onCompletedClickHandler}
        >
          Completed
        </Button>
      </div>
    </div>
  );
}
export default ToDoList;
