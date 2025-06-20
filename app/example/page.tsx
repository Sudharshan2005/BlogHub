'use client';

import { useState } from 'react';

export default function ExamplePage() {
  const [responseMessage, setResponseMessage] = useState('');

  // Function to handle GET request
  const handleGet = async () => {
    try {
        const res = await fetch('/api/example');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setResponseMessage(`GET: ${data.message}`);
    } catch (error) {
        console.error('Error:', error);
        setResponseMessage('Error fetching API');
    }
      
  };

  // Function to handle POST request
  const handlePost = async () => {
    const res = await fetch('/api/example', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Sudharshan' }),
    });
    const data = await res.json();
    setResponseMessage(`POST: ${data.message}`);
  };

  // Function to handle PUT request
  const handlePut = async () => {
    const res = await fetch('/api/example', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ updatedName: 'Leela Sudharshan' }),
    });
    const data = await res.json();
    setResponseMessage(`PUT: ${data.message}`);
  };

  // Function to handle DELETE request
  const handleDelete = async () => {
    const res = await fetch('/api/example', { method: 'DELETE' });
    const data = await res.json();
    setResponseMessage(`DELETE: ${data.message}`);
  };

  // Function to handle PATCH request
  const handlePatch = async () => {
    const res = await fetch('/api/example', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patchName: 'Sudharshan Patched' }),
    });
    const data = await res.json();
    setResponseMessage(`PATCH: ${data.message}`);
  };

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-3xl font-bold mb-4">Next.js API with All Methods</h1>

      <div className="space-x-2">
        <button onClick={handleGet} className="px-4 py-2 bg-blue-500 text-white rounded">
          GET
        </button>
        <button onClick={handlePost} className="px-4 py-2 bg-green-500 text-white rounded">
          POST
        </button>
        <button onClick={handlePut} className="px-4 py-2 bg-yellow-500 text-white rounded">
          PUT
        </button>
        <button onClick={handlePatch} className="px-4 py-2 bg-purple-500 text-white rounded">
          PATCH
        </button>
        <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded">
          DELETE
        </button>
      </div>

      <p className="mt-4 text-lg font-medium">API Response: {responseMessage}</p>
    </div>
  );
}
