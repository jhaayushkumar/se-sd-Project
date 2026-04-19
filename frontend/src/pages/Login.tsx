import React, { useState } from 'react';
import { Button, TextField, Typography, Paper, Container, Box } from '@mui/material';
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
    <Container maxWidth="xs" sx={{ display: 'flex', minHeight: '100vh', alignItems: 'center' }}>
      <Paper sx={{ p: 4, width: '100%', border: '1px solid rgba(255,255,255,0.1)' }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 700, mb: 3 }}>Login</Typography>
        {error && <Typography color="error" component="div" sx={{ mb: 2, fontSize: '0.875rem' }}>{error}</Typography>}
        <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Email" variant="outlined" fullWidth value={email} onChange={e => setEmail(e.target.value)} required size="small" />
          <TextField label="Password" type="password" variant="outlined" fullWidth value={password} onChange={e => setPassword(e.target.value)} required size="small" />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 1 }}>Sign In</Button>
        </Box>
        <Typography component="div" sx={{ mt: 3, fontSize: '0.875rem', opacity: 0.7 }}>
          No account? <Link to="/register" style={{ color: '#94a3b8', textDecoration: 'underline' }}>Register</Link>
        </Typography>
      </Paper>
    </Container>
  );

};
