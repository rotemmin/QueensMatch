'use client';
import { useState } from 'react';

export default function FirebaseTest() {
  const [loading, setLoading] = useState(false);

  const handleFirebaseTest = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const response = await fetch("/api/firebaseTest");
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Firebase Test</h1>
      <button 
        onClick={handleFirebaseTest}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {loading ? 'Testing...' : 'Run Firebase Test'}
      </button>
    </div>
  );
}