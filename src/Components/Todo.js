import React, { useState, useEffect, useReducer } from "react";
import axios from "axios";

const Todo = props => {
  const [todoName, setTodoName] = useState("");
  //   const [todoList, setTodoList] = useState([]);
  const [submittedTodo, setSubmittedTodo] = useState(null);

  const todoListReducer = (state, action) => {
    switch (action.type) {
      case "ADD":
        return state.concat(action.payload);
      case "SET":
        return action.payload;
      case "REMOVE":
        return state.filter(todo => todo.id !== action.payload);
      default:
        return state;
    }
  };

  const [todoList, dispatch] = useReducer(todoListReducer, []);

  useEffect(() => {
    axios
      .get("https://react-hooks-practice.firebaseio.com/todos.json")
      .then(res => {
        console.log(res);
        const todoData = res.data;
        const todos = [];
        for (let key in todoData) {
          todos.push({ id: key, name: todoData[key].todo });
        }
        dispatch({ type: "SET", payload: todos });
      });
  }, []);

  useEffect(() => {
    document.addEventListener("mousemove", mouseMoveHandler);
    return () => document.removeEventListener("mousemove", mouseMoveHandler);
  }, []);

  useEffect(() => {
    if (submittedTodo) {
      dispatch({ type: "ADD", payload: submittedTodo });
    }
  }, [submittedTodo]);

  const mouseMoveHandler = e => {
    console.log(e.clientX, e.clientY);
  };

  const inputChangeHandler = e => {
    setTodoName(e.target.value);
  };

  const addTodoHandler = () => {
    axios
      .post("https://react-hooks-practice.firebaseio.com/todos.json", {
        todo: todoName
      })
      .then(res => {
        const todoItem = { id: res.data.name, name: todoName };
        setSubmittedTodo(todoItem);
      })
      .catch(err => console.log(err));
  };

  const todoRemoveHandler = id => {
    axios
      .delete(`https://react-hooks-practice.firebaseio.com/todos/${id}.json`)
      .then(res => dispatch({ type: "REMOVE", payload: id }))
      .catch(err => console.log(err));
  };

  return (
    <React.Fragment>
      <input
        type="text"
        placeholder="Todo"
        onChange={inputChangeHandler}
        value={todoName}
      />
      <button type="button" onClick={addTodoHandler}>
        Add
      </button>
      <ul>
        {todoList.map(todo => (
          <li key={todo.id} onClick={todoRemoveHandler.bind(this, todo.id)}>
            {todo.name}
          </li>
        ))}
      </ul>
    </React.Fragment>
  );
};

export default Todo;
