import { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    toast.success(`Welcome ${userData.username}!`);
  };

  const handleLogout = () => {
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Dashboard user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;