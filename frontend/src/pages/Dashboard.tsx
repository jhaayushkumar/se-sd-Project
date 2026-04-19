import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Grid, Card, CardContent, CardActions, Chip, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import api from '../services/api';
import { useAuth } from '../store/AuthContext';

interface Project {
  _id: string;
  name: string;
  description: string;
  status: string;
}

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchProjects();
  }, []);

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

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'background.paper', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Typography variant="h6" color="primary" fontWeight="bold">Workspace</Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Typography>Welcome, {user?.first_name}</Typography>
          <Button variant="outlined" color="error" size="small" onClick={logout}>Logout</Button>
        </Box>
      </Box>

      <Box sx={{ flexGrow: 1, p: 4, overflowY: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
          <Typography variant="h4" fontWeight="bold">My Projects</Typography>
          <Button variant="contained" onClick={() => setOpen(true)}>+ New Project</Button>
        </Box>

        {loading ? <CircularProgress /> : (
          <Grid container spacing={3}>
            {projects.map((proj) => (
              <Grid item xs={12} sm={6} md={4} key={proj._id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>{proj.name}</Typography>
                    <Typography color="text.secondary" variant="body2" sx={{ mb: 2 }}>{proj.description}</Typography>
                    <Chip label={proj.status} color="primary" size="small" variant="outlined" />
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary">Manage Tasks</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
            {projects.length === 0 && (
              <Typography variant="body1" color="text.secondary" sx={{ p: 3 }}>
                No projects found. Create one to get started!
              </Typography>
            )}
          </Grid>
        )}
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create New Project</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="Name" fullWidth value={newProject.name} onChange={(e) => setNewProject({ ...newProject, name: e.target.value })} />
          <TextField label="Description" fullWidth multiline rows={3} value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateProject} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
