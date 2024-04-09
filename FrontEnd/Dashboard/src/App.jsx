import { useState, useEffect } from 'react'
import './App.css'
import Todo from './components/Todo'
import TodoForm from './components/TodoForm'
import Search from './components/Search'
import CategoryForm from './components/CategoryForm'
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000'
})


function App() {
  const currentDate = new Date();
  const creationDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;

  const [todos, setTodos] = useState([])

  useEffect( () => {
    api.get("/").then( (response) => {
      console.log(response.data)
      setTodos(response.data)
    })
  }, [])

  function updateTodo(id) {
    api
      .post(`/updateOne/${id}`, {
        value,
        description,
        category
      })
      .then((response) => {
        console.log(response);
      });
  }

  function deleteTodo(id) {
    api
      .get(`/deleteOne/${id}`)
      .then((response) => {
        console.log(response);
      });
  }

  function checkTodo(id) {
    api
      .post(`/check/${id}`)
      .then((response) => {
        console.log(response);
      });
  }

  const treatTodo = (name, category, description) => {
    let todoExists = todos.some(t => t.name === name);
    if (!todoExists) {
      addTodo(name, category, description);
      return;
    }

    editTodo(name, category, description);
  }

  const editTodo = (name, category, description) => {
    todos.forEach(t => {
      if (t.name === name) {
        t.category = category;
        t.description = description;
        updateTodo(t.id);
        const todosUpdated = [...todos];
        setTodos(todosUpdated);
        return;
      }
    })
  }

  const addTodo = (name, category, description) => {
    const currentDate = new Date();
    const creationDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
    const newTodos = [
      ...todos,
      {
        id: Math.floor(Math.random() * 10000),
        name,
        description,
        category,
        isCompleted: false,
        creationDate: creationDate,
      },
    ];

    setTodos(newTodos);
  }

  const removeTodo = (id) => {
    const newTodos = [...todos];
    const filteredTodos = newTodos.filter(todo =>
      todo.id !== id
    );
    deleteTodo(id);
    setTodos(filteredTodos);
  }

  const completeTodo = (id) => {
    const newTodos = [...todos];
    newTodos.map(todo => (todo.id === id) ? todo.isCompleted = !todo.isCompleted : todo)
    checkTodo(id);
    setTodos(newTodos);
  }

  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([
    "Trabalho",
    "Pessoal",
    "Estudos",
  ]);

  const treatCategory = (category) => {
    if (categories.includes(category)) {
      const filteredCategories = categories.filter(c => c !== category);
      setCategories(filteredCategories);
      cleanTodosByCategory(category);
    } else {
      const newCategories = [...categories, category];
      setCategories(newCategories);
    }
  }

  const cleanTodosByCategory = (category) => {
    const filteredTodos = todos.filter(t => t.category !== category);
    setTodos(filteredTodos);
  }

  return <div className="app">
    <div className="scrollable-container">
      <h1>Lista de tarefas</h1>
      <Search search={search} setSearch={setSearch} />
      <div className="todo-list">
        {todos
          .filter(todo => new RegExp(search, "i").test(todo.name))
          .map((todo) => (
            <Todo key={todo.id} todo={todo} removeTodo={removeTodo} completeTodo={completeTodo} />
          ))}
      </div>
      <TodoForm treatTodo={treatTodo} categories={categories} />
      <CategoryForm treatCategory={treatCategory} />
    </div>
  </div>
}

export default App;
