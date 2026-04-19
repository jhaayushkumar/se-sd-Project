import React, { useState } from 'react';
import { Button, TextField, Typography, Paper, Container } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import api from '../services/api';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data.token, response.data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', minHeight: '100vh', alignItems: 'center' }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h4" fontWeight="bold" textAlign="center" color="primary">Welcome Back</Typography>
        {error && <Typography color="error" textAlign="center">{error}</Typography>}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <TextField label="Email" variant="outlined" fullWidth value={email} onChange={e => setEmail(e.target.value)} required />
          <TextField label="Password" type="password" variant="outlined" fullWidth value={password} onChange={e => setPassword(e.target.value)} required />
          <Button type="submit" variant="contained" color="primary" size="large" fullWidth>Login</Button>
        </form>
        <Typography textAlign="center" sx={{ mt: 2 }}>
          Don't have an account? <Link to="/register" style={{ color: '#6c63ff', textDecoration: 'none' }}>Register here</Link>
        </Typography>
      </Paper>
    </Container>
  );
};
