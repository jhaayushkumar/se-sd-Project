import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Card, CardContent, CardActions,
  Chip, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, LinearProgress, Avatar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../store/AuthContext';

interface Project {
  _id: string;
  name: string;
  description: string;
  status: string;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: '#10b981',
  COMPLETED: '#6c63ff',
  ARCHIVED: '#94a3b8',
  ON_HOLD: '#f59e0b',
};

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    try {
      await api.post('/projects', newProject);
      setOpen(false);
      setNewProject({ name: '', description: '' });
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const stats = [
    { label: 'Total Projects', value: projects.length, icon: '📁', color: '#6c63ff' },
    { label: 'Active', value: projects.filter(p => p.status === 'ACTIVE').length, icon: '⚡', color: '#10b981' },
    { label: 'On Hold', value: projects.filter(p => p.status === 'ON_HOLD').length, icon: '⏸', color: '#f59e0b' },
    { label: 'Completed', value: projects.filter(p => p.status === 'COMPLETED').length, icon: '✅', color: '#6c63ff' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box sx={{
        p: 2, px: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        bgcolor: 'background.paper', borderBottom: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
      }}>
        <Typography variant="h6" component="div" sx={{
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #6c63ff, #ff6584)',
          backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
        }}>
          ⚡ Workspace
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Avatar sx={{ bgcolor: '#6c63ff', width: 32, height: 32, fontSize: 14 }}>
            {user?.first_name?.[0]?.toUpperCase()}
          </Avatar>
          <Typography variant="body2" component="span" color="text.secondary">
            Welcome, <strong style={{ color: '#fff' }}>{user?.first_name}</strong>
          </Typography>
          <Chip label={user?.role} size="small" sx={{ bgcolor: '#6c63ff22', color: '#6c63ff', fontWeight: 700 }} />
          <Button variant="outlined" color="error" size="small" onClick={logout} sx={{ borderRadius: 2 }}>
            Logout
          </Button>
        </Box>
      </Box>

      <Box sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
          {stats.map((stat) => (
            <Card key={stat.label} sx={{
              flex: '1 1 150px', textAlign: 'center', p: 1,
              background: `linear-gradient(135deg, ${stat.color}15, ${stat.color}05)`,
              border: `1px solid ${stat.color}30`,
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' }
            }}>
              <CardContent>
                <Typography component="div" sx={{ fontSize: '1.8rem' }}>{stat.icon}</Typography>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: stat.color }}>{stat.value}</Typography>
                <Typography variant="caption" component="div" color="text.secondary">{stat.label}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>My Projects</Typography>
          <Button
            variant="contained" onClick={() => setOpen(true)}
            sx={{
              background: 'linear-gradient(135deg, #6c63ff, #ff6584)',
              fontWeight: 700, px: 3, borderRadius: 2
            }}
          >
            + New Project
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ mt: 4 }}>
            <LinearProgress sx={{ borderRadius: 4, '& .MuiLinearProgress-bar': { bgcolor: '#6c63ff' } }} />
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {projects.map((proj) => (
              <Card key={proj._id} sx={{
                flex: '1 1 280px', maxWidth: 380, display: 'flex', flexDirection: 'column',
                transition: 'all 0.25s',
                border: '1px solid rgba(255,255,255,0.06)',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: '0 20px 40px rgba(108,99,255,0.2)',
                  border: '1px solid rgba(108,99,255,0.3)'
                }
              }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>{proj.name}</Typography>
                    <Chip
                      label={proj.status}
                      size="small"
                      sx={{
                        bgcolor: `${STATUS_COLORS[proj.status] || '#94a3b8'}20`,
                        color: STATUS_COLORS[proj.status] || '#94a3b8',
                        fontWeight: 700, fontSize: '0.65rem'
                      }}
                    />
                  </Box>
                  <Typography color="text.secondary" variant="body2" sx={{ mb: 2, minHeight: 40 }}>
                    {proj.description || 'No description provided.'}
                  </Typography>
                  <Typography variant="caption" color="text.disabled">
                    📅 Created {new Date(proj.createdAt).toLocaleDateString()}
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    size="small" variant="contained" fullWidth
                    onClick={() => navigate(`/projects/${proj._id}/tasks`)}
                    sx={{
                      background: 'linear-gradient(135deg, #6c63ff44, #ff658444)',
                      color: '#fff', fontWeight: 700,
                      '&:hover': { background: 'linear-gradient(135deg, #6c63ff, #ff6584)' }
                    }}
                  >
                    📋 Manage Tasks
                  </Button>
                </CardActions>
              </Card>
            ))}
            {projects.length === 0 && (
              <Box sx={{
                width: '100%', textAlign: 'center', py: 8,
                border: '2px dashed rgba(255,255,255,0.1)', borderRadius: 3
              }}>
                <Typography component="div" sx={{ fontSize: '3rem' }}>📁</Typography>
                <Typography variant="h6" component="div" color="text.secondary" sx={{ mt: 1 }}>No projects yet</Typography>
                <Typography variant="body2" component="div" color="text.disabled">Create your first project to get started!</Typography>
                <Button variant="contained" onClick={() => setOpen(true)} sx={{ mt: 2 }}>+ New Project</Button>
              </Box>
            )}
          </Box>
        )}
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle sx={{ fontWeight: 700 }}>Create New Project</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1, minWidth: 420 }}>
          <TextField
            label="Project Name" fullWidth
            value={newProject.name}
            onChange={e => setNewProject({ ...newProject, name: e.target.value })}
          />
          <TextField
            label="Description" fullWidth multiline rows={3}
            value={newProject.description}
            onChange={e => setNewProject({ ...newProject, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCreateProject} variant="contained" disabled={!newProject.name}
            sx={{ background: 'linear-gradient(135deg, #6c63ff, #ff6584)', fontWeight: 700 }}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
