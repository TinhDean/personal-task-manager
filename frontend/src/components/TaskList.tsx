import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  userId: string;
  createdAt: string;
}

interface TaskListProps {
  token: string;
  user: { id: string; username: string };
  onLogout: () => void;
}

export const TaskList: React.FC<TaskListProps> = ({ token, user, onLogout }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Setup Axios Instance with Auth Header
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const fetchTasks = async (query = '') => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/tasks?search=${encodeURIComponent(query)}`);
      setTasks(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể tải danh sách công việc.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [token]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!newTitle.trim()) {
      return;
    }

    try {
      const response = await api.post('/tasks', { title: newTitle });
      setTasks([response.data, ...tasks]);
      setNewTitle('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể tạo công việc mới.');
    }
  };

  const handleToggleComplete = async (task: Task) => {
    setError('');
    try {
      const response = await api.put(`/tasks/${task.id}`, {
        completed: !task.completed,
      });
      setTasks(tasks.map((t) => (t.id === task.id ? response.data : t)));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể cập nhật trạng thái.');
    }
  };

  const handleStartEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setEditingTitle(task.title);
  };

  const handleSaveEdit = async (taskId: string) => {
    if (!editingTitle.trim()) return;
    setError('');
    try {
      const response = await api.put(`/tasks/${taskId}`, {
        title: editingTitle,
      });
      setTasks(tasks.map((t) => (t.id === taskId ? response.data : t)));
      setEditingTaskId(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể lưu tên công việc.');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa công việc này?')) return;
    setError('');
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter((t) => t.id !== taskId));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể xóa công việc.');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    fetchTasks(val); // Live search
  };

  return (
    <div className="task-container">
      <header className="task-header">
        <div className="user-info">
          <div className="avatar">{user.username.slice(0, 2).toUpperCase()}</div>
          <div>
            <h3>{user.username}</h3>
            <p className="status-badge">Đang hoạt động</p>
          </div>
        </div>
        <button onClick={onLogout} className="btn btn-outline btn-logout">
          Đăng Xuất
        </button>
      </header>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Search and Add Task Grid */}
      <div className="task-actions-grid">
        <div className="search-box">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Tìm kiếm công việc theo tên..."
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                fetchTasks('');
              }}
              className="clear-btn"
            >
              ✕
            </button>
          )}
        </div>

        <form onSubmit={handleCreateTask} className="add-task-form">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Thêm công việc mới..."
            required
          />
          <button type="submit" className="btn btn-primary btn-add">
            Thêm
          </button>
        </form>
      </div>

      {/* Task List */}
      <div className="task-list-card">
        <h2>Danh sách công việc ({tasks.length})</h2>

        {loading && <div className="loading">Đang tải dữ liệu...</div>}

        {!loading && tasks.length === 0 && (
          <div className="empty-state">
            <p>Không tìm thấy công việc nào.</p>
          </div>
        )}

        {!loading && tasks.length > 0 && (
          <div className="tasks-wrapper">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`task-item ${task.completed ? 'completed' : ''}`}
              >
                <div className="task-left">
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggleComplete(task)}
                    />
                    <span className="checkmark"></span>
                  </label>

                  {editingTaskId === task.id ? (
                    <input
                      type="text"
                      className="edit-input"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      onBlur={() => handleSaveEdit(task.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEdit(task.id);
                        if (e.key === 'Escape') setEditingTaskId(null);
                      }}
                      autoFocus
                    />
                  ) : (
                    <span
                      className="task-title"
                      onDoubleClick={() => handleStartEdit(task)}
                    >
                      {task.title}
                    </span>
                  )}
                </div>

                <div className="task-actions">
                  {editingTaskId === task.id ? (
                    <button
                      onClick={() => handleSaveEdit(task.id)}
                      className="btn-icon btn-save"
                      title="Lưu thay đổi"
                    >
                      ✓
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStartEdit(task)}
                      className="btn-icon btn-edit"
                      title="Sửa tên công việc"
                    >
                      ✏️
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="btn-icon btn-delete"
                    title="Xóa công việc"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
