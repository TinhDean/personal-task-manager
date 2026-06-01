import React, { useState } from 'react';
import axios from 'axios';

interface AuthProps {
  onLoginSuccess: (token: string, user: { id: string; username: string }) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    if (!username || !password) {
      setError('Vui lòng điền đầy đủ tài khoản và mật khẩu.');
      setLoading(false);
      return;
    }

    try {
      const endpoint = isLogin ? 'login' : 'register';
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await axios.post(`${apiUrl}/auth/${endpoint}`, {
        username,
        password,
      });

      if (isLogin) {
        const { token, user } = response.data;
        onLoginSuccess(token, user);
      } else {
        setMessage('Đăng ký thành công! Hãy chuyển sang Đăng nhập.');
        setIsLogin(true);
        setPassword('');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại sau.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? 'Đăng Nhập' : 'Đăng Ký Tài Khoản'}</h2>
        <p className="subtitle">
          {isLogin
            ? 'Chào mừng bạn quay trở lại! Quản lý công việc thật dễ dàng.'
            : 'Tạo tài khoản mới để bắt đầu sắp xếp công việc.'}
        </p>

        {error && <div className="alert alert-danger">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Tài khoản</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập tên tài khoản..."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu..."
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Đang xử lý...' : isLogin ? 'Đăng Nhập' : 'Đăng Ký'}
          </button>
        </form>

        <div className="auth-toggle">
          <span>
            {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản rồi?'}
          </span>
          <button
            type="button"
            className="btn-link"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setMessage('');
            }}
          >
            {isLogin ? 'Đăng ký ngay' : 'Đăng nhập ở đây'}
          </button>
        </div>
      </div>
    </div>
  );
};
