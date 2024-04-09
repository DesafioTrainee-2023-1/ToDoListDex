import React from 'react'

function Todo({ todo, removeTodo, completeTodo }) {
  return (
    <div 
      className="todo" 
      style={{textDecoration: todo.isCompleted ? "line-through" : ""}}
    >
      <div className="content">
        <p>{todo.name}</p>
        <p>{todo.description}</p>
        <p>{todo.creationDate}</p>
        <p>({todo.category})</p>
      </div>
      <div>
        <button className='complete' onClick={() => completeTodo(todo.id)}>Completar</button>
        <button className='remove' onClick={() => removeTodo(todo.id)}>x</button>
      </div>
    </div>
  )
}

export default Todo
