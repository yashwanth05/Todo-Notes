
import { useEffect, useState } from 'react';

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const userId = localStorage.getItem('userId'); // Retrieve user ID from local storage

  useEffect(() => {
    const fetchTodos = async () => {
      const response = await fetch(`http://localhost:4000/todos/${userId}`);
      const data = await response.json();

      const formattedTodos = data.map(todo => ({
        id: todo.id,
        task: todo.title,
        completed: todo.completed,
      }));

      setTodos(formattedTodos);
    };
    fetchTodos();
  }, [userId]);

  const addTodo = async () => {
    if (input.trim()) {
      const response = await fetch('http://localhost:4000/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, task: input }),
      });
      if (response.ok) {
        const newTodo = await response.json();
        setTodos([...todos, { id: newTodo.id, task: newTodo.title, completed: newTodo.completed }]);
        setInput('');
      }
    }
  };

  const updateTodoCompletion = async (todoId, currentStatus) => {
    const response = await fetch(`http://localhost:4000/todos/${userId}/${todoId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !currentStatus }),
    });

    if (response.ok) {
      setTodos(todos.map(todo => 
        todo.id === todoId ? { ...todo, completed: !currentStatus } : todo
      ));
    } else {
      alert('Failed to update todo');
    }
  };

  const deleteTodo = async (todoId) => {
    const response = await fetch(`http://localhost:4000/todos/${todoId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setTodos(todos.filter(todo => todo.id !== todoId));
    } else {
      alert('Failed to delete todo');
    }
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Todo List</h1>
      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new task"
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 text-black"
        />
        <button
          onClick={addTodo}
          className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition"
        >
          Add
        </button>
      </div>
      <ul className="w-full max-w-md bg-white rounded-lg shadow-md p-4">
  {todos.map((todo) => (
    <li
      key={todo.id}
      className="flex justify-between items-center p-2 border-b last:border-b-0"
    >
      <span className={`${todo.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
        {todo.task}
      </span>
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => updateTodoCompletion(todo.id, todo.completed)}
          className="mr-2"
        />
        <button
          onClick={() => deleteTodo(todo.id)}
          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
        >
          Delete
        </button>
      </div>
    </li>
  ))}
</ul>

    </div>
  );
}
