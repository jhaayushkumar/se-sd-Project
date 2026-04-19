import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { ProjectController } from '../controllers/project.controller';

const router = Router();
const controller = new ProjectController();

router.use(authenticate);

router.post('/', controller.createProject);
router.get('/', controller.getProjects);
router.get('/:id', controller.getProjectById);
router.put('/:id', controller.updateProject);
router.delete('/:id', controller.deleteProject);

export default router;
