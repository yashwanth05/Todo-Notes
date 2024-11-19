import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterDiv() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    if (email && username && password) {
      try {
        const response = await fetch('http://localhost:4000/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, username, password }),
        });

        const data = await response.json();
        if (data.success) {
          alert('Registration successful');
          router.push('/login'); // Redirect to login page
        } else {
          alert('Registration failed: ' + data.message);
        }
      } catch (error) {
        alert('An error occurred: ' + error.message);
      }
    } else {
      alert('Please fill in all fields');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-black">
      <h1 className="text-3xl font-semibold mb-8">Register</h1>
      <div className="bg-white p-6 rounded shadow-md w-80 text-black">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 p-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mb-4 p-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 p-2 w-full border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          onClick={handleRegister}
          className="w-full bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600 transition duration-200"
        >
          Register
        </button>
      </div>
    </div>
  );
}
