import { useState, useEffect } from 'react';
import { Auth } from './components/Auth';
import { TaskList } from './components/TaskList';
import './index.css';

interface User {
  id: string;
  username: string;
}

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('task_manager_token');
    const storedUser = localStorage.getItem('task_manager_user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('task_manager_token', newToken);
    localStorage.setItem('task_manager_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('task_manager_token');
    localStorage.removeItem('task_manager_user');
  };

  if (loading) {
    return (
      <div className="app-loading">
        <div className="spinner"></div>
        <p>Đang khởi tạo ứng dụng...</p>
      </div>
    );
  }

  return (
    <div className="app-wrapper">
      <div className="background-decor">
        <div className="glow-circle circle-1"></div>
        <div className="glow-circle circle-2"></div>
      </div>
      <main className="main-content">
        {token && user ? (
          <TaskList token={token} user={user} onLogout={handleLogout} />
        ) : (
          <Auth onLoginSuccess={handleLoginSuccess} />
        )}
      </main>
    </div>
  );
}

export default App;
