import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Chip, CircularProgress, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Select, MenuItem, FormControl,
  InputLabel, IconButton, Card, CardContent, Divider, Avatar, Tooltip
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  due_date?: string;
}

const COLUMNS: { key: Task['status']; label: string; color: string; bg: string }[] = [
  { key: 'TODO', label: '📋 To Do', color: '#94a3b8', bg: 'rgba(148,163,184,0.08)' },
  { key: 'IN_PROGRESS', label: '⚡ In Progress', color: '#6c63ff', bg: 'rgba(108,99,255,0.08)' },
  { key: 'REVIEW', label: '🔍 Review', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
  { key: 'DONE', label: '✅ Done', color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
];

const PRIORITY_COLORS: Record<string, string> = {
  LOW: '#10b981',
  MEDIUM: '#6c63ff',
  HIGH: '#f59e0b',
  CRITICAL: '#ef4444',
};

export const ProjectTasks: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'MEDIUM', due_date: '' });
  const [dragging, setDragging] = useState<string | null>(null);

  useEffect(() => { fetchTasks(); }, [id]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/tasks/project/${id}`);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      await api.post('/tasks', { ...newTask, project_id: id });
      setOpen(false);
      setNewTask({ title: '', description: '', priority: 'MEDIUM', due_date: '' });
      fetchTasks();
    } catch (err) { console.error(err); }
  };

  const handleStatusChange = async (taskId: string, status: Task['status']) => {
    try {
      await api.put(`/tasks/${taskId}`, { status });
      setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status } : t));
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (taskId: string) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(prev => prev.filter(t => t._id !== taskId));
    } catch (err) { console.error(err); }
  };

  const onDragStart = (taskId: string) => setDragging(taskId);
  const onDrop = (status: Task['status']) => {
    if (dragging) {
      handleStatusChange(dragging, status);
      setDragging(null);
    }
  };

  const tasksByStatus = (status: Task['status']) => tasks.filter(t => t.status === status);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box sx={{
        p: 2, px: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        bgcolor: 'background.paper', borderBottom: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button variant="text" onClick={() => navigate('/dashboard')} sx={{ color: '#6c63ff', fontWeight: 700 }}>
            ← Dashboard
          </Button>
          <Divider orientation="vertical" flexItem />
          <Typography variant="h6" fontWeight="bold">Task Board</Typography>
        </Box>
        <Button variant="contained" onClick={() => setOpen(true)} sx={{
          background: 'linear-gradient(135deg, #6c63ff, #ff6584)',
          fontWeight: 700, px: 3
        }}>
          + New Task
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress sx={{ color: '#6c63ff' }} />
        </Box>
      ) : (
        <Box sx={{ display: 'flex', gap: 2, p: 3, overflowX: 'auto', minHeight: 'calc(100vh - 70px)' }}>
          {COLUMNS.map(col => (
            <Box
              key={col.key}
              onDragOver={e => e.preventDefault()}
              onDrop={() => onDrop(col.key)}
              sx={{
                minWidth: 280, flex: 1, bgcolor: col.bg,
                border: `1px solid ${col.color}30`,
                borderRadius: 3, p: 2,
                transition: 'all 0.2s',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography fontWeight="bold" sx={{ color: col.color }}>{col.label}</Typography>
                <Chip
                  label={tasksByStatus(col.key).length}
                  size="small"
                  sx={{ bgcolor: `${col.color}20`, color: col.color, fontWeight: 700 }}
                />
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {tasksByStatus(col.key).map(task => (
                  <Card
                    key={task._id}
                    draggable
                    onDragStart={() => onDragStart(task._id)}
                    sx={{
                      cursor: 'grab', transition: 'all 0.2s',
                      border: '1px solid rgba(255,255,255,0.06)',
                      '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' },
                      '&:active': { cursor: 'grabbing' }
                    }}
                  >
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="body1" fontWeight="600" sx={{ flex: 1, pr: 1 }}>
                          {task.title}
                        </Typography>
                        <Tooltip title="Delete Task">
                          <IconButton size="small" onClick={() => handleDelete(task._id)}
                            sx={{ color: '#ef4444', opacity: 0.6, '&:hover': { opacity: 1 }, p: 0.3 }}>
                            ✕
                          </IconButton>
                        </Tooltip>
                      </Box>
                      {task.description && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                          {task.description}
                        </Typography>
                      )}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1.5 }}>
                        <Chip
                          label={task.priority}
                          size="small"
                          sx={{
                            bgcolor: `${PRIORITY_COLORS[task.priority]}20`,
                            color: PRIORITY_COLORS[task.priority],
                            fontWeight: 700, fontSize: '0.65rem'
                          }}
                        />
                        {task.due_date && (
                          <Typography variant="caption" color="text.secondary">
                            📅 {new Date(task.due_date).toLocaleDateString()}
                          </Typography>
                        )}
                      </Box>
                      <Box sx={{ display: 'flex', gap: 0.5, mt: 1.5, flexWrap: 'wrap' }}>
                        {COLUMNS.filter(c => c.key !== task.status).map(c => (
                          <Chip
                            key={c.key}
                            label={`→ ${c.key.replace('_', ' ')}`}
                            size="small"
                            clickable
                            onClick={() => handleStatusChange(task._id, c.key)}
                            sx={{
                              fontSize: '0.6rem', height: 20,
                              bgcolor: 'rgba(255,255,255,0.05)',
                              '&:hover': { bgcolor: `${c.color}25` }
                            }}
                          />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                ))}
                {tasksByStatus(col.key).length === 0 && (
                  <Box sx={{
                    border: '2px dashed rgba(255,255,255,0.08)', borderRadius: 2,
                    p: 3, textAlign: 'center', color: 'text.disabled'
                  }}>
                    <Typography variant="caption">Drop tasks here</Typography>
                  </Box>
                )}
              </Box>
            </Box>
          ))}
        </Box>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { minWidth: 400 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Create New Task</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Task Title" fullWidth
            value={newTask.title}
            onChange={e => setNewTask({ ...newTask, title: e.target.value })}
          />
          <TextField
            label="Description" fullWidth multiline rows={3}
            value={newTask.description}
            onChange={e => setNewTask({ ...newTask, description: e.target.value })}
          />
          <FormControl fullWidth>
            <InputLabel>Priority</InputLabel>
            <Select
              value={newTask.priority}
              label="Priority"
              onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
            >
              {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map(p => (
                <MenuItem key={p} value={p}>
                  <Chip label={p} size="small" sx={{ bgcolor: `${PRIORITY_COLORS[p]}20`, color: PRIORITY_COLORS[p] }} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Due Date" type="date" fullWidth
            InputLabelProps={{ shrink: true }}
            value={newTask.due_date}
            onChange={e => setNewTask({ ...newTask, due_date: e.target.value })}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCreate} variant="contained" disabled={!newTask.title}
            sx={{ background: 'linear-gradient(135deg, #6c63ff, #ff6584)' }}
          >
            Create Task
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
