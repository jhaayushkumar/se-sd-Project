import React, { useState } from 'react';
import { Button, TextField, Typography, Paper, Container, Box } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import api from '../services/api';

export const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/register', { email, password, first_name, last_name });
      login(response.data.token, response.data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', minHeight: '100vh', alignItems: 'center' }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', textAlign: 'center' }} color="primary">Create Account</Typography>
        {error && <Typography color="error" component="div" sx={{ textAlign: 'center' }}>{error}</Typography>}
        <Box component="form" onSubmit={handleRegister} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="First Name" variant="outlined" fullWidth value={first_name} onChange={e => setFirstName(e.target.value)} required />
          <TextField label="Last Name" variant="outlined" fullWidth value={last_name} onChange={e => setLastName(e.target.value)} required />
          <TextField label="Email" type="email" variant="outlined" fullWidth value={email} onChange={e => setEmail(e.target.value)} required />
          <TextField label="Password" type="password" variant="outlined" fullWidth value={password} onChange={e => setPassword(e.target.value)} required />
          <Button type="submit" variant="contained" color="primary" size="large" fullWidth>Sign Up</Button>
        </Box>
        <Typography component="div" sx={{ textAlign: 'center', mt: 2 }}>
          Already have an account? <Link to="/login" style={{ color: '#6c63ff', textDecoration: 'none' }}>Login instead</Link>
        </Typography>
      </Paper>
    </Container>
  );
};
