import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { TaskController } from '../controllers/task.controller';

const router = Router();
const controller = new TaskController();

router.use(authenticate);

router.post('/', controller.createTask);
router.get('/project/:projectId', controller.getProjectTasks);
router.put('/:id', controller.updateTask);
router.delete('/:id', controller.deleteTask);

export default router;
